
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Calendar,
  TrendingUp,
  CreditCard,
  Building2,
  UserPlus,
  Store,
  Receipt,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Truck,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { t } = useSettings();

  const navigation = [
    { name: t('dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('sales'), href: '/sales', icon: ShoppingCart },
    { name: 'Customer Entry', href: '/customer-entry', icon: UserPlus },
    { name: t('purchaseEntry'), href: '/purchase-entry', icon: Package },
    { name: t('purchaseOrder'), href: '/purchase-order', icon: Receipt },
    { name: t('clients'), href: '/clients', icon: Users },
    { name: t('vendors'), href: '/vendors', icon: Building2 },
    { name: 'Stock Management', href: '/stock-management', icon: Store },
    { name: 'Stock Expiry', href: '/stock-expiry', icon: AlertTriangle },
    { name: 'Sales Report', href: '/sales-report', icon: BarChart3 },
    { name: 'Purchase Report', href: '/purchase-report', icon: FileSpreadsheet },
    { name: 'Invoice Reprint', href: '/invoice-reprint', icon: FileText },
    { name: 'Vendor Payment', href: '/vendor-payment', icon: DollarSign },
    { name: "Today's Collection", href: '/todays-collection', icon: TrendingUp },
    { name: 'Ledger View', href: '/ledger-view', icon: CreditCard },
    { name: t('settings'), href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-card border-r">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-foreground">Business Management</h1>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                      )}
                    >
                      <item.icon
                        className="mr-3 h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              {/* User info and logout at bottom */}
              <div className="flex-shrink-0 px-2 pb-4">
                <div className="flex items-center px-2 py-2 text-sm text-muted-foreground">
                  <div className="mr-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.email || 'User'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
