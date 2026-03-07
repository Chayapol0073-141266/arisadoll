import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import CustomOrder from './pages/CustomOrder';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminPayments from './pages/AdminPayments';
import AdminCategories from './pages/AdminCategories';
import AdminCustomers from './pages/AdminCustomers';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Home as HomeIcon, CreditCard, Layers } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('doll_shop_admin_auth') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('doll_shop_admin_auth');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'สินค้า' },
    { path: '/admin/categories', icon: <Layers size={20} />, label: 'หมวดหมู่' },
    { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'คำสั่งซื้อ' },
    { path: '/admin/payments', icon: <CreditCard size={20} />, label: 'การชำระเงิน' },
    { path: '/admin/customers', icon: <Users size={20} />, label: 'ลูกค้า' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pastel-pink rounded-full flex items-center justify-center text-white text-sm">🧸</div>
            <span className="text-xl font-display text-pastel-pink font-bold">Teddy Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-pastel-pink text-white shadow-md shadow-pastel-pink/20' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-pastel-pink transition-colors">
            <HomeIcon size={20} />
            <span className="font-medium">กลับหน้าหลัก</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <NavbarWrapper />
          <div className="flex-1">
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/custom" element={<CustomOrder />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute><AdminLayout><AdminCustomers /></AdminLayout></ProtectedRoute>} />
            </Routes>
          </div>
          
          <FooterWrapper />
        </div>
      </CartProvider>
    </Router>
  );
}

const NavbarWrapper = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname === '/login';
  if (isAdmin) return null;
  return <Navbar />;
};

const FooterWrapper = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname === '/login';
  if (isAdmin) return null;
  
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pastel-pink rounded-full flex items-center justify-center text-white text-sm">🧸</div>
              <span className="text-xl font-display text-pastel-pink font-bold">Teddy & Friends</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              ร้านขายตุ๊กตาออนไลน์ที่รวบรวมความน่ารักและอบอุ่นไว้ในที่เดียว 
              พร้อมบริการส่งความสุขถึงหน้าบ้านคุณ
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">เมนูแนะนำ</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/shop" className="hover:text-pastel-pink transition-colors">สินค้าทั้งหมด</Link></li>
              <li><Link to="/custom" className="hover:text-pastel-pink transition-colors">สั่งทำพิเศษ</Link></li>
              <li><Link to="/shop" className="hover:text-pastel-pink transition-colors">ตุ๊กตาผ้า</Link></li>
              <li><Link to="/shop" className="hover:text-pastel-pink transition-colors">เซตของขวัญ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">ช่วยเหลือ</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-pastel-pink transition-colors">วิธีการสั่งซื้อ</a></li>
              <li><a href="#" className="hover:text-pastel-pink transition-colors">การจัดส่งสินค้า</a></li>
              <li><a href="#" className="hover:text-pastel-pink transition-colors">นโยบายการคืนสินค้า</a></li>
              <li><a href="#" className="hover:text-pastel-pink transition-colors">คำถามที่พบบ่อย</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">ติดต่อเรา</h4>
            <p className="text-sm text-gray-500 mb-4">
              123 ถนนความสุข แขวงน่ารัก <br />
              เขตใจดี กรุงเทพฯ 10110
            </p>
            <p className="text-sm text-gray-500 font-bold">โทร: 02-123-4567</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
          © 2024 Teddy & Friends Doll Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
