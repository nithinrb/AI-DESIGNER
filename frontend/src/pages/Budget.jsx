import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, DollarSign, Download, ArrowLeft } from 'lucide-react';

const Budget = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tierMultiplier, setTierMultiplier] = useState(1);

  // Example project ID (in real app, this comes from URL params)
  const projectId = 'proj_1'; 

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchBudget = async () => {
      try {
        const response = await fetch(`/api/project/budget/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBudgetData(data.budget);
        }
      } catch (err) {
        console.error("Failed to fetch budget:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudget();
  }, [token, navigate, projectId]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Budget Planner</h1>
            <p className="text-gray-400">Master Bedroom Redesign - Estimated Costs</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="mt-4 md:mt-0 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors border border-gray-700"
          >
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </motion.div>

        {isLoading ? (
          <div className="glass-panel p-12 rounded-2xl flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : budgetData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Total Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="glass-panel p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <PieChart className="w-32 h-32 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2 relative z-10">Total Estimated Cost</h3>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 relative z-10 mb-6 transition-all">
                  ${Math.round(budgetData.total_estimated * tierMultiplier)}
                </div>
                
                <p className="text-sm text-gray-400 relative z-10">
                  This estimate is based on average market prices for the selected 'Medium' budget tier.
                </p>
              </div>
            </motion.div>

            {/* Breakdown List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass-panel p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Cost Breakdown</h2>
              
              <div className="space-y-6">
                {budgetData.breakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-medium text-gray-200">{item.category}</span>
                      <span className="font-bold text-white transition-all">${Math.round(item.amount * tierMultiplier)}</span>
                    </div>
                    {/* Progress bar visual */}
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.amount / budgetData.total_estimated) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 + (idx * 0.1) }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Want to adjust your budget?</h3>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setTierMultiplier(0.5)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors border ${tierMultiplier === 0.5 ? 'bg-gray-700 border-gray-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'}`}
                  >
                    Switch to Economy ($)
                  </button>
                  <button 
                    onClick={() => setTierMultiplier(1)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors border ${tierMultiplier === 1 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'}`}
                  >
                    Mid-Range ($$)
                  </button>
                  <button 
                    onClick={() => setTierMultiplier(2.5)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors shadow-lg ${tierMultiplier === 2.5 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 border'}`}
                  >
                    Upgrade to Premium ($$$)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">Failed to load budget data.</div>
        )}
      </div>
    </div>
  );
};

export default Budget;
