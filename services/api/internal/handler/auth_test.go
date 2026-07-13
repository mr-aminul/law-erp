package handler_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/mr-aminul/law-erp/services/api/internal/auth"
	"github.com/mr-aminul/law-erp/services/api/internal/handler"
	"github.com/mr-aminul/law-erp/services/api/internal/store"
)

func TestAuthHandler_Me_includesAvatarURL(t *testing.T) {
	users := store.NewDevAuthStore()
	ctx := context.Background()

	user, err := users.FindByEmail(ctx, "saif.alam@gmail.com")
	if err != nil {
		t.Fatalf("FindByEmail: %v", err)
	}

	const picture = "https://lh3.googleusercontent.com/a/me-test"
	if err := users.UpdateAvatarURL(ctx, user.ID, picture); err != nil {
		t.Fatalf("UpdateAvatarURL: %v", err)
	}

	tokens := auth.NewTokenIssuer("test-secret", time.Hour)
	token, _, err := tokens.Issue(user.ID, user.FirmID, user.Role, user.Email)
	if err != nil {
		t.Fatalf("Issue: %v", err)
	}

	authHandler := handler.NewAuthHandler(users, tokens, "test")
	req := httptest.NewRequest(http.MethodGet, "/auth/me", nil)
	req.AddCookie(&http.Cookie{Name: auth.CookieName, Value: token})
	req = req.WithContext(auth.WithClaims(req.Context(), &auth.Claims{
		UserID: user.ID,
		FirmID: user.FirmID,
		Role:   user.Role,
		Email:  user.Email,
	}))

	rec := httptest.NewRecorder()
	authHandler.Me(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var body struct {
		User struct {
			AvatarURL string `json:"avatarUrl"`
		} `json:"user"`
	}
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.User.AvatarURL != picture {
		t.Fatalf("avatarUrl = %q, want %q", body.User.AvatarURL, picture)
	}
}

func TestAuthHandler_Me_omitsEmptyAvatarURL(t *testing.T) {
	users := store.NewDevAuthStore()
	user, err := users.FindByEmail(context.Background(), "alam.saifivna@gmail.com")
	if err != nil {
		t.Fatalf("FindByEmail: %v", err)
	}

	tokens := auth.NewTokenIssuer("test-secret", time.Hour)
	authHandler := handler.NewAuthHandler(users, tokens, "test")

	req := httptest.NewRequest(http.MethodGet, "/auth/me", nil)
	req = req.WithContext(auth.WithClaims(req.Context(), &auth.Claims{UserID: user.ID}))

	rec := httptest.NewRecorder()
	authHandler.Me(rec, req)

	var raw map[string]any
	if err := json.NewDecoder(rec.Body).Decode(&raw); err != nil {
		t.Fatalf("decode: %v", err)
	}

	userMap, ok := raw["user"].(map[string]any)
	if !ok {
		t.Fatalf("user payload missing")
	}
	if _, exists := userMap["avatarUrl"]; exists {
		t.Fatalf("avatarUrl should be omitted when empty, got %#v", userMap["avatarUrl"])
	}
}

func TestAuthHandler_Logout_clearsSessionCookie(t *testing.T) {
	users := store.NewDevAuthStore()
	tokens := auth.NewTokenIssuer("test-secret", time.Hour)
	authHandler := handler.NewAuthHandler(users, tokens, "test")

	req := httptest.NewRequest(http.MethodPost, "/auth/logout", nil)
	rec := httptest.NewRecorder()
	authHandler.Logout(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	cookies := rec.Result().Cookies()
	var session *http.Cookie
	for _, c := range cookies {
		if c.Name == auth.CookieName {
			session = c
			break
		}
	}
	if session == nil {
		t.Fatal("session cookie not set")
	}
	if session.Value != "" {
		t.Fatalf("cookie value = %q, want empty", session.Value)
	}
	if session.MaxAge != -1 {
		t.Fatalf("cookie MaxAge = %d, want -1", session.MaxAge)
	}
}
