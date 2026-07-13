# ADR 004: Auth, firm onboarding, and RBAC (plan)

**Status:** Proposed — implement in phases below

## Context

Law ERP is multi-tenant: many firms, many users per firm, different roles per firm. Postgres RLS already expects `app.firm_id` from the authenticated session. Auth must be built before RBAC details are finalized.

## Goals

1. Know **who** the user is and **which firm** they belong to on every request.
2. Onboard new firms with a **first owner** safely and audibly.
3. Leave room for **RBAC** without rewriting auth later.
4. Support **Sign in with Google** (Gmail / Google account) alongside email + password.

## Non-goals (v1)

- **Enterprise SSO** (SAML / Okta / Azure AD) — later; Google OAuth is not SAML
- **Gmail API** (reading/sending mail from user inboxes) — not auth; out of scope
- MFA (phase 2 after basic login works)
- Users belonging to multiple firms in one session
- Full RBAC permission matrix (designed, not built in v1)
- **Outbound email (SMTP / Resend / etc.)** — deferred; see [Invite delivery without email](#invite-delivery-without-email-v1)
- **Email verification** — deferred with SMTP
- **Forgot-password email** — deferred; use direct password set or admin reset in v1

---

## Architecture decision

| Layer | Choice |
|-------|--------|
| Identity store | Postgres `users` (extend existing table) |
| Auth owner | Go API (`services/api`) — not browser-only |
| Password login | Email + password (optional per user — Google-only users have `password_hash` NULL) |
| **Google login** | OAuth 2.0 authorization code flow; API owns token exchange |
| Access token | Short-lived JWT (15 min): `sub`, `firm_id`, `role` |
| Refresh token | Random secret, **httpOnly cookie**, hashed in DB, rotated on use |
| Tenant enforcement | JWT → middleware → `SET app.firm_id` → RLS |
| Password hashing | argon2id (or bcrypt if simpler for v1) |

Next.js calls API with `credentials: 'include'`. No refresh tokens in `localStorage`.

**Google OAuth scopes (v1):** `openid`, `email`, `profile` only — enough to identify the user. No Gmail read/send scopes.

---

## How firms and first users are added

Three supported paths. All create **`firms` + first `users` row with `role = firm_owner`** in one transaction where possible.

### Path A — Self-service signup (default for SaaS)

**Who:** A new law firm signs up on your marketing site.

**Flow:**

```text
1. User opens /signup
2. Form: firm name, country, slug (or auto from name), owner full name, email, password
   OR "Continue with Google" → firm name step → Google provides email + name
3. POST /auth/register-firm (or OAuth callback completes registration)
4. API (single DB transaction):
     INSERT firms (...)
     INSERT users (firm_id, email, password_hash?, role='firm_owner', status='active')
     INSERT user_oauth_identities (if Google)
     INSERT audit_events (action='firm.created', ...)
     INSERT audit_events (action='user.created', ...)
5. Issue access JWT + refresh cookie
6. Redirect to /onboarding (profile, timezone, optional AI consent later)
```

**Validations:**

- Email globally unique **per firm** (already `UNIQUE (firm_id, email)`); for signup, firm is new so email is first in that firm.
- Slug unique across firms (`firms.slug`).
- Password policy: min length, block common passwords.

**Optional (later):** Email verification before full access — skip until SMTP exists.

---

## Invite delivery without email (v1)

We **create invites and accept links** now; we **do not send email** until SMTP is configured.

**Principle:** The invite API always returns (or the UI always shows) a full **`accept_url`** the operator can copy and share manually (Slack, WhatsApp, in person).

| Mode | When | Behaviour |
|------|------|-----------|
| **API response** | Always | `POST /auth/invite` and `POST /platform/firms` return `{ invite_id, accept_url, expires_at }` |
| **UI copy button** | Always | Settings → Users: “Copy invite link” after creating invite |
| **Dev log** | `ENV=development` | Log `accept_url` to server stdout (optional convenience) |
| **Email** | Later phase | Plug in `NotificationSender` interface; same `accept_url`, different channel |

**Accept URL shape:** `{WEB_ORIGIN}/accept-invite?token={raw_token}`  
Store **hashed** token in DB; raw token only in response once (like password reset).

**No SMTP friction elsewhere:**

- **Path A (signup):** Owner sets password on the form — no invite email needed.
- **Path B (platform creates firm):** Admin copies owner invite link from UI/API response.
- **Staff invites:** Owner copies link from users settings.
- **Forgot password:** Defer or v1 “admin sets temporary password” / re-send invite link — not a separate email flow yet.

When SMTP lands, add `internal/notify/email.go` implementing `SendInvite(ctx, to, acceptURL)` without changing invite or accept endpoints.

---

## Sign in with Google (Gmail account)

Users can log in or complete signup using their **Google account** (typically a `@gmail.com` address). This is **Google OAuth for identity** — not access to their Gmail inbox.

### Setup (one-time)

1. Google Cloud Console → OAuth 2.0 Client (Web application)
2. Redirect URI: `{API_ORIGIN}/auth/google/callback` (and staging/prod URLs)
3. Env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `WEB_ORIGIN`

### OAuth flow (API-owned)

```text
1. User clicks "Continue with Google" on /login or /signup
2. GET /auth/google/start?intent=login|signup|accept_invite&state=...
     → redirect to Google (state + PKCE optional)
3. Google → GET /auth/google/callback?code=...&state=...
4. API exchanges code → id_token / userinfo (email, sub, name)
5. Lookup user_oauth_identities (provider=google, provider_subject=sub)
     OR match pending invite / signup session from state
6. Issue same JWT + refresh cookie as password login
7. Redirect to WEB_ORIGIN (dashboard, onboarding, or accept-invite complete)
```

Use **`state`** (signed, short-lived cookie) to prevent CSRF and carry intent (`login`, `signup`, `accept_invite` + invite token).

### When Google is used

| Scenario | Behaviour |
|----------|-----------|
| **Login** | Google `sub` linked to existing user → JWT. Unknown Google account → error "No account" or offer signup. |
| **Signup (Path A)** | After Google, collect firm name (+ slug) if not already in session → create firm + owner, link Google, no password required. |
| **Accept invite** | Google email **must match** `firm_invites.email` → create user, link Google, mark invite accepted. Password optional. |
| **Link Google later** | Logged-in user → `POST /auth/google/link` → attach identity to current user (same email). |

### Account linking rules

- One Google account (`sub`) maps to **one** ERP user globally.
- Linking Google to a user requires Google email matches `users.email` (case-insensitive).
- User may have **password only**, **Google only**, or **both**.
- `email_verified_at` set from Google when `email_verified` claim is true.

### What Google does *not* replace

- **Invite delivery** — still copy `accept_url` manually (no SMTP).
- **Firm scoping** — Google proves identity; `firm_id` still comes from our `users` row, not from Google.
- **RBAC** — role still from our DB.

---

### Path B — Platform admin creates firm (sales / ops)

**Who:** Your team onboards a client before they log in.

**Flow:**

```text
1. Platform admin uses internal UI or CLI (protected by platform credentials)
2. POST /platform/firms
     Body: firm name, country, slug, owner email, owner full name
3. API:
     INSERT firms
     INSERT firm_invites (email, role=firm_owner, token, expires_at)
     INSERT audit_events
4. Response includes accept_url — admin copies and sends manually (no SMTP)
5. Owner opens link → /accept-invite?token=... → password or Google → login
```

No password until the owner accepts the invite. Firm exists but has **no active owner** until invite accepted.

---

### Path C — Invite-only (no public signup)

Same as Path B but **disable Path A** in config (`ALLOW_PUBLIC_SIGNUP=false`). Every firm comes through sales or platform admin.

---

### After the first owner exists

Additional users join via **firm invite** (not firm creation):

```text
firm_owner (or future users.manage permission)
  → POST /auth/invite { email, full_name, role }
  → firm_invites row
  → response: accept_url (copy + share manually)
  → invitee opens link → sets password **or Continue with Google** (email must match invite)
  → users row (role from invite, status=active)
  → audit_events
```

---

## Roles (v1 placeholders → RBAC later)

| Role | Purpose (v1) |
|------|----------------|
| `firm_owner` | First user; can invite users, firm settings, billing (later) |
| `firm_admin` | Manage users and settings, not delete firm |
| `staff` | Default; case/client work |
| `billing` | Billing module only (when wired) |
| `readonly` | View only |

v1: enforce coarse checks in middleware (`role IN (...)`).  
Later: `permissions` + `firm_user_roles` table; JWT carries permission list or role IDs.

**Platform staff** (your company): separate `platform_users` table — **not** mixed into `users` with null `firm_id` (keeps RLS simple).

---

## Schema additions (migration `000006_auth`)

```sql
-- users (alter)
password_hash       TEXT,              -- NULL for Google-only or until invite accepted
status              user_status NOT NULL DEFAULT 'pending',  -- pending | active | suspended
email_verified_at   TIMESTAMPTZ,       -- set from Google when verified
last_login_at       TIMESTAMPTZ,

-- user_oauth_identities (Google and future providers)
id, user_id, provider, provider_subject, email, created_at
UNIQUE (provider, provider_subject)
UNIQUE (user_id, provider)

-- auth_refresh_tokens
id, user_id, token_hash, expires_at, revoked_at, created_at, user_agent, ip

-- firm_invites
id, firm_id, email, full_name, role, token_hash, invited_by, expires_at, accepted_at

-- platform_users (optional v1, required for Path B UI)
id, email, password_hash, role, ...
```

Enable RLS on new tenant-scoped tables. Refresh tokens scoped by `user_id` (join to `firm_id` in app layer).

---

## API surface (REST for auth, GraphQL for app)

Auth stays **REST** (cookies, redirects, simple clients):

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register-firm` | Public (if enabled) |
| POST | `/auth/login` | Public (email + password) |
| GET | `/auth/google/start` | Public — redirect to Google (`intent=login\|signup\|accept_invite`) |
| GET | `/auth/google/callback` | Public — OAuth callback; sets JWT cookies |
| POST | `/auth/google/link` | JWT — link Google to current account |
| POST | `/auth/logout` | Refresh cookie |
| POST | `/auth/refresh` | Refresh cookie |
| POST | `/auth/forgot-password` | Deferred (no SMTP) |
| POST | `/auth/reset-password` | Token (when reset flow exists) |
| POST | `/auth/invite` | JWT + firm_owner/admin — **returns `accept_url`** |
| GET | `/auth/invites` | JWT — list pending invites + copy links |
| POST | `/auth/accept-invite` | Invite token |
| GET | `/auth/me` | JWT |

GraphQL: all existing fields require JWT middleware except `health`.

Platform (separate router + API key or platform JWT):

| POST | `/platform/firms` | Platform admin |

---

## Request pipeline (every protected call)

```text
HTTP request
  → CORS + credentials
  → Auth middleware: parse JWT from Authorization header OR access cookie
  → Validate signature, expiry, user status=active
  → Load user + firm (not deleted)
  → Context: user_id, firm_id, role
  → DB: SET LOCAL app.firm_id = firm_id
  → (later) RBAC middleware: permission check
  → GraphQL resolver / handler
  → audit sensitive mutations
```

---

## Frontend pages

| Route | Purpose |
|-------|---------|
| `/signup` | Path A — firm + owner (password **or** Google) |
| `/login` | Email/password **or** Continue with Google |
| `/accept-invite` | Password **or** Google (email must match invite) |
| `/onboarding` | Post-signup firm profile (optional v1) |
| `/settings/users` | Invite users, **copy invite link**, list pending |

---

## Implementation phases

### Phase 0 — Prerequisites
- [ ] Wire Postgres to Go API (replace `SeedStore`)
- [ ] Run existing migrations + `000006_auth`
- [ ] Connection pool sets `app.firm_id` helper

### Phase 1 — Core auth
- [ ] Password hash + login + logout + refresh
- [ ] JWT middleware on `/graphql` and protected REST
- [ ] `GET /auth/me`
- [ ] Frontend login page + auth context + redirect if unauthenticated
- [ ] **Google OAuth:** `/auth/google/start` + `/auth/google/callback` for **login** (existing linked users)
- [ ] `user_oauth_identities` + link/unlink rules

### Phase 2 — Firm + owner onboarding
- [ ] `POST /auth/register-firm` (Path A) — password path
- [ ] Signup page with **Continue with Google** → firm details step → register
- [ ] Audit events on firm/user creation
- [ ] Slug generation + validation

### Phase 3 — Invites (no email)
- [ ] `firm_invites` + accept flow (password **or** Google on accept page)
- [ ] `POST /auth/invite` returns `accept_url`
- [ ] UI: copy link + pending invites list
- [ ] Optional: log `accept_url` in dev
- [ ] **Later:** `NotificationSender` + SMTP/Resend

### Phase 4 — Platform onboarding
- [ ] `platform_users` + `/platform/firms` (Path B) — response includes owner `accept_url`
- [ ] Internal admin UI or CLI

### Phase 5 — RBAC (separate design session)
- [ ] Permissions table + middleware
- [ ] Replace coarse `role` string checks
- [ ] Settings UI for roles

### Phase 6 — Hardening
- [ ] Outbound email (invites, verify, forgot-password) via pluggable sender
- [ ] Email verification
- [ ] MFA
- [ ] Rate limiting on login/invite
- [ ] Session revocation (logout all devices)

---

## Security checklist

- [ ] `firm_id` from JWT only — never trust GraphQL input alone
- [ ] Refresh token rotation + reuse detection
- [ ] Invite tokens: single-use, hashed, expire in 7 days
- [ ] Suspend user → invalidate refresh tokens
- [ ] All auth events in `audit_events`
- [ ] CORS `AllowCredentials` only for known web origin
- [ ] Google OAuth: validate `state`, use HTTPS redirect URIs in prod, store only `sub` + email — not Google access tokens long-term

---

## Environment variables (auth)

```bash
# API
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
WEB_ORIGIN=http://localhost:3000   # post-OAuth redirect target

# Web (optional — only if client initiates; prefer API redirect flow)
# NEXT_PUBLIC_GOOGLE_CLIENT_ID not required if OAuth starts on API
```

---

## Open questions (decide before Phase 2)

1. **Public signup on day one?** Path A vs invite-only (Path C). Path A avoids invites entirely for the first owner.
2. **Slug rules** — user-chosen vs auto (`rahman-associates`).
3. **One email across firms?** v1: same email can exist in different firms (different accounts). Same email twice in one firm: blocked.

**Decided:** No SMTP in v1 — manual `accept_url` copy; email added in Phase 6.  
**Decided:** Sign in with Google (OAuth) in v1 — identity only, no Gmail API scopes.

---

## Related

- [ADR 002: Multi-tenant data model](002-multi-tenant-data-model.md)
- [DATA_GOVERNANCE.md](../DATA_GOVERNANCE.md)
- [DATABASE.md](../DATABASE.md)
