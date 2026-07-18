# AI Usage

Honesty note per the assessment instructions: this entire codebase was generated with Claude (Anthropic), used as an active pair-programmer across the full stack. This document is a straightforward account of that process, not a minimized one.

## Which AI tools were used

- **Claude** (Anthropic), via a chat-based coding session with file read/write/execute tools. Used for architecture planning, all backend and frontend code generation, and this documentation.

## How it was used

The build was driven step by step rather than as one large generation:

1. **Requirements extraction** — Claude read the assessment PDF in full and produced a checklist mapping every stated requirement (functional, API, DB, docs, bonus) before any code was written.
2. **Scaffolding** — folder structure and `package.json`/config files generated first, so every subsequent file had a stable place to live.
3. **Backend** — models → middleware → services → controllers → routes → app/server entry point, in that dependency order, so each layer could reference what already existed.
4. **Frontend** — design tokens → types → services → context/hooks → shared components → pages → routing, again dependency-first.
5. **Docs** — this set of four documents, written last, once the actual implementation (not a plan of it) was in hand.

Each step was reviewed against the checklist before moving to the next, and the checklist was updated to reflect real completed work, not planned work.

## Example prompts (paraphrased from the actual session)

- *"Read the uploaded assessment PDF completely. Create a checklist of every requirement... Before writing any code, show me the checklist."*
- *"Generate Step 1: the complete folder structure."*
- *"Generate the backend completely" — followed by the tech-stack constraints (Express, Mongoose, bcrypt, Multer, pdf-parse, Gemini).*
- *"Generate the complete frontend" — React + TypeScript + Vite + Tailwind, with the same functional requirements list.*
- Two clarifying questions were asked and answered mid-project: which AI provider to use (Gemini) and which bonus features to prioritize (pagination, delete/preview, markdown rendering).

## What was AI-generated vs. modified

Effectively all code in this repository was AI-generated in the initial pass — this was a from-scratch build, not an edit of existing code. There was no separate "AI draft → human rewrite" cycle within this session; instead, correctness was enforced *during* generation:

- Every backend file was passed through `node --check` immediately after creation to catch syntax errors before moving on (this caught nothing — all files were clean — but it was run as a gate, not skipped).
- Design decisions (response envelope shape, error-handling strategy, RAG-lite context injection instead of a vector DB, extraction-failure-as-a-state rather than a hard rejection) were made deliberately by evaluating trade-offs against the assessment's actual scale, not defaulted to.
- **If you (the developer) continue this project**, treat this as the point where you should read every file, run it locally, and start making your own modifications — the assessment's interview will expect you to explain and extend this code without AI assistance, so understanding it now matters more than the fact that it compiles.

## Where AI gave incorrect or suboptimal output, and how it was caught

1. **Shell brace expansion silently failed.** The first `mkdir -p backend/src/{config,models,...}` command was run in a non-interactive shell that doesn't expand `{a,b,c}` brace syntax, so it created one literal folder named `{config,models,...}` instead of the intended subfolders. Caught immediately by listing the directory tree right after the command (a verification step, not an assumption of success) and fixed by issuing individual `mkdir -p` commands instead.
2. **ESM/CJS mismatch in `tailwind.config.js`.** When wiring in `@tailwindcss/typography` for markdown rendering, the first attempt used Node's CommonJS `require()` inside a file that uses `export default` (ESM syntax, since the frontend `package.json` sets `"type": "module"`). This would have thrown a `ReferenceError: require is not defined` at build time. Caught by re-reading the file's own syntax before adding to it, and fixed by switching to a top-level `import`.
3. **No live build verification is possible in this sandbox.** The development sandbox used for this session has no outbound network access (confirmed via a blocked `npm install`, HTTP 403). This means `npm install`, `npm run dev`, `npm run build`, and any real TypeScript type-checking against installed dependencies could **not** be run here. This is disclosed rather than papered over: the code is syntactically checked where possible (Node's `--check` on backend JS) and manually cross-referenced (import paths, prop types, API contracts between frontend services and backend routes), but it has not been executed end-to-end. **You should run `npm install` and both dev servers locally as your first step**, and expect to fix any small integration issues that only surface at runtime (e.g. a missed import, a Tailwind class typo) — this is exactly the kind of AI limitation the assessment is designed to surface.

## How correctness was verified overall

- Backend: `node --check` on every `.js` file (syntax-level).
- Frontend: manual cross-reference of every `import`/`export`, every prop passed to a component against its declared interface, and every API call against the exact backend route signature it targets.
- Structural verification: the folder tree was printed and checked against the plan at each step rather than assumed.
- **Not yet verified**: actual runtime behavior, MongoDB connectivity, real Gemini API responses, and browser rendering — none of which are possible without network access in this environment. This is the single biggest gap between "generated" and "production-ready," and closing it locally is the necessary next step before submission.
