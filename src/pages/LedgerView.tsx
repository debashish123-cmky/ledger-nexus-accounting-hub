
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Download, BookOpen, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LedgerEntry {
  id: string;
  ledgerName: string;
  group: 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | 'Equity';
  debit: number;
  credit: number;
  balance: number;
  lastTransactionDate: string;
  transactionCount: number;
}

const LedgerView = () => {
  const [ledgers, setLedgers] = useState<LedgerEntry[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<LedgerEntry | null>(null);
  const [formData, setFormData] = useState({
    ledgerName: '',
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
    
    if (editingLedger) {
      setLedgers(ledgers.map(ledger =>
        ledger.id === editingLedger.id
          ? { ...ledger, ...formData }
          : ledger
      ));
      toast({ title: 'Ledger updated successfully!' });
    } else {
      const newLedger: LedgerEntry = {
        id: Date.now().toString(),
        ...formData,
        debit: 0,
        credit: 0,
        balance: 0,
        lastTransactionDate: new Date().toISOString().split('T')[0],
        transactionCount: 0
      };
      setLedgers([...ledgers, newLedger]);
      toast({ title: 'Ledger created successfully!' });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      ledgerName: '',
      group: 'Assets' as 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | 'Equity'
    });
    setEditingLedger(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (ledger: LedgerEntry) => {
    setFormData({
      ledgerName: ledger.ledgerName,
      group: ledger.group
    });
    setEditingLedger(ledger);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLedgers(ledgers.filter(ledger => ledger.id !== id));
    toast({ title: 'Ledger deleted successfully!' });
  };

  const handleViewTransactions = (ledger: LedgerEntry) => {
    toast({ title: `Viewing transactions for ${ledger.ledgerName}` });
    // Here you would typically navigate to transaction details
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Ledger Name', 'Group', 'Debit', 'Credit', 'Balance', 'Transaction Count'],
      ...filteredLedgers.map(ledger => [
        ledger.ledgerName, ledger.group, ledger.debit.toString(),
        ledger.credit.toString(), ledger.balance.toString(), ledger.transactionCount.toString()
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

  const calculateGroupTotals = () => {
    const groupTotals = groups.reduce((acc, group) => {
      const groupLedgers = filteredLedgers.filter(ledger => ledger.group === group);
      acc[group] = {
        count: groupLedgers.length,
        totalDebit: groupLedgers.reduce((sum, ledger) => sum + ledger.debit, 0),
        totalCredit: groupLedgers.reduce((sum, ledger) => sum + ledger.credit, 0),
        netBalance: groupLedgers.reduce((sum, ledger) => sum + ledger.balance, 0)
      };
      return acc;
    }, {} as Record<string, any>);
    
    return groupTotals;
  };

  const groupTotals = calculateGroupTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Ledger View</h2>
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
                Create Ledger
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLedger ? 'Edit Ledger' : 'Create New Ledger'}
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
                    required
                  />
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
                    {editingLedger ? 'Update' : 'Create'} Ledger
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Group Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {groups.map(group => (
          <Card key={group}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{groupTotals[group]?.count || 0}</div>
                <p className="text-sm text-gray-600">{group}</p>
                <p className="text-xs text-gray-500">
                  Net: ₹{(groupTotals[group]?.netBalance || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Ledgers</Label>
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
          <CardTitle>Ledger Accounts</CardTitle>
          <CardDescription>
            All ledger accounts with their current balances ({filteredLedgers.length} ledgers)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ledger Name</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLedgers.map((ledger) => (
                  <TableRow key={ledger.id}>
                    <TableCell className="font-medium">{ledger.ledgerName}</TableCell>
                    <TableCell>
                      <Badge className={getGroupColor(ledger.group)}>
                        {ledger.group}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-red-600">₹{ledger.debit.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-green-600">₹{ledger.credit.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${ledger.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Math.abs(ledger.balance).toLocaleString('en-IN')} {ledger.balance >= 0 ? 'Dr' : 'Cr'}
                      </span>
                    </TableCell>
                    <TableCell>{ledger.transactionCount}</TableCell>
                    <TableCell>{new Date(ledger.lastTransactionDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewTransactions(ledger)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
              <p className="text-gray-500">No ledgers found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trial Balance Summary */}
      {filteredLedgers.length > 0 && (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-800">Trial Balance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-indigo-600">Total Debit</p>
                <p className="text-xl font-bold text-indigo-800">
                  ₹{filteredLedgers.reduce((sum, ledger) => sum + ledger.debit, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600">Total Credit</p>
                <p className="text-xl font-bold text-indigo-800">
                  ₹{filteredLedgers.reduce((sum, ledger) => sum + ledger.credit, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600">Net Balance</p>
                <p className="text-xl font-bold text-indigo-800">
                  ₹{Math.abs(filteredLedgers.reduce((sum, ledger) => sum + ledger.balance, 0)).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-600">Total Ledgers</p>
                <p className="text-xl font-bold text-indigo-800">{filteredLedgers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LedgerView;
