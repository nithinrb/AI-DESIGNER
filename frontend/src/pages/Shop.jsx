import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ShoppingCart, Filter } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';

const Shop = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [styleFilter, setStyleFilter] = useState('modern');
  
  // Checkout Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/shop/recommendations?style=${styleFilter}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [token, navigate, styleFilter]);

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-4 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 mr-3 text-pink-400" /> Curated For You
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover premium furniture and decor matched to your AI-generated room designs.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center mb-10">
          <div className="glass-panel p-2 rounded-full flex space-x-2 overflow-x-auto custom-scrollbar max-w-full">
            {['modern', 'minimalist', 'scandinavian'].map((style) => (
              <button
                key={style}
                onClick={() => setStyleFilter(style)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  styleFilter === style 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-panel p-4 rounded-2xl animate-pulse h-80 flex flex-col">
                <div className="w-full h-48 bg-gray-700/50 rounded-xl mb-4"></div>
                <div className="w-3/4 h-5 bg-gray-700/50 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-700/50 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-4 rounded-2xl group flex flex-col h-full"
              >
                <div className="relative h-56 w-full mb-4 rounded-xl overflow-hidden bg-white">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" /> 4.9
                  </div>
                </div>
                
                <p className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">{product.brand}</p>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">{product.name}</h3>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <span className="text-xl font-black text-white">${product.price}</span>
                  <button 
                    onClick={() => handleBuyNow(product)}
                    className="px-4 py-2 rounded-lg bg-gray-800 flex items-center text-white text-sm font-bold hover:bg-pink-500 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No products found for this style.</p>
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
};

export default Shop;
