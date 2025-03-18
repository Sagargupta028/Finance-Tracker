
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpensesChart from '../components/ExpensesChart';
import CategoryChart from '../components/CategoryChart';
import BudgetForm from '../components/BudgetForm';
import BudgetChart from '../components/BudgetChart';
import SpendingInsights from '../components/SpendingInsights';
import { toast } from "sonner";

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

  // Initialize dark mode based on user preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Failed to parse saved transactions', error);
        toast.error('Failed to load saved transactions');
      }
    }
    
    // Load saved budgets
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets));
      } catch (error) {
        console.error('Failed to parse saved budgets', error);
        toast.error('Failed to load saved budgets');
      }
    }
    
    // Simulate loading time for animation purposes
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && Object.keys(budgets).length > 0) {
      localStorage.setItem('budgets', JSON.stringify(budgets));
    }
  }, [budgets, isLoading]);

  const handleAddTransaction = (transaction) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(transactions.map(t => 
        t.id === transaction.id ? transaction : t
      ));
      toast.success('Transaction updated successfully');
    } else {
      // Add new transaction
      setTransactions([...transactions, transaction]);
      toast.success('Transaction added successfully');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('transactions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      toast.success('Transaction deleted successfully');
    }
  };

  const handleSaveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    toast.success('Budgets saved successfully');
  };

  return (
    <div className="min-h-screen bg-finance-gray/30 dark:bg-slate-900 dark:text-white transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 pt-24 pb-12 md:px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-[70vh]">
              <div className="w-12 h-12 rounded-full border-4 border-finance-blue border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <>
              <Dashboard transactions={transactions} />
              
              <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`py-4 px-1 relative ${
                      activeTab === 'transactions'
                        ? 'text-finance-blue dark:text-finance-light-blue font-medium border-b-2 border-finance-blue dark:border-finance-light-blue'
                        : 'text-gray-500 dark:text-gray-400 hover:text-finance-blue dark:hover:text-finance-light-blue'
                    }`}
                  >
                    Transactions
                  </button>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className={`py-4 px-1 relative ${
                      activeTab === 'categories'
                        ? 'text-finance-blue dark:text-finance-light-blue font-medium border-b-2 border-finance-blue dark:border-finance-light-blue'
                        : 'text-gray-500 dark:text-gray-400 hover:text-finance-blue dark:hover:text-finance-light-blue'
                    }`}
                  >
                    Categories
                  </button>
                  <button
                    onClick={() => setActiveTab('budgeting')}
                    className={`py-4 px-1 relative ${
                      activeTab === 'budgeting'
                        ? 'text-finance-blue dark:text-finance-light-blue font-medium border-b-2 border-finance-blue dark:border-finance-light-blue'
                        : 'text-gray-500 dark:text-gray-400 hover:text-finance-blue dark:hover:text-finance-light-blue'
                    }`}
                  >
                    Budgeting
                  </button>
                </nav>
              </div>
              
              {activeTab === 'transactions' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <TransactionForm 
                      addTransaction={handleAddTransaction} 
                      editingTransaction={editingTransaction}
                      setEditingTransaction={setEditingTransaction}
                    />
                    <ExpensesChart transactions={transactions} />
                  </div>
                  
                  <div>
                    <TransactionList 
                      transactions={transactions}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'categories' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <CategoryChart transactions={transactions} />
                    <SpendingInsights transactions={transactions} budgets={budgets} />
                  </div>
                  
                  <div>
                    <TransactionList 
                      transactions={transactions}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'budgeting' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <BudgetForm budgets={budgets} saveBudgets={handleSaveBudgets} />
                    <SpendingInsights transactions={transactions} budgets={budgets} />
                  </div>
                  
                  <div>
                    <BudgetChart transactions={transactions} budgets={budgets} />
                    <TransactionList 
                      transactions={transactions}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="bg-white dark:bg-slate-800 py-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>FinanceTrack &copy; {new Date().getFullYear()} - Personal Finance Visualizer</p>
          <p className="mt-1 text-xs">
            Built with React, Tailwind CSS, and Recharts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
