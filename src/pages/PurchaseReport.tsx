import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Download, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { usePurchase } from '@/contexts/PurchaseContext';

interface PurchaseItem {
  id: string;
  companyName: string;
  description: string;
  hsnNo: string;
  batchNo: string;
  expDate: string;
  qty: number;
  unit: string;
  freeQty: number;
  noOfPc: number;
  rate: number;
  salesRate: number;
  taxableValue: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
}

interface PurchaseRecord {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  vendorName: string;
  vendorGST: string;
  state: string;
  taxableAmt: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  items: PurchaseItem[];
}

const PurchaseReport = () => {
  const { getPurchaseRecords } = usePurchase();
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Get filtered purchase records from context
  const purchaseRecords = getPurchaseRecords(dateFrom, dateTo);

  const calculateTotals = () => {
    const totalTaxable = purchaseRecords.reduce((sum, record) => sum + record.taxableAmt, 0);
    const totalCGST = purchaseRecords.reduce((sum, record) => sum + record.cgst, 0);
    const totalSGST = purchaseRecords.reduce((sum, record) => sum + record.sgst, 0);
    const totalIGST = purchaseRecords.reduce((sum, record) => sum + record.igst, 0);
    const grandTotal = purchaseRecords.reduce((sum, record) => sum + record.total, 0);

    return { totalTaxable, totalCGST, totalSGST, totalIGST, grandTotal };
  };

  const handleViewDetails = (record: PurchaseRecord) => {
    setSelectedPurchase(record);
    setIsDetailOpen(true);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Invoice No', 'Invoice Date', 'Vendor Name', 'GST No', 'State', 'Taxable Amt', 'CGST', 'SGST', 'IGST', 'Total'],
      ...purchaseRecords.map(record => [
        record.invoiceNo, record.invoiceDate, record.vendorName, record.vendorGST, record.state,
        record.taxableAmt.toString(), record.cgst.toString(), record.sgst.toString(), record.igst.toString(), record.total.toString()
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
          <ShoppingCart className="h-6 w-6 text-blue-600" />
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
            Vendor-wise purchases from {new Date(dateFrom).toLocaleDateString('en-IN')} to {new Date(dateTo).toLocaleDateString('en-IN')} ({purchaseRecords.length} invoices)
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
                {purchaseRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.invoiceNo}</TableCell>
                    <TableCell>{new Date(record.invoiceDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>{record.vendorName}</TableCell>
                    <TableCell className="font-mono text-sm">{record.vendorGST}</TableCell>
                    <TableCell>{record.state}</TableCell>
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

          {purchaseRecords.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No purchase records found for the selected date range</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Purchase Details - {selectedPurchase?.invoiceNo}</DialogTitle>
            <DialogDescription>
              Complete breakdown of purchased items
            </DialogDescription>
          </DialogHeader>
          
          {selectedPurchase && (
            <div className="space-y-4">
              {/* Purchase Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p><strong>Invoice No:</strong> {selectedPurchase.invoiceNo}</p>
                  <p><strong>Invoice Date:</strong> {new Date(selectedPurchase.invoiceDate).toLocaleDateString('en-IN')}</p>
                  <p><strong>Vendor:</strong> {selectedPurchase.vendorName}</p>
                </div>
                <div>
                  <p><strong>GST No:</strong> {selectedPurchase.vendorGST}</p>
                  <p><strong>State:</strong> {selectedPurchase.state}</p>
                  <p><strong>Total Amount:</strong> ₹{selectedPurchase.total.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-semibold mb-2">Purchased Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Batch No</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>GST%</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPurchase.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.companyName}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-mono text-sm">{item.hsnNo}</TableCell>
                        <TableCell>{item.batchNo}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>₹{item.rate.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{item.gstPercent}%</TableCell>
                        <TableCell>₹{item.total.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Tax Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <p><strong>Taxable Amount:</strong> ₹{selectedPurchase.taxableAmt.toLocaleString('en-IN')}</p>
                  <p><strong>CGST:</strong> ₹{selectedPurchase.cgst.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p><strong>SGST:</strong> ₹{selectedPurchase.sgst.toLocaleString('en-IN')}</p>
                  <p><strong>IGST:</strong> ₹{selectedPurchase.igst.toLocaleString('en-IN')}</p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <p className="text-lg font-bold"><strong>Total Purchase:</strong> ₹{selectedPurchase.total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Total Summary */}
      {purchaseRecords.length > 0 && (
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
