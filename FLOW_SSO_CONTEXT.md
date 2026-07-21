# Galaxy Launchpad - SSO Authentication & Onboarding Flow

## Overview
Galaxy Launchpad is Finzly's banking middleware onboarding portal. The application implements a secure SSO (Single Sign-On) authentication flow followed by domain-specific configuration dashboards.

---

## Authentication Flow

### Phase 1: Entry Point (Unauthenticated)
```
User → Landing Page (/)
        ↓
        Redirects to /core (default domain)
```

**Current Implementation:**
- `src/app/page.tsx` - Root page redirects to `/core`
- No authentication middleware currently implemented
- Redirects happen at the routing level

**To Implement SSO:**
- Add `middleware.ts` to intercept requests
- Redirect unauthenticated users to SSO provider
- Store auth tokens in secure HTTP-only cookies

---

### Phase 2: SSO Authentication
```
User visits / or tries to access /core
        ↓
Middleware checks authentication status
        ↓
User NOT authenticated?
        ↓
Redirect to SSO Provider (OAuth 2.0 / SAML)
        ↓
User logs in (credential or federated)
        ↓
SSO Provider returns auth code
        ↓
Exchange code for tokens (ID token + access token)
        ↓
Store tokens (HTTP-only cookie, optional refresh token)
        ↓
Redirect back to requested page
```

**Recommended SSO Providers:**
- Okta (enterprise SSO)
- Auth0
- Microsoft Entra ID (Azure AD)
- Custom OAuth 2.0 server

**Token Storage:**
```javascript
// Secure approach
- Access Token: HTTP-only, Secure cookie (short-lived, ~15 min)
- Refresh Token: HTTP-only, Secure cookie (long-lived, ~7 days)
- User Info: In-memory state (fetched from ID token)
```

---

### Phase 3: Portal Entry (Authenticated)
```
SSO Redirect callback
        ↓
Verify token signature
        ↓
Extract user claims (email, name, tenant, roles)
        ↓
Redirect to /core (or last requested page)
        ↓
Middleware validates session on every request
        ↓
Access granted → Portal Layout rendered
```

---

## Post-Authentication Flow

### Portal Structure
```
/core              → Core Banking Configuration
/payments          → Payment Rails Setup
/screening         → OFAC / Screening Setup
/trade             → Foreign Trade Setup
/reporting         → Reporting Configuration
/digital           → Digital Channel Setup
```

### Portal Layout Components
**File:** `src/app/(portal)/layout.tsx`

```
┌─────────────────────────────────────┐
│         TopBar                      │
│    (Tenant info, User menu)         │
├──────────────┬──────────────────────┤
│              │                      │
│  Sidebar     │   Page Content       │
│  (Domains)   │   (Domain Config)    │
│              │                      │
└──────────────┴──────────────────────┘
```

---

## Core Banking Configuration Flow

### Current Implementation (In `/core`)

**Step 1: Provider Selection**
```
Select Core Banking Provider (Fiserv, FIS, Jack Henry, etc.)
            ↓
Select Flavour (version-specific config)
```

**Step 2: Capability Configuration**
For each Core Banking connection:
- **Account Inquiry** - API endpoints, auth, request/response mapping
- **Memo Post** - Holds/freezes on accounts
- **Validate** - Pre-transaction validation rules
- **Custom Core Facility** - Any other integration

**Step 3: Form Sections Per Capability**
```
Account Inquiry / Memo Post / Validate / Custom
    ├── Provider & Flavour Select
    ├── URL & Endpoints
    ├── Authentication (Dynamic per type)
    │   ├── OAuth 2.0 (Client Credentials)
    │   ├── API Key + Secret
    │   ├── Mutual TLS (mTLS)
    │   ├── JWT Bearer Token
    │   └── Basic Authentication
    ├── Request/Response Formatting (JSON/XML)
    ├── Environment URLs (Dev, UAT, Prod)
    ├── Field Mapping (Core ↔ Finzly)
    ├── Status Code Mapping
    └── Validation Rules (for Validate capability)
```

**Step 4: Multi-Core Support**
```
Add another Core Banking button
            ↓
Creates duplicate configuration set for different provider
            ↓
Each core has isolated state
            ↓
All stored together in form submission
```

---

## Data Flow

### Authentication State
```javascript
// Example auth context structure
{
  isAuthenticated: boolean,
  user: {
    id: string,
    email: string,
    name: string,
    tenant: string,
    roles: string[]
  },
  accessToken: string,     // From SSO
  expiresAt: number,       // Timestamp
  refreshToken?: string    // Optional
}
```

### Configuration State (Core Banking Example)
```javascript
{
  coreConnections: [
    {
      id: string,
      provider: string,           // e.g., "Fiserv"
      flavour: string,            // e.g., "Premier"
      
      inquiry: {
        enabled: boolean,
        url: string,
        endpoints: [{ method, endpoint, description }],
        authType: string,
        authValues: { [fieldName]: value },
        reqFormat: "JSON" | "XML",
        reqRaw: string,
        resFormat: "JSON" | "XML",
        resRaw: string,
        envs: [{ type: "Dev" | "UAT" | "Prod", url }],
        mappingRows: [{ source: coreField, target: finzlyField }],
        status: { [statusCategory]: httpCode },
        statusExtras: [{ code, meaning }]
      },
      
      memo: { /* similar structure */ },
      validate: { /* similar structure */ },
      custom: { /* simple structure */ }
    }
  ]
}
```

---

## Security Considerations

### Authentication
- [ ] Implement middleware for route protection
- [ ] Use HTTP-only cookies for tokens
- [ ] Implement CSRF protection
- [ ] Add rate limiting on SSO endpoints

### Data Protection
- [ ] Encrypt sensitive fields (credentials, API keys)
- [ ] Never log credentials
- [ ] Validate all input on backend
- [ ] Implement role-based access control (RBAC)

### Session Management
- [ ] Implement token refresh mechanism
- [ ] Add session timeout (30-60 min idle)
- [ ] Clear tokens on logout
- [ ] Implement "remember me" securely (if needed)

---

## Implementation Roadmap

### Phase 1: SSO Setup (Week 1)
- [ ] Choose SSO provider (Okta/Auth0/Azure AD)
- [ ] Set up OAuth 2.0 application
- [ ] Create middleware for auth checks
- [ ] Implement callback handler

### Phase 2: Session Management (Week 2)
- [ ] Create auth context/provider
- [ ] Implement token refresh logic
- [ ] Add logout functionality
- [ ] Create protected route wrapper

### Phase 3: UI Integration (Week 3)
- [ ] Add login page (redirect SSO)
- [ ] Add user menu in TopBar
- [ ] Implement logout flow
- [ ] Add role-based UI restrictions

### Phase 4: Testing & Hardening (Week 4)
- [ ] Security audit
- [ ] Test SSO flow with provider
- [ ] Implement error handling
- [ ] Add monitoring/logging

---

## File Structure for Authentication

```
src/
├── app/
│   ├── page.tsx                 (Entry point)
│   ├── auth/
│   │   ├── login/page.tsx       (Login page - optional)
│   │   ├── callback/page.tsx    (SSO callback handler)
│   │   └── logout/page.tsx      (Logout handler)
│   ├── api/
│   │   └── auth/
│   │       ├── callback/route.ts    (Backend SSO callback)
│   │       ├── logout/route.ts      (Backend logout)
│   │       └── refresh/route.ts     (Token refresh)
│   ├── middleware.ts            (Auth middleware)
│   └── (portal)/
│       ├── layout.tsx
│       ├── core/page.tsx
│       └── ...
├── lib/
│   └── auth/
│       ├── client.ts            (Client-side auth utils)
│       ├── server.ts            (Server-side auth utils)
│       └── types.ts             (Auth type definitions)
├── context/
│   └── auth-context.tsx         (React Context for auth state)
├── hooks/
│   └── useAuth.ts               (Custom hook for auth)
└── components/
    └── auth/
        ├── ProtectedRoute.tsx
        ├── LoginRequired.tsx
        └── UserMenu.tsx
```

---

## Environment Variables

```bash
# SSO Provider Configuration
NEXT_PUBLIC_SSO_PROVIDER=okta                      # or auth0, azure, etc.
NEXT_PUBLIC_SSO_CLIENT_ID=your_client_id
NEXT_PUBLIC_SSO_DOMAIN=your-tenant.okta.com
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback

# Backend Secrets (Server-only)
SSO_CLIENT_SECRET=xxx
SSO_SIGNING_KEY=xxx
SESSION_SECRET=xxx

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

---

## Testing Checklist

- [ ] User can log in via SSO
- [ ] Token is stored securely
- [ ] User can access portal pages
- [ ] Unauthenticated user redirects to SSO
- [ ] Token refresh works
- [ ] Logout clears session
- [ ] Session timeout works
- [ ] User info loads correctly
- [ ] Different roles see different features
- [ ] Sensitive data is not exposed in frontend

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@auth0/nextjs-auth0": "^3.x.x",          // if using Auth0
    "next-auth": "^5.x.x",                    // alternative auth lib
    "js-cookie": "^3.x.x",                    // cookie management
    "jose": "^5.x.x"                          // JWT handling
  }
}
```

---

## References

- OAuth 2.0: https://datatracker.ietf.org/doc/html/rfc6749
- SAML 2.0: https://wiki.oasis-open.org/security
- Auth0 Documentation: https://auth0.com/docs
- Okta Documentation: https://developer.okta.com
- Next.js Auth: https://nextjs.org/docs/app/building-your-application/authentication
