package graph

import (
	"github.com/mr-aminul/law-erp/services/api/internal/config"
	"github.com/mr-aminul/law-erp/services/api/internal/store"
)

// Resolver is the root GraphQL resolver.
type Resolver struct {
	Config config.Config
	Store  *store.SeedStore
}
