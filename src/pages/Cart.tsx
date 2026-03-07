import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          🛒
        </div>
        <h2 className="text-3xl font-display text-gray-800 mb-4">ตะกร้าของคุณยังว่างอยู่</h2>
        <p className="text-gray-500 mb-8">ไปเลือกดูตุ๊กตาน่ารักๆ กันเถอะ!</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          ไปช้อปเลย <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display text-gray-800 mb-10">ตะกร้าสินค้าของคุณ</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              key={`${item.id}-${item.custom_text}`}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-sm text-pastel-pink font-semibold mb-2">{item.category}</p>
                {item.custom_text && (
                  <p className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full inline-block">
                    ปักชื่อ: {item.custom_text}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pastel-pink"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pastel-pink"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <p className="text-lg font-bold text-gray-800">฿{(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">฿{item.price.toLocaleString()} / ชิ้น</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] shadow-lg border border-gray-100 sticky top-32">
            <h3 className="text-2xl font-display text-gray-800 mb-6">สรุปรายการสั่งซื้อ</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>ยอดรวมสินค้า</span>
                <span>฿{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ค่าจัดส่ง</span>
                <span className="text-pastel-green font-bold">ฟรี</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-800">ยอดรวมทั้งสิ้น</span>
                <span className="text-3xl font-display text-pastel-pink">฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
              ดำเนินการชำระเงิน <ArrowRight size={20} />
            </Link>
            
            <p className="text-center text-xs text-gray-400 mt-6">
              ชำระเงินได้อย่างปลอดภัยผ่าน PromptPay และบัตรเครดิต
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
