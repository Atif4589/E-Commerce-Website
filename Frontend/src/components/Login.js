import React, { useState, useEffect, useCallback } from 'react';

function Login({ onLogin, onNavigateToRegister, apiUrl }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Normalize API URL to strip any accidental trailing slashes
  const baseUrl = apiUrl ? apiUrl.replace(/\/+$/, '') : 'http://localhost:5000/api';

  const handleGoogleLogin = useCallback(async (response) => {
    try {
      setLoading(true);
      setError('');
      const token = response.credential;

      const res = await fetch(`${baseUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // Save session locally so user stays logged in
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Google login failed. Please try again.');
      }
    } catch (err) {
      setError('Google login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, onLogin]);

  useEffect(() => {
    // Retry mechanism in case google script loads slightly after component mounts
    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogle);
        window.google.accounts.id.initialize({
          client_id: '4399188923-3vu92cu9t7004kg8svhua15q7th7udbr.apps.googleusercontent.com',
          callback: handleGoogleLogin,
        });

        const btnContainer = document.getElementById('googleSignInButton');
        if (btnContainer) {
          btnContainer.innerHTML = ''; // Prevent duplicate buttons on re-render
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'filled_black',
            size: 'large',
            width: '300',
            text: 'signin_with'
          });
        }
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, [handleGoogleLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login to LS Luxe Step</h2>

      {error && (
        <div className="error" style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center', margin: '1.5rem 0', color: '#d4af37' }}>
        OR
      </div>

      <div id="googleSignInButton" style={{ display: 'flex', justifyContent: 'center' }}></div>

      <div className="form-link" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Don't have an account?{' '}
        <span 
          onClick={onNavigateToRegister} 
          style={{ color: '#d4af37', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Register here
        </span>
      </div>
    </div>
  );
}

export default Login;