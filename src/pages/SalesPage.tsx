
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Users, TrendingUp, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import VoiceToText from '@/components/VoiceToText';

const SalesPage = () => {
  const { language } = useSettings();
  const { sales, products, customers, addSale, updateSale, deleteSale, addProduct, updateProduct, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [newSale, setNewSale] = useState({
    customer: '',
    amount: '',
    status: 'Pending' as 'Completed' | 'Pending' | 'Processing'
  });

  // Calculate sales metrics from actual data
  const todaySales = sales
    .filter(sale => new Date(sale.date).toDateString() === new Date().toDateString())
    .reduce((sum, sale) => sum + sale.amount, 0);

  const monthlySales = sales
    .filter(sale => {
      const saleDate = new Date(sale.date);
      const now = new Date();
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, sale) => sum + sale.amount, 0);

  const totalCustomers = customers.length;
  const avgOrderValue = sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.amount, 0) / sales.length : 0;

  const handleVoiceSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleAddSale = () => {
    const sale = {
      id: Date.now().toString(),
      customer: newSale.customer,
      amount: parseFloat(newSale.amount) || 0,
      status: newSale.status,
      date: new Date().toISOString()
    };

    if (editingSale) {
      updateSale(editingSale.id, sale);
      setEditingSale(null);
    } else {
      addSale(sale);
    }

    setNewSale({ customer: '', amount: '', status: 'Pending' });
    setIsNewSaleOpen(false);
  };

  const handleEditSale = (sale: any) => {
    setEditingSale(sale);
    setNewSale({
      customer: sale.customer,
      amount: sale.amount.toString(),
      status: sale.status
    });
    setIsNewSaleOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">Sales Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <VoiceToText 
              onTranscript={handleVoiceSearch}
              language={language}
              placeholder="Search with voice"
            />
          </div>
          <Dialog open={isNewSaleOpen} onOpenChange={(open) => {
            setIsNewSaleOpen(open);
            if (!open) {
              setEditingSale(null);
              setNewSale({ customer: '', amount: '', status: 'Pending' });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSale ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">Customer</Label>
                  <Input 
                    id="customer" 
                    value={newSale.customer} 
                    onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">Amount</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    value={newSale.amount} 
                    onChange={(e) => setNewSale({ ...newSale, amount: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsNewSaleOpen(false)}>Cancel</Button>
                <Button type="submit" onClick={handleAddSale}>
                  {editingSale ? 'Update' : 'Save'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todaySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Real-time data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{Math.round(avgOrderValue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average per sale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest customer transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sales.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No sales recorded yet</p>
              ) : (
                sales.slice(-5).reverse().map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">{sale.customer}</div>
                      <div className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="font-bold">₹{sale.amount}</div>
                      <Badge className={getStatusColor(sale.status)}>
                        {sale.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditSale(sale)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteSale(sale.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products added yet</p>
              ) : (
                products.slice(0, 4).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sales} units sold</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold">₹{product.revenue.toLocaleString()}</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => {/* Add edit product logic */}}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used sales operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              New Customer
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ShoppingCart className="h-6 w-6 mb-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Sales Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Customer List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;
