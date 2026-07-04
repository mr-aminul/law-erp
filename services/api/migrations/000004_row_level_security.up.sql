-- Row Level Security: every query scoped to app.firm_id (set by API from JWT).

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE firm_ai_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_export_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_texts ENABLE ROW LEVEL SECURITY;

-- Helper: current tenant from session (set per request: SET app.firm_id = 'uuid').
CREATE OR REPLACE FUNCTION app_current_firm_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.firm_id', true), '')::UUID;
$$ LANGUAGE sql STABLE;

CREATE POLICY tenant_isolation_users ON users
  USING (firm_id = app_current_firm_id());

CREATE POLICY tenant_isolation_clients ON clients
  USING (firm_id = app_current_firm_id());

CREATE POLICY tenant_isolation_cases ON cases
  USING (firm_id = app_current_firm_id());

CREATE POLICY tenant_isolation_case_notes ON case_notes
  USING (firm_id = app_current_firm_id());

CREATE POLICY tenant_isolation_documents ON documents
  USING (firm_id = app_current_firm_id());

CREATE POLICY tenant_isolation_document_texts ON document_texts
  USING (firm_id = app_current_firm_id());

CREATE POLICY tenant_isolation_consents ON firm_ai_consents
  USING (firm_id = app_current_firm_id());

CREATE POLICY tenant_isolation_audit ON audit_events
  USING (firm_id IS NULL OR firm_id = app_current_firm_id());

CREATE POLICY tenant_isolation_export_batches ON ai_export_batches
  USING (firm_id = app_current_firm_id());
