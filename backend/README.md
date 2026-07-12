# TransitOps Backend

This is the backend for TransitOps (Smart Transport Operations Platform).

## Architecture

This backend follows a strict layered architecture grouped by technical responsibility (not feature modules). This ensures simplicity and clean separation of concerns for the hackathon.

The request flow must ALWAYS be:
`Route -> Controller -> Service -> Repository -> Prisma -> PostgreSQL`

### Layer Responsibilities

1. **Routes (`src/routes/`)**:
   - Register HTTP endpoints (e.g., `router.get('/', controller.getAll)`).
   - Attach necessary middlewares (auth, role, validation).
   - DO NOT handle requests directly.

2. **Controllers (`src/controllers/`)**:
   - Must be extremely thin.
   - Extract data from `req` (body, params, query).
   - Call the appropriate Service method.
   - Return the formatted HTTP response (success or failure).
   - DO NOT contain business logic or database queries.

3. **Services (`src/services/`)**:
   - Contain ALL the business logic and rules.
   - Execute operations using Repositories.
   - Throw custom errors (`NotFoundError`, `ValidationError`, etc.) if business rules are violated.

4. **Repositories (`src/repositories/`)**:
   - The ONLY layer allowed to interact with Prisma.
   - Handle direct data access (create, read, update, delete).
   - Should not contain business logic.

5. **Middleware (`src/middleware/`)**:
   - Reusable Express middlewares.
   - Includes `validate.middleware.ts` (using Zod), `auth.middleware.ts`, `authorize.middleware.ts`, and a global `error.middleware.ts`.

### Directory Structure

```text
src/
├── config/             # Environment variables and Prisma singleton
├── controllers/        # Thin request handlers
├── services/           # Business logic
├── repositories/       # Database access (Prisma)
├── routes/             # API endpoint definitions
├── validators/         # Zod validation schemas
├── middleware/         # Express middlewares
├── errors/             # Custom error classes
├── constants/          # Application constants
├── utils/              # Helper functions (e.g., logger, jwt)
├── types/              # TypeScript types and interfaces
├── app.ts              # Express application setup
└── server.ts           # Server entry point
```

## API Response Format

**Success:**
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { ... }
}
```

**Failure:**
```json
{
    "success": false,
    "message": "Error description",
    "errors": [ ... ]
}
```

## Getting Started

1. Set up `.env` based on the Prisma schema requirements.
2. Run `pnpm install`.
3. Start the dev server using `pnpm run dev`.
