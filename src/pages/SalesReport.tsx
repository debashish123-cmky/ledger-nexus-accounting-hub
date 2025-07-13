
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Eye, Download, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SalesRecord {
  id: string;
  customerName: string;
  phoneNo: string;
  taxableAmt: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  invoices: SalesInvoice[];
}

interface SalesInvoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
}

const SalesReport = () => {
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCustomer, setSelectedCustomer] = useState<SalesRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Empty data array
  const salesRecords: SalesRecord[] = [];

  const calculateTotals = () => {
    const totalTaxable = salesRecords.reduce((sum, record) => sum + record.taxableAmt, 0);
    const totalCGST = salesRecords.reduce((sum, record) => sum + record.cgst, 0);
    const totalSGST = salesRecords.reduce((sum, record) => sum + record.sgst, 0);
    const totalIGST = salesRecords.reduce((sum, record) => sum + record.igst, 0);
    const grandTotal = salesRecords.reduce((sum, record) => sum + record.total, 0);

    return { totalTaxable, totalCGST, totalSGST, totalIGST, grandTotal };
  };

  const handleViewInvoices = (record: SalesRecord) => {
    setSelectedCustomer(record);
    setIsDetailOpen(true);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Customer Name', 'Phone No', 'Taxable Amt', 'CGST', 'SGST', 'IGST', 'Total'],
      ...salesRecords.map(record => [
        record.customerName, record.phoneNo, record.taxableAmt.toString(),
        record.cgst.toString(), record.sgst.toString(), record.igst.toString(), record.total.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${dateFrom}-to-${dateTo}.csv`;
    a.click();
    toast({ title: 'Sales report exported successfully!' });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">Sales Report</h2>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Date Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹{totals.totalTaxable.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">Taxable Amount</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{totals.totalCGST.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">CGST</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{totals.totalSGST.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">SGST</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹{totals.totalIGST.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">IGST</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">₹{totals.grandTotal.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">Grand Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Summary</CardTitle>
          <CardDescription>
            Customer-wise sales from {new Date(dateFrom).toLocaleDateString('en-IN')} to {new Date(dateTo).toLocaleDateString('en-IN')} ({salesRecords.length} customers)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone No</TableHead>
                  <TableHead>Taxable Amt</TableHead>
                  <TableHead>CGST</TableHead>
                  <TableHead>SGST</TableHead>
                  <TableHead>IGST</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Invoices</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.customerName}</TableCell>
                    <TableCell>{record.phoneNo}</TableCell>
                    <TableCell>₹{record.taxableAmt.toLocaleString('en-IN')}</TableCell>
                    <TableCell className={record.cgst > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      ₹{record.cgst.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className={record.sgst > 0 ? 'text-purple-600 font-medium' : 'text-gray-400'}>
                      ₹{record.sgst.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className={record.igst > 0 ? 'text-orange-600 font-medium' : 'text-gray-400'}>
                      ₹{record.igst.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="font-bold">₹{record.total.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.invoices.length} invoices</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewInvoices(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {salesRecords.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sales records found for the selected date range</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Invoice Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Details - {selectedCustomer?.customerName}</DialogTitle>
            <DialogDescription>
              All invoices for this customer
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p><strong>Customer:</strong> {selectedCustomer.customerName}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phoneNo}</p>
                </div>
                <div>
                  <p><strong>Total Sales:</strong> ₹{selectedCustomer.total.toLocaleString('en-IN')}</p>
                  <p><strong>Number of Invoices:</strong> {selectedCustomer.invoices.length}</p>
                </div>
              </div>

              {/* Invoices Table */}
              <div>
                <h4 className="font-semibold mb-2">Invoice List</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCustomer.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                        <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(invoice.paymentStatus)}>
                            {invoice.paymentStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Tax Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
                <div>
                  <p><strong>Taxable Amount:</strong> ₹{selectedCustomer.taxableAmt.toLocaleString('en-IN')}</p>
                  <p><strong>CGST:</strong> ₹{selectedCustomer.cgst.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p><strong>SGST:</strong> ₹{selectedCustomer.sgst.toLocaleString('en-IN')}</p>
                  <p><strong>IGST:</strong> ₹{selectedCustomer.igst.toLocaleString('en-IN')}</p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <p className="text-lg font-bold"><strong>Total Sales:</strong> ₹{selectedCustomer.total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Total Summary */}
      {salesRecords.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-green-600">Taxable Amount</p>
                <p className="font-bold text-green-800">₹{totals.totalTaxable.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">CGST</p>
                <p className="font-bold text-green-800">₹{totals.totalCGST.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">SGST</p>
                <p className="font-bold text-green-800">₹{totals.totalSGST.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">IGST</p>
                <p className="font-bold text-green-800">₹{totals.totalIGST.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Grand Total</p>
                <p className="text-xl font-bold text-green-800">₹{totals.grandTotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesReport;
