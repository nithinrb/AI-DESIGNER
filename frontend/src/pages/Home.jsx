import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wand2, Sparkles, Layout } from 'lucide-react';

const Home = () => {
  return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4 max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 text-sm text-gray-300 border border-white/10">
          <Sparkles size={16} className="text-secondary" />
          <span>Powered by NVIDIA CUDA & PyTorch</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-100 dark:text-white">
          Redesign Your Room in <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Seconds with AI
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Upload a photo of your space and let our enterprise-grade AI transform it. Get personalized styles, furniture recommendations, and budget estimates instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/design" className="bg-primary hover:bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
            <Wand2 size={20} />
            Start Designing
          </Link>
          <Link to="/examples" className="glass-dark hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 border border-white/10">
            <Layout size={20} />
            View Gallery
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
