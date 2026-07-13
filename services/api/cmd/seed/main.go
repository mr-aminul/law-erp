package main

import (
	"context"
	"log"
	"os"

	"github.com/mr-aminul/law-erp/services/api/internal/auth"
	"github.com/mr-aminul/law-erp/services/api/internal/db"
	"github.com/mr-aminul/law-erp/services/api/internal/store"
)

func main() {
	ctx := context.Background()

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is required for seed")
	}

	pool, err := db.NewPool(ctx, databaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	email := os.Getenv("DEV_OWNER_EMAIL")
	if email == "" {
		email = "saif.alam@gmail.com"
	}

	fullName := os.Getenv("DEV_OWNER_NAME")
	if fullName == "" {
		fullName = "Saif Alam"
	}

	password := os.Getenv("DEV_OWNER_PASSWORD")
	if password == "" {
		password = "DevPass123!"
	}

	hash, err := auth.HashPassword(password)
	if err != nil {
		log.Fatal(err)
	}

	users := store.NewUserStore(pool)
	if err := users.SeedDev(ctx, email, fullName, hash); err != nil {
		log.Fatal(err)
	}
	if err := users.UpsertDevUser(ctx, store.DevUserID2, "alam.saifivna@gmail.com", fullName, "firm_owner", hash); err != nil {
		log.Fatal(err)
	}

	log.Printf("seeded dev firm law-erp-dev with owners %s and alam.saifivna@gmail.com", email)
	log.Printf("dev password: %s (override with DEV_OWNER_PASSWORD)", password)
}
