import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { CheckCircle2, CreditCard, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';

import { createOrder } from '../lib/firebaseService';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'promptpay'
  });

  if (cart.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.address) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        setStep(1);
        setLoading(false);
        return;
      }

      const newOrderId = await createOrder({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        address: formData.address,
        total_amount: totalPrice,
        payment_method: formData.paymentMethod,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
          custom_text: item.custom_text || ''
        }))
      });

      if (newOrderId) {
        setOrderId(newOrderId);
        setStep(3);
        clearCart();
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ: ' + (error.message || 'กรุณาลองใหม่อีกครั้ง'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= i ? 'bg-pastel-pink text-white shadow-md' : 'bg-gray-200 text-gray-400'
            }`}>
              {step > i ? <CheckCircle2 size={20} /> : i}
            </div>
            {i < 3 && <div className={`w-20 h-1 mx-2 rounded ${step > i ? 'bg-pastel-pink' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-display text-gray-800 mb-8 text-center">ข้อมูลการจัดส่ง</h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">ชื่อ-นามสกุล</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">เบอร์โทรศัพท์</label>
                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">อีเมล</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">ที่อยู่จัดส่ง</label>
              <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-pink outline-none" />
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">
              ต่อไป: เลือกวิธีการชำระเงิน
            </button>
          </form>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-display text-gray-800 mb-8 text-center">วิธีการชำระเงิน</h2>
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 space-y-8">
            <div className="grid gap-4">
              {[
                { id: 'promptpay', name: 'PromptPay', icon: '📱', desc: 'สแกน QR Code เพื่อชำระเงิน' },
                { id: 'credit', name: 'บัตรเครดิต / เดบิต', icon: '💳', desc: 'Visa, Mastercard, JCB' },
                { id: 'transfer', name: 'โอนเงินผ่านธนาคาร', icon: '🏦', desc: 'กสิกรไทย, ไทยพาณิชย์' },
                { id: 'cod', name: 'ชำระเงินปลายทาง', icon: '📦', desc: 'ชำระเงินเมื่อได้รับสินค้า' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                  className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left ${
                    formData.paymentMethod === method.id ? 'border-pastel-pink bg-pastel-pink/5' : 'border-gray-100 hover:border-pastel-pink/30'
                  }`}
                >
                  <div className="text-3xl">{method.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{method.name}</h4>
                    <p className="text-sm text-gray-500">{method.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === method.id ? 'border-pastel-pink bg-pastel-pink' : 'border-gray-200'
                  }`}>
                    {formData.paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            {formData.paymentMethod === 'promptpay' && (
              <div className="bg-gray-50 p-8 rounded-3xl text-center space-y-4">
                <p className="font-bold text-gray-700">สแกนเพื่อจ่าย ฿{totalPrice.toLocaleString()}</p>
                <div className="w-48 h-48 bg-white mx-auto p-4 rounded-2xl shadow-sm border border-gray-100">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PromptPayMock" alt="QR Code" className="w-full h-full" />
                </div>
                <p className="text-xs text-gray-400">กรุณาชำระเงินภายใน 15 นาที</p>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-gray-500 hover:text-pastel-pink transition-colors">
                ย้อนกลับ
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex-[2] btn-primary py-4 text-lg disabled:opacity-50"
              >
                {loading ? 'กำลังประมวลผล...' : `ยืนยันการสั่งซื้อ ฿${totalPrice.toLocaleString()}`}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-12">
          <div className="w-24 h-24 bg-pastel-green rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-display text-gray-800">สั่งซื้อสำเร็จแล้ว! 🎉</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              ขอบคุณที่ไว้วางใจ Teddy & Friends เราได้รับคำสั่งซื้อของคุณแล้ว 
              และจะรีบจัดส่งให้เร็วที่สุด
            </p>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 max-w-md mx-auto text-left space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">หมายเลขคำสั่งซื้อ</span>
              <span className="font-bold text-gray-800">#ORD-{orderId?.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">สถานะ</span>
              <span className="text-pastel-green font-bold">กำลังเตรียมจัดส่ง</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
              <span className="text-gray-800 font-bold">ยอดชำระรวม</span>
              <span className="text-2xl font-display text-pastel-pink">฿{totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="btn-primary px-12 py-4">
            กลับหน้าหลัก
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Checkout;
