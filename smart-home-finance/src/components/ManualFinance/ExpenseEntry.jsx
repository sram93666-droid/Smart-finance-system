import React, { useState } from 'react';
import './ManualFinance.css';

const ExpenseEntry = ({ onAddExpense, onNext, onPrevious, expenses }) => {
  const [newExpense, setNewExpense] = useState({
    category: 'Food',
    amount: ''
  });

  const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newExpense.amount && parseFloat(newExpense.amount) > 0) {
      await onAddExpense({
        category: newExpense.category,
        amount: parseFloat(newExpense.amount)
      });
      setNewExpense({ ...newExpense, amount: '' });
    }
  };

  const getTotalExpense = () => {
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
  };

  return (
    <div className="expense-entry">
      <h2>Daily Expense Entry</h2>
      
      <div className="expense-summary">
        <h3>Total Expenses: ₹{getTotalExpense().toFixed(2)}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="expense-form">
        <select
          value={newExpense.category}
          onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <input
          type="number"
          placeholder="Amount (₹)"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
          required
        />
        
        <button type="submit">Add Expense</button>
      </form>
      
      <div className="expenses-list">
        <h3>Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses added yet. Start by adding your first expense!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 10).map((expense, index) => (
                <tr key={index}>
                  <td>{expense.category}</td>
                  <td>₹{(expense.amount || 0).toFixed(2)}</td>
                  <td>{expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="navigation-buttons">
        <button onClick={onPrevious} className="prev-btn">← Previous</button>
        <button onClick={onNext} className="next-btn">Next →</button>
      </div>
    </div>
  );
};

export default ExpenseEntry;