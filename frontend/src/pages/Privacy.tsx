import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Privacy: React.FC = () => {
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
          <h1>Privacy Policy</h1>
          <p className="blog-subtitle">Your data, your rules. Transparent privacy for a modern AI assistant.</p>
        </header>

        <section className="blog-section">
          <h2>1. What Information We Collect</h2>
          <p>
            When you use Spark AI, we collect only what is absolutely necessary to provide you with a seamless and intelligent search experience:
          </p>
          <ul className="blog-stack-list">
            <li><strong>Account Data:</strong> We collect basic profile information (like your Name and Email address) securely provided by your authentication provider (Google or GitHub) via Supabase.</li>
            <li><strong>Conversation Data:</strong> We collect the text of the questions you ask (prompts) and the AI's responses. These are securely saved in our database so you can seamlessly access your chat history across sessions.</li>
          </ul>
        </section>

        <section className="blog-section">
          <h2>2. How We Use That Information</h2>
          <p>
            Your data is used strictly to provide and improve the core Spark AI service. We use your conversation history to provide conversational context to the AI, allowing you to ask follow-up questions naturally. We do not sell your personal data to advertisers or third-party data brokers.
          </p>
        </section>

        <section className="blog-section">
          <h2>3. Third-Party Services & The AI Model</h2>
          <p>
            Unlike many modern AI applications, Spark AI is designed with a massive privacy advantage regarding how your prompts are processed:
          </p>
          <ul className="blog-hard-parts">
            <li><strong>Web Search (Tavily):</strong> To provide up-to-date answers, your search queries may be securely transmitted to the Tavily API to fetch real-time web results.</li>
            <li><strong>The AI Model (Ollama):</strong> <em>This is our superpower.</em> Because Spark AI utilizes a Large Language Model running locally via Ollama, <strong>your prompts and conversation data are NOT sent to corporate servers like OpenAI, Google, or Anthropic for processing.</strong> Your thoughts remain private.</li>
            <li><strong>Database Hosting (Supabase):</strong> Your account details and encrypted chat histories are securely hosted using Supabase's enterprise-grade infrastructure.</li>
          </ul>
        </section>

        <section className="blog-section">
          <h2>4. Data Retention & Deletion</h2>
          <p>
            We retain your chat history so you can pick up exactly where you left off. However, you are in full control. You maintain the right to request the deletion of your account and the permanent wiping of your conversation history from our database at any time by contacting our support team.
          </p>
        </section>

        <section className="blog-section">
          <h2>5. Cookies and Tracking</h2>
          <p>
            We keep it simple. We use standard, secure session tokens (JWTs) strictly to keep you logged in safely across page loads. We do not use third-party tracking cookies to follow you across the web or serve you targeted advertisements.
          </p>
        </section>

        <section className="blog-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please feel free to reach out to us at <a href="mailto:tiyaaaxi@gmail.com">tiyaaaxi@gmail.com</a>.
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

export default Privacy;
