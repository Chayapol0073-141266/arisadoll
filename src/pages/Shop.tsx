import React, { useEffect, useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { THEMES } from '../constants';
import { motion } from 'motion/react';

import { getProducts, getCategories } from '../lib/firebaseService';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display text-gray-800 mb-2">สินค้าทั้งหมด</h1>
          <p className="text-gray-500">เลือกเพื่อนตัวโปรดของคุณจากรายการทั้งหมด</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาตุ๊กตา..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-pastel-pink focus:border-transparent outline-none transition-all"
            />
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-pastel-pink shadow-sm transition-all">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">หมวดหมู่</h3>
            <div className="space-y-2">
              {['ทั้งหมด', ...categories.map(c => c.name)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                    selectedCategory === cat 
                      ? 'bg-pastel-pink text-white font-bold shadow-sm' 
                      : 'text-gray-500 hover:bg-pastel-pink/10 hover:text-pastel-pink'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">ช่วงราคา</h3>
            <div className="space-y-4">
              <input type="range" min="0" max="2000" className="w-full accent-pastel-pink" />
              <div className="flex justify-between text-sm text-gray-400">
                <span>฿0</span>
                <span>฿2,000+</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">ธีม</h3>
            <div className="flex flex-wrap gap-2">
              {THEMES.map(theme => (
                <button key={theme} className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-pastel-pink hover:text-pastel-pink transition-all">
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-gray-200 aspect-square rounded-3xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
              <p className="text-gray-400">ไม่พบสินค้าที่ตรงตามเงื่อนไข</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
