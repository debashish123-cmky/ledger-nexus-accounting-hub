
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import SearchWithVoice from '@/components/SearchWithVoice';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  status: 'active' | 'inactive';
  totalPurchases: number;
  lastPurchase: string;
}

const ClientManagement = () => {
  const { t } = useSettings();
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'ABC Corp Ltd',
      email: 'contact@abccorp.com',
      phone: '+91 98765 43210',
      address: '123 Business Park, Mumbai, Maharashtra 400001',
      gstNumber: '27AABCU9603R1ZX',
      status: 'active',
      totalPurchases: 125000,
      lastPurchase: '2024-01-15'
    },
    {
      id: '2',
      name: 'XYZ Enterprises',
      email: 'info@xyzenterprises.in',
      phone: '+91 88776 65432',
      address: '456 Innovation Hub, Bangalore, Karnataka 560001',
      gstNumber: '29XYZPD8765Q2ZA',
      status: 'active',
      totalPurchases: 280000,
      lastPurchase: '2024-02-01'
    },
    {
      id: '3',
      name: 'Global Solutions Pvt Ltd',
      email: 'support@globalsolutions.net',
      phone: '+91 77665 54321',
      address: '789 Tech Square, Hyderabad, Telangana 500001',
      gstNumber: '36GSPLE5432A3RT',
      status: 'inactive',
      totalPurchases: 85000,
      lastPurchase: '2023-12-20'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: '',
    status: 'active' as const
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.gstNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = () => {
    const newId = Math.random().toString(36).substring(7);
    setClients([...clients, { id: newId, ...newClient, totalPurchases: 0, lastPurchase: 'N/A' }]);
    setNewClient({ name: '', email: '', phone: '', address: '', gstNumber: '', status: 'active' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">{t('clients')}</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('add')} {t('clients')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('add')} {t('clients')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">{t('companyName')}</Label>
                <Input id="name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">{t('phone')}</Label>
                <Input id="phone" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">{t('address')}</Label>
                <Input id="address" value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gst" className="text-right">{t('gstNumber')}</Label>
                <Input id="gst" value={newClient.gstNumber} onChange={(e) => setNewClient({ ...newClient, gstNumber: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select onValueChange={(value: string) => setNewClient({ ...newClient, status: value as 'active' | 'inactive' })}>
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
            <div className="flex justify-end">
              <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>{t('cancel')}</Button>
              <Button type="submit" onClick={handleAddClient}>{t('save')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchWithVoice
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`${t('search')} ${t('clients')}...`}
          className="flex-1"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <Card key={client.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {client.name}
                <Badge variant={client.status === 'active' ? 'default' : 'destructive'}>
                  {client.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {client.email}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {client.phone}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {client.address}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-medium">GST:</span>
                {client.gstNumber}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Total Purchases:</span> ₹{client.totalPurchases}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Last Purchase:</span> {client.lastPurchase}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  {t('edit')}
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteClient(client.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientManagement;
