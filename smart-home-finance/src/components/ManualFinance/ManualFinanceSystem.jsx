import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import ExpenseEntry from './ExpenseEntry';
import Analysis from './Analysis';
import './ManualFinance.css';

const ManualFinanceSystem = () => {
  const { currentUser, userData } = useAuth();
  const [step, setStep] = useState(1);
  const [timeLimit, setTimeLimit] = useState('monthly');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: userData?.name || '',
    age: userData?.age || '',
    occupation: userData?.occupation || '',
    salary: userData?.salary || '',
    emiStatus: userData?.emiStatus || '',
    previousExpense: ''
  });

  const fetchExpenses = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const q = query(
        collection(db, 'expenses'),
        where('userId', '==', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const expensesData = [];
      querySnapshot.forEach((doc) => {
        expensesData.push({ id: doc.id, ...doc.data() });
      });
      
      expensesData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (expense) => {
    if (!currentUser) return;
    
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        userId: currentUser.uid,
        date: new Date().toISOString()
      });
      
      await fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="manual-finance">
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div>User Details</div>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div>Expense Entry</div>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div>Analysis</div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="step-content">
          <h2>Personal Information</h2>
          <form className="user-details-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Full Name"
              value={userDetails.name}
              onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={userDetails.age}
              onChange={(e) => setUserDetails({...userDetails, age: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Occupation"
              value={userDetails.occupation}
              onChange={(e) => setUserDetails({...userDetails, occupation: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Monthly Salary"
              value={userDetails.salary}
              onChange={(e) => setUserDetails({...userDetails, salary: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Monthly EMI"
              value={userDetails.emiStatus}
              onChange={(e) => setUserDetails({...userDetails, emiStatus: e.target.value})}
            />
            <input
              type="number"
              placeholder="Previous Month's Expense Estimate"
              value={userDetails.previousExpense}
              onChange={(e) => setUserDetails({...userDetails, previousExpense: e.target.value})}
            />
            
            <div className="time-limit-select">
              <label>Time Period:</label>
              <select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <button type="button" onClick={handleNext} className="next-btn">Next →</button>
          </form>
        </div>
      )}
      
      {step === 2 && (
        <ExpenseEntry 
          onAddExpense={handleAddExpense}
          onNext={handleNext}
          onPrevious={handlePrevious}
          expenses={expenses}
        />
      )}
      
      {step === 3 && (
        <Analysis 
          expenses={expenses}
          userDetails={userDetails}
          timeLimit={timeLimit}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
};

export default ManualFinanceSystem;