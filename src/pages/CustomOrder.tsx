import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Calculator, CheckCircle2, ArrowRight, MessageCircle, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CustomOrder = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimation, setEstimation] = useState<{ price: number; feasibility: string; suggestion: string } | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Initial AI greeting
    setMessages([
      { 
        role: 'model', 
        text: 'สวัสดีค่ะ! ยินดีต้อนรับสู่บริการสั่งทำตุ๊กตาพิเศษของ Teddy & Friends ค่ะ 🧸✨ ไม่ทราบว่าคุณลูกค้าอยากทำตุ๊กตาเนื่องในโอกาสพิเศษอะไรคะ? เช่น วันครบรอบ วันเกิด หรือของขวัญรับปริญญา บอกความต้องการเบื้องต้นและงบประมาณที่ตั้งไว้ได้เลยนะคะ' 
      }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `คุณคือผู้เชี่ยวชาญด้านการออกแบบตุ๊กตาสั่งทำพิเศษของร้าน Teddy & Friends หน้าที่ของคุณคือให้คำปรึกษาลูกค้า ประเมินความเป็นไปได้ และประเมินราคาคร่าวๆ ตามความต้องการของลูกค้า

ความต้องการล่าสุดของลูกค้า: "${userMessage}"
ประวัติการสนทนา: ${messages.map(m => `${m.role}: ${m.text}`).join('\n')}

กรุณาตอบกลับในรูปแบบ JSON ดังนี้:
{
  "reply": "ข้อความตอบกลับลูกค้าที่สุภาพและให้คำแนะนำ",
  "estimation": {
    "price": ตัวเลขราคาประเมิน (0 ถ้ายังไม่ชัดเจน),
    "feasibility": "ระดับความเป็นไปได้ (เช่น สูง, ปานกลาง, ต้องปรับแก้)",
    "suggestion": "ข้อแนะนำเพิ่มเติมเพื่อให้สินค้าออกมาดีที่สุด"
  }
}` }] }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      
      if (data.estimation && data.estimation.price > 0) {
        setEstimation(data.estimation);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'ขออภัยค่ะ ระบบขัดข้องเล็กน้อย กรุณาลองใหม่อีกครั้งนะคะ' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = () => {
    if (!estimation) return;

    const customProduct = {
      id: Date.now(), // Temporary ID
      name: `ตุ๊กตาสั่งทำพิเศษ (Custom Order)`,
      price: estimation.price,
      image_url: "https://picsum.photos/seed/custom-doll/400/400",
      category: "ตุ๊กตาสั่งทำพิเศษ",
      theme: "Custom",
      size: "Custom",
      description: messages.filter(m => m.role === 'user').map(m => m.text).join(' | '),
      custom_text: "สั่งทำพิเศษตามรายละเอียดในแชท"
    };

    addToCart(customProduct as any);
    setIsFinalized(true);
    setTimeout(() => {
      navigate('/cart');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col h-[700px] bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-pastel-pink/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-pastel-pink rounded-full flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">ระบบให้คำปรึกษาออกแบบตุ๊กตา</h2>
              <p className="text-xs text-pastel-pink font-medium">AI Designer Assistant</p>
            </div>
          </div>

          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-pastel-pink text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 rounded-tl-none flex gap-2">
                  <span className="w-2 h-2 bg-pastel-pink rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-pastel-pink rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-pastel-pink rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="พิมพ์รายละเอียดความต้องการของคุณที่นี่..."
                className="w-full pl-6 pr-16 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pastel-pink outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-pastel-pink text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center">
              * คุณสามารถพูดคุยและปรับเปลี่ยนรายละเอียดได้จนกว่าจะพอใจ
            </p>
          </div>
        </div>

        {/* Estimation & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-pastel-pink" /> สรุปการประเมิน
            </h3>
            
            {estimation ? (
              <div className="space-y-6">
                <div className="p-6 bg-pastel-pink/5 rounded-3xl border border-pastel-pink/10">
                  <p className="text-sm text-gray-500 mb-1">ราคาประเมินคร่าวๆ</p>
                  <p className="text-4xl font-display text-pastel-pink">฿{estimation.price.toLocaleString()}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-pastel-green/20 text-pastel-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">ความเป็นไปได้</p>
                      <p className="text-sm text-gray-500">{estimation.feasibility}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-pastel-blue/20 text-pastel-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Info size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">ข้อแนะนำจากดีไซน์เนอร์</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{estimation.suggestion}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isFinalized}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                  >
                    {isFinalized ? (
                      <>เพิ่มลงตะกร้าแล้ว! <CheckCircle2 size={20} /></>
                    ) : (
                      <>ยืนยันคำสั่งซื้อ <ArrowRight size={20} /></>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <MessageCircle size={32} />
                </div>
                <p className="text-sm text-gray-400">
                  กรุณาพิมพ์รายละเอียดความต้องการ <br /> เพื่อให้ระบบช่วยประเมินราคาค่ะ
                </p>
              </div>
            )}
          </div>

          <div className="bg-pastel-blue p-8 rounded-[40px] text-white shadow-lg shadow-pastel-blue/20">
            <h4 className="font-bold mb-3">ทำไมต้องสั่งทำกับเรา?</h4>
            <ul className="text-sm space-y-3 opacity-90">
              <li className="flex items-center gap-2">• งานประณีตโดยช่างฝีมือ</li>
              <li className="flex items-center gap-2">• วัสดุเกรดพรีเมียม ปลอดภัย</li>
              <li className="flex items-center gap-2">• ส่งแบบให้ดูก่อนเริ่มงานจริง</li>
              <li className="flex items-center gap-2">• รับประกันความพึงพอใจ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
