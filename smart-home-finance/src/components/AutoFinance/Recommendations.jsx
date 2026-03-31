import React from 'react';

const Recommendations = ({ analysisData, mode }) => {
  const getProductRecommendations = () => {
    const products = {
      groceries: [
        { name: 'Fresh Vegetables Pack', price: 299, discount: '10% off' },
        { name: 'Organic Fruits Box', price: 499, discount: '15% off' },
        { name: 'Monthly Grocery Kit', price: 1999, discount: '20% off' }
      ],
      clothes: [
        { name: 'Cotton T-Shirts (Pack of 3)', price: 999, discount: '25% off' },
        { name: 'Formal Shirts', price: 1499, discount: '30% off' },
        { name: 'Winter Collection', price: 2999, discount: '15% off' }
      ],
      gadgets: [
        { name: 'Smart Watch', price: 3999, discount: '20% off' },
        { name: 'Wireless Earbuds', price: 2499, discount: '25% off' },
        { name: 'Power Bank', price: 999, discount: '10% off' }
      ]
    };
    
    const priceMultiplier = {
      Low: 0.7,
      Medium: 1,
      High: 1.3
    };
    
    const multiplier = priceMultiplier[mode] || 1;
    
    return Object.entries(products).map(([category, items]) => ({
      category,
      items: items.map(item => ({
        ...item,
        price: Math.round(item.price * multiplier)
      }))
    }));
  };

  const recommendations = getProductRecommendations();

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '20px', 
      padding: '30px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginBottom: '10px', color: '#333' }}>
        🎯 Recommended Products for You
      </h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Based on your <strong>{mode}</strong> savings mode
      </p>
      
      {analysisData && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h3>📊 Your Financial Summary</h3>
          <p><strong>Total Expense:</strong> ₹{analysisData.totalExpense?.toFixed(2) || 0}</p>
          <p><strong>Monthly Savings:</strong> ₹{analysisData.savings?.toFixed(2) || 0}</p>
          <p><strong>Suggestion:</strong> {analysisData.suggestion || 'Keep tracking!'}</p>
        </div>
      )}
      
      {recommendations.map((category, idx) => (
        <div key={idx} style={{ marginBottom: '40px' }}>
          <h3 style={{ 
            marginBottom: '20px', 
            color: '#667eea',
            borderLeft: '4px solid #667eea',
            paddingLeft: '15px'
          }}>
            🛍️ {category.category.toUpperCase()}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {category.items.map((product, pid) => (
              <div key={pid} style={{
                background: '#f9f9f9',
                borderRadius: '12px',
                padding: '20px',
                transition: 'transform 0.3s'
              }}>
                <div style={{
                  position: 'relative',
                  marginBottom: '10px'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ff4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {product.discount}
                  </span>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '24px', color: '#667eea', fontWeight: 'bold', margin: '15px 0' }}>
                  ₹{product.price}
                </div>
                <button style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  View Deal →
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div style={{
        background: '#e8f5e9',
        borderRadius: '15px',
        padding: '25px',
        marginTop: '30px'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>💡 Savings Tips</h3>
        <ul style={{ color: '#1b5e20' }}>
          <li>✓ Track all your expenses daily</li>
          <li>✓ Set up automatic savings transfer</li>
          <li>✓ Use cashback apps for purchases</li>
          <li>✓ Review subscriptions monthly</li>
        </ul>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        marginTop: '30px'
      }}>
        <button onClick={() => window.location.href = '/dashboard'} style={{
          padding: '12px 30px',
          background: '#f0f0f0',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer'
        }}>
          Back to Dashboard
        </button>
        <button onClick={() => window.location.reload()} style={{
          padding: '12px 30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer'
        }}>
          Start New Analysis
        </button>
      </div>
    </div>
  );
};

export default Recommendations;