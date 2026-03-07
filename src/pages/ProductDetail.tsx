import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { SIZES } from '../constants';

import { getProductById } from '../lib/firebaseService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity, customText);
    // Show toast or notification
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-pastel-pink mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> กลับไปหน้าก่อนหน้า
      </button>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-[40px] overflow-hidden bg-white shadow-xl border-8 border-white">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-pastel-pink cursor-pointer transition-all">
                <img src={`https://picsum.photos/seed/${product.id + i}/200/200`} alt="Gallery" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-pastel-pink/10 text-pastel-pink px-4 py-1 rounded-full text-sm font-bold">
                {product.category}
              </span>
              <div className="flex items-center text-pastel-yellow">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="text-gray-400 text-sm ml-2">(4.9/5)</span>
              </div>
            </div>
            <h1 className="text-4xl font-display text-gray-800 mb-4">{product.name}</h1>
            <p className="text-3xl font-display text-pastel-pink">฿{product.price.toLocaleString()}</p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description || "ไม่มีคำอธิบายเพิ่มเติมสำหรับสินค้านี้"}
          </p>

          <div className="space-y-6 pt-6 border-t border-gray-100">
            {/* Size Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">ขนาดที่เลือก</label>
              <div className="flex gap-3">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                      selectedSize === size 
                        ? 'bg-pastel-pink text-white shadow-md' 
                        : 'bg-white border border-gray-200 text-gray-500 hover:border-pastel-pink'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text */}
            {product.category === 'ตุ๊กตาสั่งทำพิเศษ' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">ข้อความที่ต้องการปัก (ฟรี)</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="เช่น ชื่อเล่น หรือ วันเกิด"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-500"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-500"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-400">มีสินค้าในสต็อก {product.stock} ชิ้น</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-lg"
              >
                <ShoppingCart size={22} /> เพิ่มลงตะกร้า
              </button>
              <button className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-all shadow-sm">
                <Heart size={24} />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
            <div className="text-center space-y-1">
              <ShieldCheck className="mx-auto text-pastel-green" size={24} />
              <p className="text-[10px] font-bold text-gray-500 uppercase">รับประกันคุณภาพ</p>
            </div>
            <div className="text-center space-y-1">
              <Truck className="mx-auto text-pastel-blue" size={24} />
              <p className="text-[10px] font-bold text-gray-500 uppercase">ส่งฟรีทั่วไทย</p>
            </div>
            <div className="text-center space-y-1">
              <RotateCcw className="mx-auto text-pastel-orange" size={24} />
              <p className="text-[10px] font-bold text-gray-500 uppercase">เปลี่ยนคืนใน 7 วัน</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-24 space-y-10">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-display text-gray-800">รีวิวจากลูกค้า ({product.reviews?.length || 0})</h2>
          <button className="text-pastel-pink font-bold hover:underline">เขียนรีวิว</button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review: Review) => (
              <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{review.customer_name}</h4>
                    <div className="flex text-pastel-yellow mt-1">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400">ยังไม่มีรีวิวสำหรับสินค้านี้ เป็นคนแรกที่รีวิวสิ!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
