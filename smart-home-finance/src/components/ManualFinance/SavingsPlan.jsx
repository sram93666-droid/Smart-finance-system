import React from 'react';

const SavingsPlan = ({ savingsPlan, userDetails, onComplete }) => {
  return (
    <div className="monthly-analysis">
      <h2>Your Personalized Savings Plan</h2>
      
      <div className="savings-plan-card">
        <div className="plan-details">
          <h3>Based on your {userDetails?.mode || 'Medium'} savings mode:</h3>
          <p>{savingsPlan}</p>
        </div>
        
        <div className="tips">
          <h3>💡 Additional Tips for Better Savings:</h3>
          <ul>
            <li>✓ Track your daily expenses to stay aware of spending patterns</li>
            <li>✓ Set up automatic transfers to a savings account</li>
            <li>✓ Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>✓ Review and adjust your budget monthly</li>
            <li>✓ Consider using cashback apps and reward programs</li>
            <li>✓ Cook at home more often to reduce food expenses</li>
            <li>✓ Cancel unused subscriptions and memberships</li>
          </ul>
        </div>
        
        <div className="motivation">
          <h3>🎯 Your Financial Goal</h3>
          <p>Based on your {userDetails?.mode} savings mode, aim to save:</p>
          <div className="target-savings">
            {userDetails?.mode === 'Low' && '10% of your monthly income'}
            {userDetails?.mode === 'Medium' && '20% of your monthly income'}
            {userDetails?.mode === 'High' && '30% of your monthly income'}
          </div>
        </div>
        
        <button className="continue-btn" onClick={onComplete}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SavingsPlan;