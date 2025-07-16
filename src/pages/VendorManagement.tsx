
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Download, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';
import SearchWithVoice from '@/components/SearchWithVoice';

const VendorManagement = () => {
  const { t } = useSettings();
  const { vendors, addVendor, updateVendor, deleteVendor } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [showVendorList, setShowVendorList] = useState(false);
  const [newVendor, setNewVendor] = useState<{
    vendorNumber: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    gstNumber: string;
    status: 'active' | 'inactive';
    category: string;
  }>({
    vendorNumber: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: '',
    status: 'active',
    category: ''
  });

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.vendorNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const totalSupplied = vendors.reduce((sum, vendor) => sum + vendor.totalSupplied, 0);

  const handleAddVendor = () => {
    const newId = Date.now().toString();
    const vendorData = { 
      id: newId, 
      ...newVendor, 
      totalSupplied: 0, 
      lastSupply: 'N/A',
      createdAt: new Date().toISOString()
    };
    addVendor(vendorData);
    resetForm();
  };

  const handleEditVendor = (vendor: any) => {
    setEditingVendor(vendor);
    setNewVendor({
      vendorNumber: vendor.vendorNumber,
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      gstNumber: vendor.gstNumber,
      status: vendor.status,
      category: vendor.category
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateVendor = () => {
    if (!editingVendor) return;
    
    const updatedVendor = {
      ...editingVendor,
      ...newVendor
    };
    
    updateVendor(editingVendor.id, updatedVendor);
    resetForm();
  };

  const resetForm = () => {
    setNewVendor({ 
      vendorNumber: '',
      name: '', 
      email: '', 
      phone: '', 
      address: '', 
      gstNumber: '', 
      status: 'active', 
      category: '' 
    });
    setEditingVendor(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteVendor = (id: string) => {
    deleteVendor(id);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Vendor Number,Name,Email,Phone,Address,GST Number,Category,Status,Total Supplied,Last Supply\n" +
      vendors.map(vendor => 
        `${vendor.vendorNumber},${vendor.name},${vendor.email},${vendor.phone},${vendor.address},${vendor.gstNumber},${vendor.category},${vendor.status},${vendor.totalSupplied},${vendor.lastSupply}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showVendorList) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowVendorList(false)}>← Back</Button>
            <h1 className="text-3xl font-bold text-foreground">All Vendors</h1>
          </div>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <SearchWithVoice
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search vendors..."
            className="flex-1"
          />
        </div>

        <div className="grid gap-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {vendor.name} ({vendor.vendorNumber})
                  <div className="flex items-center space-x-2">
                    <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                      {vendor.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEditVendor(vendor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteVendor(vendor.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Vendor Number</p>
                    <p className="text-muted-foreground">{vendor.vendorNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-muted-foreground">
                      <Mail className="h-4 w-4 mr-1 inline-block" />
                      {vendor.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('phone')}</p>
                    <p className="text-muted-foreground">
                      <Phone className="h-4 w-4 mr-1 inline-block" />
                      {vendor.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('address')}</p>
                    <p className="text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1 inline-block" />
                      {vendor.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('gstNumber')}</p>
                    <p className="text-muted-foreground">{vendor.gstNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-muted-foreground">{vendor.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Supplied</p>
                    <p className="text-muted-foreground">₹{vendor.totalSupplied.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Supply</p>
                    <p className="text-muted-foreground">{vendor.lastSupply}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No vendors found.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Vendor Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVendor ? 'Edit Vendor' : 'Add Vendor'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vendorNumber" className="text-right">Vendor Number</Label>
                  <Input 
                    id="vendorNumber" 
                    value={newVendor.vendorNumber} 
                    onChange={(e) => setNewVendor({ ...newVendor, vendorNumber: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter vendor number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">{t('vendorName')}</Label>
                  <Input 
                    id="name" 
                    value={newVendor.name} 
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter vendor name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newVendor.email} 
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">{t('phone')}</Label>
                  <Input 
                    id="phone" 
                    value={newVendor.phone} 
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">{t('address')}</Label>
                  <Input 
                    id="address" 
                    value={newVendor.address} 
                    onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter address"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gstNumber" className="text-right">{t('gstNumber')}</Label>
                  <Input 
                    id="gstNumber" 
                    value={newVendor.gstNumber} 
                    onChange={(e) => setNewVendor({ ...newVendor, gstNumber: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter GST number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Input 
                    id="category" 
                    value={newVendor.category} 
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })} 
                    className="col-span-3" 
                    placeholder="Enter category"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select value={newVendor.status} onValueChange={(value: 'active' | 'inactive') => setNewVendor({ ...newVendor, status: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={resetForm}>{t('cancel')}</Button>
                <Button type="submit" onClick={editingVendor ? handleUpdateVendor : handleAddVendor}>
                  {editingVendor ? t('update') : t('save')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Vendor Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendors}</div>
            <p className="text-xs text-muted-foreground">{activeVendors} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supplied</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSupplied.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">General</div>
            <p className="text-xs text-muted-foreground">Most active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Best performing vendors this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No vendors added yet</p>
              ) : (
                vendors.slice(0, 3).map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold">₹{vendor.totalSupplied.toLocaleString()}</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditVendor(vendor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteVendor(vendor.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Supplies */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Supplies</CardTitle>
            <CardDescription>Latest vendor transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No supply records yet</p>
              ) : (
                vendors.slice(-3).reverse().map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">{vendor.name}</div>
                      <div className="text-sm text-gray-500">{vendor.lastSupply}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="font-bold">₹{vendor.totalSupplied.toLocaleString()}</div>
                      <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                        {vendor.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your vendors efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={() => setShowVendorList(true)} className="w-full max-w-sm">
              View All Vendors
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorManagement;
