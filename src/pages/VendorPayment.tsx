import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, CreditCard, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VendorPayment {
  id: string;
  vendorName: string;
  vendorGST: string;
  paidAmount: number;
  paymentDate: string;
  paymentMode: 'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI';
  referenceNo: string;
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const VendorPayment = () => {
  const [payments, setPayments] = useState<VendorPayment[]>([
    {
      id: '1',
      vendorName: 'XYZ Suppliers Ltd',
      vendorGST: '27XYZAB1234C1D6',
      paidAmount: 45000,
      paymentDate: '2024-01-15',
      paymentMode: 'Bank Transfer',
      referenceNo: 'TXN123456789',
      description: 'Payment for Invoice INV-001',
      status: 'Completed'
    },
    {
      id: '2',
      vendorName: 'Global Trading Co',
      vendorGST: '33GLOBA5678T1E9',
      paidAmount: 25000,
      paymentDate: '2024-01-16',
      paymentMode: 'Cheque',
      referenceNo: 'CHQ001234',
      description: 'Partial payment for multiple invoices',
      status: 'Completed'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<VendorPayment | null>(null);
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorGST: '',
    paidAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Bank Transfer' as 'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI',
    referenceNo: '',
    description: '',
    status: 'Completed' as 'Completed' | 'Pending' | 'Failed'
  });

  const paymentModes = ['Cash', 'Bank Transfer', 'Cheque', 'UPI'];
  const statusOptions = ['Completed', 'Pending', 'Failed'];

  const filteredPayments = payments.filter(payment =>
    payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.vendorGST.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.referenceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPayment) {
      setPayments(payments.map(payment =>
        payment.id === editingPayment.id
          ? { ...payment, ...formData }
          : payment
      ));
      toast({ title: 'Payment updated successfully!' });
    } else {
      const newPayment: VendorPayment = {
        id: Date.now().toString(),
        ...formData
      };
      setPayments([...payments, newPayment]);
      toast({ title: 'Payment recorded successfully!' });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      vendorName: '',
      vendorGST: '',
      paidAmount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Bank Transfer' as 'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI',
      referenceNo: '',
      description: '',
      status: 'Completed' as 'Completed' | 'Pending' | 'Failed'
    });
    setEditingPayment(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (payment: VendorPayment) => {
    setFormData({
      vendorName: payment.vendorName,
      vendorGST: payment.vendorGST,
      paidAmount: payment.paidAmount,
      paymentDate: payment.paymentDate,
      paymentMode: payment.paymentMode,
      referenceNo: payment.referenceNo,
      description: payment.description,
      status: payment.status
    });
    setEditingPayment(payment);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
    toast({ title: 'Payment record deleted successfully!' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPaid = filteredPayments.reduce((sum, payment) => sum + payment.paidAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">Vendor Payment</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPayment ? 'Edit Payment' : 'Record New Payment'}
              </DialogTitle>
              <DialogDescription>
                Enter payment details for vendor
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendorName">Vendor Name *</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vendorGST">Vendor GST No</Label>
                  <Input
                    id="vendorGST"
                    value={formData.vendorGST}
                    onChange={(e) => setFormData({...formData, vendorGST: e.target.value.toUpperCase()})}
                    placeholder="27ABCDE1234F1Z5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paidAmount">Paid Amount *</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    step="0.01"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({...formData, paidAmount: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="paymentDate">Payment Date *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentMode">Payment Mode *</Label>
                  <Select value={formData.paymentMode} onValueChange={(value: any) => setFormData({...formData, paymentMode: value})}>
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
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="referenceNo">Reference/Transaction No</Label>
                <Input
                  id="referenceNo"
                  value={formData.referenceNo}
                  onChange={(e) => setFormData({...formData, referenceNo: e.target.value})}
                  placeholder="TXN123456789 / CHQ001234"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Payment description"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPayment ? 'Update' : 'Record'} Payment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredPayments.length}
              </div>
              <p className="text-sm text-gray-600">Total Payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ₹{totalPaid.toLocaleString('en-IN')}
              </div>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredPayments.filter(p => p.status === 'Completed').length}
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredPayments.filter(p => p.status === 'Pending').length}
              </div>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Track all vendor payments and their status
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by vendor name, GST, or reference number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>GST No</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Reference No</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{payment.vendorName}</div>
                        {payment.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {payment.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{payment.vendorGST || '-'}</TableCell>
                    <TableCell className="font-semibold">₹{payment.paidAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(payment.paymentDate).toLocaleDateString('en-IN')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{payment.paymentMode}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.referenceNo || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(payment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(payment.id)}
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
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payment records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorPayment;
