
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomCard from './ui/CustomCard';

const ExpensesChart = ({ transactions }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Group transactions by month
    const groupedByMonth = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          expenses: 0,
          income: 0
        };
      }
      
      if (transaction.amount < 0) {
        acc[monthYear].expenses += Math.abs(transaction.amount);
      } else {
        acc[monthYear].income += transaction.amount;
      }
      
      return acc;
    }, {});
    
    // Convert to array and sort by month
    const monthsArray = Object.values(groupedByMonth).sort((a, b) => a.month.localeCompare(b.month));
    
    // Format month names
    const formattedData = monthsArray.map(item => {
      const [year, month] = item.month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        ...item,
        name: `${monthNames[parseInt(month) - 1]} ${year}`
      };
    });
    
    setMonthlyData(formattedData);
    
    // Trigger animation after data is loaded
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
          {payload.length === 2 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Net: ${(payload[1].value - payload[0].value).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <CustomCard className={`h-[400px] mb-8 ${animate ? 'animate-slide-up' : 'opacity-0'}`}>
      <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
      
      {monthlyData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>No data available. Add transactions to see your monthly overview.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#86868b', fontSize: 12 }}
              axisLine={{ stroke: '#e1e1e1' }}
            />
            <YAxis 
              tick={{ fill: '#86868b', fontSize: 12 }}
              axisLine={{ stroke: '#e1e1e1' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              fill="#ff6b6b" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Bar 
              dataKey="income" 
              name="Income" 
              fill="#0071e3" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </CustomCard>
  );
};

export default ExpensesChart;
