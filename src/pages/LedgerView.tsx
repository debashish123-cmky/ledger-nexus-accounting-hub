
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LedgerEntry {
  id: string;
  ledgerName: string;
  group: string;
  debit: number;
  credit: number;
  balance: number;
  balanceType: 'Dr' | 'Cr';
  lastTransaction: string;
  transactions: LedgerTransaction[];
}

interface LedgerTransaction {
  id: string;
  date: string;
  particular: string;
  voucher: string;
  debit: number;
  credit: number;
  balance: number;
}

const LedgerView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedLedger, setSelectedLedger] = useState<LedgerEntry | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);

  // Sample data - would come from database
  const ledgerEntries: LedgerEntry[] = [
    {
      id: '1',
      ledgerName: 'Cash in Hand',
      group: 'Current Assets',
      debit: 125000,
      credit: 98000,
      balance: 27000,
      balanceType: 'Dr',
      lastTransaction: '2024-01-25',
      transactions: [
        {
          id: '1',
          date: '2024-01-15',
          particular: 'Sales Receipt',
          voucher: 'RV001',
          debit: 15000,
          credit: 0,
          balance: 15000
        },
        {
          id: '2',
          date: '2024-01-20',
          particular: 'Office Rent',
          voucher: 'PV001',
          debit: 0,
          credit: 8000,
          balance: 7000
        }
      ]
    },
    {
      id: '2',
      ledgerName: 'ABC Corporation',
      group: 'Sundry Debtors',
      debit: 85000,
      credit: 45000,
      balance: 40000,
      balanceType: 'Dr',
      lastTransaction: '2024-01-22',
      transactions: [
        {
          id: '3',
          date: '2024-01-10',
          particular: 'Sales Invoice',
          voucher: 'SI001',
          debit: 50000,
          credit: 0,
          balance: 50000
        },
        {
          id: '4',
          date: '2024-01-22',
          particular: 'Payment Received',
          voucher: 'RV002',
          debit: 0,
          credit: 25000,
          balance: 25000
        }
      ]
    },
    {
      id: '3',
      ledgerName: 'XYZ Suppliers',
      group: 'Sundry Creditors',
      debit: 35000,
      credit: 75000,
      balance: 40000,
      balanceType: 'Cr',
      lastTransaction: '2024-01-24',
      transactions: [
        {
          id: '5',
          date: '2024-01-12',
          particular: 'Purchase Invoice',
          voucher: 'PI001',
          debit: 0,
          credit: 60000,
          balance: 60000
        },
        {
          id: '6',
          date: '2024-01-24',
          particular: 'Payment Made',
          voucher: 'PV002',
          debit: 35000,
          credit: 0,
          balance: 25000
        }
      ]
    },
    {
      id: '4',
      ledgerName: 'Office Rent',
      group: 'Indirect Expenses',
      debit: 24000,
      credit: 0,
      balance: 24000,
      balanceType: 'Dr',
      lastTransaction: '2024-01-20',
      transactions: [
        {
          id: '7',
          date: '2024-01-01',
          particular: 'Monthly Rent',
          voucher: 'JV001',
          debit: 8000,
          credit: 0,
          balance: 8000
        },
        {
          id: '8',
          date: '2024-01-20',
          particular: 'Monthly Rent',
          voucher: 'JV002',
          debit: 8000,
          credit: 0,
          balance: 16000
        }
      ]
    }
  ];

  const groups = ['Current Assets', 'Sundry Debtors', 'Sundry Creditors', 'Indirect Expenses', 'Direct Expenses', 'Sales Accounts'];

  const filteredLedgers = ledgerEntries.filter(ledger => {
    const matchesSearch = ledger.ledgerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || ledger.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleViewTransactions = (ledger: LedgerEntry) => {
    setSelectedLedger(ledger);
    setShowTransactions(true);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Ledger Name', 'Group', 'Debit', 'Credit', 'Balance', 'Balance Type', 'Last Transaction'],
      ...filteredLedgers.map(ledger => [
        ledger.ledgerName, ledger.group, ledger.debit.toString(),
        ledger.credit.toString(), ledger.balance.toString(), ledger.balanceType, ledger.lastTransaction
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

  const calculateGroupTotals = () => {
    const groupTotals: { [key: string]: { debit: number; credit: number; balance: number } } = {};
    
    filteredLedgers.forEach(ledger => {
      if (!groupTotals[ledger.group]) {
        groupTotals[ledger.group] = { debit: 0, credit: 0, balance: 0 };
      }
      groupTotals[ledger.group].debit += ledger.debit;
      groupTotals[ledger.group].credit += ledger.credit;
      groupTotals[ledger.group].balance += ledger.balanceType === 'Dr' ? ledger.balance : -ledger.balance;
    });

    return groupTotals;
  };

  const groupTotals = calculateGroupTotals();

  if (showTransactions && selectedLedger) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Ledger Transactions - {selectedLedger.ledgerName}</h2>
          </div>
          <Button onClick={() => setShowTransactions(false)} variant="outline">
            Back to Ledgers
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>
              Current balance and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Debit</p>
                <p className="text-xl font-bold text-blue-800">₹{selectedLedger.debit.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Total Credit</p>
                <p className="text-xl font-bold text-green-800">₹{selectedLedger.credit.toLocaleString('en-IN')}</p>
              </div>
              <div className={`p-4 rounded-lg ${selectedLedger.balanceType === 'Dr' ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className={`text-sm ${selectedLedger.balanceType === 'Dr' ? 'text-red-600' : 'text-green-600'}`}>
                  Current Balance
                </p>
                <p className={`text-xl font-bold ${selectedLedger.balanceType === 'Dr' ? 'text-red-800' : 'text-green-800'}`}>
                  ₹{selectedLedger.balance.toLocaleString('en-IN')} {selectedLedger.balanceType}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Group</p>
                <p className="text-lg font-bold text-gray-800">{selectedLedger.group}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              All transactions for this ledger account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Particular</TableHead>
                  <TableHead>Voucher</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedLedger.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell className="font-medium">{transaction.particular}</TableCell>
                    <TableCell>{transaction.voucher}</TableCell>
                    <TableCell className={transaction.debit > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>
                      {transaction.debit > 0 ? `₹${transaction.debit.toLocaleString('en-IN')}` : '-'}
                    </TableCell>
                    <TableCell className={transaction.credit > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      {transaction.credit > 0 ? `₹${transaction.credit.toLocaleString('en-IN')}` : '-'}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{transaction.balance.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Ledger View</h2>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Ledger
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
              <Label htmlFor="group">Filter by Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
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

      {/* Group Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(groupTotals).map(([group, totals]) => (
          <Card key={group}>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-2">{group}</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Debit:</span>
                    <span className="font-medium">₹{totals.debit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit:</span>
                    <span className="font-medium">₹{totals.credit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Net:</span>
                    <span className={`font-bold ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{Math.abs(totals.balance).toLocaleString('en-IN')} {totals.balance >= 0 ? 'Dr' : 'Cr'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ledger List */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger Accounts</CardTitle>
          <CardDescription>
            All ledger accounts with balances ({filteredLedgers.length} accounts)
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
                  <TableHead>Last Transaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLedgers.map((ledger) => (
                  <TableRow key={ledger.id}>
                    <TableCell className="font-medium">{ledger.ledgerName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ledger.group}</Badge>
                    </TableCell>
                    <TableCell className="text-red-600 font-medium">
                      ₹{ledger.debit.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      ₹{ledger.credit.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {ledger.balanceType === 'Dr' ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className={`font-bold ${ledger.balanceType === 'Dr' ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{ledger.balance.toLocaleString('en-IN')} {ledger.balanceType}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(ledger.lastTransaction).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewTransactions(ledger)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLedgers.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No ledger accounts found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LedgerView;
