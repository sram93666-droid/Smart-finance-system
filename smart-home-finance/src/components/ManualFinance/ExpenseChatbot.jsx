import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import LoadingAnimation from '../Common/LoadingAnimation';
import './Chatbot.css';

const ExpenseChatbot = ({ userDetails, onAnalysisComplete }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dailyExpenses, setDailyExpenses] = useState([]);

  useEffect(() => {
    loadTodayExpenses();
    addWelcomeMessage();
  }, []);

  const loadTodayExpenses = async () => {
    const today = new Date().toISOString().split('T')[0];
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', currentUser.uid),
      where('date', '>=', today)
    );
    
    const snapshot = await getDocs(expensesQuery);
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setDailyExpenses(expenses);
  };

  const addWelcomeMessage = () => {
    setMessages([
      {
        type: 'bot',
        text: `👋 Hi! I'm your AI finance assistant. Let's track your daily expenses together!\n\nToday is ${new Date().toLocaleDateString()}. Have you spent anything today?\n\nYou can say something like:\n"Spent ₹200 on food"\n"₹100 on travel"\n"₹50 on groceries"`,
        timestamp: new Date()
      }
    ]);
  };

  const processExpenseInput = (text) => {
    // Extract amount and category from user input
    const amountMatch = text.match(/₹?(\d+)/);
    if (!amountMatch) return null;
    
    const amount = parseFloat(amountMatch[1]);
    
    const categories = {
      food: ['food', 'lunch', 'dinner', 'breakfast', 'meal', 'restaurant', 'cafe'],
      travel: ['travel', 'transport', 'bus', 'train', 'taxi', 'fuel', 'petrol'],
      groceries: ['grocery', 'groceries', 'vegetables', 'fruits', 'milk'],
      shopping: ['shopping', 'clothes', 'clothing', 'apparel'],
      entertainment: ['entertainment', 'movie', 'netflix', 'amazon'],
      bills: ['bill', 'electricity', 'water', 'internet', 'rent'],
      health: ['health', 'medical', 'medicine', 'doctor'],
      other: []
    };
    
    let category = 'other';
    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        category = cat;
        break;
      }
    }
    
    return { amount, category };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;
    
    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }]);
    setInputMessage('');
    setIsProcessing(true);
    
    // Process expense
    const expense = processExpenseInput(userMessage);
    
    if (expense) {
      try {
        await addDoc(collection(db, 'expenses'), {
          userId: currentUser.uid,
          category: expense.category,
          amount: expense.amount,
          date: new Date().toISOString().split('T')[0],
          description: userMessage,
          timestamp: new Date()
        });
        
        // Update daily expenses
        setDailyExpenses(prev => [...prev, expense]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: `✅ Added ₹${expense.amount} to ${expense.category}.\n\nTotal spent today: ₹${calculateTodayTotal() + expense.amount}\n\nAnything else you spent on?`,
            timestamp: new Date()
          }]);
          setIsProcessing(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error saving expense:', error);
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Sorry, I had trouble saving your expense. Please try again.',
          timestamp: new Date()
        }]);
        setIsProcessing(false);
      }
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "I couldn't understand the expense. Please mention the amount and category.\nExample: 'Spent ₹200 on food'",
          timestamp: new Date()
        }]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const calculateTodayTotal = () => {
    return dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const checkMonthCompletion = async () => {
    const firstDay = new Date();
    firstDay.setDate(1);
    const lastDay = new Date();
    
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', currentUser.uid),
      where('date', '>=', firstDay.toISOString().split('T')[0])
    );
    
    const snapshot = await getDocs(expensesQuery);
    const monthlyExpenses = snapshot.docs.map(doc => doc.data());
    
    if (monthlyExpenses.length > 0 && new Date().getDate() >= 28) {
      onAnalysisComplete(monthlyExpenses);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <FaRobot className="bot-icon" />
        <h3>Daily Expense Tracker</h3>
        <div className="today-total">
          Today's Total: ₹{calculateTodayTotal()}
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === 'bot' ? <FaRobot /> : <FaUser />}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="message bot">
            <div className="message-icon">
              <FaRobot />
            </div>
            <div className="message-content">
              <LoadingAnimation />
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Describe your expense..."
          disabled={isProcessing}
        />
        <button onClick={handleSendMessage} disabled={isProcessing}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ExpenseChatbot;