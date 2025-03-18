import React, { useMemo } from 'react';
import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import CustomCard from './ui/CustomCard';

// Import the category list to keep it consistent
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

const SpendingInsights = ({ transactions, budgets }) => {
  const insights = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // For previous month comparisons
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    if (previousMonth < 0) {
      previousMonth = 11;
      previousYear--;
    }
    
    // Filter transactions for current and previous months
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const previousMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    });
    
    // Calculate total spending (expenses only) for current and previous months
    const currentMonthSpending = currentMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const previousMonthSpending = previousMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Calculate total income for current and previous months
    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousMonthIncome = previousMonthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate spending by category for current month
    const currentMonthCategorySpending = {};
    
    currentMonthTransactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const category = t.category || 'other';
        if (!currentMonthCategorySpending[category]) {
          currentMonthCategorySpending[category] = 0;
        }
        currentMonthCategorySpending[category] += Math.abs(t.amount);
      });
    
    // Compare with budgets for insights
    const budgetInsights = [];
    
    Object.entries(currentMonthCategorySpending).forEach(([category, amount]) => {
      const budget = budgets[category] || 0;
      const categoryObj = CATEGORIES.find(c => c.id === category) || { name: 'Other', icon: '📋' };
      
      if (budget > 0) {
        const percentUsed = (amount / budget) * 100;
        
        if (percentUsed >= 100) {
          budgetInsights.push({
            type: 'warning',
            message: `You've exceeded your ${categoryObj.name} budget by $${(amount - budget).toFixed(2)}.`,
            icon: AlertTriangleIcon,
            category: categoryObj
          });
        } else if (percentUsed >= 80) {
          budgetInsights.push({
            type: 'info',
            message: `You're approaching your ${categoryObj.name} budget (${percentUsed.toFixed(0)}% used).`,
            icon: TrendingUpIcon,
            category: categoryObj
          });
        }
      } else if (amount > 100) {
        // If no budget is set but significant spending
        budgetInsights.push({
          type: 'suggestion',
          message: `Consider setting a budget for ${categoryObj.name} (spent $${amount.toFixed(2)}).`,
          icon: CheckCircleIcon,
          category: categoryObj
        });
      }
    });
    
    // Spending trends
    let spendingTrend = null;
    if (previousMonthSpending > 0) {
      const percentChange = ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100;
      
      if (Math.abs(percentChange) >= 5) {
        spendingTrend = {
          type: percentChange > 0 ? 'warning' : 'positive',
          message: `Your spending is ${percentChange > 0 ? 'up' : 'down'} ${Math.abs(percentChange).toFixed(1)}% compared to last month.`,
          icon: percentChange > 0 ? TrendingUpIcon : TrendingDownIcon
        };
      }
    }
    
    // Savings potential
    let savingsInsight = null;
    if (currentMonthIncome > 0 && currentMonthSpending > 0) {
      const savingsRate = (currentMonthIncome - currentMonthSpending) / currentMonthIncome * 100;
      
      if (savingsRate < 20 && savingsRate >= 0) {
        savingsInsight = {
          type: 'suggestion',
          message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider saving at least 20% of your income.`,
          icon: CheckCircleIcon
        };
      } else if (savingsRate < 0) {
        savingsInsight = {
          type: 'warning',
          message: `You're spending more than you earn this month. Consider reducing expenses.`,
          icon: AlertTriangleIcon
        };
      } else if (savingsRate >= 20) {
        savingsInsight = {
          type: 'positive',
          message: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income.`,
          icon: CheckCircleIcon
        };
      }
    }
    
    // Find the highest spending category
    let highestCategory = null;
    let highestAmount = 0;
    
    Object.entries(currentMonthCategorySpending).forEach(([category, amount]) => {
      if (amount > highestAmount) {
        highestAmount = amount;
        highestCategory = category;
      }
    });
    
    let topCategoryInsight = null;
    if (highestCategory) {
      const categoryObj = CATEGORIES.find(c => c.id === highestCategory) || { name: 'Other', icon: '📋' };
      topCategoryInsight = {
        type: 'info',
        message: `Your highest spending category is ${categoryObj.name} ($${highestAmount.toFixed(2)}).`,
        icon: TrendingUpIcon,
        category: categoryObj
      };
    }
    
    return {
      budgetInsights,
      spendingTrend,
      savingsInsight,
      topCategoryInsight,
      hasInsights: budgetInsights.length > 0 || spendingTrend || savingsInsight || topCategoryInsight
    };
  }, [transactions, budgets]);

  return (
    <CustomCard className="mb-8 animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
      
      {!insights.hasInsights ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Add more transactions to generate spending insights.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.spendingTrend && (
            <div className={`p-3 rounded-lg ${
              insights.spendingTrend.type === 'warning' 
                ? 'bg-red-50 dark:bg-red-900/20' 
                : 'bg-green-50 dark:bg-green-900/20'
            }`}>
              <div className="flex items-start">
                <div className={`p-1.5 rounded-full mr-3 ${
                  insights.spendingTrend.type === 'warning' 
                    ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                    : 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  <insights.spendingTrend.icon size={16} />
                </div>
                <p className="text-sm">{insights.spendingTrend.message}</p>
              </div>
            </div>
          )}
          
          {insights.savingsInsight && (
            <div className={`p-3 rounded-lg ${
              insights.savingsInsight.type === 'warning' 
                ? 'bg-red-50 dark:bg-red-900/20' 
                : insights.savingsInsight.type === 'positive' 
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-blue-50 dark:bg-blue-900/20'
            }`}>
              <div className="flex items-start">
                <div className={`p-1.5 rounded-full mr-3 ${
                  insights.savingsInsight.type === 'warning' 
                    ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                    : insights.savingsInsight.type === 'positive' 
                      ? 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  <insights.savingsInsight.icon size={16} />
                </div>
                <p className="text-sm">{insights.savingsInsight.message}</p>
              </div>
            </div>
          )}
          
          {insights.topCategoryInsight && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <div className="flex items-start">
                <div className="p-1.5 rounded-full mr-3 bg-amber-100 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400">
                  <insights.topCategoryInsight.icon size={16} />
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{insights.topCategoryInsight.category.icon}</span>
                  <p className="text-sm">{insights.topCategoryInsight.message}</p>
                </div>
              </div>
            </div>
          )}
          
          {insights.budgetInsights.slice(0, 3).map((insight, index) => (
            <div key={index} className={`p-3 rounded-lg ${
              insight.type === 'warning' 
                ? 'bg-red-50 dark:bg-red-900/20' 
                : insight.type === 'positive' 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-blue-50 dark:bg-blue-900/20'
            }`}>
              <div className="flex items-start">
                <div className={`p-1.5 rounded-full mr-3 ${
                  insight.type === 'warning' 
                    ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                    : insight.type === 'positive' 
                      ? 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  <insight.icon size={16} />
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{insight.category.icon}</span>
                  <p className="text-sm">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          {insights.budgetInsights.length > 3 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              + {insights.budgetInsights.length - 3} more insights
            </p>
          )}
        </div>
      )}
    </CustomCard>
  );
};

export default SpendingInsights;
