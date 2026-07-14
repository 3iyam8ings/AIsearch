import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const ApiDocs: React.FC = () => {
  return (
    <div className="login-page fade-transition" style={{ justifyContent: 'space-between' }}>
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'var(--sidebar-bg)', padding: '60px 40px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--accent-primary)', marginBottom: '20px' }}>Developer API</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.6' }}>
            We are currently putting the finishing touches on our public API endpoints. Soon, you will be able to programmatically query Spark AI, stream responses, and integrate our search capabilities directly into your own applications.
          </p>
          <div style={{ display: 'inline-block', padding: '10px 24px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', fontWeight: 600 }}>
            Coming Soon
          </div>
        </div>
      </div>

      <footer className="login-footer">
        <div className="login-footer-left">
          Spark AI
        </div>
        <div className="login-footer-right" style={{ display: 'flex', gap: '20px' }}>
          <Link to="/blog">Blog</Link>
          <a href="mailto:tiyaaaxi@gmail.com">Help</a>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default ApiDocs;
