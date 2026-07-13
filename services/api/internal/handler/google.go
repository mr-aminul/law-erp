package handler

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"

	"github.com/mr-aminul/law-erp/services/api/internal/auth"
	"github.com/mr-aminul/law-erp/services/api/internal/config"
	"github.com/mr-aminul/law-erp/services/api/internal/store"
)

const oauthStateCookie = "law_erp_oauth_state"

type GoogleHandler struct {
	users     store.UserRepository
	tokens    *auth.TokenIssuer
	oauth     *oauth2.Config
	webOrigin string
	secure    bool
}

func NewGoogleHandler(cfg config.Config, users store.UserRepository, tokens *auth.TokenIssuer) *GoogleHandler {
	if !cfg.GoogleEnabled() {
		return &GoogleHandler{users: users, tokens: tokens, webOrigin: cfg.WebOrigin}
	}

	return &GoogleHandler{
		users:  users,
		tokens: tokens,
		oauth: &oauth2.Config{
			ClientID:     cfg.GoogleClientID,
			ClientSecret: cfg.GoogleClientSecret,
			RedirectURL:  cfg.GoogleRedirectURL(),
			Scopes:       []string{"openid", "email", "profile"},
			Endpoint:     google.Endpoint,
		},
		webOrigin: cfg.WebOrigin,
		secure:    cfg.Env == "production",
	}
}

func (h *GoogleHandler) Enabled(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]bool{"enabled": h.oauth != nil})
}

func (h *GoogleHandler) Start(w http.ResponseWriter, r *http.Request) {
	if h.oauth == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{
			"error": "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
		})
		return
	}

	state, err := randomState()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not start Google sign-in"})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     oauthStateCookie,
		Value:    state,
		Path:     "/",
		MaxAge:   600,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   h.secure,
	})

	url := h.oauth.AuthCodeURL(state, oauth2.AccessTypeOnline)
	http.Redirect(w, r, url, http.StatusFound)
}

func (h *GoogleHandler) Callback(w http.ResponseWriter, r *http.Request) {
	if h.oauth == nil {
		h.redirectError(w, r, "Google sign-in is not configured")
		return
	}

	stateCookie, err := r.Cookie(oauthStateCookie)
	if err != nil || stateCookie.Value == "" || stateCookie.Value != r.URL.Query().Get("state") {
		h.redirectError(w, r, "Invalid sign-in session. Please try again.")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     oauthStateCookie,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   h.secure,
	})

	if errMsg := r.URL.Query().Get("error"); errMsg != "" {
		h.redirectError(w, r, "Google sign-in was cancelled")
		return
	}

	code := r.URL.Query().Get("code")
	if code == "" {
		h.redirectError(w, r, "Missing authorization code")
		return
	}

	token, err := h.oauth.Exchange(r.Context(), code)
	if err != nil {
		h.redirectError(w, r, "Could not complete Google sign-in")
		return
	}

	profile, err := FetchGoogleProfile(r.Context(), googleUserInfoURL, token.AccessToken)
	if err != nil {
		h.redirectError(w, r, "Could not read Google profile")
		return
	}

	email := strings.ToLower(strings.TrimSpace(profile.Email))
	if email == "" {
		h.redirectError(w, r, "Google account has no email")
		return
	}

	user, err := h.users.FindByEmail(r.Context(), email)
	if errors.Is(err, store.ErrUserNotFound) {
		h.redirectError(w, r, "No Law ERP account for this Google email yet")
		return
	}
	if err != nil {
		h.redirectError(w, r, "Sign-in failed")
		return
	}

	if user.Status != "active" {
		h.redirectError(w, r, "Account is not active")
		return
	}

	if err := PersistGoogleLogin(r.Context(), h.users, user.ID, profile.Picture); err != nil {
		h.redirectError(w, r, "Sign-in failed")
		return
	}

	sessionToken, expiresAt, err := h.tokens.Issue(user.ID, user.FirmID, user.Role, user.Email)
	if err != nil {
		h.redirectError(w, r, "Could not create session")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     auth.CookieName,
		Value:    sessionToken,
		Path:     "/",
		Expires:  expiresAt,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   h.secure,
	})

	http.Redirect(w, r, h.webOrigin+"/", http.StatusFound)
}

func (h *GoogleHandler) redirectError(w http.ResponseWriter, r *http.Request, message string) {
	target := fmt.Sprintf("%s/login?error=%s", h.webOrigin, url.QueryEscape(message))
	http.Redirect(w, r, target, http.StatusFound)
}

const googleUserInfoURL = "https://www.googleapis.com/oauth2/v2/userinfo"

// PersistGoogleLogin stores the Google profile image and records last login.
func PersistGoogleLogin(ctx context.Context, users store.UserRepository, userID, pictureURL string) error {
	if strings.TrimSpace(pictureURL) != "" {
		if err := users.UpdateAvatarURL(ctx, userID, strings.TrimSpace(pictureURL)); err != nil {
			return err
		}
	}
	return users.TouchLogin(ctx, userID)
}

type GoogleProfile struct {
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// FetchGoogleProfile loads the signed-in Google account profile.
func FetchGoogleProfile(ctx context.Context, userInfoURL, accessToken string) (*GoogleProfile, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, userInfoURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(res.Body)
		return nil, fmt.Errorf("google userinfo: %s", string(body))
	}

	var profile GoogleProfile
	if err := json.NewDecoder(res.Body).Decode(&profile); err != nil {
		return nil, err
	}
	return &profile, nil
}

func randomState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}
