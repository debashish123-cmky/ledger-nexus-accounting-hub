
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2, Users, Truck, ShoppingCart, FileText, Receipt,
  CreditCard, Package, AlertTriangle, TrendingUp, BarChart3,
  BookOpen, Menu, LogOut, Home, User, Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Client Management', href: '/clients', icon: Users },
  { name: 'Vendor Management', href: '/vendors', icon: Truck },
  { name: 'Purchase Entry', href: '/purchase-entry', icon: ShoppingCart },
  { name: 'Invoice Reprint', href: '/invoice-reprint', icon: FileText },
  { name: 'Purchase Order', href: '/purchase-order', icon: Receipt },
  { name: 'Vendor Payment', href: '/vendor-payment', icon: CreditCard },
  { name: 'Stock Management', href: '/stock-management', icon: Package },
  { name: 'Stock Expiry', href: '/stock-expiry', icon: AlertTriangle },
  { name: "Today's Collection", href: '/todays-collection', icon: TrendingUp },
  { name: 'Purchase Report', href: '/purchase-report', icon: BarChart3 },
  { name: 'Sales Report', href: '/sales-report', icon: BarChart3 },
  { name: 'Ledger View', href: '/ledger-view', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-6 border-b">
        <Building2 className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">Accounting Pro</h2>
          <p className="text-xs text-gray-500">Management System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all
                ${isActive(item.href)
                  ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed positioning */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <div className="bg-white shadow-sm border-r">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content - Properly positioned */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between lg:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
            </div>
          </div>

          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="hidden lg:flex"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
