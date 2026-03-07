import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Package, ShoppingBag, Users, TrendingUp, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getAdminStats } from '../lib/firebaseService';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display text-gray-800">แผงควบคุมผู้ดูแลระบบ</h1>
        <div className="text-sm text-gray-400">อัปเดตล่าสุด: {new Date().toLocaleString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'ยอดขายรวม', value: `฿${stats.totalSales.toLocaleString()}`, icon: <DollarSign />, color: 'bg-pastel-green/10 text-pastel-green' },
          { label: 'คำสั่งซื้อทั้งหมด', value: stats.orderCount, icon: <ShoppingBag />, color: 'bg-pastel-blue/10 text-pastel-blue' },
          { label: 'สินค้าในระบบ', value: stats.productCount, icon: <Package />, color: 'bg-pastel-pink/10 text-pastel-pink' },
          { label: 'ลูกค้าทั้งหมด', value: stats.customerCount, icon: <Users />, color: 'bg-pastel-yellow/10 text-pastel-yellow' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">คำสั่งซื้อล่าสุด</h2>
            <Link to="/admin/orders" className="text-pastel-pink text-sm font-bold hover:underline">ดูทั้งหมด</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4">ลูกค้า</th>
                  <th className="px-8 py-4">วันที่</th>
                  <th className="px-8 py-4">ยอดรวม</th>
                  <th className="px-8 py-4">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4">
                      <p className="font-bold text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-500">
                      {order.created_at?.seconds 
                        ? new Date(order.created_at.seconds * 1000).toLocaleDateString('th-TH') 
                        : new Date(order.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-8 py-4 font-bold text-gray-800">
                      ฿{order.total_amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'pending' ? 'bg-pastel-orange/20 text-pastel-orange' :
                        order.status === 'delivered' ? 'bg-pastel-green/20 text-pastel-green' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Inventory Alert */}
        <div className="space-y-8">
          <div className="bg-pastel-pink p-8 rounded-[40px] text-white shadow-lg shadow-pastel-pink/20">
            <h3 className="text-xl font-bold mb-4">สรุปยอดขายวันนี้</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl font-display">฿{stats.todaySales.toLocaleString()}</span>
              <span className="text-sm opacity-80 mb-1">วันนี้</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm opacity-90">
                <span>จำนวนออเดอร์</span>
                <span>{stats.todayOrderCount} รายการ</span>
              </div>
              <div className="w-full bg-white/20 h-1 rounded-full">
                <div className="bg-white w-full h-full rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-pastel-orange" /> การแจ้งเตือน
            </h3>
            <div className="space-y-4">
              {stats.lowStockProducts.map((p: any) => (
                <div key={p.id} className="flex gap-4 items-start p-4 bg-pastel-yellow/5 rounded-2xl border border-pastel-yellow/10">
                  <div className="w-2 h-2 bg-pastel-yellow rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">สินค้า "{p.name}" เหลือเพียง {p.stock} ชิ้นในสต็อก</p>
                </div>
              ))}
              {stats.oldPendingCount > 0 && (
                <div className="flex gap-4 items-start p-4 bg-pastel-blue/5 rounded-2xl border border-pastel-blue/10">
                  <div className="w-2 h-2 bg-pastel-blue rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">มี {stats.oldPendingCount} ออเดอร์ที่ยังไม่ได้จัดส่งเกิน 24 ชม.</p>
                </div>
              )}
              {stats.lowStockCount === 0 && stats.oldPendingCount === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm italic">
                  ไม่มีการแจ้งเตือนในขณะนี้
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
