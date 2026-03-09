# Undocumented behaviors for API reimplementation

Use this alongside `openapi.yaml` when duplicating the API. These are implicit behaviors and edge cases not obvious from the spec alone.

## Authentication

- **Token lookup order:** `Authorization: Bearer <token>` → `req.body.token` → `req.query.token`
- **JWT payload:** `{ email, id, exp, iat }` where `id` is MongoDB ObjectId
- **JWT expiry:** 365 days from issue

## Request body limits

- JSON: 10MB (`express.json({ limit: '10mb' })`)
- URL-encoded: 10MB (`express.urlencoded({ extended: true, limit: '10mb' })`)

## Email validation

- **Regex:** `/^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/`
- Applied only to non-Google registration (`isGoogleUser !== true`)

## One-time codes

- **Format:** 6-digit numeric (100000–999999)
- **Lifespan:** 15 minutes (`TOKEN_LIFESPAN_MINS`)
- **Validation:** `updatedAt >= (now - 15 mins)` (code timestamp stored via Mongoose `timestamps`)
- **Type coercion:** Mongoose accepts string or number for `oneTimeCode`

## Google user registration

When `isGoogleUser: true`:
- No email format validation
- No "already registered" check (both new and existing users get 204)
- Existing Google users: 204, no-op

## Settings update

- Only `showWelcomeStrip` is writable
- Only applied when `typeof req.body.showWelcomeStrip === 'boolean'`
- Non-boolean values (null, string, number) are ignored; no error
- Empty body: 204, no change

## Contact endpoint

- Missing `text`: email content is `undefined` or empty
- No validation on `text` or `email`
- Sends to hardcoded `devtimr@gmail.com`

## Track showId validation

- `Number(req.params.showId)` must be finite
- `NaN`, `Infinity`, non-numeric strings → 422 "Incorrect parameters"

## Rate limiting

- 50 requests per 15 minutes
- **Skipped** when `NODE_ENV !== 'production'`
- Standard headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`

## CORS

- Origin allowlist: `localhost:4000`, `tv-minder.com`, `netlify.app` variants, `*.netlify.app`
- Credentials: true
- Max-Age: 86400
