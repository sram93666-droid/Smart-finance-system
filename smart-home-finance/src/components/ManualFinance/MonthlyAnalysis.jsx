import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MonthlyAnalysis = ({ expenses, userDetails, onSavingsPlan }) => {
  const calculateCategoryTotals = () => {
    const totals = {};
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return totals;
  };

  const categoryTotals = calculateCategoryTotals();
  const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const highestCategory = Object.entries(categoryTotals).reduce((a, b) => 
    (a[1] > b[1] ? a : b), ['none', 0])[0];

  const barChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Expenses (₹)',
        data: Object.values(categoryTotals),
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1
      }
    ]
  };

  const pieChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  const getSavingsPlan = () => {
    const salary = userDetails.salary;
    const savingsTarget = {
      Low: 0.1,
      Medium: 0.2,
      High: 0.3
    };
    
    const targetPercentage = savingsTarget[userDetails.mode];
    const targetSavings = salary * targetPercentage;
    const currentSavings = salary - totalExpense;
    
    let plan = '';
    if (currentSavings >= targetSavings) {
      plan = `Great job! You're saving ₹${currentSavings} which meets your ${userDetails.mode} savings goal. Keep it up!`;
    } else {
      const deficit = targetSavings - currentSavings;
      plan = `To reach your ${userDetails.mode} savings goal, you need to save an additional ₹${deficit} per month. Consider reducing expenses in ${highestCategory}.`;
    }
    
    return plan;
  };

  return (
    <div className="monthly-analysis">
      <h2>Monthly Analysis</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Expense</h3>
          <div className="stat-value">₹{totalExpense.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <h3>Highest Spending</h3>
          <div className="stat-value">{highestCategory}</div>
          <div className="stat-sub">₹{categoryTotals[highestCategory]?.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="insight-card">
        <h3>💡 Insight</h3>
        <p>You are spending more on <strong>{highestCategory}</strong>. This is ₹{categoryTotals[highestCategory]?.toFixed(2)} of your total expenses.</p>
      </div>
      
      <div className="chart-container">
        <h3>Category-wise Breakdown</h3>
        <div className="charts-wrapper">
          <div className="chart">
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>
          <div className="chart">
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
      
      <div className="savings-plan">
        <h3>📊 Savings Plan</h3>
        <p>{getSavingsPlan()}</p>
      </div>
      
      <button className="continue-btn" onClick={() => onSavingsPlan(getSavingsPlan())}>
        Continue to Recommendations
      </button>
    </div>
  );
};

export default MonthlyAnalysis;