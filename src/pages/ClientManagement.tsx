
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
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    gstNumber: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: '',
    status: 'active'
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.gstNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = () => {
    const newId = Date.now().toString();
    const clientData: Client = { 
      id: newId, 
      ...newClient, 
      totalPurchases: 0, 
      lastPurchase: 'N/A' 
    };
    setClients([...clients, clientData]);
    resetForm();
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      gstNumber: client.gstNumber,
      status: client.status
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateClient = () => {
    if (!editingClient) return;
    
    const updatedClient: Client = {
      ...editingClient,
      ...newClient
    };
    
    setClients(clients.map(client => 
      client.id === editingClient.id ? updatedClient : client
    ));
    resetForm();
  };

  const resetForm = () => {
    setNewClient({ 
      name: '', 
      email: '', 
      phone: '', 
      address: '', 
      gstNumber: '', 
      status: 'active' 
    });
    setEditingClient(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">{t('clients')}</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('add')} {t('clients')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClient ? `${t('edit')} ${t('clients')}` : `${t('add')} ${t('clients')}`}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">{t('companyName')}</Label>
                <Input 
                  id="name" 
                  value={newClient.name} 
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} 
                  className="col-span-3" 
                  placeholder="Enter company name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newClient.email} 
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} 
                  className="col-span-3" 
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">{t('phone')}</Label>
                <Input 
                  id="phone" 
                  value={newClient.phone} 
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} 
                  className="col-span-3" 
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">{t('address')}</Label>
                <Input 
                  id="address" 
                  value={newClient.address} 
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} 
                  className="col-span-3" 
                  placeholder="Enter address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gst" className="text-right">{t('gstNumber')}</Label>
                <Input 
                  id="gst" 
                  value={newClient.gstNumber} 
                  onChange={(e) => setNewClient({ ...newClient, gstNumber: e.target.value })} 
                  className="col-span-3" 
                  placeholder="Enter GST number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select value={newClient.status} onValueChange={(value: string) => setNewClient({ ...newClient, status: value as 'active' | 'inactive' })}>
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
              <Button type="submit" onClick={editingClient ? handleUpdateClient : handleAddClient}>
                {editingClient ? t('update') : t('save')}
              </Button>
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
                <span className="font-medium">Total Purchases:</span> ₹{client.totalPurchases.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Last Purchase:</span> {client.lastPurchase}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
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

      {filteredClients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No clients found. Add your first client to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
