import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

import { getCategories, addCategory, updateCategory, deleteCategory } from '../lib/firebaseService';

interface Category {
  id: string;
  name: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!category.id) {
      alert('ไม่พบ ID ของหมวดหมู่');
      return;
    }

    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
        alert('ลบหมวดหมู่สำเร็จ');
        await fetchCategories();
      } catch (error: any) {
        console.error("Error deleting category:", error);
        alert(`เกิดข้อผิดพลาดในการลบหมวดหมู่: ${error.message || 'ไม่ทราบสาเหตุ'}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryName);
        alert('อัปเดตหมวดหมู่สำเร็จ');
      } else {
        await addCategory(categoryName);
        alert('เพิ่มหมวดหมู่สำเร็จ');
      }
      setShowModal(false);
      setEditingCategory(null);
      setCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const openModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setShowModal(true);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-gray-800">จัดการหมวดหมู่สินค้า</h1>
          <p className="text-gray-400">เพิ่ม แก้ไข หรือลบหมวดหมู่สินค้าในร้าน</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> เพิ่มหมวดหมู่ใหม่
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-6">ชื่อหมวดหมู่</th>
                <th className="px-8 py-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={2} className="px-8 py-10 text-center text-gray-400">กำลังโหลด...</td></tr>
              ) : categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <p className="font-bold text-gray-800">{category.name}</p>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(category)}
                        className="p-2 text-gray-400 hover:text-pastel-blue transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category)}
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
            className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-display text-gray-800">
                {editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">ชื่อหมวดหมู่</label>
                <input 
                  required 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="เช่น ตุ๊กตาหมี, ของขวัญ"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" 
                />
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

export default AdminCategories;
