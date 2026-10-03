import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, KeyRound, Mail } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim().toLowerCase(), password);
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (!err.response) {
        setError('Unable to connect to backend server. Please verify the server is running on http://localhost:5000.');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header text-center">
          <div className="auth-icon">
            <LogIn size={28} />
          </div>
          <h2>Welcome Back</h2>
          <p>Login to access AlumniConnect portal</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@alumniconnect.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-icon-wrapper">
              <KeyRound className="input-icon" size={18} />
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

        {/* <div className="demo-credentials-box">
          <p className="demo-title">🔑 Quick Development Credentials:</p>
          <div style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
            <p><strong>Admin:</strong> admin@alumniconnect.com | <strong>Pass:</strong> Admin@123</p>
            <p><strong>Alumnus:</strong> sarah.j@example.com | <strong>Pass:</strong> password123</p>
          </div>
        </div> */}

        <div className="auth-footer text-center">
          <p>
            Don't have an alumnus account? <Link to="/register" className="text-accent-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
