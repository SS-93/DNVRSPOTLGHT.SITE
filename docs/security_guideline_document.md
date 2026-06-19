# Security Guidelines for Denver Spotlight Community Platform v2.0

This document defines the security principles and controls to be applied across the entire Denver Spotlight v2.0 codebase, infrastructure, and development lifecycle. It aligns with industry best practices, ensures defense in depth, and prepares for the phased on-ramp into the Buckets ecosystem.

---

## 1. Introduction & Scope

These guidelines cover:
- The Next.js 16 frontend (App Router, React 19, Tailwind v4) and ReactBits components.
- Phase 1 backend (Supabase `inquiries` table, Resend transactional emails).
- Environment and configuration management (.env files, `config/organization.ts`).
- Future Buckets integrations (Passport, Concierto, MediaID, Treasury, Coliseum, Companon, CALS).
- CI/CD processes (GitHub Actions, Vercel deployments).

They do **not** cover detailed mobile-app security or third-party admin UIs (Phase 3).

---

## 2. Core Security Principles

1. **Security by Design**: Integrate security considerations early in component design, code reviews, and architecture diagrams.
2. **Least Privilege**: Grant only minimal rights to services, database roles, environment variables, and file systems.
3. **Defense in Depth**: Layer controls at the network, application, data, and infrastructure levels.
4. **Fail Securely**: Default to denying access on error; never leak stack traces, credentials, or internal URLs.
5. **Secure Defaults**: Opt-in to all Buckets feature flags; require explicit enabling (`buckets.* = true`).
6. **Keep It Simple**: Favor built-in Next.js 16 App Router patterns, avoid custom middleware complexity.
7. **Input Validation & Output Encoding**: Treat all external input as untrusted; use Zod or similar on server actions.

---

## 3. Authentication & Access Control

### Phase 1 (Open Site)
- No user login for marketing forms; public pages read-only.
- Admin endpoints (e.g., environment health checks) must be protected by a secret token or disabled.

### Phase 2/3 (Buckets Integration & Admin UI)
- **Passwordless Auth**: Use Supabase Auth magic-link; validate `access_token` server-side on every request.
- **Role-Based Access Control (RBAC)**:
  - Define roles in Supabase Auth: `admin`, `editor`, `finance`.
  - Protect server actions with custom middleware or `proxy.ts` to check JWT claims.
- **JWT Security**:
  - Use RS256 or HS256 with strong keys stored in a secrets manager (e.g., AWS Secrets Manager).
  - Validate `exp` and `iss` claims on every call.
- **Session Management**:
  - Short token lifetimes (e.g., 15 min), with secure refresh flows.
  - HTTP-only, Secure, SameSite=lax cookies if storing session tokens.

---

## 4. Input Handling & Processing

- **Server-Side Validation**: Every form payload runs through a Zod (or Yup) schema in API routes or Server Actions (`'use server'`).
- **Prevent Injection**:
  - Use Supabase parameterized queries rather than string concatenation.
  - Sanitize any dynamic values in Supabase SQL views or functions.
- **XSS & Output Encoding**:
  - Escape all user-supplied content rendered in React components.
  - Use `dangerouslySetInnerHTML` only after sanitizing with a vetted library (e.g., DOMPurify).
  - Enforce a strict Content Security Policy via HTTP headers.
- **CSRF Protection**:
  - For any state-changing POST/PUT/DELETE endpoints, implement CSRF tokens or rely on same-site cookies.
- **Redirect Validation**:
  - If using dynamic redirects, allow-list domains or paths in `NEXT_PUBLIC_REDIRECT_WHITELIST` env var.
- **File Uploads**:
  - Phase 1 has none; if added, validate file type, size, and strip metadata.

---

## 5. Data Protection & Privacy

- **Encryption in Transit**:
  - Enforce HTTPS (TLS 1.2+) on Vercel; redirect all HTTP traffic.
- **Encryption at Rest**:
  - Supabase database encrypted by default; verify storage encryption settings.
- **Secrets Management**:
  - No hard-coded keys in source. Use Vercel environment variables or a secrets manager.
  - Prefix only non-public variables with `NEXT_`; avoid `NEXT_PUBLIC` for secrets.
- **PII Handling**:
  - Mask or truncate personal data in logs; redact email addresses and phone numbers.
  - Support user data deletion via API linked to the data-deletion form.
- **Privacy Compliance**:
  - Cookie-consent banner gating non-essential cookies.
  - Detailed Privacy Policy page; maintain a record of user consents.

---

## 6. API & Service Security

- **Rate Limiting & Throttling**:
  - Apply per-IP or per-API key limits on `/api/inquiries`, `/api/events`, and Buckets endpoints.
- **CORS Configuration**:
  - Restrict to trusted origins (e.g., `https://denverspotlight.org`).
  - Disallow credentials from untrusted origins.
- **Versioning & Least Exposure**:
  - Namespace future Buckets APIs under `/api/v2/...`.
  - Expose only necessary fields in JSON responses; omit internal IDs and debug info.
- **HTTP Methods**:
  - Enforce correct verbs; reject unexpected methods with `405 Method Not Allowed`.

---

## 7. Web Application Security Hygiene

- **Security Headers** (configured at edge or in `proxy.ts`):
  - `Content-Security-Policy`: default-deny, allow scripts only from self or GTM after consent.
  - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`.
  - `X-Content-Type-Options: nosniff`.
  - `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'`.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
- **Cookie Security**:
  - `Secure; HttpOnly; SameSite=Lax` for session/auth cookies.
- **Subresource Integrity**:
  - Use SRI hashes for any critical CDN assets (e.g., fonts).

---

## 8. Infrastructure & Configuration Management

- **Vercel Hardening**:
  - Disable unused features (e.g., preview deployments if not needed).
  - Enforce two-factor authentication on team accounts.
- **Environment Isolation**:
  - Separate projects for development, staging, production in Vercel and Supabase.
  - Use `.env.development`, `.env.staging`, `.env.production` with strict variable whitelists.
- **Access Control**:
  - Grant Vercel and Supabase service role keys only to CI and edge functions; restrict local usage.
- **TLS Configuration**:
  - Ensure only strong cipher suites; no TLS 1.0/1.1.
- **Disable Debug**:
  - `NEXT_PUBLIC_VERCEL_ANALYTICS=false` in production; `NODE_ENV=production`.

---

## 9. Dependency Management

- **Lockfiles**: Commit `package-lock.json` or `yarn.lock` and audit on every pull request.
- **Vulnerability Scanning**: Integrate Snyk or GitHub Dependabot to catch CVEs in React, Next.js, Tailwind, etc.
- **Minimize Footprint**: Review dependencies quarterly; remove unused packages (e.g., legacy v3 Tailwind plugins).

---

## 10. CI/CD & DevOps Security

- **GitHub Actions**:
  - Enforce branch protection (required reviews, status checks).
  - Run linting, type checks, Zod schema validation, Lighthouse, and axe-core.
- **Secrets in CI**:
  - Store API keys in GitHub Secrets with least privilege scopes.
- **Automated Tests**:
  - Unit tests for input validation, integration tests for API endpoints, end-to-end smoke tests on staging.
- **Deployment Safety**:
  - Require manual approval for production deploys; use Vercel’s Protected Branch Preview.

---

## 11. Monitoring, Logging & Incident Response

- **Logging**:
  - Centralize logs (Vercel Edge logs, Supabase logs) without PII.
  - Tag logs by request ID for traceability.
- **Monitoring**:
  - Set up uptime checks (Pingdom, Vercel monitor).
  - Alert on elevated error rates (5xx errors > 1% of requests).
- **Incident Response**:
  - Define run-books for data breach, service outage, secret compromise.
  - Rotate keys immediately upon suspected compromise; notify stakeholders.

---

## 12. Conclusion

Adhering to these security guidelines ensures Denver Spotlight v2.0 launches with a hardened foundation and can safely evolve through Phases 2 and 3. Continuous review, automated checks, and defense in depth will protect both user trust and the integrity of the Buckets on-ramp.