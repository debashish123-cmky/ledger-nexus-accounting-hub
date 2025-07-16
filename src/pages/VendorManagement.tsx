
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Building } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import SearchWithVoice from '@/components/SearchWithVoice';

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  status: 'active' | 'inactive';
  totalSupplied: number;
  lastSupply: string;
  category: string;
}

const VendorManagement = () => {
  const { t } = useSettings();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [newVendor, setNewVendor] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    gstNumber: string;
    status: 'active' | 'inactive';
    category: string;
  }>({
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
    vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVendor = () => {
    const newId = Date.now().toString();
    const vendorData: Vendor = { 
      id: newId, 
      ...newVendor, 
      totalSupplied: 0, 
      lastSupply: 'N/A' 
    };
    setVendors([...vendors, vendorData]);
    resetForm();
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setNewVendor({
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
    
    const updatedVendor: Vendor = {
      ...editingVendor,
      ...newVendor
    };
    
    setVendors(vendors.map(vendor => 
      vendor.id === editingVendor.id ? updatedVendor : vendor
    ));
    resetForm();
  };

  const resetForm = () => {
    setNewVendor({ 
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
    setVendors(vendors.filter(vendor => vendor.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">{t('vendors')}</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('add')} {t('vendors')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVendor ? `${t('edit')} ${t('vendors')}` : `${t('add')} ${t('vendors')}`}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                <Select value={newVendor.status} onValueChange={(value: string) => setNewVendor({ ...newVendor, status: value as 'active' | 'inactive' })}>
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

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchWithVoice
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`${t('search')} ${t('vendors')}...`}
          className="flex-1"
        />
      </div>

      <div className="grid gap-4">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {vendor.name}
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
                  <p className="text-sm font-medium">{t('companyName')}</p>
                  <p className="text-muted-foreground">{vendor.name}</p>
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
          <p className="text-gray-500">No vendors found. Add your first vendor to get started.</p>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
