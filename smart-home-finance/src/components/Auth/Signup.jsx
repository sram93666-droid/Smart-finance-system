import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PasswordStrength from './PasswordStrength';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    signupMethod: 'email'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
    if (!/[@#$%^&+=]/.test(password)) errors.push('Password must contain at least one special character');
    if (/\s/.test(password)) errors.push('Password cannot contain spaces');
    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.signupMethod === 'email' && !formData.email) newErrors.email = 'Email is required';
    if (formData.signupMethod === 'phone' && !formData.phone) newErrors.phone = 'Phone number is required';
    
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) newErrors.password = passwordErrors;
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const loginIdentifier = formData.signupMethod === 'email' 
      ? formData.email 
      : `${formData.phone}@phone.local`;
    
    const userDetails = {
      name: formData.name,
      signupMethod: formData.signupMethod,
      ...(formData.signupMethod === 'email' ? { email: formData.email } : { phone: formData.phone }),
      createdAt: new Date().toISOString()
    };
    
    const result = await signup(loginIdentifier, formData.password, userDetails);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        
        <div className="method-toggle">
          <button 
            className={formData.signupMethod === 'email' ? 'active' : ''}
            onClick={() => setFormData({...formData, signupMethod: 'email'})}
          >
            Email
          </button>
          <button 
            className={formData.signupMethod === 'phone' ? 'active' : ''}
            onClick={() => setFormData({...formData, signupMethod: 'phone'})}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {formData.signupMethod === 'email' ? (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          ) : (
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
            <PasswordStrength password={formData.password} />
            {errors.password && (
              <div className="field-error">
                {errors.password.map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;