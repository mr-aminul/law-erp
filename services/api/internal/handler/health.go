package handler

import (
	"encoding/json"
	"net/http"
)

type HealthHandler struct {
	env string
}

func NewHealthHandler(env string) *HealthHandler {
	return &HealthHandler{env: env}
}

type healthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
	Env     string `json:"env"`
}

func (h *HealthHandler) Check(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, healthResponse{
		Status:  "ok",
		Service: "law-erp-api",
		Env:     h.env,
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
