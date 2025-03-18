import React, { useState, useEffect } from 'react';
import CustomCard from './ui/CustomCard';
import CustomButton from './ui/CustomButton';
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';

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
  { id: 'other', name: 'Other', icon: '📋' }
];

const BudgetForm = ({ budgets, saveBudgets }) => {
  const [budgetItems, setBudgetItems] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize budget items from props or set default values
  useEffect(() => {
    if (budgets && Object.keys(budgets).length > 0) {
      const items = CATEGORIES
        .filter(cat => cat.id !== 'income') // We don't budget for income
        .map(category => ({
          categoryId: category.id,
          amount: budgets[category.id] || 0
        }));
      
      setBudgetItems(items);
      calculateTotal(items);
    } else {
      const defaultItems = CATEGORIES
        .filter(cat => cat.id !== 'income') // We don't budget for income
        .map(category => ({
          categoryId: category.id,
          amount: 0
        }));
      
      setBudgetItems(defaultItems);
      calculateTotal(defaultItems);
    }
  }, [budgets]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setTotalBudget(total);
  };

  const handleAmountChange = (categoryId, value) => {
    const updatedItems = budgetItems.map(item => {
      if (item.categoryId === categoryId) {
        return { ...item, amount: value === '' ? 0 : Number(value) };
      }
      return item;
    });
    
    setBudgetItems(updatedItems);
    calculateTotal(updatedItems);
    
    // Clear any error for this category
    if (errors[categoryId]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[categoryId];
        return newErrors;
      });
    }
  };

  const validateBudgets = () => {
    const newErrors = {};
    
    budgetItems.forEach(item => {
      if (isNaN(Number(item.amount))) {
        newErrors[item.categoryId] = 'Amount must be a number';
      } else if (Number(item.amount) < 0) {
        newErrors[item.categoryId] = 'Amount cannot be negative';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateBudgets()) return;
    
    setIsSaving(true);
    
    // Convert budget items to object format: { categoryId: amount }
    const budgetObject = budgetItems.reduce((obj, item) => {
      obj[item.categoryId] = Number(item.amount);
      return obj;
    }, {});
    
    // Simulate API call delay
    setTimeout(() => {
      saveBudgets(budgetObject);
      setIsSaving(false);
    }, 300);
  };

  const getCategoryIcon = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : '📋';
  };

  const getCategoryName = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : 'Other';
  };

  return (
    <CustomCard className="mb-8 animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {budgetItems.map((item) => (
          <div key={item.categoryId} className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-finance-gray flex items-center justify-center text-lg">
              {getCategoryIcon(item.categoryId)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{getCategoryName(item.categoryId)}</p>
              {errors[item.categoryId] && (
                <p className="text-red-500 text-xs">{errors[item.categoryId]}</p>
              )}
            </div>
            <div className="relative w-28">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                min="0"
                step="1"
                className="form-input w-full pl-7"
                value={item.amount || ''}
                onChange={(e) => handleAmountChange(item.categoryId, e.target.value)}
              />
            </div>
            <button 
              className="text-finance-blue hover:text-finance-light-blue transition-colors"
              onClick={() => handleAmountChange(item.categoryId, Number(item.amount || 0) + 10)}
            >
              <PlusCircleIcon size={20} />
            </button>
            <button 
              className="text-finance-blue hover:text-finance-light-blue transition-colors"
              onClick={() => handleAmountChange(item.categoryId, Math.max(0, Number(item.amount || 0) - 10))}
            >
              <MinusCircleIcon size={20} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total Monthly Budget:</span>
          <span className="text-xl font-bold text-finance-blue">${totalBudget.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-end">
          <CustomButton 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Budget'}
          </CustomButton>
        </div>
      </div>
    </CustomCard>
  );
};

export default BudgetForm;
