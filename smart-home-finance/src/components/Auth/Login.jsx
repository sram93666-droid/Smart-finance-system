import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // email or phone
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let loginEmail = email;
      if (loginMethod === 'phone') {
        // Convert phone to email format if needed
        loginEmail = `${email}@phone.local`;
      }
      
      const result = await login(loginEmail, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to login');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Smart Finance</h2>
        
        <div className="method-toggle">
          <button 
            className={loginMethod === 'email' ? 'active' : ''}
            onClick={() => setLoginMethod('email')}
          >
            Email
          </button>
          <button 
            className={loginMethod === 'phone' ? 'active' : ''}
            onClick={() => setLoginMethod('phone')}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{loginMethod === 'email' ? 'Email' : 'Phone Number'}</label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/signup">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;