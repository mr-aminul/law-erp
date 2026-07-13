package config

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port              string
	CORSOrigins       []string
	Env               string
	GraphQLPlayground bool
	DatabaseURL       string
	JWTSecret         string
	JWTExpiry         string
	GoogleClientID     string
	GoogleClientSecret string
	WebOrigin          string
	APIPublicURL       string
}

func Load() Config {
	loadDotEnv()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	origins := os.Getenv("CORS_ORIGINS")
	if origins == "" {
		origins = "http://localhost:3847,http://localhost:3000,http://localhost:3001"
	}

	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	playground := os.Getenv("GRAPHQL_PLAYGROUND")
	graphQLPlayground := playground == "" || playground == "true" || playground == "1"

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-jwt-secret-change-in-production"
	}

	jwtExpiry := os.Getenv("JWT_EXPIRY")
	if jwtExpiry == "" {
		jwtExpiry = "24h"
	}

	return Config{
		Port:               port,
		CORSOrigins:        splitCSV(origins),
		Env:                env,
		GraphQLPlayground:  graphQLPlayground,
		DatabaseURL:        os.Getenv("DATABASE_URL"),
		JWTSecret:          jwtSecret,
		JWTExpiry:          jwtExpiry,
		GoogleClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		WebOrigin:          firstNonEmpty(os.Getenv("WEB_ORIGIN"), "http://localhost:3000"),
		APIPublicURL:       firstNonEmpty(os.Getenv("API_PUBLIC_URL"), "http://localhost:"+port),
	}
}

func (c Config) GoogleEnabled() bool {
	return c.GoogleClientID != "" && c.GoogleClientSecret != ""
}

func (c Config) GoogleRedirectURL() string {
	return strings.TrimRight(c.APIPublicURL, "/") + "/auth/google/callback"
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
	}
	return ""
}

func loadDotEnv() {
	_ = godotenv.Load(".env")
	if wd, err := os.Getwd(); err == nil {
		_ = godotenv.Load(filepath.Join(wd, ".env"))
		_ = godotenv.Load(filepath.Join(wd, "services", "api", ".env"))
	}
}

func splitCSV(value string) []string {
	parts := strings.Split(value, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		if trimmed := strings.TrimSpace(part); trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}
