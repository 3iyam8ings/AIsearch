import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Features: React.FC = () => {
  return (
    <div className="features-page fade-transition">
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

      <main className="features-main">
        <div className="features-hero">
          <h1 className="features-title">
            Intelligence, <span className="text-gradient">Redefined.</span>
          </h1>
          <p className="features-subtitle">
            Spark AI combines the speed of local models with the infinite knowledge of the web.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🌐</span>
            </div>
            <h2>Real-Time Web Search</h2>
            <p>
              Never rely on outdated training data again. We use advanced web scraping (via Tavily) to pull in live, up-to-the-second information from across the internet.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🔒</span>
            </div>
            <h2>Deep Privacy</h2>
            <p>
              Intelligence that respects your data. By leveraging local LLM infrastructure, your conversations remain entirely private and are never used to train future models.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📑</span>
            </div>
            <h2>Transparent Citations</h2>
            <p>
              Trust, but verify. Spark AI doesn't just give answers—it shows its work. Every factual claim is backed by inline citations and clickable links to original sources.
            </p>
          </div>

          {/* Card 4 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🧠</span>
            </div>
            <h2>Conversational Memory</h2>
            <p>
              Conversations that flow naturally. Our backend remembers the context of the chat, allowing you to ask follow-up questions seamlessly.
            </p>
          </div>

          {/* Card 5 */}
          <div className="feature-card feature-card-wide">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">✨</span>
            </div>
            <h2>Beautiful, Distraction-Free UI</h2>
            <p>
              Built for focus. The sleek, modern dark-mode aesthetic is designed to keep you centered on the answers without cluttered menus or distractions.
            </p>
          </div>
        </div>
        
        <div className="features-cta">
          <Link to="/signup" className="send-btn cta-btn">Experience Spark AI Today</Link>
        </div>
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

export default Features;
