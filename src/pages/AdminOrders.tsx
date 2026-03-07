import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Eye, Truck, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { Order } from '../types';

import { getOrders, updateOrderStatus } from '../lib/firebaseService';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      alert('อัปเดตสถานะสำเร็จ');
      fetchOrders();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ: ' + (error.message || 'กรุณาลองใหม่อีกครั้ง'));
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-display text-gray-800">จัดการคำสั่งซื้อ</h1>
        <p className="text-gray-400">ติดตามและอัปเดตสถานะการจัดส่งสินค้า</p>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาออเดอร์ (ชื่อลูกค้า, อีเมล)..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pastel-pink outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map(s => (
            <button key={s} className="px-4 py-2 rounded-xl bg-gray-50 text-xs font-bold text-gray-400 hover:text-pastel-pink transition-colors capitalize">
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-6">หมายเลขสั่งซื้อ</th>
                <th className="px-8 py-6">ลูกค้า</th>
                <th className="px-8 py-6">ยอดรวม</th>
                <th className="px-8 py-6">การชำระเงิน</th>
                <th className="px-8 py-6">สถานะ</th>
                <th className="px-8 py-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <span className="font-mono text-xs font-bold text-gray-400">#ORD-{order.id.toString().slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-8 py-4">
                    <p className="font-bold text-gray-800">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.customer_email}</p>
                  </td>
                  <td className="px-8 py-4 font-bold text-gray-800">฿{order.total_amount.toLocaleString()}</td>
                  <td className="px-8 py-4">
                    <span className="text-xs text-gray-500 uppercase font-medium">{order.payment_method}</span>
                  </td>
                  <td className="px-8 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-none focus:ring-0 cursor-pointer ${
                        order.status === 'pending' ? 'bg-pastel-orange/20 text-pastel-orange' :
                        order.status === 'processing' ? 'bg-pastel-blue/20 text-pastel-blue' :
                        order.status === 'shipped' ? 'bg-pastel-orange/20 text-pastel-orange' :
                        order.status === 'delivered' ? 'bg-pastel-green/20 text-pastel-green' :
                        'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-pastel-pink transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
