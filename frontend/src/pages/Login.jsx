import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../styles/CreateAccount.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/users/login', {
        username,
        password,
      });

      if (response.data && response.data.id) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/timer');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Invalid username or password';
      setError(errorMsg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Cube Timer</h1>
        <p className="auth-subtitle">Login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/create">Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;