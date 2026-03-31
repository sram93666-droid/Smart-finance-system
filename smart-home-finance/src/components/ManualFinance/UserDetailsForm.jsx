import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import './ManualFinance.css';

const UserDetailsForm = ({ onComplete }) => {
  const { currentUser, userData } = useAuth();
  const [formData, setFormData] = useState({
    age: userData?.age || '',
    occupation: userData?.occupation || '',
    salary: userData?.salary || '',
    emiStatus: userData?.emiStatus || 'No',
    previousExpense: userData?.previousExpense || '',
    mode: 'Medium' // Low, Medium, High
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        age: formData.age,
        occupation: formData.occupation,
        salary: parseFloat(formData.salary),
        emiStatus: formData.emiStatus,
        previousExpense: parseFloat(formData.previousExpense) || 0,
        mode: formData.mode
      });
      
      onComplete(formData);
    } catch (error) {
      console.error('Error saving user details:', error);
    }
  };

  return (
    <div className="user-details-form">
      <h2>Tell us about yourself</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
            min="18"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Occupation</label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => setFormData({...formData, occupation: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Monthly Salary (₹)</label>
          <input
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({...formData, salary: e.target.value})}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>EMI Status</label>
          <select
            value={formData.emiStatus}
            onChange={(e) => setFormData({...formData, emiStatus: e.target.value})}
          >
            <option value="No">No EMI</option>
            <option value="Yes">Yes, I have EMIs</option>
          </select>
        </div>

        <div className="form-group">
          <label>Previous Month's Expense (₹)</label>
          <input
            type="number"
            value={formData.previousExpense}
            onChange={(e) => setFormData({...formData, previousExpense: e.target.value})}
            placeholder="Optional"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Select Your Savings Mode</label>
          <div className="mode-selector">
            <button
              type="button"
              className={`mode-btn ${formData.mode === 'Low' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, mode: 'Low'})}
            >
              Low Savings
            </button>
            <button
              type="button"
              className={`mode-btn ${formData.mode === 'Medium' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, mode: 'Medium'})}
            >
              Medium Savings
            </button>
            <button
              type="button"
              className={`mode-btn ${formData.mode === 'High' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, mode: 'High'})}
            >
              High Savings
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Continue to Expense Tracker
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;