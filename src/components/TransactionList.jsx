import React, { useState } from 'react';
import CustomCard from './ui/CustomCard';
import CustomButton from './ui/CustomButton';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

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

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getCategory = (categoryId) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || { name: 'Other', icon: '📋' };
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredTransactions = sortedTransactions.filter(transaction => {
    const matchesText = transaction.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    return matchesText && matchesCategory;
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <CustomCard className="animate-slide-up">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm font-medium text-finance-blue hover:text-finance-light-blue transition-colors"
        >
          <Filter size={16} className="mr-1" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      {showFilters && (
        <div className="mb-4 space-y-3 animate-fade-in">
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Text</label>
            <input
              type="text"
              placeholder="Filter by description"
              className="form-input w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Category</label>
            <ToggleGroup type="single" value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || 'all')} className="flex flex-wrap gap-1">
              <ToggleGroupItem value="all" className="text-xs">All</ToggleGroupItem>
              {CATEGORIES.map((cat) => (
                <ToggleGroupItem key={cat.id} value={cat.id} className="text-xs">
                  {cat.icon} {cat.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      )}
      
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-finance-gray/40">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('description')}
                >
                  Description {getSortIndicator('description')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('amount')}
                >
                  Amount {getSortIndicator('amount')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('date')}
                >
                  Date {getSortIndicator('date')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  Category {getSortIndicator('category')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-800 dark:divide-slate-700">
              {filteredTransactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <tr 
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                    onClick={() => toggleExpand(transaction.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{transaction.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{formatDate(transaction.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-finance-gray">
                          {getCategory(transaction.category).icon} {getCategory(transaction.category).name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <CustomButton 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(transaction)}
                          className="text-finance-blue hover:bg-finance-blue/10"
                        >
                          Edit
                        </CustomButton>
                        <CustomButton 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDelete(transaction.id)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          Delete
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                  {expandedId === transaction.id && (
                    <tr className="bg-finance-gray/20 dark:bg-slate-700/50">
                      <td colSpan="5" className="px-6 py-4">
                        <div className="text-sm animate-fade-in space-y-2">
                          <p><strong>Description:</strong> {transaction.description}</p>
                          <p><strong>Amount:</strong> ${Math.abs(transaction.amount).toFixed(2)}</p>
                          <p><strong>Date:</strong> {formatDate(transaction.date)}</p>
                          <p><strong>Category:</strong> {getCategory(transaction.category).icon} {getCategory(transaction.category).name}</p>
                          {transaction.notes && <p><strong>Notes:</strong> {transaction.notes}</p>}
                          <p><strong>Transaction ID:</strong> {transaction.id}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CustomCard>
  );
};

export default TransactionList;
