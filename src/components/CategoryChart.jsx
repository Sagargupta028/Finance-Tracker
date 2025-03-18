import React, { useState, useEffect } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';
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
  { id: 'income', name: 'Income', icon: '💰', color: '#8CD47E' },
  { id: 'other', name: 'Other', icon: '📋', color: '#A0A0A0' }
];

const CategoryChart = ({ transactions }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    // Filter transactions by time period
    const now = new Date();
    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      
      // Only include expenses (negative amounts)
      if (t.amount >= 0) return false;
      
      switch (timeFilter) {
        case 'month':
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear();
        case 'quarter':
          const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          return transactionDate >= quarterStart;
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    // Group by category
    const categoryExpenses = {};
    
    filtered.forEach(transaction => {
      const categoryId = transaction.category || 'other';
      const amount = Math.abs(transaction.amount);
      
      if (!categoryExpenses[categoryId]) {
        categoryExpenses[categoryId] = 0;
      }
      
      categoryExpenses[categoryId] += amount;
    });
    
    // Format data for PieChart
    const formattedData = Object.keys(categoryExpenses).map(categoryId => {
      const category = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES.find(c => c.id === 'other');
      return {
        name: category.name,
        value: categoryExpenses[categoryId],
        color: category.color,
        icon: category.icon
      };
    });

    // Sort by value (highest first)
    formattedData.sort((a, b) => b.value - a.value);
    
    setCategoryData(formattedData);
    
    // Trigger animation
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, [transactions, timeFilter]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <p className="font-medium">{payload[0].payload.name} {payload[0].payload.icon}</p>
          <p className="text-finance-blue dark:text-finance-light-blue">
            ${payload[0].value.toFixed(2)} ({(payload[0].payload.percent * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  
  // Add percentage to each category
  const dataWithPercent = categoryData.map(item => ({
    ...item,
    percent: total > 0 ? item.value / total : 0
  }));

  return (
    <CustomCard className={`h-[400px] mb-8 ${animate ? 'animate-slide-up' : 'opacity-0'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Spending by Category</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeFilter('month')}
            className={`text-xs px-3 py-1 rounded-full ${
              timeFilter === 'month' 
                ? 'bg-finance-blue text-white' 
                : 'bg-finance-gray text-finance-black dark:bg-slate-700 dark:text-white'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeFilter('quarter')}
            className={`text-xs px-3 py-1 rounded-full ${
              timeFilter === 'quarter' 
                ? 'bg-finance-blue text-white' 
                : 'bg-finance-gray text-finance-black dark:bg-slate-700 dark:text-white'
            }`}
          >
            Quarter
          </button>
          <button 
            onClick={() => setTimeFilter('year')}
            className={`text-xs px-3 py-1 rounded-full ${
              timeFilter === 'year' 
                ? 'bg-finance-blue text-white' 
                : 'bg-finance-gray text-finance-black dark:bg-slate-700 dark:text-white'
            }`}
          >
            Year
          </button>
          <button 
            onClick={() => setTimeFilter('all')}
            className={`text-xs px-3 py-1 rounded-full ${
              timeFilter === 'all' 
                ? 'bg-finance-blue text-white' 
                : 'bg-finance-gray text-finance-black dark:bg-slate-700 dark:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      
      {dataWithPercent.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>No expense data available for this time period.</p>
        </div>
      ) : (
        <div className="flex h-[300px]">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercent}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                stroke="#f5f5f7"
                strokeWidth={2}
                animationDuration={800}
                animationEasing="ease-out"
                paddingAngle={3}
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(1)}%)`}
                labelLine={false}
              >
                {dataWithPercent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="w-[40%] overflow-y-auto flex flex-col justify-center px-4">
            <h3 className="text-sm font-medium mb-2">Top Categories</h3>
            <div className="space-y-2">
              {dataWithPercent.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-xs">
                      {category.icon} {category.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium">${category.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CustomCard>
  );
};

export default CategoryChart;
