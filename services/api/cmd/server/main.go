package main

import (
	"log"
	"net/http"

	"github.com/mr-aminul/law-erp/services/api/internal/config"
	"github.com/mr-aminul/law-erp/services/api/internal/server"
)

func main() {
	cfg := config.Load()

	srv := server.New(cfg)

	addr := ":" + cfg.Port
	log.Printf("law-erp api listening on http://localhost%s", addr)

	if err := http.ListenAndServe(addr, srv); err != nil {
		log.Fatal(err)
	}
}
