import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Folder, Clock, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/project/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [token, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-white mb-2">Welcome Back, {user?.name || 'Designer'}!</h1>
          <p className="text-gray-400">Here's an overview of your recent interior design projects.</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Projects', value: projects.length, icon: <Folder className="text-blue-400" /> },
            { label: 'Avg Design Score', value: '88/100', icon: <CheckCircle2 className="text-green-400" /> },
            { label: 'Saved Budgets', value: '$' + (projects.length * 1500).toLocaleString(), icon: <BarChart2 className="text-purple-400" /> }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-2xl flex items-center justify-between"
            >
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Projects Grid */}
        <h2 className="text-2xl font-bold text-white mb-6">Recent Projects</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl h-64 animate-pulse">
                <div className="w-full h-32 bg-gray-700/50 rounded-xl mb-4"></div>
                <div className="w-3/4 h-6 bg-gray-700/50 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-700/50 rounded"></div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-4 rounded-2xl group cursor-pointer"
                onClick={() => navigate('/budget')}
              >
                <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={project.image_url} 
                    alt={project.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white flex items-center">
                    <CheckCircle2 size={12} className="mr-1 text-green-400" />
                    {project.score}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{project.name}</h3>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <Clock size={14} className="mr-1" />
                  {project.date} • {project.style}
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-700/50 pt-4 mt-2">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-gray-800 text-gray-300">
                    {project.budget} Budget
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/budget'); }}
                    className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium transition-colors"
                  >
                    View Plan <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center">
            <Folder className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">Start your first interior design project by uploading a room photo.</p>
            <button 
              onClick={() => navigate('/design')}
              className="bg-primary hover:bg-blue-600 px-6 py-3 rounded-xl font-medium text-white transition-colors"
            >
              Start New Design
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
