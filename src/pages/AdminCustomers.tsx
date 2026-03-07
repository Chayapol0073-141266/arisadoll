import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, User, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import { getOrders } from '../lib/firebaseService';

interface Customer {
  email: string;
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: any;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const orders = await getOrders();
      
      // Group by email to get unique customers
      const customerMap = new Map<string, Customer>();
      
      orders.forEach(order => {
        const email = order.customer_email || 'no-email';
        const existing = customerMap.get(email);
        
        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += (order.total_amount || 0);
          if (order.created_at?.seconds > (existing.lastOrderDate?.seconds || 0)) {
            existing.lastOrderDate = order.created_at;
          }
        } else {
          customerMap.set(email, {
            email: email,
            name: order.customer_name,
            phone: order.customer_phone,
            address: order.address,
            orderCount: 1,
            totalSpent: order.total_amount || 0,
            lastOrderDate: order.created_at
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-display text-gray-800">รายชื่อลูกค้า</h1>
        <p className="text-gray-400">ข้อมูลลูกค้าที่เคยสั่งซื้อสินค้าในร้าน</p>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ, อีเมล หรือ เบอร์โทรศัพท์..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pastel-pink outline-none"
          />
        </div>
        <div className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-500">
          <span className="text-sm font-bold">ทั้งหมด {customers.length} ราย</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-20 text-gray-400">กำลังโหลดข้อมูลลูกค้า...</div>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer, i) => (
            <motion.div 
              key={customer.email}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-pastel-pink/10 rounded-full flex items-center justify-center text-pastel-pink flex-shrink-0">
                  <User size={32} />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{customer.name}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Mail size={14} /> {customer.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">ยอดซื้อสะสม</p>
                      <p className="text-xl font-display text-pastel-pink">฿{customer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ShoppingBag size={14} className="text-gray-400" />
                      สั่งซื้อแล้ว {customer.orderCount} ครั้ง
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600 col-span-2">
                      <MapPin size={14} className="text-gray-400 mt-1 flex-shrink-0" />
                      <span className="line-clamp-1">{customer.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full w-fit">
                    <Calendar size={10} />
                    สั่งซื้อล่าสุดเมื่อ: {customer.lastOrderDate ? new Date(customer.lastOrderDate.seconds * 1000).toLocaleDateString('th-TH') : 'N/A'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-400">ไม่พบข้อมูลลูกค้าที่ตรงตามเงื่อนไข</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
