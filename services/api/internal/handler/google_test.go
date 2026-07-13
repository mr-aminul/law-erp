package handler_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/mr-aminul/law-erp/services/api/internal/handler"
	"github.com/mr-aminul/law-erp/services/api/internal/store"
)

func TestPersistGoogleLogin_savesAvatarAndTouchLogin(t *testing.T) {
	users := store.NewDevAuthStore()
	ctx := context.Background()

	user, err := users.FindByEmail(ctx, "saif.alam@gmail.com")
	if err != nil {
		t.Fatalf("FindByEmail: %v", err)
	}

	const picture = "https://lh3.googleusercontent.com/a/google-login"
	if err := handler.PersistGoogleLogin(ctx, users, user.ID, picture); err != nil {
		t.Fatalf("PersistGoogleLogin: %v", err)
	}

	updated, err := users.FindByID(ctx, user.ID)
	if err != nil {
		t.Fatalf("FindByID: %v", err)
	}
	if updated.AvatarURL != picture {
		t.Fatalf("avatar = %q, want %q", updated.AvatarURL, picture)
	}
}

func TestPersistGoogleLogin_skipsEmptyPicture(t *testing.T) {
	users := store.NewDevAuthStore()
	ctx := context.Background()

	user, err := users.FindByEmail(ctx, "alam.saifivna@gmail.com")
	if err != nil {
		t.Fatalf("FindByEmail: %v", err)
	}

	if err := users.UpdateAvatarURL(ctx, user.ID, "https://lh3.googleusercontent.com/a/keep"); err != nil {
		t.Fatalf("UpdateAvatarURL: %v", err)
	}

	if err := handler.PersistGoogleLogin(ctx, users, user.ID, "   "); err != nil {
		t.Fatalf("PersistGoogleLogin: %v", err)
	}

	updated, err := users.FindByID(ctx, user.ID)
	if err != nil {
		t.Fatalf("FindByID: %v", err)
	}
	if updated.AvatarURL != "https://lh3.googleusercontent.com/a/keep" {
		t.Fatalf("avatar = %q, want existing avatar preserved", updated.AvatarURL)
	}
}

func TestFetchGoogleProfile_success(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if got := r.Header.Get("Authorization"); got != "Bearer test-token" {
			t.Fatalf("Authorization = %q, want Bearer test-token", got)
		}
		_ = json.NewEncoder(w).Encode(map[string]string{
			"email":   "user@example.com",
			"name":    "Test User",
			"picture": "https://lh3.googleusercontent.com/a/profile",
		})
	}))
	defer srv.Close()

	profile, err := handler.FetchGoogleProfile(context.Background(), srv.URL, "test-token")
	if err != nil {
		t.Fatalf("FetchGoogleProfile: %v", err)
	}
	if profile.Email != "user@example.com" {
		t.Fatalf("email = %q", profile.Email)
	}
	if profile.Picture != "https://lh3.googleusercontent.com/a/profile" {
		t.Fatalf("picture = %q", profile.Picture)
	}
}

func TestFetchGoogleProfile_non200(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		http.Error(w, "denied", http.StatusUnauthorized)
	}))
	defer srv.Close()

	_, err := handler.FetchGoogleProfile(context.Background(), srv.URL, "bad-token")
	if err == nil {
		t.Fatal("expected error for non-200 response")
	}
}
