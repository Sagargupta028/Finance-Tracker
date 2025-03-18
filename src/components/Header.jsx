
import React, { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="w-8 h-8 rounded-lg bg-finance-blue flex items-center justify-center text-white font-semibold">F</span>
          <h1 className="text-xl font-semibold">FinanceTrack</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium hover:text-finance-blue transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium hover:text-finance-blue transition-colors">Transactions</a>
            <a href="#" className="text-sm font-medium hover:text-finance-blue transition-colors">Analytics</a>
          </nav>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-finance-gray/50 dark:bg-slate-800 hover:bg-finance-gray dark:hover:bg-slate-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-amber-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-slate-700" />
            )}
          </button>
          
          <div className="md:hidden">
            <button className="p-2 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
