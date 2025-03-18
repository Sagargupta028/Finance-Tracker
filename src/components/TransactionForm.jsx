
import React, { useState, useEffect } from 'react';
import CustomCard from './ui/CustomCard';
import CustomButton from './ui/CustomButton';
import { CalendarIcon, XCircleIcon } from 'lucide-react';

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

const TransactionForm = ({ addTransaction, editingTransaction, setEditingTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('other');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
      setCategory(editingTransaction.category || 'other');
      setNotes(editingTransaction.notes || '');
    }
  }, [editingTransaction]);

  const validateForm = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(amount))) newErrors.amount = 'Amount must be a number';
    if (!date) newErrors.date = 'Date is required';
    if (!category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: new Date(date),
      category,
      notes,
    };

    setTimeout(() => {
      addTransaction(transaction);
      resetForm();
      setIsSubmitting(false);
    }, 300); // Simulating network delay
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate('');
    setCategory('other');
    setNotes('');
    setErrors({});
    setEditingTransaction(null);
  };

  return (
    <CustomCard className="mb-8 animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">
        {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            className={`form-input w-full ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="text"
            className={`form-input w-full ${errors.amount ? 'border-red-500' : ''}`}
            placeholder="Enter amount (use negative for expenses)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <div className="relative">
            <input
              type="date"
              className={`form-input w-full ${errors.date ? 'border-red-500' : ''}`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground opacity-50" />
          </div>
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className={`form-input w-full ${errors.category ? 'border-red-500' : ''}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea
            className="form-input w-full min-h-[80px]"
            placeholder="Add any additional notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-2">
          {editingTransaction && (
            <CustomButton
              type="button"
              variant="secondary"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>
          )}
          
          <CustomButton 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : editingTransaction ? 'Update' : 'Add'}
          </CustomButton>
        </div>
      </form>
    </CustomCard>
  );
};

export default TransactionForm;
