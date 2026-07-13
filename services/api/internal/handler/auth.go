package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/mr-aminul/law-erp/services/api/internal/auth"
	"github.com/mr-aminul/law-erp/services/api/internal/store"
)

type AuthHandler struct {
	users  store.UserRepository
	tokens *auth.TokenIssuer
	secure bool
	env    string
}

func NewAuthHandler(users store.UserRepository, tokens *auth.TokenIssuer, env string) *AuthHandler {
	return &AuthHandler{
		users:  users,
		tokens: tokens,
		secure: env == "production",
		env:    env,
	}
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type userResponse struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FullName  string `json:"fullName"`
	Role      string `json:"role"`
	AvatarURL string `json:"avatarUrl,omitempty"`
	Firm      struct {
		ID   string `json:"id"`
		Name string `json:"name"`
		Slug string `json:"slug"`
	} `json:"firm"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	email := strings.TrimSpace(strings.ToLower(req.Email))
	if email == "" || req.Password == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "email and password are required"})
		return
	}

	user, err := h.users.FindByEmail(r.Context(), email)
	if errors.Is(err, store.ErrUserNotFound) {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid email or password"})
		return
	}
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "login failed"})
		return
	}

	if user.Status != "active" {
		writeJSON(w, http.StatusForbidden, map[string]string{"error": "account is not active"})
		return
	}

	if user.Password == "" || !auth.CheckPassword(user.Password, req.Password) {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid email or password"})
		return
	}

	token, expiresAt, err := h.tokens.Issue(user.ID, user.FirmID, user.Role, user.Email)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "login failed"})
		return
	}

	_ = h.users.TouchLogin(r.Context(), user.ID)

	h.setAuthCookie(w, token, expiresAt)
	writeJSON(w, http.StatusOK, map[string]any{"user": toUserResponse(user)})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	claims, ok := auth.ClaimsFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	user, err := h.users.FindByID(r.Context(), claims.UserID)
	if errors.Is(err, store.ErrUserNotFound) {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to load user"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"user": toUserResponse(user)})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     auth.CookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   h.secure,
	})
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *AuthHandler) setAuthCookie(w http.ResponseWriter, token string, expiresAt time.Time) {
	http.SetCookie(w, &http.Cookie{
		Name:     auth.CookieName,
		Value:    token,
		Path:     "/",
		Expires:  expiresAt,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   h.secure,
	})
}

func toUserResponse(user *store.User) userResponse {
	resp := userResponse{
		ID:        user.ID,
		Email:     user.Email,
		FullName:  user.FullName,
		Role:      user.Role,
		AvatarURL: user.AvatarURL,
	}
	resp.Firm.ID = user.FirmID
	resp.Firm.Name = user.FirmName
	resp.Firm.Slug = user.FirmSlug
	return resp
}
