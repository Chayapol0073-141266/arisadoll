import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-pastel-pink/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-pastel-pink rounded-full flex items-center justify-center text-white shadow-sm">
              🧸
            </div>
            <span className="text-2xl font-display text-pastel-pink font-bold tracking-wide">
              Teddy & Friends
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-pastel-pink font-medium transition-colors">หน้าแรก</Link>
            <Link to="/shop" className="text-gray-600 hover:text-pastel-pink font-medium transition-colors">สินค้าทั้งหมด</Link>
            <Link to="/custom" className="text-gray-600 hover:text-pastel-pink font-medium transition-colors">สั่งทำพิเศษ</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <button className="p-2 text-gray-400 hover:text-pastel-pink transition-colors">
              <Search size={22} />
            </button>
            <Link to="/wishlist" className="p-2 text-gray-400 hover:text-pastel-pink transition-colors">
              <Heart size={22} />
            </Link>
            <Link to="/cart" className="p-2 text-gray-400 hover:text-pastel-pink transition-colors relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-pastel-pink text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to="/admin" className="p-2 text-gray-400 hover:text-pastel-pink transition-colors">
              <User size={22} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="p-2 text-gray-400 mr-2 relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-pastel-pink text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-pastel-pink/10 rounded-lg">หน้าแรก</Link>
              <Link to="/shop" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-pastel-pink/10 rounded-lg">สินค้าทั้งหมด</Link>
              <Link to="/custom" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-pastel-pink/10 rounded-lg">สั่งทำพิเศษ</Link>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-pastel-pink/10 rounded-lg">จัดการหลังบ้าน</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
