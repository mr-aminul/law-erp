package server

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/mr-aminul/law-erp/services/api/graph"
	"github.com/mr-aminul/law-erp/services/api/internal/auth"
	"github.com/mr-aminul/law-erp/services/api/internal/config"
	"github.com/mr-aminul/law-erp/services/api/internal/db"
	"github.com/mr-aminul/law-erp/services/api/internal/handler"
	"github.com/mr-aminul/law-erp/services/api/internal/store"
)

func New(cfg config.Config) http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.CORSOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Request-ID"},
		ExposedHeaders:   []string{"X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	jwtTTL, err := time.ParseDuration(cfg.JWTExpiry)
	if err != nil {
		jwtTTL = 24 * time.Hour
	}
	tokens := auth.NewTokenIssuer(cfg.JWTSecret, jwtTTL)
	r.Use(auth.Middleware(tokens))

	seed := store.NewSeedStore()
	gql := &graph.Resolver{Config: cfg, Store: seed}
	health := handler.NewHealthHandler(cfg.Env)

	r.Get("/health", health.Check)

	var users store.UserRepository = store.NewDevAuthStore()

	if cfg.DatabaseURL != "" {
		ctx := context.Background()
		pool, err := db.NewPool(ctx, cfg.DatabaseURL)
		if err != nil {
			log.Printf("warning: postgres unavailable (%v) — using in-memory dev auth", err)
		} else {
			users = store.NewUserStore(pool)
			log.Println("postgres connected — auth using database")
		}
	} else {
		log.Println("DATABASE_URL not set — auth using in-memory dev user (saif.alam@gmail.com / DevPass123!)")
	}

	authHandler := handler.NewAuthHandler(users, tokens, cfg.Env)
	googleHandler := handler.NewGoogleHandler(cfg, users, tokens)

	r.Route("/auth", func(authRouter chi.Router) {
		authRouter.Post("/login", authHandler.Login)
		authRouter.Post("/logout", authHandler.Logout)
		authRouter.With(auth.RequireAuth(tokens)).Get("/me", authHandler.Me)
		authRouter.Get("/google/enabled", googleHandler.Enabled)
		authRouter.Get("/google/start", googleHandler.Start)
		authRouter.Get("/google/callback", googleHandler.Callback)
	})

	r.Handle("/graphql", gql.NewHandler())
	if cfg.GraphQLPlayground {
		r.Handle("/", graph.NewPlaygroundHandler())
	}

	return r
}
