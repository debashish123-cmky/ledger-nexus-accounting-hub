import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Download, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  name: string;
  address: string;
  panNo: string;
  gstNo: string;
  mobileNo: string;
  state: string;
  paymentDays: number;
  totalPayments: number;
  pendingAmount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'XYZ Suppliers Ltd',
      address: '789 Industrial Area, Pune',
      panNo: 'XYZAB1234C',
      gstNo: '27XYZAB1234C1D6',
      mobileNo: '9876543210',
      state: 'Maharashtra',
      paymentDays: 30,
      totalPayments: 125000,
      pendingAmount: 45000,
      status: 'Active',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'Global Trading Co',
      address: '321 Commerce Street, Chennai',
      panNo: 'GLOBA5678T',
      gstNo: '33GLOBA5678T1E9',
      mobileNo: '9123456789',
      state: 'Tamil Nadu',
      paymentDays: 45,
      totalPayments: 89000,
      pendingAmount: 0,
      status: 'Active',
      createdAt: '2024-01-12'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    panNo: '',
    gstNo: '',
    mobileNo: '',
    state: '',
    paymentDays: 30,
    status: 'Active' as 'Active' | 'Inactive'
  });

  const states = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
    'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
  ];

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.mobileNo.includes(searchTerm) ||
    vendor.gstNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVendor) {
      setVendors(vendors.map(vendor =>
        vendor.id === editingVendor.id
          ? { ...vendor, ...formData }
          : vendor
      ));
      toast({ title: 'Vendor updated successfully!' });
    } else {
      const newVendor: Vendor = {
        id: Date.now().toString(),
        ...formData,
        totalPayments: 0,
        pendingAmount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setVendors([...vendors, newVendor]);
      toast({ title: 'Vendor added successfully!' });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      panNo: '',
      gstNo: '',
      mobileNo: '',
      state: '',
      paymentDays: 30,
      status: 'Active' as 'Active' | 'Inactive'
    });
    setEditingVendor(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (vendor: Vendor) => {
    setFormData({
      name: vendor.name,
      address: vendor.address,
      panNo: vendor.panNo,
      gstNo: vendor.gstNo,
      mobileNo: vendor.mobileNo,
      state: vendor.state,
      paymentDays: vendor.paymentDays,
      status: vendor.status
    });
    setEditingVendor(vendor);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setVendors(vendors.filter(vendor => vendor.id !== id));
    toast({ title: 'Vendor deleted successfully!' });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Address', 'PAN No', 'GST No', 'Mobile No', 'State', 'Payment Days', 'Total Payments', 'Pending Amount', 'Status'],
      ...filteredVendors.map(vendor => [
        vendor.name, vendor.address, vendor.panNo, vendor.gstNo,
        vendor.mobileNo, vendor.state, vendor.paymentDays.toString(),
        vendor.totalPayments.toString(), vendor.pendingAmount.toString(), vendor.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendors.csv';
    a.click();
    toast({ title: 'Vendor data exported successfully!' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Truck className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">Vendor Management</h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the vendor details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Vendor Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="panNo">PAN No *</Label>
                    <Input
                      id="panNo"
                      value={formData.panNo}
                      onChange={(e) => setFormData({...formData, panNo: e.target.value.toUpperCase()})}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gstNo">GST No</Label>
                    <Input
                      id="gstNo"
                      value={formData.gstNo}
                      onChange={(e) => setFormData({...formData, gstNo: e.target.value.toUpperCase()})}
                      placeholder="27ABCDE1234F1Z5"
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="mobileNo">Mobile No *</Label>
                    <Input
                      id="mobileNo"
                      value={formData.mobileNo}
                      onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentDays">Payment Days *</Label>
                    <Input
                      id="paymentDays"
                      type="number"
                      value={formData.paymentDays}
                      onChange={(e) => setFormData({...formData, paymentDays: parseInt(e.target.value) || 0})}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingVendor ? 'Update' : 'Add'} Vendor
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory</CardTitle>
          <CardDescription>
            Manage your vendor database and payment tracking
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vendors by name, mobile, or GST number..."
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
                  <TableHead>Contact</TableHead>
                  <TableHead>GST No</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead>Total Payments</TableHead>
                  <TableHead>Pending Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{vendor.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {vendor.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{vendor.mobileNo}</div>
                        <div className="text-xs text-gray-500">{vendor.state}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{vendor.gstNo || '-'}</TableCell>
                    <TableCell>{vendor.paymentDays} days</TableCell>
                    <TableCell>₹{vendor.totalPayments.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <span className={vendor.pendingAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                        ₹{vendor.pendingAmount.toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(vendor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(vendor.id)}
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
          
          {filteredVendors.length === 0 && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No vendors found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorManagement;
