import { useState, useEffect } from 'react';

function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  currentUser,
  onLogout
}) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync mode whenever initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setError('');
    setSuccessMessage('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = mode === 'register'
        ? { name, email, password }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication request failed');
      }

      setSuccessMessage(data.message || (mode === 'register' ? 'Account created successfully!' : 'Signed in successfully!'));

      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }

      setTimeout(() => {
        setSuccessMessage('');
        setEmail('');
        setPassword('');
        setName('');
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
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

        {currentUser ? (
          /* Profile & Logout View when logged in */
          <div className="auth-profile-box" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className="auth-logo-icon" style={{ margin: '0 auto 1rem', fontSize: '2rem' }}>
              👤
            </div>
            <h2 className="auth-title">My Account</h2>
            <p className="auth-subtitle" style={{ marginBottom: '1.25rem' }}>
              You are currently signed in to your ShopEase account.
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Full Name
                </span>
                <p style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{currentUser.name}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Email Address
                </span>
                <p style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{currentUser.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-primary-orange btn-block"
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                onClick={() => {
                  if (onLogout) onLogout();
                  onClose();
                }}
              >
                Log Out
              </button>
              <button
                type="button"
                className="btn-secondary-outline btn-block"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Regular Login / Register Form */
          <>
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
                  type="button"
                  className={`auth-toggle-btn ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => handleModeChange('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-toggle-btn ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => handleModeChange('register')}
                >
                  Register
                </button>
              </div>
            </div>

            {successMessage ? (
              <div className="auth-success-box">
                <span className="success-emoji">🎉</span>
                <h3>Welcome to ShopEase!</h3>
                <p>{successMessage}</p>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                {error && (
                  <div
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                      fontWeight: 600
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

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
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-orange btn-block"
                  disabled={loading}
                >
                  {loading
                    ? (mode === 'login' ? 'Signing in...' : 'Creating Account...')
                    : (mode === 'login' ? 'Sign In to ShopEase' : 'Create Account')}
                </button>

                <p className="auth-footer-text">
                  By continuing, you agree to ShopEase Terms & Privacy Policy.
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;

