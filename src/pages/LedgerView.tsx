
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Download, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';

interface LedgerEntry {
  id: string;
  ledgerName: string;
  amount: number;
  debit: number;
  credit: number;
  group: 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | 'Equity';
}

const LedgerView = () => {
  const { ledgers, addLedger, updateLedger, deleteLedger } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<LedgerEntry | null>(null);
  const [formData, setFormData] = useState({
    ledgerName: '',
    amount: '',
    debit: '',
    credit: '',
    group: 'Assets' as 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | 'Equity'
  });

  const groups = ['Assets', 'Liabilities', 'Income', 'Expenses', 'Equity'];

  const filteredLedgers = ledgers.filter(ledger => {
    const matchesSearch = ledger.ledgerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || ledger.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ledgerData = {
      ledgerName: formData.ledgerName,
      amount: parseFloat(formData.amount) || 0,
      debit: parseFloat(formData.debit) || 0,
      credit: parseFloat(formData.credit) || 0,
      group: formData.group
    };

    if (editingLedger) {
      updateLedger(editingLedger.id, ledgerData);
      toast({ title: 'Ledger updated successfully!' });
    } else {
      const newLedger: LedgerEntry = {
        id: Date.now().toString(),
        ...ledgerData
      };
      addLedger(newLedger);
      toast({ title: 'Ledger created successfully!' });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      ledgerName: '',
      amount: '',
      debit: '',
      credit: '',
      group: 'Assets'
    });
    setEditingLedger(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (ledger: LedgerEntry) => {
    setFormData({
      ledgerName: ledger.ledgerName,
      amount: ledger.amount.toString(),
      debit: ledger.debit.toString(),
      credit: ledger.credit.toString(),
      group: ledger.group
    });
    setEditingLedger(ledger);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteLedger(id);
    toast({ title: 'Ledger deleted successfully!' });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Ledger Name', 'Amount', 'Debit', 'Credit', 'Group'],
      ...filteredLedgers.map(ledger => [
        ledger.ledgerName, 
        ledger.amount.toString(),
        ledger.debit.toString(), 
        ledger.credit.toString(), 
        ledger.group
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledger-report.csv';
    a.click();
    toast({ title: 'Ledger report exported successfully!' });
  };

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'Assets': return 'bg-green-100 text-green-800';
      case 'Liabilities': return 'bg-red-100 text-red-800';
      case 'Income': return 'bg-blue-100 text-blue-800';
      case 'Expenses': return 'bg-orange-100 text-orange-800';
      case 'Equity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotals = () => {
    return {
      totalAmount: filteredLedgers.reduce((sum, ledger) => sum + ledger.amount, 0),
      totalDebit: filteredLedgers.reduce((sum, ledger) => sum + ledger.debit, 0),
      totalCredit: filteredLedgers.reduce((sum, ledger) => sum + ledger.credit, 0),
      totalEntries: filteredLedgers.length
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Ledger Management</h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ledger Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLedger ? 'Edit Ledger Entry' : 'Create New Ledger Entry'}
                </DialogTitle>
                <DialogDescription>
                  Enter ledger details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="ledgerName">Ledger Name *</Label>
                  <Input
                    id="ledgerName"
                    value={formData.ledgerName}
                    onChange={(e) => setFormData({...formData, ledgerName: e.target.value})}
                    placeholder="Enter ledger name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="debit">Debit</Label>
                    <Input
                      id="debit"
                      type="number"
                      value={formData.debit}
                      onChange={(e) => setFormData({...formData, debit: e.target.value})}
                      placeholder="Enter debit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="credit">Credit</Label>
                    <Input
                      id="credit"
                      type="number"
                      value={formData.credit}
                      onChange={(e) => setFormData({...formData, credit: e.target.value})}
                      placeholder="Enter credit"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="group">Group *</Label>
                  <Select value={formData.group} onValueChange={(value: any) => setFormData({...formData, group: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLedger ? 'Update' : 'Create'} Entry
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹{totals.totalAmount.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">₹{totals.totalDebit.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">Total Debit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{totals.totalCredit.toLocaleString('en-IN')}</div>
              <p className="text-sm text-gray-600">Total Credit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{totals.totalEntries}</div>
              <p className="text-sm text-gray-600">Total Entries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Ledger</Label>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by ledger name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="groupFilter">Filter by Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {groups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger Entries</CardTitle>
          <CardDescription>
            All ledger entries with current balances ({filteredLedgers.length} entries)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ledger Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLedgers.map((ledger) => (
                  <TableRow key={ledger.id}>
                    <TableCell className="font-medium">{ledger.ledgerName}</TableCell>
                    <TableCell className="font-semibold">₹{ledger.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-red-600 font-medium">₹{ledger.debit.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-green-600 font-medium">₹{ledger.credit.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge className={getGroupColor(ledger.group)}>
                        {ledger.group}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(ledger)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(ledger.id)}
                          className="text-red-600 hover:text-red-700"
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
          
          {filteredLedgers.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No ledger entries found</p>
              <p className="text-gray-400 text-sm">Create your first ledger entry to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LedgerView;
