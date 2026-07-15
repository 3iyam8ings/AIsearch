import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Blog: React.FC = () => {
  return (
    <div className="blog-page fade-transition">
      <nav className="login-nav">
        <Link to="/" style={{ textDecoration: 'none' }} className="login-nav-left">
          <img src={logo} alt="Logo" className="login-nav-logo" />
          Spark AI
        </Link>
        <div className="login-nav-right">
          <Link to="/login" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)' }}>Login</Link>
          <Link to="/signup" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)' }}>Sign Up</Link>
        </div>
      </nav>

      <main className="blog-content">
        <header className="blog-header">
          <h1>Building a Personal Perplexity: Real-time AI Search with Local LLMs</h1>
          <p className="blog-subtitle">A deep dive into the architecture of a sophisticated AI search assistant.</p>
        </header>

        <section className="blog-section">
          <h2>1. Hook & Introduction</h2>
          <p>
            Imagine being able to ask a question, get a streamed, sourced AI answer, complete with full conversation history — essentially your own personal version of Perplexity. That's exactly what I built with Spark AI.
          </p>
          <p>
            I built this as a portfolio piece to scratch a personal itch: wanting a powerful search assistant that I could fully control, learn from, and customize, without being entirely locked into a single ecosystem.
          </p>
        </section>

        <section className="blog-section">
          <h2>2. The Big Picture — How It All Fits Together</h2>
          <figure className="blog-figure">
            <img src="/architecture-diagram.png" alt="System Architecture Diagram" className="blog-image" />
            <figcaption>Frontend → Backend → (Supabase / Tavily / Ollama / Postgres)</figcaption>
          </figure>

          <div className="blog-architecture-steps">
            <p><strong>Authentication:</strong> You log in, and Supabase seamlessly handles the Google/GitHub OAuth flow, issuing a secure JWT.</p>
            <p><strong>The Query:</strong> You ask a question. This goes securely to the backend, authenticated with your token.</p>
            <p><strong>Web Search:</strong> The backend instantly reaches out to the live web using the Tavily API to fetch the most relevant, up-to-date sources.</p>
            <p><strong>LLM Synthesis:</strong> The backend hands those search results, combined with your question and chat history, to an LLM running via Ollama.</p>
            <p><strong>Real-time Streaming:</strong> The answer streams back to your screen, word by word, for a fast and engaging experience.</p>
            <p><strong>Persistence:</strong> Everything gets saved safely to the Postgres database so you can pick up the conversation exactly where you left off later.</p>
          </div>
        </section>

        <section className="blog-section">
          <h2>3. The Stack, and Why</h2>
          <ul className="blog-stack-list">
            <li><strong>Frontend:</strong> Vite / React / TypeScript — Lightning-fast builds and rock-solid type safety.</li>
            <li><strong>Backend:</strong> Bun / Express — Bun was chosen instead of Node for its incredible speed and built-in tooling.</li>
            <li><strong>Database:</strong> Prisma / Postgres — A reliable relational store with a type-safe ORM that makes schema changes a breeze.</li>
            <li><strong>Auth:</strong> Supabase — Production-ready authentication without the headache of managing it from scratch.</li>
            <li><strong>Search:</strong> Tavily — An API purpose-built for AI search agents, returning perfectly clean markdown.</li>
            <li><strong>LLM:</strong> Ollama — Running open-source models locally means I'm not locked into OpenAI's pricing or ecosystem.</li>
          </ul>
        </section>

        <section className="blog-section">
          <h2>4. Walking Through a Real Request</h2>
          <p>
            Let's trace a concrete query end-to-end. Suppose you ask: <em>"What are the latest developments in quantum computing?"</em>
          </p>
          <p>
            First, the frontend sends this to the Express backend with your Bearer token. The backend validates it against Supabase. Next, the backend fires off a query to Tavily, fetching recent news articles.
            <br /><br />
            We then construct a prompt: <em>"Using these sources: [Tavily Data], answer this question: [User Query]."</em> This massive string is sent to Ollama. As Ollama generates tokens, Bun pipes the stream directly back to the React frontend using Server-Sent Events (SSE).
            <br /><br />
            Finally, once the stream finishes, the complete interaction is persisted to Postgres via Prisma. It's abstract architecture turned into tangible magic.
          </p>
        </section>

        <section className="blog-section">
          <h2>5. The Interesting/Hard Parts</h2>
          <ul className="blog-hard-parts">
            <li><strong>Streaming Responses:</strong> Getting SSE (Server-Sent Events) to work smoothly between Bun and React required careful buffer management and state updates to ensure the UI felt completely responsive and stutter-free.</li>
            <li><strong>Context Management:</strong> Making follow-up questions actually use conversation history as context meant dynamically sliding the context window so the LLM didn't lose the thread, without exceeding token limits.</li>
            <li><strong>Auto-provisioning Users:</strong> Handling the edge case of user creation on their very first login via OAuth required careful webhook and database triggers in Supabase to sync with the local Prisma DB.</li>
          </ul>
        </section>

        <section className="blog-section">
          <h2>6. Future Improvements</h2>
          <ul className="blog-hard-parts">
            <li><strong>API:</strong> Exposing endpoints for developers to integrate Spark AI.</li>
            <li><strong>Image Upload:</strong> Allowing users to upload images for multimodal understanding and visual Q&A.</li>
            <li><strong>Document & PDF Links:</strong> Upload or link PDFs and documents to chat directly with their contents.</li>
            <li><strong>Voice Chat:</strong> Adding real-time voice interactions for a more natural conversational experience.</li>
            <li><strong>More Emotional Engagement:</strong> Making the AI talk more like a human, with deeper empathy and emotional intelligence.</li>
          </ul>
        </section>

        <section className="blog-section">
          <h2>7. Wrap-up</h2>
          <p>
            Building this end-to-end has been an incredible journey through the modern AI stack. From managing streaming connections to orchestrating live web search, it's a completely different paradigm than traditional CRUD apps.
          </p>
          <p>
            Check out the <a href="https://ai-search-brown.vercel.app/" target="_blank" rel="noopener noreferrer">Live Demo</a> or <a href="https://github.com/3iyam8ings" target="_blank" rel="noopener noreferrer">Repo</a>. I'd love to hear your feedback or answer any questions about the architecture!
          </p>
        </section>
      </main>

      <footer className="login-footer">
        <div className="login-footer-left">
          Spark AI
        </div>
        <div className="login-footer-center">
          <Link to="/login">Home</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <div className="login-footer-right">
          © 2026 Spark AI Inc. Built for intelligence.
        </div>
      </footer>
    </div>
  );
};

export default Blog;
