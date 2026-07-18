# AI-Powered Knowledge Base Assistant

A full-stack web application where users upload documents (PDF, TXT, Markdown) and ask AI-powered questions about their contents. Built for the Full Stack Developer technical assessment.

## Project Overview

Users sign up, upload documents to a personal knowledge base, and ask natural-language questions about any document. The app extracts text from each upload, sends it as grounding context to Google's Gemini API, and returns an answer sourced strictly from that document. Every question and answer is saved to a searchable chat history, and a dashboard summarizes activity at a glance.

**Tech stack**

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| AI | Groq (`groq-sdk`, model: `llama-3.3-70b-versatile`) |
| File handling | Multer (upload), `pdf-parse` (extraction) |

## Project Structure

```
knowledge-base-assistant/
├── backend/
│   ├── src/
│   │   ├── config/        # DB + Gemini client setup
│   │   ├── models/        # User, Document, Conversation (Mongoose)
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # Express routers
│   │   ├── middleware/    # Auth, error handling, upload, validation
│   │   ├── services/      # Text extraction, Gemini prompting
│   │   ├── utils/         # ApiError, ApiResponse, asyncHandler
│   │   └── uploads/       # Uploaded files on disk
│   ├── app.js / server.js
│   └── .env.example
├── frontend/
│   └── src/
│       ├── components/    # common/, documents/, chat/, dashboard/
│       ├── pages/         # Login, Register, Dashboard, Documents, Chat, History
│       ├── context/       # AuthContext
│       ├── services/      # API clients (axios)
│       ├── types/         # Shared TypeScript interfaces
│       └── layouts/       # AuthLayout, MainLayout
├── README.md
├── AI_USAGE.md
├── DEBUG_NOTES.md
└── ARCHITECTURE.md
```

## Setup & Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB (local instance or a free MongoDB Atlas cluster)
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone and install

```bash
git clone <your-repo-url>
cd knowledge-base-assistant

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```bash
cd backend
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `GROQ_API_KEY` | Your Groq API key (get one free at console.groq.com) |
| `GROQ_MODEL` | Optional — overrides default (`llama-3.3-70b-versatile`) |
| `CLIENT_URL` | Frontend origin, for CORS (default `http://localhost:5173`) |

The frontend needs no `.env` for local dev — Vite proxies `/api` requests to `http://localhost:5000` (see `frontend/vite.config.ts`).

### 3. Run locally

```bash
# Terminal 1 — backend
cd backend
npm run dev        # nodemon, http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm run dev         # http://localhost:5173
```

Open `http://localhost:5173`, register an account, and start uploading documents.

### 4. Build for production

```bash
cd frontend && npm run build     # outputs to frontend/dist
cd backend  && npm start          # serves the API (pair with a static host or reverse proxy for the built frontend)
```

## Design Decisions

- **MVC + services layer on the backend.** Controllers stay thin; AI calls and text extraction live in `services/`, so swapping Gemini for OpenAI later is a one-file change, and the logic is unit-testable in isolation.
- **RAG-lite instead of a vector database.** Documents are extracted to plain text and injected directly into the Gemini prompt (truncated to ~20k characters). At assessment scale this is simpler and just as accurate as embeddings + a vector store, and it avoids adding infrastructure (Pinecone/Chroma/etc.) that the requirements don't call for.
- **Consistent response envelope.** Every API response is `{ success, message, data }` via `ApiResponse`, and every error funnels through one `ApiError` → global `errorHandler`. This made the frontend's error handling trivial — one `getErrorMessage()` helper covers every failure mode.
- **Graceful degradation on extraction/AI failure.** A document with failed text extraction (e.g. a scanned/image-only PDF) still gets stored with `extractionStatus: 'failed'` rather than rejecting the upload outright — the user sees why, in place, rather than losing the file.
- **Design language.** The frontend uses a deliberate "archive/library" visual identity (ledger-blue, stamp-amber accents, serif headings, ink-stamp file-type badges) rather than a generic dashboard template, since the product's actual subject is a personal document archive.

## Future Improvements

- Swap plain-text-in-prompt for real embeddings + a vector store once documents/users scale past what fits in a single context window.
- Add streaming AI responses (Gemini supports streaming; the current implementation awaits the full response).
- Add Docker Compose (Mongo + backend + frontend) for one-command local setup.
- Add automated tests (Jest/Supertest on the backend, React Testing Library on the frontend) — scoped out of this pass to prioritize full functional coverage first.
- Move file storage to S3/Cloud Storage instead of local disk, for horizontal scalability.
- Add role-based access if this ever needs shared/team knowledge bases instead of one-per-user.
