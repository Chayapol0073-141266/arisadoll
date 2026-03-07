import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

import { getProducts, getCategories, addProduct, updateProduct, deleteProduct } from '../lib/firebaseService';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทุกหมวดหมู่');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setImagePreview(editingProduct.image_url);
    } else {
      setImagePreview(null);
    }
  }, [editingProduct]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!product.id) {
      alert('ไม่พบ ID ของสินค้า');
      return;
    }
    
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        alert('ลบสินค้าสำเร็จ');
        await fetchProducts();
      } catch (error: any) {
        console.error("Error deleting product:", error);
        alert(`เกิดข้อผิดพลาดในการลบสินค้า: ${error.message || 'ไม่ทราบสาเหตุ'}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const productData = {
      ...data,
      image_url: imagePreview,
      price: parseFloat(data.price as string) || 0,
      stock: parseInt(data.stock as string) || 0,
      is_featured: data.is_featured === 'on' ? 1 : 0
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        alert('อัปเดตข้อมูลสำเร็จ');
      } else {
        await addProduct(productData);
        alert('เพิ่มสินค้าสำเร็จ');
      }

      setShowModal(false);
      setEditingProduct(null);
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-gray-800">จัดการสินค้า</h1>
          <p className="text-gray-400">เพิ่ม ลบ แก้ไข ข้อมูลสินค้าในร้าน</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อสินค้า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pastel-pink outline-none"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-6 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pastel-pink outline-none text-gray-500"
        >
          <option value="ทุกหมวดหมู่">ทุกหมวดหมู่</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-pastel-pink transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-6">สินค้า</th>
                <th className="px-8 py-6">หมวดหมู่</th>
                <th className="px-8 py-6">ราคา</th>
                <th className="px-8 py-6">สต็อก</th>
                <th className="px-8 py-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products
                .filter(p => 
                  (selectedCategory === 'ทุกหมวดหมู่' || p.category === selectedCategory) &&
                  (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={product.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.theme} | {product.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-pastel-blue/10 text-pastel-blue text-[10px] font-bold rounded-full uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-bold text-gray-800">฿{product.price.toLocaleString()}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-pastel-green' : 'bg-pastel-orange'}`}></div>
                      <span className="text-sm font-medium text-gray-600">{product.stock} ชิ้น</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingProduct(product); setShowModal(true); }}
                        className="p-2 text-gray-400 hover:text-pastel-blue transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-display text-gray-800">
                {editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">ชื่อสินค้า</label>
                  <input required name="name" defaultValue={editingProduct?.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">หมวดหมู่</label>
                  <select name="category" defaultValue={editingProduct?.category} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">ราคา (บาท)</label>
                  <input required type="number" name="price" defaultValue={editingProduct?.price} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">สต็อก (ชิ้น)</label>
                  <input required type="number" name="stock" defaultValue={editingProduct?.stock} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">ขนาด</label>
                  <input name="size" defaultValue={editingProduct?.size} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">รูปภาพสินค้า</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={32} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all">
                      <Search size={16} /> เลือกรูปภาพ
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-400">รองรับไฟล์ JPG, PNG (แนะนำขนาด 800x800 px)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">คำอธิบาย</label>
                <textarea name="description" defaultValue={editingProduct?.description} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="is_featured" defaultChecked={editingProduct?.is_featured === 1} className="w-5 h-5 rounded border-gray-300 text-pastel-pink focus:ring-pastel-pink" />
                <label className="text-sm font-bold text-gray-700">แสดงเป็นสินค้าแนะนำ</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-gray-400">ยกเลิก</button>
                <button type="submit" className="flex-[2] btn-primary py-4 text-lg">บันทึกข้อมูล</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
