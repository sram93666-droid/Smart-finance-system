import React, { useState } from 'react';
import './ManualFinance.css';

const Analysis = ({ expenses, userDetails, timeLimit, onPrevious }) => {
  const [savingMode, setSavingMode] = useState('medium');
  
  const calculateCategoryTotals = () => {
    const totals = {};
    expenses.forEach(expense => {
      if (expense.category && expense.amount) {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
      }
    });
    return totals;
  };
  
  const categoryTotals = calculateCategoryTotals();
  const totalExpense = expenses.reduce((total, e) => total + (e.amount || 0), 0);
  
  const highestCategory = Object.entries(categoryTotals).reduce(
    (max, [cat, amount]) => amount > max.amount ? { category: cat, amount } : max,
    { category: 'None', amount: 0 }
  );
  
  const monthlySalary = parseFloat(userDetails.salary) || 0;
  const monthlyEMI = parseFloat(userDetails.emiStatus) || 0;
  const availableIncome = monthlySalary - monthlyEMI;
  
  const getBudgetPlan = () => {
    const safeTotalExpense = totalExpense || 1;
    const plans = {
      low: {
        food: safeTotalExpense * 0.25,
        travel: safeTotalExpense * 0.15,
        shopping: safeTotalExpense * 0.1,
        bills: safeTotalExpense * 0.4,
        others: safeTotalExpense * 0.1
      },
      medium: {
        food: safeTotalExpense * 0.3,
        travel: safeTotalExpense * 0.2,
        shopping: safeTotalExpense * 0.15,
        bills: safeTotalExpense * 0.25,
        others: safeTotalExpense * 0.1
      },
      high: {
        food: safeTotalExpense * 0.35,
        travel: safeTotalExpense * 0.25,
        shopping: safeTotalExpense * 0.2,
        bills: safeTotalExpense * 0.15,
        others: safeTotalExpense * 0.05
      }
    };
    return plans[savingMode];
  };
  
  const getExpectedSavings = () => {
    const budgetPlan = getBudgetPlan();
    const plannedExpenses = Object.values(budgetPlan).reduce((a, b) => a + b, 0);
    return availableIncome - plannedExpenses;
  };
  
  const getSavingTips = () => {
    const tips = {
      low: [
        "Start tracking every expense to identify spending patterns",
        "Set a monthly savings goal and automate transfers",
        "Use cash instead of cards to control spending"
      ],
      medium: [
        "Reduce dining out by cooking at home more often",
        "Cancel unused subscriptions and memberships",
        "Shop with a list to avoid impulse purchases"
      ],
      high: [
        "Invest in mutual funds for long-term growth",
        "Consider refinancing high-interest debt",
        "Start a side hustle to increase income"
      ]
    };
    return tips[savingMode];
  };
  
  return (
    <div className="analysis">
      <h2>📊 Financial Analysis Dashboard</h2>
      
      <div className="analysis-cards">
        <div className="card">
          <h3>💰 Total {timeLimit === 'monthly' ? 'Monthly' : 'Yearly'} Expense</h3>
          <div className="amount">₹{(timeLimit === 'monthly' ? totalExpense : totalExpense * 12).toFixed(2)}</div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
            Based on {expenses.length} transactions
          </div>
        </div>
        
        <div className="card">
          <h3>📈 Category Breakdown</h3>
          {Object.keys(categoryTotals).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>No expenses recorded yet.</p>
          ) : (
            <div className="category-list">
              {Object.entries(categoryTotals).map(([cat, amount]) => (
                <div key={cat} className="category-item">
                  <span>🍽️ {cat}</span>
                  <span>₹{amount.toFixed(2)}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(amount / totalExpense) * 100}%` }}
                    ></div>
                  </div>
                  <span>{((amount / totalExpense) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="card">
          <h3>🎯 Highest Spending Category</h3>
          <div className="highest-category">
            <div className="category-name">{highestCategory.category}</div>
            <div className="category-amount">₹{highestCategory.amount.toFixed(2)}</div>
            {highestCategory.category !== 'None' && (
              <div className="insight">
                💡 You are spending {((highestCategory.amount / totalExpense) * 100).toFixed(1)}% 
                of your budget on {highestCategory.category}
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3>⚙️ Saving Mode Selection</h3>
          <div className="saving-modes">
            <button 
              className={savingMode === 'low' ? 'active' : ''}
              onClick={() => setSavingMode('low')}
            >
              🐢 Low
            </button>
            <button 
              className={savingMode === 'medium' ? 'active' : ''}
              onClick={() => setSavingMode('medium')}
            >
              ⚡ Medium
            </button>
            <button 
              className={savingMode === 'high' ? 'active' : ''}
              onClick={() => setSavingMode('high')}
            >
              🚀 High
            </button>
          </div>
        </div>
        
        <div className="card">
          <h3>📋 Budget Plan ({savingMode.toUpperCase()} Mode)</h3>
          <div className="budget-plan">
            {Object.entries(getBudgetPlan()).map(([cat, amount]) => (
              <div key={cat} className="budget-item">
                <span>• {cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <span>₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h3>💎 Expected Savings</h3>
          <div className={`amount ${getExpectedSavings() >= 0 ? 'positive' : 'negative'}`}>
            ₹{getExpectedSavings().toFixed(2)}
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
            Per {timeLimit === 'monthly' ? 'month' : 'year'}
          </div>
          {getExpectedSavings() < 0 && (
            <div className="insight" style={{ marginTop: '15px', background: '#ff6b6b', color: 'white' }}>
              ⚠️ You're spending more than you earn! Consider reducing expenses.
            </div>
          )}
        </div>
        
        <div className="card tips-card">
          <h3>💡 Smart Saving Tips for {savingMode.toUpperCase()} Mode</h3>
          <ul>
            {getSavingTips().map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="navigation-buttons">
        <button onClick={onPrevious} className="prev-btn">← Previous Step</button>
      </div>
    </div>
  );
};

export default Analysis;