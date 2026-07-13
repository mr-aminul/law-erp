.PHONY: dev dev-web dev-api install tidy test-api db-up migrate-up migrate-down gqlgen

dev:
	@echo "Starting Go API (8080) and Next.js (3847)..."
	@$(MAKE) -j2 dev-api dev-web

dev-web:
	cd apps/web && PORT=3847 npm run dev

dev-api:
	cd services/api && go run ./cmd/server

install:
	cd apps/web && npm install

tidy:
	cd services/api && go mod tidy

test-api:
	cd services/api && go test ./...

gqlgen:
	cd services/api && go run github.com/99designs/gqlgen generate

db-up:
	docker compose up -d postgres

migrate-up:
	cd services/api && go run ./cmd/migrate up

migrate-down:
	cd services/api && go run ./cmd/migrate down
