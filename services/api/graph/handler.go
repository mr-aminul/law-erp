package graph

import (
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/mr-aminul/law-erp/services/api/graph/generated"
)

// NewHandler returns the GraphQL HTTP handler.
func (r *Resolver) NewHandler() http.Handler {
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
		Resolvers: r,
	}))
	return srv
}

// NewPlaygroundHandler serves GraphiQL (development only).
func NewPlaygroundHandler() http.Handler {
	return playground.Handler("Law ERP GraphQL", "/graphql")
}
