import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Design = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [style, setStyle] = useState('modern');
  const [budget, setBudget] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('style', style);
    formData.append('budget', budget);

    try {
      const response = await fetch('/api/upload/room', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze room.");
      }

      setResults(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/project/history', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...results,
          style: style,
          budget: budget
        })
      });
      if (response.ok) {
        navigate('/dashboard');
      } else {
        throw new Error('Failed to save project');
      }
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            AI Room Designer
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload a photo of your room and let our AI transform it based on your style and budget preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload & Settings Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Upload className="mr-2 text-blue-400" />
              Upload Room
            </h2>

            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-400 hover:bg-gray-800/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-48 rounded-lg overflow-hidden"
                  >
                    <img src={preview} alt="Room Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">Click to change image</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-48"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 font-medium mb-1">Click or drag image here</p>
                    <p className="text-gray-500 text-sm">Supports PNG, JPG, JPEG, WEBP</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Preferences */}
            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Design Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['modern', 'minimalist', 'industrial', 'bohemian', 'scandinavian', 'classic'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        style === s
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        budget === b
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {b === 'low' ? '$ (Budget)' : b === 'medium' ? '$$ (Mid)' : '$$$ (Premium)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || isLoading}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Analyzing Room...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2" />
                  Generate AI Design
                </>
              )}
            </button>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            {results ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <CheckCircle2 className="mr-2 text-green-400" />
                    Analysis Complete
                  </h2>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-400">Design Score</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                      {results.layout_score}/100
                    </span>
                  </div>
                </div>

                {results.output_image_url && (
                  <div className="w-full h-56 rounded-xl overflow-hidden mb-6 relative">
                    <img 
                      src={results.output_image_url} 
                      alt="Generated Design" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                      AI Generated
                    </div>
                  </div>
                )}

                <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                      <ChevronRight className="text-blue-400 w-5 h-5 mr-1" />
                      Style Suggestions
                    </h3>
                    <ul className="space-y-2 pl-6">
                      {results.style_suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-gray-400 list-disc">{suggestion}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                      <ChevronRight className="text-purple-400 w-5 h-5 mr-1" />
                      Detected Elements
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.detected_objects.map((obj, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm border border-gray-700">
                          {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Estimated Upgrade Cost</span>
                      <span className="text-2xl font-bold text-white">${results.estimated_cost_to_upgrade}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleSaveProject}
                  disabled={isSaving}
                  className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
                >
                  {isSaving ? (
                    <><Loader className="w-5 h-5 animate-spin mr-2" /> Saving...</>
                  ) : (
                    "Save Project to Dashboard"
                  )}
                </button>
              </motion.div>
            ) : (
              <div className="glass-panel p-8 rounded-2xl h-full flex flex-col items-center justify-center text-center opacity-50">
                <Wand2 className="w-16 h-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Awaiting Image</h3>
                <p className="text-gray-500 max-w-sm">
                  Upload a room image and generate a design to see the AI analysis, layout score, and recommendations here.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Design;
