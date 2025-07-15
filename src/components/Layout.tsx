
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Building2, Users, Truck, ShoppingCart, FileText, Receipt,
  CreditCard, Package, AlertTriangle, TrendingUp, BarChart3,
  BookOpen, Menu, LogOut, Home, User, Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, nameKey: 'dashboard' },
  { name: 'Client Management', href: '/clients', icon: Users, nameKey: 'clients' },
  { name: 'Vendor Management', href: '/vendors', icon: Truck, nameKey: 'vendors' },
  { name: 'Purchase Entry', href: '/purchase-entry', icon: ShoppingCart, nameKey: 'purchaseEntry' },
  { name: 'Invoice Reprint', href: '/invoice-reprint', icon: FileText, nameKey: 'invoiceReprint' },
  { name: 'Purchase Order', href: '/purchase-order', icon: Receipt, nameKey: 'purchaseOrder' },
  { name: 'Vendor Payment', href: '/vendor-payment', icon: CreditCard, nameKey: 'vendorPayment' },
  { name: 'Stock Management', href: '/stock-management', icon: Package, nameKey: 'stockManagement' },
  { name: 'Stock Expiry', href: '/stock-expiry', icon: AlertTriangle, nameKey: 'stockExpiry' },
  { name: "Today's Collection", href: '/todays-collection', icon: TrendingUp, nameKey: 'todaysCollection' },
  { name: 'Purchase Report', href: '/purchase-report', icon: BarChart3, nameKey: 'purchaseReport' },
  { name: 'Sales Report', href: '/sales-report', icon: BarChart3, nameKey: 'salesReport' },
  { name: 'Ledger View', href: '/ledger-view', icon: BookOpen, nameKey: 'ledgerView' },
  { name: 'Settings', href: '/settings', icon: Settings, nameKey: 'settings' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useSettings();

  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="flex items-center gap-2 p-6 border-b flex-shrink-0">
        <Building2 className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Accounting Pro</h2>
          <p className="text-xs text-muted-foreground">Management System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 p-4">
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
                  ? 'bg-primary text-primary-foreground border-r-2 border-primary'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {t(item.nameKey)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 flex-shrink-0 bg-card">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="w-full justify-start text-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t('logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Fixed positioning */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content - Properly positioned */}
      <div className="flex flex-col flex-1 lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="bg-card shadow-sm border-b px-4 py-3 flex items-center justify-between lg:px-6 sticky top-0 z-40">
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
              <h1 className="text-xl font-semibold text-foreground">
                {t(navigation.find(item => isActive(item.href))?.nameKey || 'dashboard')}
              </h1>
              <p className="text-sm text-muted-foreground">{t('welcomeBack')}, {user?.name}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
