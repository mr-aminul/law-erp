package config

import (
	"os"
	"strings"
)

type Config struct {
	Port              string
	CORSOrigins       []string
	Env               string
	GraphQLPlayground bool
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	origins := os.Getenv("CORS_ORIGINS")
	if origins == "" {
		origins = "http://localhost:3000,http://localhost:3001"
	}

	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	playground := os.Getenv("GRAPHQL_PLAYGROUND")
	graphQLPlayground := playground == "" || playground == "true" || playground == "1"

	return Config{
		Port:              port,
		CORSOrigins:       splitCSV(origins),
		Env:               env,
		GraphQLPlayground: graphQLPlayground,
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
