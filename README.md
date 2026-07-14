<div align="center">
  <img src="./frontend/src/assets/logo.png" alt="Spark AI Logo" width="120" />
  <h1>Spark AI</h1>
  <p><strong>Intelligence, Redefined.</strong></p>
  <p>An authenticated, streaming AI research assistant that combines real-time web search with local LLMs, wrapped in a beautiful, distraction-free UI.</p>
</div>

---

## 🌟 Features

*   **Real-Time Web Search:** Never rely on outdated training data. Spark AI utilizes [Tavily](https://tavily.com/) to pull in live, up-to-the-second information from across the internet.
*   **Deep Privacy:** Built to leverage local LLM infrastructure (like [Ollama](https://ollama.ai/)). Your conversations remain entirely private and are never used to train future models.
*   **Transparent Citations:** Trust, but verify. Every factual claim is backed by inline citations and clickable links to original sources.
*   **Seamless Conversational Memory:** The backend (powered by PostgreSQL & Prisma) remembers the context of the chat, allowing for natural follow-up questions.
*   **Beautiful, Distraction-Free UI:** A sleek, modern dark-mode aesthetic with glassmorphism, fluid animations, and a responsive layout designed for focus.
*   **Secure Authentication:** Frictionless Google and GitHub OAuth powered by [Supabase](https://supabase.com/).

---

## 🛠️ Tech Stack

**Frontend:**
*   [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/) (Build Tool)
*   [React Router](https://reactrouter.com/) (Navigation)
*   Vanilla CSS (Custom Glassmorphism & Animations)

**Backend:**
*   [Bun](https://bun.sh/) (Runtime)
*   [Express](https://expressjs.com/) (Server)
*   [Prisma](https://www.prisma.io/) (ORM)
*   [PostgreSQL](https://www.postgresql.org/) (Database)
*   [Supabase](https://supabase.com/) (Auth / JWT Validation)
*   [Tavily Search API](https://tavily.com/)

---

## 🚀 Local Development Setup

### 1. Prerequisites
*   [Bun](https://bun.sh/) installed locally
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local Postgres)
*   A [Supabase](https://supabase.com/) project (with Google/GitHub OAuth enabled)
*   A [Tavily](https://tavily.com/) API Key

### 2. Environment Variables
Create two `.env` files in your project:

**`frontend/.env`**
```env
VITE_API_URL="http://localhost:3000"
VITE_SUPABASE_URL="https://<YOUR_SUPABASE_ID>.supabase.co"
VITE_SUPABASE_ANON_KEY="<YOUR_SUPABASE_ANON_KEY>"
```

**`backend/.env`**
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aisearch?schema=public"
SUPABASE_URL="https://<YOUR_SUPABASE_ID>.supabase.co"
SUPABASE_ANON_KEY="<YOUR_SUPABASE_ANON_KEY>"
TAVILY_API_KEY="<YOUR_TAVILY_API_KEY>"
```

### 3. Start the Database
Spin up the local PostgreSQL container from the root directory:
```bash
docker-compose up -d
```

### 4. Setup the Backend
Open a terminal in the `backend/` directory:
```bash
# Install dependencies
bun install

# Run database migrations
bunx prisma migrate dev

# Generate the Prisma client
bunx prisma generate

# Start the development server
bun run --watch index.ts
```

### 5. Setup the Frontend
Open a terminal in the `frontend/` directory:
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Navigate to `http://localhost:5173` to view Spark AI!

---

## ☁️ Live Demo

🚀 **[View the Live Application Here](https://your-vercel-app-link.vercel.app)** 

*(Note: The live version requires the backend and database to be properly configured and running.)*

---

<div align="center">
  <p>© 2026 Spark AI Inc. Built for intelligence.</p>
</div>
