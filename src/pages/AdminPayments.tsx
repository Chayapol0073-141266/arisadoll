import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, DollarSign, CreditCard, Smartphone, Landmark, Calendar, Filter, Truck } from 'lucide-react';
import { Order } from '../types';

import { getOrders } from '../lib/firebaseService';

const AdminPayments = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'promptpay': return <Smartphone className="text-pastel-blue" size={18} />;
      case 'credit': return <CreditCard className="text-pastel-pink" size={18} />;
      case 'transfer': return <Landmark className="text-pastel-green" size={18} />;
      case 'cod': return <Truck className="text-pastel-orange" size={18} />;
      default: return <DollarSign className="text-gray-400" size={18} />;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  const stats = {
    today: orders
      .filter(o => {
        const date = o.created_at?.seconds ? new Date(o.created_at.seconds * 1000) : new Date(o.created_at);
        return date.toDateString() === new Date().toDateString() && o.status !== 'cancelled';
      })
      .reduce((sum, o) => sum + (o.total_amount || 0), 0),
    pending: orders
      .filter(o => o.status === 'pending')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0),
    completed: orders
      .filter(o => o.status === 'completed' || o.status === 'shipped')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0),
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-display text-gray-800">รายการชำระเงิน</h1>
        <p className="text-gray-400">ตรวจสอบประวัติการชำระเงินและหลักฐานจากลูกค้า</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-1">ยอดรับชำระวันนี้</p>
          <p className="text-2xl font-bold text-gray-800">฿{stats.today.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-1">รอดำเนินการ</p>
          <p className="text-2xl font-bold text-pastel-orange">฿{stats.pending.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-medium mb-1">ชำระสำเร็จแล้ว</p>
          <p className="text-2xl font-bold text-pastel-green">฿{stats.completed.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อลูกค้า หรือ หมายเลขสั่งซื้อ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pastel-pink outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 text-gray-500 hover:text-pastel-pink transition-colors">
          <Calendar size={18} />
          <span className="text-sm font-bold">เลือกวันที่</span>
        </button>
        <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-pastel-pink transition-colors">
          <Filter size={20} />
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-6">วันที่ชำระ</th>
                <th className="px-8 py-6">หมายเลขสั่งซื้อ</th>
                <th className="px-8 py-6">ลูกค้า</th>
                <th className="px-8 py-6">ช่องทาง</th>
                <th className="px-8 py-6">จำนวนเงิน</th>
                <th className="px-8 py-6">สถานะ</th>
                <th className="px-8 py-6 text-right">หลักฐาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-8 py-10 text-center text-gray-400">กำลังโหลดข้อมูล...</td></tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4 text-sm text-gray-500">
                      {(order.created_at?.seconds 
                        ? new Date(order.created_at.seconds * 1000) 
                        : new Date(order.created_at)).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-8 py-4">
                      <span className="font-mono text-xs font-bold text-gray-400">#ORD-{order.id.toString().slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-4">
                      <p className="font-bold text-gray-800">{order.customer_name}</p>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(order.payment_method)}
                        <span className="text-xs text-gray-500 uppercase font-medium">{order.payment_method}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-bold text-gray-800">฿{order.total_amount.toLocaleString()}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'pending' ? 'bg-pastel-orange/20 text-pastel-orange' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-400' :
                        'bg-pastel-green/20 text-pastel-green'
                      }`}>
                        {order.status === 'pending' ? 'รอดำเนินการ' : order.status === 'cancelled' ? 'ยกเลิก' : 'สำเร็จ'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-pastel-pink text-xs font-bold hover:underline">ดูสลิป</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-8 py-10 text-center text-gray-400">ไม่พบข้อมูลการชำระเงิน</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
