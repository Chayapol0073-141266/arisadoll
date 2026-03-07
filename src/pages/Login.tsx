import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple mock authentication for demo purposes
    // In a real app, this would be an API call
    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        localStorage.setItem('doll_shop_admin_auth', 'true');
        navigate(from, { replace: true });
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-pastel-pink rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-pastel-pink/20">
              🧸
            </div>
            <h1 className="text-3xl font-display text-gray-800">เข้าสู่ระบบจัดการ</h1>
            <p className="text-gray-400 text-sm">กรุณาเข้าสู่ระบบเพื่อจัดการร้านค้าของคุณ</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm border border-red-100"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">ชื่อผู้ใช้</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pastel-pink outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pastel-pink outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : (
                <>เข้าสู่ระบบ <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              Demo Credentials: <span className="font-bold text-gray-500">admin / password123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
