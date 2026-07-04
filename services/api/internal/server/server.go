package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/mr-aminul/law-erp/services/api/graph"
	"github.com/mr-aminul/law-erp/services/api/internal/config"
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

	seed := store.NewSeedStore()
	gql := &graph.Resolver{Config: cfg, Store: seed}

	health := handler.NewHealthHandler(cfg.Env)

	r.Get("/health", health.Check)
	r.Handle("/graphql", gql.NewHandler())
	if cfg.GraphQLPlayground {
		r.Handle("/", graph.NewPlaygroundHandler())
	}

	return r
}
