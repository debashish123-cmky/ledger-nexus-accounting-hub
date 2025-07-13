
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StockItem {
  id: string;
  companyName: string;
  productName: string;
  hsnCode: string;
  rackNo: string;
  qty: number;
  unit: string;
  batchNo: string;
  expDate: string;
  purchaseRate: number;
  salesRate: number;
  gstPercent: number;
  minStockLevel: number;
  maxStockLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
}

const StockManagement = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      companyName: 'ABC Pharma',
      productName: 'Paracetamol 500mg',
      hsnCode: '30041000',
      rackNo: 'A-01-05',
      qty: 250,
      unit: 'Tablets',
      batchNo: 'BAT001',
      expDate: '2025-12-31',
      purchaseRate: 2.50,
      salesRate: 4.00,
      gstPercent: 12,
      minStockLevel: 50,
      maxStockLevel: 500,
      status: 'In Stock'
    },
    {
      id: '2',
      companyName: 'XYZ Medicines',
      productName: 'Vitamin D3 Capsules',
      hsnCode: '30041020',
      rackNo: 'B-02-10',
      qty: 25,
      unit: 'Capsules',
      batchNo: 'BAT002',
      expDate: '2024-06-30',
      purchaseRate: 15.00,
      salesRate: 25.00,
      gstPercent: 18,
      minStockLevel: 30,
      maxStockLevel: 200,
      status: 'Low Stock'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    productName: '',
    hsnCode: '',
    rackNo: '',
    qty: 0,
    unit: 'Pcs',
    batchNo: '',
    expDate: '',
    purchaseRate: 0,
    salesRate: 0,
    gstPercent: 18,
    minStockLevel: 10,
    maxStockLevel: 100
  });

  const units = ['Pcs', 'Tablets', 'Capsules', 'Bottles', 'Kg', 'Ltr', 'Box', 'Pack'];

  const getStockStatus = (item: StockItem): StockItem['status'] => {
    const today = new Date();
    const expDate = new Date(item.expDate);
    
    if (expDate < today) return 'Expired';
    if (item.qty === 0) return 'Out of Stock';
    if (item.qty <= item.minStockLevel) return 'Low Stock';
    return 'In Stock';
  };

  const filteredItems = stockItems.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hsnCode.includes(searchTerm) ||
    item.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(item => ({
    ...item,
    status: getStockStatus(item)
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setStockItems(stockItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, status: getStockStatus({ ...item, ...formData }) }
          : item
      ));
      toast({ title: 'Stock item updated successfully!' });
    } else {
      const newItem: StockItem = {
        id: Date.now().toString(),
        ...formData,
        status: getStockStatus({ ...formData } as StockItem)
      };
      setStockItems([...stockItems, newItem]);
      toast({ title: 'Stock item added successfully!' });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      productName: '',
      hsnCode: '',
      rackNo: '',
      qty: 0,
      unit: 'Pcs',
      batchNo: '',
      expDate: '',
      purchaseRate: 0,
      salesRate: 0,
      gstPercent: 18,
      minStockLevel: 10,
      maxStockLevel: 100
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: StockItem) => {
    setFormData({
      companyName: item.companyName,
      productName: item.productName,
      hsnCode: item.hsnCode,
      rackNo: item.rackNo,
      qty: item.qty,
      unit: item.unit,
      batchNo: item.batchNo,
      expDate: item.expDate,
      purchaseRate: item.purchaseRate,
      salesRate: item.salesRate,
      gstPercent: item.gstPercent,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setStockItems(stockItems.filter(item => item.id !== id));
    toast({ title: 'Stock item deleted successfully!' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      case 'Expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stockSummary = {
    total: filteredItems.length,
    inStock: filteredItems.filter(item => item.status === 'In Stock').length,
    lowStock: filteredItems.filter(item => item.status === 'Low Stock').length,
    outOfStock: filteredItems.filter(item => item.status === 'Out of Stock').length,
    expired: filteredItems.filter(item => item.status === 'Expired').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Stock Management</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Stock Item' : 'Add New Stock Item'}
              </DialogTitle>
              <DialogDescription>
                Enter stock item details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hsnCode">HSN Code *</Label>
                  <Input
                    id="hsnCode"
                    value={formData.hsnCode}
                    onChange={(e) => setFormData({...formData, hsnCode: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rackNo">Rack No</Label>
                  <Input
                    id="rackNo"
                    value={formData.rackNo}
                    onChange={(e) => setFormData({...formData, rackNo: e.target.value})}
                    placeholder="A-01-05"
                  />
                </div>
                <div>
                  <Label htmlFor="batchNo">Batch No</Label>
                  <Input
                    id="batchNo"
                    value={formData.batchNo}
                    onChange={(e) => setFormData({...formData, batchNo: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="qty">Quantity *</Label>
                  <Input
                    id="qty"
                    type="number"
                    value={formData.qty}
                    onChange={(e) => setFormData({...formData, qty: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="expDate">Expiry Date</Label>
                  <Input
                    id="expDate"
                    type="date"
                    value={formData.expDate}
                    onChange={(e) => setFormData({...formData, expDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="purchaseRate">Purchase Rate *</Label>
                  <Input
                    id="purchaseRate"
                    type="number"
                    step="0.01"
                    value={formData.purchaseRate}
                    onChange={(e) => setFormData({...formData, purchaseRate: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="salesRate">Sales Rate *</Label>
                  <Input
                    id="salesRate"
                    type="number"
                    step="0.01"
                    value={formData.salesRate}
                    onChange={(e) => setFormData({...formData, salesRate: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gstPercent">GST% *</Label>
                  <Input
                    id="gstPercent"
                    type="number"
                    value={formData.gstPercent}
                    onChange={(e) => setFormData({...formData, gstPercent: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStockLevel">Min Stock Level</Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({...formData, minStockLevel: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                  <Input
                    id="maxStockLevel"
                    type="number"
                    value={formData.maxStockLevel}
                    onChange={(e) => setFormData({...formData, maxStockLevel: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Add'} Stock Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stockSummary.total}</div>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stockSummary.inStock}</div>
              <p className="text-sm text-gray-600">In Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stockSummary.lowStock}</div>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stockSummary.outOfStock}</div>
              <p className="text-sm text-gray-600">Out of Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stockSummary.expired}</div>
              <p className="text-sm text-gray-600">Expired</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Inventory</CardTitle>
          <CardDescription>
            Manage your stock items and track inventory levels
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by product name, company, HSN code, or batch number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Details</TableHead>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Batch Info</TableHead>
                  <TableHead>Rates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-500">{item.companyName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.hsnCode}</TableCell>
                    <TableCell>{item.rackNo || '-'}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{item.qty} {item.unit}</div>
                        <div className="text-xs text-gray-500">
                          Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{item.batchNo || '-'}</div>
                        <div className="text-xs text-gray-500">
                          {item.expDate ? `Exp: ${new Date(item.expDate).toLocaleDateString('en-IN')}` : '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">P: ₹{item.purchaseRate}</div>
                        <div className="text-sm">S: ₹{item.salesRate}</div>
                        <div className="text-xs text-gray-500">GST: {item.gstPercent}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No stock items found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockManagement;
