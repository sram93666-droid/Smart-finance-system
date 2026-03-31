import React, { useState } from 'react';
import './SmartProcessor.css';

const SmartProcessor = ({ analysis, mode, onNext, onPrevious }) => {
  const [selectedCategory, setSelectedCategory] = useState('groceries');
  
  const productRecommendations = {
    groceries: {
      low: [
        { name: "Local Market Vegetables", price: "₹20/kg", savings: "30% off", store: "Local Market" },
        { name: "Store Brand Rice", price: "₹45/kg", savings: "Save ₹15", store: "Budget Store" },
        { name: "Bulk Purchase Deal", price: "₹500", savings: "Save ₹100", store: "Wholesale Club" }
      ],
      medium: [
        { name: "Organic Vegetables", price: "₹40/kg", savings: "Healthy choice", store: "Organic Mart" },
        { name: "Premium Basmati Rice", price: "₹120/kg", savings: "Quality assured", store: "Premium Store" },
        { name: "Monthly Grocery Box", price: "₹2000", savings: "Save ₹300", store: "Smart Cart" }
      ],
      high: [
        { name: "Exotic Vegetables", price: "₹80/kg", savings: "Premium quality", store: "Gourmet Shop" },
        { name: "Imported Food Items", price: "₹500", savings: "Gourmet selection", store: "International Mart" },
        { name: "Organic Delivery Box", price: "₹3500", savings: "Free delivery", store: "Farm Fresh" }
      ]
    },
    clothes: {
      low: [
        { name: "Basic Cotton Tee", price: "₹299", savings: "50% off", store: "Fashion Hub" },
        { name: "Budget Jeans", price: "₹599", savings: "Buy 1 Get 1", store: "Style Store" },
        { name: "Winter Sale Pack", price: "₹999", savings: "Up to 60% off", store: "Seasonal Mart" }
      ],
      medium: [
        { name: "Branded Shirt", price: "₹1299", savings: "20% off", store: "Brand Store" },
        { name: "Designer Jeans", price: "₹1999", savings: "Free Alteration", store: "Fashion Plaza" },
        { name: "Fashion Bundle", price: "₹2999", savings: "Save ₹500", store: "Style Hub" }
      ],
      high: [
        { name: "Premium Formal Wear", price: "₹4999", savings: "Tailor-made", store: "Luxury Store" },
        { name: "Designer Collection", price: "₹9999", savings: "Limited Edition", store: "Designer Boutique" },
        { name: "Luxury Brand Set", price: "₹19999", savings: "VIP Service", store: "Elite Fashion" }
      ]
    },
    gadgets: {
      low: [
        { name: "Budget Smartphone", price: "₹7999", savings: "Exchange offer", store: "Tech Store" },
        { name: "Basic Smartwatch", price: "₹1999", savings: "6 months EMI", store: "Gadget World" },
        { name: "Wireless Earbuds", price: "₹999", savings: "1 year warranty", store: "Audio Hub" }
      ],
      medium: [
        { name: "Mid-range Phone", price: "₹19999", savings: "No cost EMI", store: "ElectroMart" },
        { name: "Fitness Tracker", price: "₹3999", savings: "Health app included", store: "FitTech" },
        { name: "Noise Cancelling Headphones", price: "₹4999", savings: "30-day trial", store: "AudioPro" }
      ],
      high: [
        { name: "Flagship Phone", price: "₹69999", savings: "5G ready", store: "Premium Tech" },
        { name: "Smart Home Setup", price: "₹29999", savings: "AI integration", store: "SmartHome" },
        { name: "Premium Laptop", price: "₹89999", savings: "Student discount", store: "TechPro" }
      ]
    }
  };
  
  const recommendations = productRecommendations[selectedCategory][mode];
  
  return (
    <div className="smart-processor-modern">
      <div className="analysis-summary">
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h4>Total Previous Expenses</h4>
            <div className="summary-value">₹{analysis.totalPreviousExpense.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">🔮</div>
          <div className="summary-content">
            <h4>Predicted Future Expense</h4>
            <div className="summary-value">₹{analysis.predictedExpense.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h4>Projected Savings</h4>
            <div className={`summary-value ${analysis.projectedSavings > 0 ? 'positive' : 'negative'}`}>
              ₹{analysis.projectedSavings.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="ai-insights-section">
        <h3>🧠 AI-Generated Insights</h3>
        <div className="insights-list">
          {analysis.aiInsights.map((insight, i) => (
            <div key={i} className="insight-item">
              <span className="insight-bullet">✨</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="recommendations-section">
        <h3>📋 Smart Recommendations ({analysis.recommendations.title})</h3>
        <div className="recommendations-list">
          {analysis.recommendations.suggestions.map((suggestion, i) => (
            <div key={i} className="recommendation-item">
              <span className="checkmark">✓</span>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
        <div className="savings-estimate">
          💰 Expected Monthly Savings: <strong>₹{analysis.recommendations.expectedMonthlySavings}</strong>
        </div>
      </div>
      
      <div className="product-recommendations-modern">
        <h3>🛍️ Smart Product Recommendations</h3>
        <p className="recommendation-subtitle">Based on your {mode.toUpperCase()} savings mode</p>
        
        <div className="category-tabs">
          <button
            className={selectedCategory === 'groceries' ? 'active' : ''}
            onClick={() => setSelectedCategory('groceries')}
          >
            🥬 Groceries
          </button>
          <button
            className={selectedCategory === 'clothes' ? 'active' : ''}
            onClick={() => setSelectedCategory('clothes')}
          >
            👕 Clothes
          </button>
          <button
            className={selectedCategory === 'gadgets' ? 'active' : ''}
            onClick={() => setSelectedCategory('gadgets')}
          >
            📱 Gadgets
          </button>
        </div>
        
        <div className="products-grid-modern">
          {recommendations.map((product, i) => (
            <div key={i} className="product-card-modern">
              <div className="product-badge">{product.savings}</div>
              <h4>{product.name}</h4>
              <div className="product-price">{product.price}</div>
              <div className="product-store">🏪 {product.store}</div>
              <button className="view-deal-btn">View Deal →</button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="navigation-buttons-modern">
        <button onClick={onPrevious} className="nav-btn prev">
          ← Previous
        </button>
        <button onClick={onNext} className="nav-btn next">
          Continue to AI Assistant →
        </button>
      </div>
    </div>
  );
};

export default SmartProcessor;