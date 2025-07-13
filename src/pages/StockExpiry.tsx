
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, AlertTriangle, Calendar, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExpiryItem {
  id: string;
  productName: string;
  hsnCode: string;
  qty: number;
  unit: string;
  batchNo: string;
  expDate: string;
  rate: number;
  gstPercent: number;
  invoiceDate: string;
  daysToExpiry: number;
  status: 'Expired' | 'Expiring Soon' | 'Near Expiry';
}

const StockExpiry = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Empty data array
  const expiryItems: ExpiryItem[] = [];

  const calculateDaysToExpiry = (expDate: string): number => {
    const today = new Date();
    const expiry = new Date(expDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (daysToExpiry: number): ExpiryItem['status'] => {
    if (daysToExpiry < 0) return 'Expired';
    if (daysToExpiry <= 30) return 'Expiring Soon';
    if (daysToExpiry <= 90) return 'Near Expiry';
    return 'Expiring Soon';
  };

  const filteredItems = expiryItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.hsnCode.includes(searchTerm) ||
                         item.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && item.status.toLowerCase().replace(' ', '') === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Expiring Soon': return 'bg-orange-100 text-orange-800';
      case 'Near Expiry': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Product Name', 'HSN Code', 'Qty', 'Unit', 'Batch No', 'Exp Date', 'Rate', 'GST%', 'Invoice Date', 'Days to Expiry', 'Status'],
      ...filteredItems.map(item => [
        item.productName, item.hsnCode, item.qty.toString(), item.unit, item.batchNo, 
        item.expDate, item.rate.toString(), item.gstPercent.toString(), 
        item.invoiceDate, item.daysToExpiry.toString(), item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock-expiry-report.csv';
    a.click();
    toast({ title: 'Expiry report exported successfully!' });
  };

  const summary = {
    expired: filteredItems.filter(item => item.status === 'Expired').length,
    expiringSoon: filteredItems.filter(item => item.status === 'Expiring Soon').length,
    nearExpiry: filteredItems.filter(item => item.status === 'Near Expiry').length,
    totalValue: filteredItems.reduce((sum, item) => sum + (item.qty * item.rate), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold">Stock Expiry Management</h2>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.expired}</div>
              <p className="text-sm text-gray-600">Expired Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{summary.expiringSoon}</div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.nearExpiry}</div>
              <p className="text-sm text-gray-600">Near Expiry</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹{summary.totalValue.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Products</Label>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by product name, HSN code, or batch number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter">Filter by Status</Label>
              <select
                id="filter"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Items</option>
                <option value="expired">Expired</option>
                <option value="expiringsoon">Expiring Soon</option>
                <option value="nearexpiry">Near Expiry</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiry Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Expiry Details</CardTitle>
          <CardDescription>
            Monitor items nearing expiry or already expired ({filteredItems.length} items found)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Batch Details</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Rate & GST</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Days to Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className={item.status === 'Expired' ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="font-mono text-sm">{item.hsnCode}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold">{item.qty}</span>
                        <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Batch: {item.batchNo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(item.expDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>₹{item.rate.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">GST: {item.gstPercent}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(item.invoiceDate).toLocaleDateString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${
                        item.daysToExpiry < 0 ? 'text-red-600' : 
                        item.daysToExpiry <= 30 ? 'text-orange-600' : 'text-yellow-600'
                      }`}>
                        {item.daysToExpiry < 0 ? `${Math.abs(item.daysToExpiry)} days ago` : `${item.daysToExpiry} days`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      {(summary.expired > 0 || summary.expiringSoon > 0) && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-700">Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.expired > 0 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    {summary.expired} items have already expired and need immediate attention
                  </span>
                </div>
              )}
              {summary.expiringSoon > 0 && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    {summary.expiringSoon} items are expiring within 30 days - consider discounting or returning
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockExpiry;
