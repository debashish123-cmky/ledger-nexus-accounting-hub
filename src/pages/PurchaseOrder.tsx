
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save, Calculator, Receipt } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  companyName: string;
  description: string;
  qty: number;
  unit: string;
  price: number;
  taxableAmount: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
}

const PurchaseOrder = () => {
  const [orderData, setOrderData] = useState({
    orderNo: 'MRR/25-26/45',
    clientName: '',
    clientPhone: '',
    gstNo: '',
    state: '',
    reference: '',
    discountPercent: 0,
    discountAmount: 0,
    receivedPayment: 0,
    paymentMode: 'Cash'
  });

  const [items, setItems] = useState<OrderItem[]>([
    {
      id: '1',
      companyName: '',
      description: '',
      qty: 0,
      unit: 'Pcs',
      price: 0,
      taxableAmount: 0,
      gstPercent: 18,
      gstAmount: 0,
      total: 0
    }
  ]);

  const units = ['Pcs', 'Kg', 'Ltr', 'Box', 'Pack', 'Meter'];
  const gstRates = [0, 5, 12, 18, 28];
  const paymentModes = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'];

  const calculateItemValues = (item: OrderItem): OrderItem => {
    const taxableAmount = item.qty * item.price;
    const gstAmount = (taxableAmount * item.gstPercent) / 100;
    const total = taxableAmount + gstAmount;

    return {
      ...item,
      taxableAmount,
      gstAmount,
      total
    };
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        return calculateItemValues(updatedItem);
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      companyName: '',
      description: '',
      qty: 0,
      unit: 'Pcs',
      price: 0,
      taxableAmount: 0,
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
    const subtotal = items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalGST = items.reduce((sum, item) => sum + item.gstAmount, 0);
    const grandTotal = items.reduce((sum, item) => sum + item.total, 0);
    
    // Apply discount
    const discountAmount = orderData.discountPercent > 0 
      ? (grandTotal * orderData.discountPercent) / 100 
      : orderData.discountAmount;
    
    const totalPayable = grandTotal - discountAmount;
    const totalReturn = orderData.receivedPayment - totalPayable;

    return { 
      subtotal, 
      totalGST, 
      grandTotal, 
      discountAmount, 
      totalPayable, 
      totalReturn: Math.max(0, totalReturn),
      balanceDue: Math.max(0, totalPayable - orderData.receivedPayment)
    };
  };

  const handleSave = () => {
    const totals = calculateTotals();
    
    const purchaseOrderData = {
      order: orderData,
      items,
      totals,
      createdAt: new Date().toISOString()
    };

    console.log('Purchase Order Saved:', purchaseOrderData);
    toast({ title: 'Purchase order saved successfully!' });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Receipt className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Purchase Order</h2>
        </div>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Order
        </Button>
      </div>

      {/* Order Header */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Enter order and client information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="orderNo">Order No *</Label>
              <Input
                id="orderNo"
                value={orderData.orderNo}
                onChange={(e) => setOrderData({...orderData, orderNo: e.target.value})}
                placeholder="MRR/25-26/45"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={orderData.clientName}
                onChange={(e) => setOrderData({...orderData, clientName: e.target.value})}
                placeholder="Enter client name"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Client Phone *</Label>
              <Input
                id="clientPhone"
                value={orderData.clientPhone}
                onChange={(e) => setOrderData({...orderData, clientPhone: e.target.value})}
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="gstNo">GST No</Label>
              <Input
                id="gstNo"
                value={orderData.gstNo}
                onChange={(e) => setOrderData({...orderData, gstNo: e.target.value.toUpperCase()})}
                placeholder="27ABCDE1234F1Z5"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={orderData.state}
                onChange={(e) => setOrderData({...orderData, state: e.target.value})}
                placeholder="Maharashtra"
              />
            </div>
            <div>
              <Label htmlFor="reference">Reference (if any)</Label>
              <Input
                id="reference"
                value={orderData.reference}
                onChange={(e) => setOrderData({...orderData, reference: e.target.value})}
                placeholder="Reference details"
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
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Add items to the purchase order</CardDescription>
            </div>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Company Name</TableHead>
                  <TableHead className="min-w-[150px]">Description</TableHead>
                  <TableHead className="min-w-[60px]">Qty</TableHead>
                  <TableHead className="min-w-[60px]">Unit</TableHead>
                  <TableHead className="min-w-[80px]">Price</TableHead>
                  <TableHead className="min-w-[80px]">Taxable Amt</TableHead>
                  <TableHead className="min-w-[60px]">GST%</TableHead>
                  <TableHead className="min-w-[80px]">GST Amt</TableHead>
                  <TableHead className="min-w-[80px]">Total</TableHead>
                  <TableHead className="min-w-[60px]">Action</TableHead>
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
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                        className="min-w-[50px]"
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
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="min-w-[70px]"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        ₹{item.taxableAmount.toFixed(2)}
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
        </CardContent>
      </Card>

      {/* Payment & Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountPercent">Discount %</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  step="0.01"
                  value={orderData.discountPercent}
                  onChange={(e) => setOrderData({...orderData, discountPercent: parseFloat(e.target.value) || 0, discountAmount: 0})}
                />
              </div>
              <div>
                <Label htmlFor="discountAmount">Discount Amount</Label>
                <Input
                  id="discountAmount"
                  type="number"
                  step="0.01"
                  value={orderData.discountAmount}
                  onChange={(e) => setOrderData({...orderData, discountAmount: parseFloat(e.target.value) || 0, discountPercent: 0})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="receivedPayment">Received Payment</Label>
              <Input
                id="receivedPayment"
                type="number"
                step="0.01"
                value={orderData.receivedPayment}
                onChange={(e) => setOrderData({...orderData, receivedPayment: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select value={orderData.paymentMode} onValueChange={(value) => setOrderData({...orderData, paymentMode: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map(mode => (
                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal (Taxable Amount):</span>
                <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total GST Amount:</span>
                <span className="font-medium">₹{totals.totalGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Grand Total:</span>
                <span className="font-medium">₹{totals.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-medium text-red-600">-₹{totals.discountAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Payable:</span>
                  <span>₹{totals.totalPayable.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Received Payment:</span>
                <span className="font-medium text-green-600">₹{orderData.receivedPayment.toFixed(2)}</span>
              </div>
              {totals.totalReturn > 0 && (
                <div className="flex justify-between">
                  <span>Total Return:</span>
                  <span className="font-medium text-blue-600">₹{totals.totalReturn.toFixed(2)}</span>
                </div>
              )}
              {totals.balanceDue > 0 && (
                <div className="flex justify-between">
                  <span>Balance Due:</span>
                  <span className="font-medium text-red-600">₹{totals.balanceDue.toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseOrder;
