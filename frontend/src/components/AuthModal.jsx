import { useState } from 'react';

function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onAuthSuccess) {
        onAuthSuccess({
          name: name || (email ? email.split('@')[0] : 'Customer'),
          email
        });
      }
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="auth-header">
          <div className="auth-logo-icon">🛍️</div>
          <h2 className="auth-title">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your orders, track deliveries, and view exclusive deals.'
              : 'Create your ShopEase account to start shopping and enjoy fast checkout.'}
          </p>

          <div className="auth-mode-toggle">
            <button
              className={`auth-toggle-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              className={`auth-toggle-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="auth-success-box">
            <span className="success-emoji">🎉</span>
            <h3>Welcome to ShopEase!</h3>
            <p>You have {mode === 'login' ? 'signed in' : 'registered'} successfully.</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="auth-fullName">Full Name</label>
                <input
                  id="auth-fullName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary-orange btn-block">
              {mode === 'login' ? 'Sign In to ShopEase' : 'Create Account'}
            </button>

            <p className="auth-footer-text">
              By continuing, you agree to ShopEase Terms & Privacy Policy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
