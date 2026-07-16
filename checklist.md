# AI Search Assistant — Build Checklist

Based on the aiSearch architecture: an authenticated, streaming AI research assistant that combines web search (Tavily) with an LLM (Ollama) and persists conversation history (Prisma/Postgres).

Sequenced so each sprint produces something that actually runs, before adding the next layer of complexity. Since you know some of this stack and not all of it, each sprint flags what's likely new so you know where to slow down.

---

## Sprint 0 — Foundation
- [ ] Repo structure: `backend/` and `frontend/` as separate folders
- [ ] Backend: Bun installed, minimal Express server running (`bun --hot run index.ts`)
- [ ] Frontend: Vite + React 19 project scaffolded, dev server running
- [ ] Postgres database running locally (Docker is the easiest path if you haven't set up Postgres before)
- [ ] `.env` files for both frontend and backend, gitignored

**Likely new:** Bun — it's a JS runtime like Node, but faster and with a built-in package manager. `bun install` replaces `npm install`, `bun run` replaces `node`. If you know Node, the mental model transfers almost entirely.

**Definition of done:** hitting the backend's root endpoint returns something, and the frontend loads a blank page with no errors.

---

## Sprint 1 — Database schema (Prisma)
- [y] Prisma installed and initialized (`bunx prisma init`)
- [y] Schema defined for `User`, `Conversation`, `Message` models
- [y] Migration run against local Postgres (`bunx prisma migrate dev`)
- [y] Prisma Client generated and importable in backend code
- [y] Sanity check: manually insert and query a row through Prisma Client

**Likely new:** Prisma — you write your schema in `schema.prisma` (a simple declarative format), and it generates a fully-typed database client for you. The workflow is: edit schema → run migrate → import the generated client. It removes the need to hand-write SQL for most operations.

**Definition of done:** you can create a user and a conversation row from a script and see them in the database.

---

## Sprint 2 — Authentication (Supabase)
- [y] Supabase project created, OAuth providers (Google/GitHub) enabled
- [y] Frontend: Supabase JS client configured, login/logout flow working
- [y] Backend: `authMiddleware` that validates the bearer token from Supabase
- [y] Auto-provisioning: first-time login creates a matching `User` row in Postgres via Prisma
- [y] Protected route test: an endpoint that 401s without a valid token, succeeds with one

**Likely new:** Supabase Auth — it handles the OAuth flow and issues a JWT. Your backend doesn't do the OAuth dance itself; it just validates the token Supabase already issued. The key piece to get right: the token Supabase gives the frontend must be sent as a bearer token on every backend request (this is what the Axios interceptor pattern in the reference repo is for).

**Definition of done:** you can log in with Google or GitHub, and a corresponding user row exists in your database.

---

## Sprint 3 — Search integration (Tavily)
- [ ] Tavily API key obtained
- [ ] Backend endpoint that takes a query string and returns Tavily search results
- [ ] Response shape defined (title, url, snippet at minimum) — this becomes your source provenance data later
- [ ] Basic error handling for search API failures/timeouts

**Definition of done:** hit the endpoint with a query, get back a structured list of real search results.

---

## Sprint 4 — AI response generation (Ollama)
- [ ] Ollama set up (local install or cloud endpoint, matching what you plan to deploy with)
- [ ] Backend logic that takes a query + Tavily search results and constructs a prompt for the model
- [ ] Non-streaming version working first — just get a complete answer back before adding streaming
- [ ] Structured output format defined (the reference repo uses `<TITLE>`, `<ANSWER>`, `<FOLLOW_UPS>` tags — pick your own structure or copy this one)

**Likely new:** Ollama — it runs LLMs either locally or via a cloud endpoint, giving you an OpenAI-style chat API without depending on OpenAI directly. Start with whichever mode is less friction for you (local if you have the hardware, cloud if you don't).

**Definition of done:** query in, search results get fed into the model, structured answer comes back — even if it takes the full response time with no streaming yet.

---

## Sprint 5 — Streaming
- [ ] Convert the Sprint 4 endpoint to stream tokens as they're generated (Express supports this via chunked responses)
- [ ] Frontend: consume the stream and render text incrementally as it arrives
- [ ] Loading/typing indicator while streaming is in progress

**Definition of done:** you visibly see the answer appear word-by-word in the browser, not all at once.

---

## Sprint 6 — Conversation persistence
- [ ] Save each query + answer + sources as a `Message` linked to a `Conversation`
- [ ] New conversation created on first query, reused for follow-ups
- [ ] Follow-up queries reconstruct prior message history from the DB and pass it as context to Ollama
- [ ] Ownership check: a user can only access their own conversations

**Definition of done:** ask a follow-up question and the model's answer actually reflects the earlier conversation, not just the new query in isolation.

---

## Sprint 7 — Frontend polish
- [ ] Query input + streaming answer display on the main page
- [ ] Source cards showing the search results used, with links
- [ ] Sidebar listing past conversations, clickable to reload full thread
- [ ] Follow-up suggestions shown after each answer (if you included them in Sprint 4's structured output)
- [ ] Rename/delete conversation actions, with ownership enforced on the backend

**Definition of done:** the full loop — ask, get streamed answer with sources, see it in history, ask a follow-up — works end to end without you needing to explain any of it.

---

## Sprint 8 — Deployment
- [ ] Backend deployed (Bun-compatible host, or containerized)
- [ ] Frontend deployed (Vercel/Netlify are the low-friction options for Vite)
- [ ] Environment variables configured on both, matching your `.env.example`
- [ ] Production Supabase OAuth redirect URLs updated to match your deployed domain

**Definition of done:** a stranger can open the deployed URL, log in, and use the tool without you running anything locally for them.

---

## Notes on the pieces you flagged as unfamiliar
Come back and tell me which of Bun/Prisma/Supabase/Ollama/Tavily are the ones you haven't used — I can go deeper on setup for those specifically rather than the general flow above.
