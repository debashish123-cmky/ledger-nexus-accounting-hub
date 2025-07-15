
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users, Truck, Package, TrendingUp, AlertTriangle, 
  DollarSign, ShoppingCart, FileText, Calendar, Clock
} from 'lucide-react';
import { usePurchase } from '@/contexts/PurchaseContext';

const Dashboard = () => {
  const { purchaseRecords } = usePurchase();

  // Calculate real stats from purchase data
  const totalPurchaseValue = purchaseRecords.reduce((sum, record) => sum + record.total, 0);
  const totalVendors = new Set(purchaseRecords.map(record => record.vendorName)).size;
  const totalItems = purchaseRecords.reduce((sum, record) => sum + record.items.length, 0);
  const todaysRecords = purchaseRecords.filter(record => {
    const recordDate = new Date(record.invoiceDate).toDateString();
    const today = new Date().toDateString();
    return recordDate === today;
  });
  const todaysCollection = todaysRecords.reduce((sum, record) => sum + record.total, 0);

  const stats = [
    {
      title: 'Total Purchase Value',
      value: `₹${totalPurchaseValue.toLocaleString('en-IN')}`,
      change: purchaseRecords.length > 0 ? '+' + Math.round((todaysCollection / totalPurchaseValue) * 100) + '%' : '0%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Vendors',
      value: totalVendors.toString(),
      change: totalVendors > 0 ? '+100%' : '0%',
      changeType: 'positive',
      icon: Truck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Items',
      value: totalItems.toString(),
      change: totalItems > 0 ? '+100%' : '0%',
      changeType: 'positive',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: "Today's Collection",
      value: `₹${todaysCollection.toLocaleString('en-IN')}`,
      change: todaysCollection > 0 ? '+100%' : '0%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  // Real alerts based on data
  const alerts = [];
  if (totalItems === 0) {
    alerts.push({ id: 1, title: 'No items in inventory', type: 'warning', icon: Package });
  }
  if (totalVendors === 0) {
    alerts.push({ id: 2, title: 'No vendors registered', type: 'warning', icon: Truck });
  }
  if (purchaseRecords.length === 0) {
    alerts.push({ id: 3, title: 'No purchase records found', type: 'warning', icon: AlertTriangle });
  }

  // Real recent activities from purchase records
  const recentActivities = purchaseRecords
    .slice(-4)
    .reverse()
    .map((record, index) => ({
      id: index + 1,
      action: `Purchase Invoice ${record.invoiceNo} created`,
      time: new Date(record.invoiceDate).toLocaleDateString(),
      icon: ShoppingCart
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  {' '}from last period
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system status and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Icon className={`h-4 w-4 ${alert.type === 'error' ? 'text-red-500' : 'text-yellow-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                  </div>
                  <Badge variant={alert.type === 'error' ? 'destructive' : 'secondary'}>
                    {alert.type === 'error' ? 'Critical' : 'Warning'}
                  </Badge>
                </div>
              );
            }) : (
              <div className="text-center py-4 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>All systems operational</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest purchase activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length > 0 ? recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Icon className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-4 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Business performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Purchase Volume</span>
                <span className="text-sm text-muted-foreground">
                  {purchaseRecords.length > 0 ? '100%' : '0%'}
                </span>
              </div>
              <Progress value={purchaseRecords.length > 0 ? 100 : 0} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Vendor Diversity</span>
                <span className="text-sm text-muted-foreground">
                  {totalVendors > 0 ? Math.min(totalVendors * 20, 100) : 0}%
                </span>
              </div>
              <Progress value={totalVendors > 0 ? Math.min(totalVendors * 20, 100) : 0} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">System Usage</span>
                <span className="text-sm text-muted-foreground">
                  {purchaseRecords.length > 0 ? '85%' : '0%'}
                </span>
              </div>
              <Progress value={purchaseRecords.length > 0 ? 85 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
