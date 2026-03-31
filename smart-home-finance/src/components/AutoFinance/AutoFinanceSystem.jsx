import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import SmartProcessor from './SmartProcessor';
import Chatbot from './Chatbot';
import './AutoFinanceSystem.css';

const AutoFinanceSystem = () => {
  const { userData } = useAuth();
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(1);
  const [userDetails, setUserDetails] = useState({
    name: userData?.name || '',
    age: userData?.age || '',
    job: userData?.occupation || '',
    salary: userData?.salary || '',
    emi: userData?.emiStatus || '',
    previousExpenses: {
      vegetables: '',
      clothes: '',
      gadgets: '',
      household: '',
      others: ''
    }
  });
  const [analysis, setAnalysis] = useState(null);

  const generateRecommendations = useCallback((mode, details) => {
    const recommendations = {
      low: {
        title: "🛡️ Conservative Savings Plan",
        suggestions: [
          "Build an emergency fund of ₹10,000",
          "Start a recurring deposit with your bank",
          "Reduce eating out by 50%",
          "Use public transport twice a week"
        ],
        expectedMonthlySavings: 3000
      },
      medium: {
        title: "⚖️ Balanced Growth Plan",
        suggestions: [
          "Invest in mutual funds (SIP of ₹2000/month)",
          "Create a 50/30/20 budget (Needs/Wants/Savings)",
          "Automate savings transfer on salary day",
          "Review and cancel unused subscriptions"
        ],
        expectedMonthlySavings: 5000
      },
      high: {
        title: "🚀 Aggressive Wealth Plan",
        suggestions: [
          "Invest 30% of salary in diversified portfolio",
          "Start a side hustle for extra income",
          "Learn about stock market investing",
          "Set up automated investment in index funds"
        ],
        expectedMonthlySavings: 8000
      }
    };
    return recommendations[mode];
  }, []);

  const generateAIInsights = useCallback((details, mode) => {
    const insights = [];
    const salary = parseFloat(details.salary) || 0;
    const emi = parseFloat(details.emi) || 0;
    
    if (salary < 30000) {
      insights.push("📊 Your income is below average. Focus on essential expenses first.");
    }
    
    if (emi > salary * 0.3) {
      insights.push("⚠️ Your EMI is high. Consider debt consolidation or refinancing.");
    }
    
    const vegetableExpense = parseFloat(details.previousExpenses.vegetables) || 0;
    if (vegetableExpense > 5000) {
      insights.push("🥬 Your grocery expenses are high. Try buying from local markets.");
    }
    
    const recommendations = generateRecommendations(mode, details);
    insights.push(`🎯 Based on ${mode.toUpperCase()} mode, we recommend saving ₹${recommendations.expectedMonthlySavings}/month`);
    
    return insights;
  }, [generateRecommendations]);

  const performAnalysis = useCallback(() => {
    const totalPreviousExpense = Object.values(userDetails.previousExpenses).reduce(
      (sum, val) => sum + (parseFloat(val) || 0), 0
    );
    
    const monthlySalary = parseFloat(userDetails.salary) || 0;
    const monthlyEMI = parseFloat(userDetails.emi) || 0;
    const availableIncome = monthlySalary - monthlyEMI;
    
    const predictionFactors = {
      low: 0.8,
      medium: 1.0,
      high: 1.2
    };
    
    const predictedExpense = totalPreviousExpense * (predictionFactors[mode]);
    const projectedSavings = availableIncome - predictedExpense;
    
    const recommendations = generateRecommendations(mode, userDetails);
    
    setAnalysis({
      totalPreviousExpense,
      predictedExpense,
      projectedSavings,
      recommendations,
      savingsPotential: projectedSavings > 0 ? 'Positive' : 'Negative',
      aiInsights: generateAIInsights(userDetails, mode)
    });
  }, [mode, userDetails, generateRecommendations, generateAIInsights]);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    if (step === 3 && !analysis && mode) {
      performAnalysis();
    }
  }, [step, mode, analysis, performAnalysis]); // Added all dependencies

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setStep(2);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step === 2) {
      setMode(null);
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  // Mode Selection Screen
  if (step === 1) {
    return (
      <div className="ai-mode-selection">
        <div className="ai-header">
          <button onClick={() => window.history.back()} className="back-dashboard-btn">
            ← Back to Dashboard
          </button>
          <div className="ai-title">
            <span className="ai-icon">🤖</span>
            <h1>AI Finance Assistant</h1>
          </div>
        </div>
        
        <div className="mode-selection-container">
          <div className="welcome-message">
            <div className="welcome-avatar">✨</div>
            <h2>Welcome! First, select your savings mode:</h2>
            <p>Choose a strategy that matches your financial goals</p>
          </div>
          
          <div className="mode-cards-ai">
            <div className="mode-card-ai low" onClick={() => handleModeSelect('low')}>
              <div className="mode-icon">🛡️</div>
              <h3>Low Savings Mode</h3>
              <div className="mode-description">
                Conservative approach with steady growth
              </div>
              <div className="mode-features">
                <div className="feature">✓ Low risk investments</div>
                <div className="feature">✓ Emergency fund focus</div>
                <div className="feature">✓ 10-15% savings target</div>
              </div>
              <div className="mode-badge">Recommended for beginners</div>
            </div>
            
            <div className="mode-card-ai medium" onClick={() => handleModeSelect('medium')}>
              <div className="mode-icon">⚖️</div>
              <h3>Medium Savings Mode</h3>
              <div className="mode-description">
                Balanced approach with moderate growth
              </div>
              <div className="mode-features">
                <div className="feature">✓ Mixed investment portfolio</div>
                <div className="feature">✓ 50/30/20 budget rule</div>
                <div className="feature">✓ 20-25% savings target</div>
              </div>
              <div className="mode-badge">Most popular choice</div>
            </div>
            
            <div className="mode-card-ai high" onClick={() => handleModeSelect('high')}>
              <div className="mode-icon">🚀</div>
              <h3>High Savings Mode</h3>
              <div className="mode-description">
                Aggressive approach for maximum growth
              </div>
              <div className="mode-features">
                <div className="feature">✓ High return investments</div>
                <div className="feature">✓ Aggressive savings plan</div>
                <div className="feature">✓ 30%+ savings target</div>
              </div>
              <div className="mode-badge">For experienced investors</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Progress Steps Indicator
  const getStepTitle = () => {
    switch(step) {
      case 2: return "📝 Personal Information";
      case 3: return "💰 Previous Month Expenses";
      case 4: return "🧠 AI Analysis & Insights";
      case 5: return "💬 AI Assistant Chatbot";
      default: return "";
    }
  };

  return (
    <div className="automatic-finance-modern">
      <div className="finance-header">
        <button onClick={handlePrevious} className="back-btn-modern">
          ← Back
        </button>
        <div className="mode-indicator-modern">
          <span className="mode-label">Active Mode:</span>
          <span className={`mode-value ${mode}`}>
            {mode === 'low' && '🛡️ Low Savings'}
            {mode === 'medium' && '⚖️ Medium Savings'}
            {mode === 'high' && '🚀 High Savings'}
          </span>
        </div>
      </div>
      
      <div className="progress-steps-modern">
        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <div className="step-label">Details</div>
        </div>
        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <div className="step-label">Expenses</div>
        </div>
        <div className={`step-line ${step >= 4 ? 'active' : ''}`}></div>
        <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <div className="step-label">Analysis</div>
        </div>
        <div className={`step-line ${step >= 5 ? 'active' : ''}`}></div>
        <div className={`step-item ${step >= 5 ? 'active' : ''}`}>
          <div className="step-circle">4</div>
          <div className="step-label">Chat</div>
        </div>
      </div>
      
      <div className="step-content-modern">
        <h2 className="step-title">{getStepTitle()}</h2>
        
        {step === 2 && (
          <div className="personal-info-form">
            <div className="form-grid">
              <div className="form-field">
                <label>👤 Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                />
              </div>
              
              <div className="form-field">
                <label>🎂 Age</label>
                <input
                  type="number"
                  placeholder="Your age"
                  value={userDetails.age}
                  onChange={(e) => setUserDetails({...userDetails, age: e.target.value})}
                />
              </div>
              
              <div className="form-field">
                <label>💼 Occupation</label>
                <input
                  type="text"
                  placeholder="Your job title"
                  value={userDetails.job}
                  onChange={(e) => setUserDetails({...userDetails, job: e.target.value})}
                />
              </div>
              
              <div className="form-field">
                <label>💰 Monthly Salary (₹)</label>
                <input
                  type="number"
                  placeholder="Your monthly income"
                  value={userDetails.salary}
                  onChange={(e) => setUserDetails({...userDetails, salary: e.target.value})}
                />
              </div>
              
              <div className="form-field">
                <label>🏦 Monthly EMI (₹)</label>
                <input
                  type="number"
                  placeholder="Loan payments if any"
                  value={userDetails.emi}
                  onChange={(e) => setUserDetails({...userDetails, emi: e.target.value})}
                />
              </div>
            </div>
            
            <button onClick={handleNext} className="continue-btn">
              Continue → Tell me about your expenses
            </button>
          </div>
        )}
        
        {step === 3 && (
          <div className="expenses-form">
            <div className="form-grid">
              <div className="form-field">
                <label>🥬 Vegetables & Groceries</label>
                <input
                  type="number"
                  placeholder="Amount spent last month"
                  value={userDetails.previousExpenses.vegetables}
                  onChange={(e) => setUserDetails({
                    ...userDetails, 
                    previousExpenses: {...userDetails.previousExpenses, vegetables: e.target.value}
                  })}
                />
              </div>
              
              <div className="form-field">
                <label>👕 Clothes & Accessories</label>
                <input
                  type="number"
                  placeholder="Amount spent last month"
                  value={userDetails.previousExpenses.clothes}
                  onChange={(e) => setUserDetails({
                    ...userDetails, 
                    previousExpenses: {...userDetails.previousExpenses, clothes: e.target.value}
                  })}
                />
              </div>
              
              <div className="form-field">
                <label>📱 Gadgets & Electronics</label>
                <input
                  type="number"
                  placeholder="Amount spent last month"
                  value={userDetails.previousExpenses.gadgets}
                  onChange={(e) => setUserDetails({
                    ...userDetails, 
                    previousExpenses: {...userDetails.previousExpenses, gadgets: e.target.value}
                  })}
                />
              </div>
              
              <div className="form-field">
                <label>🏠 Household Items</label>
                <input
                  type="number"
                  placeholder="Amount spent last month"
                  value={userDetails.previousExpenses.household}
                  onChange={(e) => setUserDetails({
                    ...userDetails, 
                    previousExpenses: {...userDetails.previousExpenses, household: e.target.value}
                  })}
                />
              </div>
              
              <div className="form-field">
                <label>🎯 Other Expenses</label>
                <input
                  type="number"
                  placeholder="Entertainment, dining out, etc."
                  value={userDetails.previousExpenses.others}
                  onChange={(e) => setUserDetails({
                    ...userDetails, 
                    previousExpenses: {...userDetails.previousExpenses, others: e.target.value}
                  })}
                />
              </div>
            </div>
            
            <div className="button-group">
              <button onClick={handlePrevious} className="back-btn-modern">← Back</button>
              <button onClick={handleNext} className="continue-btn">Analyze My Finances →</button>
            </div>
          </div>
        )}
        
        {step === 4 && analysis && (
          <SmartProcessor 
            analysis={analysis}
            mode={mode}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        
        {step === 5 && analysis && (
          <Chatbot 
            analysis={analysis}
            mode={mode}
            userDetails={userDetails}
          />
        )}
      </div>
    </div>
  );
};

export default AutoFinanceSystem;