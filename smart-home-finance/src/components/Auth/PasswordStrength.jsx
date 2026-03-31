import React from 'react';
import './PasswordStrength.css';

const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@#$%^&+=]/.test(password)) strength++;
    
    return strength;
  };

  const getStrengthText = () => {
    const strength = getStrength();
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    const strength = getStrength();
    if (strength <= 2) return '#ff4444';
    if (strength <= 4) return '#ffaa44';
    return '#44ff44';
  };

  const requirements = [
    { text: 'Minimum 8 characters', met: password.length >= 8 },
    { text: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'At least 1 lowercase letter', met: /[a-z]/.test(password) },
    { text: 'At least 1 number', met: /[0-9]/.test(password) },
    { text: 'At least 1 special character (@#$%^&+=)', met: /[@#$%^&+=]/.test(password) },
    { text: 'No spaces allowed', met: !/\s/.test(password) }
  ];

  return (
    <div className="password-strength">
      <div className="strength-meter">
        <div 
          className="strength-bar"
          style={{ 
            width: `${(getStrength() / 5) * 100}%`,
            backgroundColor: getStrengthColor()
          }}
        />
      </div>
      <div className="strength-text" style={{ color: getStrengthColor() }}>
        Password Strength: {getStrengthText()}
      </div>
      <div className="requirements">
        {requirements.map((req, index) => (
          <div key={index} className={`requirement ${req.met ? 'met' : ''}`}>
            {req.met ? '✓' : '○'} {req.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;