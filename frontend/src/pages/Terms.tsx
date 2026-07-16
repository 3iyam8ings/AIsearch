import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Terms: React.FC = () => {
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
          <h1>Terms of Service</h1>
          <p className="blog-subtitle">The rules of the road for using our intelligent assistant.</p>
        </header>

        <section className="blog-section">
          <h2>1. AI Generation Disclaimer</h2>
          <p>
            Spark AI utilizes Large Language Models and real-time web search capabilities to generate responses. Please be aware of the following critical limitations:
          </p>
          <ul className="blog-hard-parts">
            <li><strong>Accuracy:</strong> The AI may occasionally produce inaccurate, incomplete, or misleading information ("hallucinations"). You should independently verify any critical factual claims.</li>
            <li><strong>No Professional Advice:</strong> Information provided by Spark AI does not constitute professional medical, legal, financial, or psychological advice. Spark AI is not liable for any decisions you make based on generated outputs.</li>
          </ul>
        </section>

        <section className="blog-section">
          <h2>2. Acceptable Use</h2>
          <p>
            By using Spark AI, you agree to interact with the service responsibly. You may not:
          </p>
          <ul className="blog-stack-list">
            <li>Attempt to bypass rate limits, scrape data, or deliberately overload our backend infrastructure.</li>
            <li>Use the service to generate illegal, hateful, harassing, or malicious content.</li>
            <li>Attempt to reverse-engineer or compromise the security of our application or database.</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms without prior notice.
          </p>
        </section>

        <section className="blog-section">
          <h2>3. Intellectual Property</h2>
          <p>
            <strong>Your Content:</strong> You retain ownership of the prompts and questions you submit to Spark AI.
          </p>
          <p>
            <strong>Our Application:</strong> Spark AI retains all ownership rights to the application's interface, backend architecture, branding, and codebase.
          </p>
        </section>

        <section className="blog-section">
          <h2>4. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the security of your authentication accounts (Google or GitHub). Any actions taken through your Spark AI account are considered your responsibility. If you believe your account has been compromised, please contact us immediately.
          </p>
        </section>

        <section className="blog-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            Spark AI is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the continuous availability of the service. We shall not be held liable for any direct or indirect damages, data loss, or service interruptions resulting from the use of Spark AI.
          </p>
        </section>

        <section className="blog-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions regarding these terms, please contact us at <a href="mailto:tiyaaaxi@gmail.com">tiyaaaxi@gmail.com</a>.
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
        </div>
        <div className="login-footer-right">
          © 2026 Spark AI Inc. Built for intelligence.
        </div>
      </footer>
    </div>
  );
};

export default Terms;
