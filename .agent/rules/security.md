 
# Security Guidelines

## Authentication
- Use access + refresh tokens.
- Rotate refresh tokens.
- Store tokens securely.

## API Security
- Enable rate limiting.
- Use Helmet (Node.js).
- Validate input with schema validation.

## Database
- Parameterized queries only.
- Enforce least privilege access.

## Secrets
- Never hardcode secrets.
- Use .env files.