# Architecture

## Project Structure

The project is a monorepo with two independent apps sharing no code directly (their contract is the REST API):

```
knowledge-base-assistant/
├── backend/    # Express API — MVC + services layer
└── frontend/   # React SPA — component/page architecture
```

**Backend layering** (top to bottom, each layer only knows about the one below it):

```
routes/        → maps HTTP verb + path to a controller function, applies middleware
controllers/   → orchestrates a single request: calls services/models, shapes the response
services/      → pure business logic (text extraction, Gemini prompting) — no req/res, unit-testable
models/        → Mongoose schemas — the only layer that talks to MongoDB directly
middleware/    → cross-cutting concerns: auth, error handling, file upload, validation
utils/         → shared primitives (ApiError, ApiResponse, asyncHandler)
```

This keeps controllers thin and the AI/extraction logic swappable — replacing Gemini with OpenAI touches exactly one file (`services/geminiService.js`) and its one import site.

**Frontend layering**:

```
pages/         → one per route, composes layout + components + data fetching
components/    → grouped by domain (documents/, chat/, dashboard/, common/)
services/      → one file per backend resource, wraps axios calls with typed responses
context/       → AuthContext — the only global state (everything else is local/page-level)
types/         → shared interfaces mirroring the backend Mongoose schemas
```

## Database Design

Three collections:

**`users`**

| Field | Type | Notes |
|---|---|---|
| name, email, password | String | password bcrypt-hashed, `select: false` by default |
| timestamps | auto | createdAt / updatedAt |

**`documents`**

| Field | Type | Notes |
|---|---|---|
| owner | ObjectId -> User | indexed, every query scopes by this |
| name, originalFileName, fileType, mimeType, sizeInBytes, storagePath | mixed | metadata |
| extractedText | String | `select: false` — large field, only pulled for preview/ask |
| extractionStatus | enum | `pending` / `success` / `failed` |
| extractionError | String | surfaced to the UI so failure is never a silent dead end |

**`conversations`**

| Field | Type | Notes |
|---|---|---|
| user | ObjectId -> User | indexed |
| document | ObjectId -> Document | indexed, populated with `name`/`fileType` for history views |
| question, answer | String | |
| status | enum | `success` / `failed` — failed AI calls are still recorded |

**Relationships**: User 1-N Document, User 1-N Conversation, Document 1-N Conversation.
Deleting a document cascades to delete its conversations, preventing orphaned chat history.

## Authentication Approach

- JWT (`jsonwebtoken`, HS256, secret from env), expiring per `JWT_EXPIRES_IN` (default 7 days).
- Password hashed with bcrypt (cost 10) in a Mongoose `pre('save')` hook — impossible to accidentally save plaintext from any code path.
- `authMiddleware.protect` reads `Authorization: Bearer <token>`, verifies it, loads the user from DB (so deleted users are rejected even with a valid token), attaches `req.user`.
- Frontend: JWT stored in `localStorage`, attached via axios request interceptor. A response interceptor catches 401s globally and force-logs out + redirects to `/login` in one place, not scattered across every call site.

## Major Engineering Decisions

**1. RAG-lite over a vector database.**
Full document text (truncated to ~20k chars) is injected directly into the Gemini prompt per question, rather than chunking + embedding + storing in a vector DB. At assessment scale this is simpler and just as accurate. The trade-off — it does not scale to very large documents — is noted in the Future Improvements section.

**2. Consistent API envelope + single error path.**
Every response is `{ success, message, data }`. Every thrown error (validation, Mongoose, Multer, JWT, unexpected bug) is normalized by one `errorHandler` middleware into the same JSON shape. The frontend implements error handling once (`getErrorMessage()`) instead of per-endpoint.

**3. Extraction failure as a state, not a rejection.**
If a PDF has no extractable text, the upload still succeeds and the document is stored with `extractionStatus: 'failed'` and a human-readable reason. The UI reflects this (grayed-out buttons, inline warning) rather than throwing away the upload.

**4. Graceful AI failure handling.**
If the Gemini call throws, the failed attempt is saved to `conversations` with `status: 'failed'`, the API returns 502, and the user sees a clear error state — their question is not lost and no screen is left blank.

**5. Debounced search.**
Search inputs debounce 400ms before resetting the page and re-fetching, keeping the UI responsive without hammering the API on every keystroke.

## How to Scale This Further

- **File storage**: move from local disk to S3/GCS — required for any multi-instance deployment.
- **Retrieval**: swap prompt-stuffing for embeddings + a vector store (pgvector, Pinecone, or MongoDB Atlas Vector Search) once documents regularly exceed the context window.
- **Caching**: Redis in front of `/dashboard` and repeated identical questions.
- **Streaming**: swap `generateContent` for Gemini's `generateContentStream` and pipe to the client over SSE for faster perceived response times.
- **Background processing**: move text extraction into a queue (BullMQ + Redis) so large PDF uploads respond immediately and extract asynchronously.
- **Horizontal scaling**: the API is already stateless (JWT, no server-side sessions), so it scales horizontally behind a load balancer the moment file storage leaves local disk.
