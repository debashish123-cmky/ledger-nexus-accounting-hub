import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Download, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  address: string;
  panNo: string;
  gstNo: string;
  mobileNo: string;
  state: string;
  clientType: 'Individual' | 'Company' | 'Partnership';
  createdAt: string;
}

const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'ABC Corporation',
      address: '123 Business Street, Mumbai',
      panNo: 'ABCDE1234F',
      gstNo: '27ABCDE1234F1Z5',
      mobileNo: '9876543210',
      state: 'Maharashtra',
      clientType: 'Company',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'John Doe',
      address: '456 Residential Area, Delhi',
      panNo: 'FGHIJ5678K',
      gstNo: '07FGHIJ5678K1A2',
      mobileNo: '9123456789',
      state: 'Delhi',
      clientType: 'Individual',
      createdAt: '2024-01-20'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    panNo: '',
    gstNo: '',
    mobileNo: '',
    state: '',
    clientType: 'Individual' as 'Individual' | 'Company' | 'Partnership'
  });

  const states = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
    'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.mobileNo.includes(searchTerm) ||
    client.gstNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      setClients(clients.map(client =>
        client.id === editingClient.id
          ? { ...client, ...formData }
          : client
      ));
      toast({ title: 'Client updated successfully!' });
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setClients([...clients, newClient]);
      toast({ title: 'Client added successfully!' });
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
      clientType: 'Individual' as 'Individual' | 'Company' | 'Partnership'
    });
    setEditingClient(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      address: client.address,
      panNo: client.panNo,
      gstNo: client.gstNo,
      mobileNo: client.mobileNo,
      state: client.state,
      clientType: client.clientType
    });
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
    toast({ title: 'Client deleted successfully!' });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Address', 'PAN No', 'GST No', 'Mobile No', 'State', 'Client Type'],
      ...filteredClients.map(client => [
        client.name, client.address, client.panNo, client.gstNo,
        client.mobileNo, client.state, client.clientType
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
    toast({ title: 'Client data exported successfully!' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Client Management</h2>
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
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the client details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Client Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientType">Client Type *</Label>
                    <Select value={formData.clientType} onValueChange={(value: any) => setFormData({...formData, clientType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
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

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingClient ? 'Update' : 'Add'} Client
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            Manage your client database
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients by name, mobile, or GST number..."
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
                  <TableHead>Client Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mobile No</TableHead>
                  <TableHead>GST No</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Added Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{client.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {client.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{client.clientType}</Badge>
                    </TableCell>
                    <TableCell>{client.mobileNo}</TableCell>
                    <TableCell className="font-mono text-sm">{client.gstNo || '-'}</TableCell>
                    <TableCell>{client.state}</TableCell>
                    <TableCell>{new Date(client.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(client.id)}
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
          
          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No clients found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManagement;
