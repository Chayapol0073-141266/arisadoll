import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

import { getProducts, getCategories } from '../lib/firebaseService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        setFeaturedProducts(productsData.filter((p: Product) => p.is_featured).slice(0, 4));
        
        const categoriesData = await getCategories();
        setCategories(categoriesData.slice(0, 4));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-pastel-orange/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/dollshop/1920/1080?blur=2" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-pastel-pink/20 text-pastel-pink rounded-full text-sm font-semibold mb-6">
              New Collection 2024 ✨
            </span>
            <h1 className="text-5xl md:text-7xl font-display text-gray-800 mb-6 leading-tight">
              เพื่อนรักตัวนุ่ม <br /> 
              <span className="text-pastel-pink">กอดอุ่นทุกเวลา</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg">
              พบกับตุ๊กตาหลากหลายสไตล์ ทั้งแบบสำเร็จรูปและสั่งทำพิเศษ 
              เพื่อเป็นของขวัญสุดประทับใจสำหรับคนที่คุณรัก
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2 text-lg py-3 px-8">
                ช้อปเลย <ArrowRight size={20} />
              </Link>
              <Link to="/custom" className="bg-white text-gray-700 font-medium py-3 px-8 rounded-full border border-gray-200 hover:bg-gray-50 transition-all">
                สั่งทำพิเศษ
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative z-10 w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://picsum.photos/seed/bear-hero/800/800" 
                alt="Main Doll" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-pastel-yellow rounded-full -z-10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pastel-blue/30 rounded-full -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display text-gray-800 mb-4">หมวดหมู่ยอดนิยม</h2>
          <div className="w-20 h-1 bg-pastel-pink mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`bg-pastel-${['pink', 'blue', 'green', 'yellow'][i % 4]}/10 p-8 rounded-3xl text-center cursor-pointer border border-transparent hover:border-white hover:shadow-md transition-all`}
            >
              <div className="text-5xl mb-4">{['🧸', '🦄', '🎎', '🎨'][i % 4]}</div>
              <h3 className="font-semibold text-gray-700">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-display text-gray-800 mb-2">สินค้าแนะนำ</h2>
            <p className="text-gray-500">ตุ๊กตายอดฮิตที่ใครๆ ก็หลงรัก</p>
          </div>
          <Link to="/shop" className="text-pastel-pink font-semibold flex items-center gap-1 hover:underline">
            ดูทั้งหมด <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-gray-200 aspect-square rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pastel-blue rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="md:w-1/2 relative z-10">
            <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
              โปรโมชั่นเปิดร้านใหม่! 🎊
            </h2>
            <p className="text-white/90 text-lg mb-8">
              ซื้อครบ 1,000 บาท รับฟรี! ตุ๊กตาพวงกุญแจสุดน่ารัก 1 ชิ้น 
              และส่งฟรีทั่วประเทศ ตั้งแต่วันนี้ - สิ้นเดือนนี้เท่านั้น
            </p>
            <button className="bg-white text-pastel-blue font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all">
              รับสิทธิ์เลย
            </button>
          </div>
          <div className="md:w-1/2 relative">
            <motion.img 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src="https://picsum.photos/seed/gift/600/600" 
              alt="Promotion" 
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl rotate-3"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <ShoppingBag className="text-pastel-pink" />, title: 'สินค้าคุณภาพ', desc: 'คัดสรรวัสดุอย่างดี' },
            { icon: <Star className="text-pastel-yellow" />, title: 'รีวิว 5 ดาว', desc: 'จากลูกค้ากว่า 1,000 ราย' },
            { icon: <Heart className="text-pastel-pink" />, title: 'ใส่ใจทุกรายละเอียด', desc: 'งานประณีตทุกชิ้น' },
            { icon: <ArrowRight className="text-pastel-green" />, title: 'ส่งไวทั่วไทย', desc: 'ได้รับของใน 1-3 วัน' },
          ].map((item, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                {item.icon}
              </div>
              <h4 className="font-bold text-gray-800">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
