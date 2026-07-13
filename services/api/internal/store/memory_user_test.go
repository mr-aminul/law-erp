package store_test

import (
	"context"
	"testing"

	"github.com/mr-aminul/law-erp/services/api/internal/store"
)

func TestMemoryUserStore_UpdateAvatarURL(t *testing.T) {
	t.Parallel()

	users := store.NewDevAuthStore()
	ctx := context.Background()

	user, err := users.FindByEmail(ctx, "saif.alam@gmail.com")
	if err != nil {
		t.Fatalf("FindByEmail: %v", err)
	}
	if user.AvatarURL != "" {
		t.Fatalf("initial avatar = %q, want empty", user.AvatarURL)
	}

	const picture = "https://lh3.googleusercontent.com/a/example"
	if err := users.UpdateAvatarURL(ctx, user.ID, picture); err != nil {
		t.Fatalf("UpdateAvatarURL: %v", err)
	}

	updated, err := users.FindByID(ctx, user.ID)
	if err != nil {
		t.Fatalf("FindByID: %v", err)
	}
	if updated.AvatarURL != picture {
		t.Fatalf("avatar = %q, want %q", updated.AvatarURL, picture)
	}

	byEmail, err := users.FindByEmail(ctx, user.Email)
	if err != nil {
		t.Fatalf("FindByEmail after update: %v", err)
	}
	if byEmail.AvatarURL != picture {
		t.Fatalf("avatar by email = %q, want %q", byEmail.AvatarURL, picture)
	}
}

func TestMemoryUserStore_UpdateAvatarURL_unknownUser(t *testing.T) {
	t.Parallel()

	users := store.NewDevAuthStore()
	err := users.UpdateAvatarURL(context.Background(), "missing-user-id", "https://example.com/a.png")
	if err != store.ErrUserNotFound {
		t.Fatalf("err = %v, want ErrUserNotFound", err)
	}
}

func TestMemoryUserStore_UpdateAvatarURL_emptyClears(t *testing.T) {
	t.Parallel()

	users := store.NewDevAuthStore()
	ctx := context.Background()

	user, err := users.FindByEmail(ctx, "alam.saifivna@gmail.com")
	if err != nil {
		t.Fatalf("FindByEmail: %v", err)
	}

	if err := users.UpdateAvatarURL(ctx, user.ID, "https://lh3.googleusercontent.com/a/clear-me"); err != nil {
		t.Fatalf("set avatar: %v", err)
	}
	if err := users.UpdateAvatarURL(ctx, user.ID, ""); err != nil {
		t.Fatalf("clear avatar: %v", err)
	}

	updated, err := users.FindByID(ctx, user.ID)
	if err != nil {
		t.Fatalf("FindByID: %v", err)
	}
	if updated.AvatarURL != "" {
		t.Fatalf("avatar = %q, want empty after clear", updated.AvatarURL)
	}
}
