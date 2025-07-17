
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save, Calculator, ShoppingCart, Printer } from 'lucide-react';
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

const PurchaseEntry = () => {
  const { addPurchaseRecord } = usePurchase();
  
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    vendorName: '',
    vendorAddress: '',
    vendorPhone: '',
    vendorGSTIN: '',
    vendorPAN: '',
    vendorEmail: '',
    vendorState: ''
  });

  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: '1',
      companyName: '',
      description: '',
      hsnNo: '',
      batchNo: '',
      expDate: '',
      qty: 0,
      unit: 'Pcs',
      freeQty: 0,
      noOfPc: 1,
      rate: 0,
      salesRate: 0,
      taxableValue: 0,
      gstPercent: 18,
      gstAmount: 0,
      total: 0
    }
  ]);

  const units = ['Pcs', 'Kg', 'Ltr', 'Box', 'Pack', 'Meter'];
  const gstRates = [0, 5, 12, 18, 28];

  const calculateItemValues = (item: PurchaseItem): PurchaseItem => {
    const taxableValue = item.qty * item.rate;
    const gstAmount = (taxableValue * item.gstPercent) / 100;
    const total = taxableValue + gstAmount;

    return {
      ...item,
      taxableValue,
      gstAmount,
      total
    };
  };

  const updateItem = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        return calculateItemValues(updatedItem);
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      companyName: '',
      description: '',
      hsnNo: '',
      batchNo: '',
      expDate: '',
      qty: 0,
      unit: 'Pcs',
      freeQty: 0,
      noOfPc: 1,
      rate: 0,
      salesRate: 0,
      taxableValue: 0,
      gstPercent: 18,
      gstAmount: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalGST = items.reduce((sum, item) => sum + item.gstAmount, 0);
    const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

    return { subtotal, totalGST, grandTotal };
  };

  const handleSave = () => {
    // Validation
    if (!invoiceData.invoiceNo || !invoiceData.vendorName) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please fill in required fields (Invoice No and Vendor Name)',
        variant: 'destructive'
      });
      return;
    }

    const { subtotal, totalGST, grandTotal } = calculateTotals();
    
    // Calculate GST breakdown based on vendor state
    const isIntraState = invoiceData.vendorState.toLowerCase() === 'your-state';
    const cgst = isIntraState ? totalGST / 2 : 0;
    const sgst = isIntraState ? totalGST / 2 : 0;
    const igst = isIntraState ? 0 : totalGST;

    // Create purchase record with the correct item structure
    const purchaseRecord = {
      id: Date.now().toString(),
      invoiceNo: invoiceData.invoiceNo,
      invoiceDate: invoiceData.invoiceDate,
      vendorName: invoiceData.vendorName,
      vendorGST: invoiceData.vendorGSTIN,
      state: invoiceData.vendorState,
      taxableAmt: subtotal,
      cgst,
      sgst,
      igst,
      total: grandTotal,
      items: items
    };

    // Add to context
    addPurchaseRecord(purchaseRecord);

    console.log('Purchase Entry Saved:', purchaseRecord);
    toast({ title: 'Purchase entry saved successfully!' });

    // Reset form
    setInvoiceData({
      invoiceNo: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      vendorName: '',
      vendorAddress: '',
      vendorPhone: '',
      vendorGSTIN: '',
      vendorPAN: '',
      vendorEmail: '',
      vendorState: ''
    });
    
    setItems([{
      id: '1',
      companyName: '',
      description: '',
      hsnNo: '',
      batchNo: '',
      expDate: '',
      qty: 0,
      unit: 'Pcs',
      freeQty: 0,
      noOfPc: 1,
      rate: 0,
      salesRate: 0,
      taxableValue: 0,
      gstPercent: 18,
      gstAmount: 0,
      total: 0
    }]);
  };

  const handlePrintInvoice = () => {
    const { subtotal, totalGST, grandTotal } = calculateTotals();
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Purchase Invoice - ${invoiceData.invoiceNo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .vendor-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .totals { margin-top: 20px; text-align: right; }
          .total-row { font-weight: bold; }
          @media print { 
            body { margin: 0; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PURCHASE INVOICE</h1>
          <h2>Invoice No: ${invoiceData.invoiceNo}</h2>
        </div>
        
        <div class="invoice-details">
          <div>
            <strong>Invoice Date:</strong> ${new Date(invoiceData.invoiceDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Generated:</strong> ${new Date().toLocaleString()}
          </div>
        </div>
        
        <div class="vendor-details">
          <h3>Vendor Details:</h3>
          <p><strong>Name:</strong> ${invoiceData.vendorName}</p>
          <p><strong>Address:</strong> ${invoiceData.vendorAddress}</p>
          <p><strong>Phone:</strong> ${invoiceData.vendorPhone}</p>
          <p><strong>GSTIN:</strong> ${invoiceData.vendorGSTIN}</p>
          <p><strong>PAN:</strong> ${invoiceData.vendorPAN}</p>
          <p><strong>Email:</strong> ${invoiceData.vendorEmail}</p>
          <p><strong>State:</strong> ${invoiceData.vendorState}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Company</th>
              <th>Description</th>
              <th>HSN</th>
              <th>Batch</th>
              <th>Exp Date</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Taxable Value</th>
              <th>GST%</th>
              <th>GST Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.companyName}</td>
                <td>${item.description}</td>
                <td>${item.hsnNo}</td>
                <td>${item.batchNo}</td>
                <td>${item.expDate}</td>
                <td>${item.qty}</td>
                <td>${item.unit}</td>
                <td>₹${item.rate.toFixed(2)}</td>
                <td>₹${item.taxableValue.toFixed(2)}</td>
                <td>${item.gstPercent}%</td>
                <td>₹${item.gstAmount.toFixed(2)}</td>
                <td>₹${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Subtotal (Taxable Amount): ₹${subtotal.toFixed(2)}</strong></p>
          <p><strong>Total GST Amount: ₹${totalGST.toFixed(2)}</strong></p>
          <p class="total-row"><strong>Grand Total: ₹${grandTotal.toFixed(2)}</strong></p>
        </div>
        
        <div style="margin-top: 50px;">
          <p><strong>Terms and Conditions:</strong></p>
          <p>1. All goods sold are subject to our standard terms and conditions.</p>
          <p>2. Payment terms: Net 30 days from invoice date.</p>
          <p>3. Please check goods immediately upon receipt.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const { subtotal, totalGST, grandTotal } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Purchase Entry</h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Purchase
          </Button>
        </div>
      </div>

      {/* Invoice Header */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>Enter invoice and vendor information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNo">Invoice No *</Label>
              <Input
                id="invoiceNo"
                value={invoiceData.invoiceNo}
                onChange={(e) => setInvoiceData({...invoiceData, invoiceNo: e.target.value})}
                placeholder="INV-2024-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => setInvoiceData({...invoiceData, invoiceDate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                value={invoiceData.vendorName}
                onChange={(e) => setInvoiceData({...invoiceData, vendorName: e.target.value})}
                placeholder="Select or enter vendor"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="vendorAddress">Vendor Address</Label>
              <Input
                id="vendorAddress"
                value={invoiceData.vendorAddress}
                onChange={(e) => setInvoiceData({...invoiceData, vendorAddress: e.target.value})}
                placeholder="Enter vendor address"
              />
            </div>
            <div>
              <Label htmlFor="vendorPhone">Phone No</Label>
              <Input
                id="vendorPhone"
                value={invoiceData.vendorPhone}
                onChange={(e) => setInvoiceData({...invoiceData, vendorPhone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <Label htmlFor="vendorGSTIN">GSTIN No</Label>
              <Input
                id="vendorGSTIN"
                value={invoiceData.vendorGSTIN}
                onChange={(e) => setInvoiceData({...invoiceData, vendorGSTIN: e.target.value.toUpperCase()})}
                placeholder="Enter GSTIN"
              />
            </div>
            <div>
              <Label htmlFor="vendorPAN">PAN No</Label>
              <Input
                id="vendorPAN"
                value={invoiceData.vendorPAN}
                onChange={(e) => setInvoiceData({...invoiceData, vendorPAN: e.target.value.toUpperCase()})}
                placeholder="Enter PAN"
              />
            </div>
            <div>
              <Label htmlFor="vendorEmail">Email</Label>
              <Input
                id="vendorEmail"
                type="email"
                value={invoiceData.vendorEmail}
                onChange={(e) => setInvoiceData({...invoiceData, vendorEmail: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="vendorState">State</Label>
              <Input
                id="vendorState"
                value={invoiceData.vendorState}
                onChange={(e) => setInvoiceData({...invoiceData, vendorState: e.target.value})}
                placeholder="Enter state"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Purchase Items</CardTitle>
              <CardDescription>Add items to the purchase invoice</CardDescription>
            </div>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[1400px]">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="w-[120px]">Company</TableHead>
                    <TableHead className="w-[150px]">Description</TableHead>
                    <TableHead className="w-[80px]">HSN</TableHead>
                    <TableHead className="w-[80px]">Batch</TableHead>
                    <TableHead className="w-[100px]">Exp Date</TableHead>
                    <TableHead className="w-[60px]">Qty</TableHead>
                    <TableHead className="w-[60px]">Unit</TableHead>
                    <TableHead className="w-[60px]">Free</TableHead>
                    <TableHead className="w-[60px]">Pcs</TableHead>
                    <TableHead className="w-[80px]">Rate</TableHead>
                    <TableHead className="w-[80px]">Sales Rate</TableHead>
                    <TableHead className="w-[80px]">Taxable</TableHead>
                    <TableHead className="w-[60px]">GST%</TableHead>
                    <TableHead className="w-[80px]">GST Amt</TableHead>
                    <TableHead className="w-[80px]">Total</TableHead>
                    <TableHead className="w-[60px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.companyName}
                          onChange={(e) => updateItem(item.id, 'companyName', e.target.value)}
                          className="min-w-[100px]"
                          placeholder="Company"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="min-w-[120px]"
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.hsnNo}
                          onChange={(e) => updateItem(item.id, 'hsnNo', e.target.value)}
                          className="min-w-[70px]"
                          placeholder="HSN"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.batchNo}
                          onChange={(e) => updateItem(item.id, 'batchNo', e.target.value)}
                          className="min-w-[70px]"
                          placeholder="Batch"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={item.expDate}
                          onChange={(e) => updateItem(item.id, 'expDate', e.target.value)}
                          className="min-w-[90px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.qty || ''}
                          onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                          className="min-w-[50px]"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                          <SelectTrigger className="min-w-[50px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map(unit => (
                              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.freeQty || ''}
                          onChange={(e) => updateItem(item.id, 'freeQty', parseFloat(e.target.value) || 0)}
                          className="min-w-[50px]"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.noOfPc || ''}
                          onChange={(e) => updateItem(item.id, 'noOfPc', parseFloat(e.target.value) || 1)}
                          className="min-w-[50px]"
                          placeholder="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.rate || ''}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="min-w-[70px]"
                          placeholder="0.00"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.salesRate || ''}
                          onChange={(e) => updateItem(item.id, 'salesRate', parseFloat(e.target.value) || 0)}
                          className="min-w-[70px]"
                          placeholder="0.00"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          ₹{item.taxableValue.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select value={item.gstPercent.toString()} onValueChange={(value) => updateItem(item.id, 'gstPercent', parseFloat(value))}>
                          <SelectTrigger className="min-w-[50px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {gstRates.map(rate => (
                              <SelectItem key={rate} value={rate.toString()}>{rate}%</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          ₹{item.gstAmount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold">
                          ₹{item.total.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Totals and Print Button */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Invoice Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal (Taxable Amount):</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total GST Amount:</span>
                <span className="font-medium">₹{totalGST.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={handlePrintInvoice} 
                className="w-full"
                variant="outline"
                disabled={!invoiceData.invoiceNo || !invoiceData.vendorName || items.every(item => !item.description)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              <p className="text-sm text-muted-foreground">
                Print a professional invoice with all purchase details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseEntry;
