import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import LoadingAnimation from '../Common/LoadingAnimation';
import './AutoFinance.css';

const AutoFinanceChatbot = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    mode: '',
    name: '',
    age: '',
    job: '',
    salary: '',
    emi: '',
    monthlyExpenses: {
      vegetables: 0,
      clothes: 0,
      gadgets: 0,
      household: 0,
      others: 0
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);

  const questions = [
    { key: 'mode', question: 'Welcome! First, select your savings mode:', type: 'mode' },
    { key: 'name', question: 'What is your name?', type: 'text' },
    { key: 'age', question: 'How old are you?', type: 'number' },
    { key: 'job', question: 'What is your occupation?', type: 'text' },
    { key: 'salary', question: 'What is your monthly salary (₹)?', type: 'number' },
    { key: 'emi', question: 'Do you have any EMIs? If yes, what is the monthly amount?', type: 'number' },
    { key: 'vegetables', question: 'Monthly expense on Vegetables (₹)?', type: 'expense' },
    { key: 'clothes', question: 'Monthly expense on Clothes (₹)?', type: 'expense' },
    { key: 'gadgets', question: 'Monthly expense on Gadgets (₹)?', type: 'expense' },
    { key: 'household', question: 'Monthly expense on Household items (₹)?', type: 'expense' },
    { key: 'others', question: 'Other monthly expenses (₹)?', type: 'expense' }
  ];

  const addMessage = (text, type) => {
    setMessages(prev => [...prev, { text, type, timestamp: new Date() }]);
  };

  const processAI = async () => {
    setIsProcessing(true);
    addMessage("🤖 Analyzing your financial data...", 'bot');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const totalExpense = Object.values(formData.monthlyExpenses).reduce((a, b) => a + b, 0);
    const salary = parseFloat(formData.salary);
    const emi = parseFloat(formData.emi) || 0;
    const totalOutflow = totalExpense + emi;
    const savings = salary - totalOutflow;
    
    const savingsTargets = {
      Low: salary * 0.1,
      Medium: salary * 0.2,
      High: salary * 0.3
    };
    
    const targetSavings = savingsTargets[formData.mode];
    let suggestion = '';
    
    if (savings >= targetSavings) {
      suggestion = `Excellent! You're already saving ₹${savings.toFixed(2)} which meets your ${formData.mode} savings target.`;
    } else {
      const deficit = targetSavings - savings;
      suggestion = `To reach your ${formData.mode} savings goal, you need to save an additional ₹${deficit.toFixed(2)} per month.`;
      
      // Find the highest expense category
      const highestCategory = Object.entries(formData.monthlyExpenses)
        .reduce((a, b) => a[1] > b[1] ? a : b);
      
      suggestion += ` Consider reducing your ${highestCategory[0]} expenses by 20%.`;
    }
    
    addMessage("✅ Analysis complete!", 'bot');
    addMessage(`📊 Total Estimated Monthly Expense: ₹${totalExpense.toFixed(2)}`, 'bot');
    addMessage(`💰 Current Savings: ₹${savings.toFixed(2)}`, 'bot');
    addMessage(`💡 ${suggestion}`, 'bot');
    
    // Save to Firestore
    try {
      await addDoc(collection(db, 'analysis'), {
        userId: currentUser.uid,
        type: 'auto',
        mode: formData.mode,
        totalExpense,
        savings,
        suggestion,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
    
    setIsProcessing(false);
    
    setTimeout(() => {
      onComplete({
        totalExpense,
        savings,
        suggestion,
        mode: formData.mode
      });
    }, 1000);
  };

  const handleModeSelect = (mode) => {
    setFormData({ ...formData, mode });
    addMessage(`You selected: ${mode} Savings Mode`, 'user');
    addMessage(questions[1].question, 'bot');
    setStep(2);
  };

  const handleInput = (value) => {
    const currentQuestion = questions[step];
    
    if (currentQuestion.type === 'expense') {
      const updatedExpenses = {
        ...formData.monthlyExpenses,
        [currentQuestion.key]: parseFloat(value) || 0
      };
      setFormData({ ...formData, monthlyExpenses: updatedExpenses });
    } else {
      setFormData({ ...formData, [currentQuestion.key]: value });
    }
    
    addMessage(value.toString(), 'user');
    
    if (step < questions.length - 1) {
      setTimeout(() => {
        const nextQuestion = questions[step + 1];
        addMessage(nextQuestion.question, 'bot');
      }, 500);
    }
    
    if (step === questions.length - 1) {
      setTimeout(() => {
        processAI();
      }, 1000);
    }
    
    setStep(step + 1);
  };

  return (
    <div className="auto-chatbot-container">
      <div className="chatbot-header">
        <div className="ai-animation">🤖</div>
        <h3>AI Finance Assistant</h3>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="message bot">
            <div className="message-icon">🤖</div>
            <div className="message-content">
              <div className="message-text">{questions[0].question}</div>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-icon">
              {msg.type === 'bot' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="message bot">
            <div className="message-icon">🤖</div>
            <div className="message-content">
              <LoadingAnimation />
            </div>
          </div>
        )}
      </div>
      
      {step === 0 && !isProcessing && (
        <div className="mode-buttons">
          <button onClick={() => handleModeSelect('Low')} className="mode-btn low">
            Low Savings
          </button>
          <button onClick={() => handleModeSelect('Medium')} className="mode-btn medium">
            Medium Savings
          </button>
          <button onClick={() => handleModeSelect('High')} className="mode-btn high">
            High Savings
          </button>
        </div>
      )}
      
      {step > 0 && step <= questions.length && !isProcessing && (
        <div className="chat-input">
          <input
            type={questions[step].type === 'number' ? 'number' : 'text'}
            placeholder="Type your answer here..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleInput(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AutoFinanceChatbot;