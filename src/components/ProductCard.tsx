import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {product.is_featured === 1 && (
          <span className="absolute top-4 left-4 bg-pastel-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault();
            // Wishlist logic
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors shadow-sm"
        >
          <Heart size={20} />
        </button>
      </Link>

      <div className="p-6 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-pastel-pink font-semibold uppercase tracking-wider mb-1">{product.category}</p>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-lg font-bold text-gray-800 hover:text-pastel-pink transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-display text-gray-800">
            ฿{product.price.toLocaleString()}
          </span>
          <button 
            onClick={() => addToCart(product, 1)}
            className="w-12 h-12 bg-pastel-pink text-white rounded-2xl flex items-center justify-center hover:bg-opacity-90 transition-all shadow-sm active:scale-90"
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
