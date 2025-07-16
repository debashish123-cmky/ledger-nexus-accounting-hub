
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Users, TrendingUp, DollarSign, Plus, Edit, Trash2, Download, FileText, BarChart3 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import VoiceToText from '@/components/VoiceToText';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const SalesPage = () => {
  const { language } = useSettings();
  const { sales, products, customers, addSale, updateSale, deleteSale, addCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showSalesReport, setShowSalesReport] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [newSale, setNewSale] = useState({
    customer: '',
    amount: '',
    status: 'Pending' as 'Completed' | 'Pending' | 'Processing'
  });
  const [newCustomer, setNewCustomer] = useState({
    customerName: '',
    phoneNo: '',
    taxableAmt: '',
    cgst: '',
    sgst: '',
    igst: '',
    total: '',
    invoices: ''
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

  // Generate chart data for sales report
  const chartData = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 19000 },
    { month: 'Mar', sales: 15000 },
    { month: 'Apr', sales: 25000 },
    { month: 'May', sales: 22000 },
    { month: 'Jun', sales: 30000 },
  ];

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

  const handleAddCustomer = () => {
    const customer = {
      id: Date.now().toString(),
      customerName: newCustomer.customerName,
      phoneNo: newCustomer.phoneNo,
      taxableAmt: parseFloat(newCustomer.taxableAmt) || 0,
      cgst: parseFloat(newCustomer.cgst) || 0,
      sgst: parseFloat(newCustomer.sgst) || 0,
      igst: parseFloat(newCustomer.igst) || 0,
      total: parseFloat(newCustomer.total) || 0,
      invoices: parseInt(newCustomer.invoices) || 0,
      createdAt: new Date().toISOString()
    };

    addCustomer(customer);
    setNewCustomer({
      customerName: '',
      phoneNo: '',
      taxableAmt: '',
      cgst: '',
      sgst: '',
      igst: '',
      total: '',
      invoices: ''
    });
    setIsNewCustomerOpen(false);
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

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Customer,Amount,Status,Date\n" +
      sales.map(sale => 
        `${sale.customer},${sale.amount},${sale.status},${sale.date}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sales Report View
  if (showSalesReport) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowSalesReport(false)}>← Back</Button>
          <h2 className="text-2xl font-bold">Sales Report</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
            <CardDescription>Sales performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Customer List View
  if (showCustomerList) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowCustomerList(false)}>← Back</Button>
            <h2 className="text-2xl font-bold">All Customers</h2>
          </div>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="grid gap-4">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Customer Name</p>
                    <p className="text-muted-foreground">{customer.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-muted-foreground">{customer.phoneNo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-muted-foreground">₹{customer.total.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No customers found.</p>
          </div>
        )}
      </div>
    );
  }

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
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
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
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
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
            <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-20 flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  New Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customerName" className="text-right">Customer Name</Label>
                    <Input 
                      id="customerName" 
                      value={newCustomer.customerName} 
                      onChange={(e) => setNewCustomer({ ...newCustomer, customerName: e.target.value })} 
                      className="col-span-3" 
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phoneNo" className="text-right">Phone No</Label>
                    <Input 
                      id="phoneNo" 
                      value={newCustomer.phoneNo} 
                      onChange={(e) => setNewCustomer({ ...newCustomer, phoneNo: e.target.value })} 
                      className="col-span-3" 
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="taxableAmt" className="text-right">Taxable Amt</Label>
                    <Input 
                      id="taxableAmt" 
                      type="number"
                      value={newCustomer.taxableAmt} 
                      onChange={(e) => setNewCustomer({ ...newCustomer, taxableAmt: e.target.value })} 
                      className="col-span-3" 
                      placeholder="Enter taxable amount"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="total" className="text-right">Total</Label>
                    <Input 
                      id="total" 
                      type="number"
                      value={newCustomer.total} 
                      onChange={(e) => setNewCustomer({ ...newCustomer, total: e.target.value })} 
                      className="col-span-3" 
                      placeholder="Enter total amount"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setIsNewCustomerOpen(false)}>Cancel</Button>
                  <Button type="submit" onClick={handleAddCustomer}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setShowSalesReport(true)}>
              <BarChart3 className="h-6 w-6 mb-2" />
              Sales Report
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setShowCustomerList(true)}>
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
