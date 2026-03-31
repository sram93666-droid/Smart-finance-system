import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = ({ analysis, mode, userDetails }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!showNameInput && userName) {
      setTimeout(() => {
        addBotMessage(`Hello ${userName}! 👋 I'm your AI Financial Assistant.`);
        setTimeout(() => {
          addBotMessage(`Based on your ${mode.toUpperCase()} savings mode, I can help you optimize your finances!`);
          setTimeout(() => {
            addBotMessage("Ask me about:\n💡 Saving tips\n💰 Reducing expenses\n📊 Budget planning\n📈 Investment advice");
          }, 800);
        }, 800);
      }, 500);
    }
  }, [showNameInput, userName, mode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text, timestamp: new Date() }]);
      setIsTyping(false);
    }, 500);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNameInput(false);
      addUserMessage(userName);
    }
  };

  const getBotResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('saving') || lowerQuestion.includes('save')) {
      return [
        "💡 **Personalized Saving Tips:**",
        "",
        `🎯 For ${mode.toUpperCase()} mode:`,
        "• Track every expense using budgeting apps",
        "• Set up automatic monthly transfers to savings",
        "• Use the 24-hour rule before big purchases",
        "• Cancel unused subscriptions and memberships",
        `• Aim to save ${mode === 'high' ? '30%' : mode === 'medium' ? '20%' : '10%'} of your income`
      ];
    } 
    else if (lowerQuestion.includes('reduce') || lowerQuestion.includes('expense')) {
      return [
        "✂️ **Expense Reduction Strategies:**",
        "",
        "• Create a detailed monthly budget",
        "• Cook at home instead of eating out (Save ₹2000-5000/month)",
        "• Use public transportation when possible",
        "• Shop with a list to avoid impulse purchases",
        "• Compare prices online before buying",
        "",
        "Potential monthly savings: ₹3000-8000"
      ];
    }
    else if (lowerQuestion.includes('budget')) {
      const salary = parseFloat(userDetails.salary) || 0;
      return [
        "📊 **Your Personalized Budget Plan:**",
        "",
        `Monthly Income: ₹${salary.toFixed(2)}`,
        "",
        "**Recommended Allocation (50/30/20 Rule):**",
        `• Needs (50%): ₹${(salary * 0.5).toFixed(2)} - Housing, food, utilities`,
        `• Wants (30%): ₹${(salary * 0.3).toFixed(2)} - Entertainment, shopping`,
        `• Savings (20%): ₹${(salary * 0.2).toFixed(2)} - Emergency fund, investments`,
        "",
        `Based on your ${mode} mode, focus on building your savings first!`
      ];
    }
    else if (lowerQuestion.includes('invest')) {
      return [
        "📈 **Investment Recommendations:**",
        "",
        `For ${mode.toUpperCase()} risk profile:`,
        "",
        mode === 'low' ? "• Recurring Deposits (6-7% returns)" : 
        mode === 'medium' ? "• Mutual Funds (10-12% returns)" : 
        "• Stocks & Equity (15-20% returns)",
        "",
        "• Start an emergency fund (3-6 months expenses)",
        "• Consider PPF for tax-free returns (7-8%)",
        "• Explore Index Funds for beginners",
        "",
        "💡 Start with as little as ₹500/month!"
      ];
    }
    else {
      return [
        "🤔 I'm here to help with your finances!",
        "",
        "Try asking me about:",
        "• 'Saving tips' - Get personalized saving strategies",
        "• 'Reduce expenses' - Learn to cut costs",
        "• 'Budget planning' - Create a budget plan",
        "• 'Investment advice' - Smart investment options",
        "",
        "What would you like to know? 💭"
      ];
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userQuestion = input;
    addUserMessage(userQuestion);
    setInput('');
    
    setIsTyping(true);
    setTimeout(() => {
      const responses = getBotResponse(userQuestion);
      responses.forEach((response, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, { type: 'bot', text: response, timestamp: new Date() }]);
        }, index * 300);
      });
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (showNameInput) {
    return (
      <div className="chatbot-name-screen">
        <div className="name-card-modern">
          <div className="ai-avatar-modern">
            <div className="avatar-icon-modern">🤖</div>
          </div>
          <h2>Welcome to AI Finance Assistant</h2>
          <p>You selected: <span className="mode-badge-modern">{mode.toUpperCase()} Savings Mode</span></p>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              placeholder="What is your name?"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
            />
            <button type="submit">
              Start Chatting →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-modern-container">
      <div className="chatbot-header-modern">
        <div className="ai-status-modern">
          <div className="status-dot-modern"></div>
          <span>AI Active</span>
        </div>
        <h2>
          <span>🤖</span> AI Finance Assistant
        </h2>
        <div className="mode-indicator-modern-chat">
          {mode === 'low' && '🛡️ Conservative'}
          {mode === 'medium' && '⚖️ Balanced'}
          {mode === 'high' && '🚀 Aggressive'}
        </div>
      </div>

      <div className="chat-messages-modern">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper-modern ${msg.type}`}>
            <div className="message-avatar-modern">
              {msg.type === 'bot' ? '🤖' : '👤'}
            </div>
            <div className="message-content-modern">
              <div className="message-bubble-modern">
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className="message-time-modern">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message-wrapper-modern bot">
            <div className="message-avatar-modern">🤖</div>
            <div className="typing-indicator-modern">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-modern">
        <div className="quick-actions-modern">
          <button onClick={() => setInput("Saving tips")}>💡 Saving Tips</button>
          <button onClick={() => setInput("Reduce expenses")}>💰 Reduce Expenses</button>
          <button onClick={() => setInput("Budget planning")}>📊 Budget Plan</button>
          <button onClick={() => setInput("Investment advice")}>📈 Investment</button>
        </div>
        
        <div className="input-container-modern">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your finances..."
          />
          <button onClick={handleSend} disabled={!input.trim()}>
            Send →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;