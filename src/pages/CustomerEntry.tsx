
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Phone, Mail, Eye } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import SearchWithVoice from '@/components/SearchWithVoice';

interface CustomerEntry {
  id: string;
  customerName: string;
  phoneNo: string;
  taxableAmt: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  invoices: number;
  createdAt: string;
}

const CustomerEntry = () => {
  const { t } = useSettings();
  const [customers, setCustomers] = useState<CustomerEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerEntry | null>(null);
  const [newCustomer, setNewCustomer] = useState<{
    customerName: string;
    phoneNo: string;
    taxableAmt: string;
    cgst: string;
    sgst: string;
    igst: string;
  }>({
    customerName: '',
    phoneNo: '',
    taxableAmt: '',
    cgst: '',
    sgst: '',
    igst: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phoneNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    const taxableAmt = parseFloat(newCustomer.taxableAmt) || 0;
    const cgst = parseFloat(newCustomer.cgst) || 0;
    const sgst = parseFloat(newCustomer.sgst) || 0;
    const igst = parseFloat(newCustomer.igst) || 0;
    const total = taxableAmt + cgst + sgst + igst;

    const customerEntry: CustomerEntry = {
      id: Date.now().toString(),
      customerName: newCustomer.customerName,
      phoneNo: newCustomer.phoneNo,
      taxableAmt,
      cgst,
      sgst,
      igst,
      total,
      invoices: 1,
      createdAt: new Date().toISOString()
    };

    setCustomers([...customers, customerEntry]);
    setNewCustomer({
      customerName: '',
      phoneNo: '',
      taxableAmt: '',
      cgst: '',
      sgst: '',
      igst: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditCustomer = (customer: CustomerEntry) => {
    setEditingCustomer(customer);
    setNewCustomer({
      customerName: customer.customerName,
      phoneNo: customer.phoneNo,
      taxableAmt: customer.taxableAmt.toString(),
      cgst: customer.cgst.toString(),
      sgst: customer.sgst.toString(),
      igst: customer.igst.toString()
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return;

    const taxableAmt = parseFloat(newCustomer.taxableAmt) || 0;
    const cgst = parseFloat(newCustomer.cgst) || 0;
    const sgst = parseFloat(newCustomer.sgst) || 0;
    const igst = parseFloat(newCustomer.igst) || 0;
    const total = taxableAmt + cgst + sgst + igst;

    const updatedCustomer: CustomerEntry = {
      ...editingCustomer,
      customerName: newCustomer.customerName,
      phoneNo: newCustomer.phoneNo,
      taxableAmt,
      cgst,
      sgst,
      igst,
      total
    };

    setCustomers(customers.map(c => c.id === editingCustomer.id ? updatedCustomer : c));
    setEditingCustomer(null);
    setNewCustomer({
      customerName: '',
      phoneNo: '',
      taxableAmt: '',
      cgst: '',
      sgst: '',
      igst: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Customer Entry</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingCustomer(null);
            setNewCustomer({
              customerName: '',
              phoneNo: '',
              taxableAmt: '',
              cgst: '',
              sgst: '',
              igst: ''
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
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
                <Label htmlFor="taxableAmt" className="text-right">Taxable Amount</Label>
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
                <Label htmlFor="cgst" className="text-right">CGST</Label>
                <Input 
                  id="cgst" 
                  type="number" 
                  value={newCustomer.cgst} 
                  onChange={(e) => setNewCustomer({ ...newCustomer, cgst: e.target.value })} 
                  className="col-span-3" 
                  placeholder="Enter CGST amount"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sgst" className="text-right">SGST</Label>
                <Input 
                  id="sgst" 
                  type="number" 
                  value={newCustomer.sgst} 
                  onChange={(e) => setNewCustomer({ ...newCustomer, sgst: e.target.value })} 
                  className="col-span-3" 
                  placeholder="Enter SGST amount"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="igst" className="text-right">IGST</Label>
                <Input 
                  id="igst" 
                  type="number" 
                  value={newCustomer.igst} 
                  onChange={(e) => setNewCustomer({ ...newCustomer, igst: e.target.value })} 
                  className="col-span-3" 
                  placeholder="Enter IGST amount"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}>
                {editingCustomer ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchWithVoice
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search customers..."
          className="flex-1"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Customer Name</th>
                  <th className="text-left p-2">Phone No</th>
                  <th className="text-left p-2">Taxable Amt</th>
                  <th className="text-left p-2">CGST</th>
                  <th className="text-left p-2">SGST</th>
                  <th className="text-left p-2">IGST</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Invoices</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{customer.customerName}</td>
                    <td className="p-2">{customer.phoneNo}</td>
                    <td className="p-2">₹{customer.taxableAmt.toLocaleString('en-IN')}</td>
                    <td className="p-2">₹{customer.cgst.toLocaleString('en-IN')}</td>
                    <td className="p-2">₹{customer.sgst.toLocaleString('en-IN')}</td>
                    <td className="p-2">₹{customer.igst.toLocaleString('en-IN')}</td>
                    <td className="p-2 font-bold">₹{customer.total.toLocaleString('en-IN')}</td>
                    <td className="p-2">
                      <Badge variant="secondary">{customer.invoices}</Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCustomer(customer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteCustomer(customer.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No customers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerEntry;
