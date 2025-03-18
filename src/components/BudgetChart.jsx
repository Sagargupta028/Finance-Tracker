import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import CustomCard from './ui/CustomCard';

// Import the category list to keep it consistent
const CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', icon: '🍔', color: '#FF6384' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#36A2EB' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#FFCE56' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#4BC0C0' },
  { id: 'housing', name: 'Housing', icon: '🏠', color: '#9966FF' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#FF9F40' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#C9CBCF' },
  { id: 'education', name: 'Education', icon: '📚', color: '#7FD2C0' },
  { id: 'other', name: 'Other', icon: '📋', color: '#A0A0A0' }
];

const BudgetChart = ({ transactions, budgets }) => {
  const [chartData, setChartData] = useState([]);
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Create data for the current month only
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.amount < 0;
    });
    
    // Calculate actual spending per category
    const actualSpending = {};
    
    CATEGORIES.forEach(category => {
      if (category.id !== 'income') {
        actualSpending[category.id] = 0;
      }
    });
    
    currentMonthTransactions.forEach(transaction => {
      const categoryId = transaction.category || 'other';
      if (categoryId !== 'income') {
        actualSpending[categoryId] = (actualSpending[categoryId] || 0) + Math.abs(transaction.amount);
      }
    });
    
    // Combine budget and actual data
    const data = Object.keys(actualSpending).map(categoryId => {
      const category = CATEGORIES.find(c => c.id === categoryId);
      const budgetAmount = budgets[categoryId] || 0;
      const actualAmount = actualSpending[categoryId] || 0;
      
      return {
        name: category.name,
        icon: category.icon,
        budget: budgetAmount,
        actual: actualAmount,
        color: category.color,
        // Calculate percent of budget used
        percentUsed: budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0,
        // Calculate amount remaining in budget
        remaining: budgetAmount - actualAmount
      };
    });
    
    // Sort by budget amount (highest first)
    data.sort((a, b) => b.budget - a.budget);
    
    setChartData(data);
    
    // Trigger animation
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, [transactions, budgets]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <p className="font-medium">{data.name} {data.icon}</p>
          <p className="text-xs">Budget: <span className="font-medium">${data.budget.toFixed(2)}</span></p>
          <p className="text-xs">Actual: <span className="font-medium">${data.actual.toFixed(2)}</span></p>
          <p className="text-xs">
            {data.remaining >= 0 ? (
              <span className="text-green-500">Remaining: ${data.remaining.toFixed(2)}</span>
            ) : (
              <span className="text-red-500">Over budget: ${Math.abs(data.remaining).toFixed(2)}</span>
            )}
          </p>
          <p className="text-xs">
            {data.budget > 0 ? `${data.percentUsed.toFixed(1)}% of budget used` : 'No budget set'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <CustomCard className={`h-[400px] mb-8 ${animate ? 'animate-slide-up' : 'opacity-0'}`}>
      <h2 className="text-xl font-semibold mb-4">Budget vs. Actual Spending</h2>
      
      {chartData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>No budget data available.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={0}
            barCategoryGap={10}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: '#e1e1e1' }}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <YAxis 
              axisLine={{ stroke: '#e1e1e1' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="budget" 
              name="Budget" 
              fill="#0071e3" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
              animationEasing="ease-in-out"
              barSize={20}
            />
            <Bar 
              dataKey="actual" 
              name="Actual" 
              fill="#ff6b6b" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
              animationEasing="ease-in-out"
              barSize={20}
            />
            <ReferenceLine y={0} stroke="#000" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </CustomCard>
  );
};

export default BudgetChart;
