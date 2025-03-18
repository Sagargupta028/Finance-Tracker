import React, { useMemo } from 'react';
import CustomCard from './ui/CustomCard';

const CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', icon: '🍔' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'housing', name: 'Housing', icon: '🏠' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'income', name: 'Income', icon: '💰' },
  { id: 'other', name: 'Other', icon: '📋' }
];

const Dashboard = ({ transactions }) => {
  const stats = useMemo(() => {
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    
    const categoryBreakdown = {};
    
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const category = t.category || 'other';
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = 0;
        }
        categoryBreakdown[category] += Math.abs(t.amount);
      });
    
    const topCategories = Object.entries(categoryBreakdown)
      .map(([id, amount]) => ({
        id,
        amount,
        ...CATEGORIES.find(c => c.id === id) || { name: 'Other', icon: '📋' }
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
    
    return {
      totalExpenses,
      totalIncome,
      balance,
      recentTransactions,
      topCategories,
      transactionCount: transactions.length
    };
  }, [transactions]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
      <CustomCard hover className="bg-gradient-to-br from-finance-blue to-finance-light-blue text-white dark:from-blue-800 dark:to-blue-600">
        <h3 className="text-xs uppercase tracking-wider opacity-80 mb-1">Balance</h3>
        <p className="text-3xl font-semibold mb-1">${stats.balance.toFixed(2)}</p>
        <div className="flex items-center text-xs opacity-80">
          <span className="mr-3">{stats.transactionCount} transactions</span>
        </div>
      </CustomCard>
      
      <CustomCard hover>
        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Income</h3>
        <p className="text-3xl font-semibold text-green-500 mb-1">${stats.totalIncome.toFixed(2)}</p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-3">Total earnings</span>
        </div>
      </CustomCard>
      
      <CustomCard hover>
        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Expenses</h3>
        <p className="text-3xl font-semibold text-red-500 mb-1">${stats.totalExpenses.toFixed(2)}</p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-3">Total spent</span>
        </div>
      </CustomCard>
      
      <CustomCard className="md:col-span-2" hover>
        <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
        
        {stats.recentTransactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {stats.recentTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 bg-finance-gray/30 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    transaction.amount < 0 
                      ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {transaction.category 
                      ? CATEGORIES.find(c => c.id === transaction.category)?.icon || '📋'
                      : transaction.amount < 0 ? '-' : '+'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <p className={`font-medium ${
                  transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {transaction.amount < 0 ? '-' : '+'} 
                  ${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CustomCard>
      
      <CustomCard hover>
        <h3 className="text-sm font-medium mb-2">Top Expense Categories</h3>
        
        {stats.topCategories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No expense data yet</p>
        ) : (
          <div className="space-y-4">
            {stats.topCategories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">${category.amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-finance-blue dark:bg-finance-light-blue h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (category.amount / stats.totalExpenses) * 100)}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {((category.amount / stats.totalExpenses) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        )}
      </CustomCard>
    </div>
  );
};

export default Dashboard;
