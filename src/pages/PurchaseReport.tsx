
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Eye, Download, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PurchaseRecord {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  vendorName: string;
  gstNo: string;
  state: string;
  taxableAmt: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  items: PurchaseItem[];
}

interface PurchaseItem {
  id: string;
  productName: string;
  qty: number;
  rate: number;
  taxableAmt: number;
  gstPercent: number;
  gstAmt: number;
  total: number;
}

const PurchaseReport = () => {
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Sample data - would come from database
  const purchaseRecords: PurchaseRecord[] = [
    {
      id: '1',
      invoiceNo: 'PINV-2024-001',
      invoiceDate: '2024-01-15',
      vendorName: 'ABC Suppliers Ltd',
      gstNo: '27ABCDE1234F1Z5',
      state: 'Maharashtra',
      taxableAmt: 50000,
      cgst: 4500,
      sgst: 4500,
      igst: 0,
      total: 59000,
      items: [
        {
          id: '1',
          productName: 'Product A',
          qty: 100,
          rate: 250,
          taxableAmt: 25000,
          gstPercent: 18,
          gstAmt: 4500,
          total: 29500
        },
        {
          id: '2',
          productName: 'Product B',
          qty: 50,
          rate: 500,
          taxableAmt: 25000,
          gstPercent: 18,
          gstAmt: 4500,
          total: 29500
        }
      ]
    },
    {
      id: '2',
      invoiceNo: 'PINV-2024-002',
      invoiceDate: '2024-01-16',
      vendorName: 'XYZ Trading Co',
      gstNo: '33XYZAB5678C1D9',
      state: 'Tamil Nadu',
      taxableAmt: 75000,
      cgst: 0,
      sgst: 0,
      igst: 13500,
      total: 88500,
      items: [
        {
          id: '3',
          productName: 'Product C',
          qty: 150,
          rate: 500,
          taxableAmt: 75000,
          gstPercent: 18,
          gstAmt: 13500,
          total: 88500
        }
      ]
    }
  ];

  const filteredRecords = purchaseRecords.filter(record => 
    record.invoiceDate >= dateFrom && record.invoiceDate <= dateTo
  );

  const calculateTotals = () => {
    const totalTaxable = filteredRecords.reduce((sum, record) => sum + record.taxableAmt, 0);
    const totalCGST = filteredRecords.reduce((sum, record) => sum + record.cgst, 0);
    const totalSGST = filteredRecords.reduce((sum, record) => sum + record.sgst, 0);
    const totalIGST = filteredRecords.reduce((sum, record) => sum + record.igst, 0);
    const grandTotal = filteredRecords.reduce((sum, record) => sum + record.total, 0);

    return { totalTaxable, totalCGST, totalSGST, totalIGST, grandTotal };
  };

  const handleViewDetails = (record: PurchaseRecord) => {
    setSelectedInvoice(record);
    setIsDetailOpen(true);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Invoice No', 'Invoice Date', 'Vendor Name', 'GST No', 'State', 'Taxable Amt', 'CGST', 'SGST', 'IGST', 'Total'],
      ...filteredRecords.map(record => [
        record.invoiceNo, record.invoiceDate, record.vendorName, record.gstNo, record.state,
        record.taxableAmt.toString(), record.cgst.toString(), record.sgst.toString(),
        record.igst.toString(), record.total.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase-report-${dateFrom}-to-${dateTo}.csv`;
    a.click();
    toast({ title: 'Purchase report exported successfully!' });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Purchase Report</h2>
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

      {/* Purchase Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Summary</CardTitle>
          <CardDescription>
            Purchase transactions from {new Date(dateFrom).toLocaleDateString('en-IN')} to {new Date(dateTo).toLocaleDateString('en-IN')} ({filteredRecords.length} records)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>GST No</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Taxable Amt</TableHead>
                  <TableHead>CGST</TableHead>
                  <TableHead>SGST</TableHead>
                  <TableHead>IGST</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.invoiceNo}</TableCell>
                    <TableCell>{new Date(record.invoiceDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>{record.vendorName}</TableCell>
                    <TableCell className="font-mono text-sm">{record.gstNo}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.state}</Badge>
                    </TableCell>
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
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No purchase records found for the selected date range</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Details - {selectedInvoice?.invoiceNo}</DialogTitle>
            <DialogDescription>
              Complete breakdown of purchase invoice
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-4">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p><strong>Vendor:</strong> {selectedInvoice.vendorName}</p>
                  <p><strong>GST No:</strong> {selectedInvoice.gstNo}</p>
                  <p><strong>State:</strong> {selectedInvoice.state}</p>
                </div>
                <div>
                  <p><strong>Invoice Date:</strong> {new Date(selectedInvoice.invoiceDate).toLocaleDateString('en-IN')}</p>
                  <p><strong>Total Amount:</strong> ₹{selectedInvoice.total.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-semibold mb-2">Product Details</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Taxable Amt</TableHead>
                      <TableHead>GST%</TableHead>
                      <TableHead>GST Amt</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>₹{item.rate.toFixed(2)}</TableCell>
                        <TableCell>₹{item.taxableAmt.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{item.gstPercent}%</TableCell>
                        <TableCell>₹{item.gstAmt.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="font-bold">₹{item.total.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <p><strong>Taxable Amount:</strong> ₹{selectedInvoice.taxableAmt.toLocaleString('en-IN')}</p>
                  <p><strong>CGST:</strong> ₹{selectedInvoice.cgst.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p><strong>SGST:</strong> ₹{selectedInvoice.sgst.toLocaleString('en-IN')}</p>
                  <p><strong>IGST:</strong> ₹{selectedInvoice.igst.toLocaleString('en-IN')}</p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <p className="text-lg font-bold"><strong>Grand Total:</strong> ₹{selectedInvoice.total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Total Summary */}
      {filteredRecords.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-blue-600">Taxable Amount</p>
                <p className="font-bold text-blue-800">₹{totals.totalTaxable.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">CGST</p>
                <p className="font-bold text-blue-800">₹{totals.totalCGST.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">SGST</p>
                <p className="font-bold text-blue-800">₹{totals.totalSGST.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">IGST</p>
                <p className="font-bold text-blue-800">₹{totals.totalIGST.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Grand Total</p>
                <p className="text-xl font-bold text-blue-800">₹{totals.grandTotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PurchaseReport;
