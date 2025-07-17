
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  FileText,
  Truck,
  BarChart,
  Calculator,
  Receipt,
  Clock,
  CreditCard,
  BookOpen,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'Sales', path: '/sales' },
    { icon: User, label: 'Customer Entry', path: '/customer-entry' },
    { icon: Package, label: 'Purchase Entry', path: '/purchase-entry' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Truck, label: 'Vendors', path: '/vendors' },
    { icon: Package, label: 'Stock Management', path: '/stock-management' },
    { icon: Clock, label: 'Stock Expiry', path: '/stock-expiry' },
    { icon: BarChart, label: 'Sales Report', path: '/sales-report' },
    { icon: FileText, label: 'Purchase Report', path: '/purchase-report' },
    { icon: Receipt, label: 'Invoice Reprint', path: '/invoice-reprint' },
    { icon: CreditCard, label: 'Vendor Payment', path: '/vendor-payment' },
    { icon: Calculator, label: "Today's Collection", path: '/todays-collection' },
    { icon: BookOpen, label: 'Ledger View', path: '/ledger-view' },
    { icon: User, label: 'Accountant', path: '/accountant' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Medical Store</h1>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-8 flex-1 overflow-y-auto pb-20">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 truncate">
                {user?.name || 'User'}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 flex-shrink-0 ml-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
