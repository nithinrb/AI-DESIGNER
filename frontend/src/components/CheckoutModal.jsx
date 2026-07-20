import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle2, Loader } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, product }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl overflow-hidden z-10"
        >
          {isSuccess ? (
            <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <CheckCircle2 className="w-24 h-24 text-green-400 mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-400">
                Your order for the <span className="text-white font-medium">{product.name}</span> has been placed.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <CreditCard className="mr-2 text-blue-400" /> Secure Checkout
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6 bg-gray-800/50 flex items-center">
                <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                <div>
                  <p className="text-sm text-gray-400 uppercase font-bold">{product.brand}</p>
                  <p className="text-lg text-white font-medium">{product.name}</p>
                </div>
                <div className="ml-auto text-xl font-black text-white">
                  ${product.price}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleCheckout} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Card Number (Mock)</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-1">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <><Loader className="animate-spin mr-2" /> Processing...</>
                    ) : (
                      `Pay $${product.price}`
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
