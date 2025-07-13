
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, TrendingUp, CreditCard, Banknote, Smartphone, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CollectionEntry {
  id: string;
  invoiceNo: string;
  customerName: string;
  phoneNo: string;
  totalBill: number;
  cash: number;
  card: number;
  upi: number;
  timestamp: string;
}

const TodaysCollection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Sample data - would come from database
  const collections: CollectionEntry[] = [
    {
      id: '1',
      invoiceNo: 'INV-2024-001',
      customerName: 'John Doe',
      phoneNo: '9876543210',
      totalBill: 2500,
      cash: 2500,
      card: 0,
      upi: 0,
      timestamp: '2024-01-15T09:30:00'
    },
    {
      id: '2',
      invoiceNo: 'INV-2024-002',
      customerName: 'ABC Corporation',
      phoneNo: '9123456789',
      totalBill: 15000,
      cash: 0,
      card: 15000,
      upi: 0,
      timestamp: '2024-01-15T10:45:00'
    },
    {
      id: '3',
      invoiceNo: 'INV-2024-003',
      customerName: 'Jane Smith',
      phoneNo: '9876541230',
      totalBill: 3200,
      cash: 0,
      card: 0,
      upi: 3200,
      timestamp: '2024-01-15T14:20:00'
    },
    {
      id: '4',
      invoiceNo: 'INV-2024-004',
      customerName: 'XYZ Enterprises',
      phoneNo: '9555666777',
      totalBill: 8500,
      cash: 5000,
      card: 3500,
      upi: 0,
      timestamp: '2024-01-15T16:15:00'
    }
  ];

  const filteredCollections = collections.filter(collection => 
    collection.timestamp.startsWith(selectedDate)
  );

  const calculateTotals = () => {
    const totalBill = filteredCollections.reduce((sum, item) => sum + item.totalBill, 0);
    const totalCash = filteredCollections.reduce((sum, item) => sum + item.cash, 0);
    const totalCard = filteredCollections.reduce((sum, item) => sum + item.card, 0);
    const totalUPI = filteredCollections.reduce((sum, item) => sum + item.upi, 0);
    const totalTransactions = filteredCollections.length;

    return { totalBill, totalCash, totalCard, totalUPI, totalTransactions };
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Invoice No', 'Customer Name', 'Phone No', 'Total Bill', 'Cash', 'Card', 'UPI', 'Time'],
      ...filteredCollections.map(item => [
        item.invoiceNo, item.customerName, item.phoneNo, 
        item.totalBill.toString(), item.cash.toString(), 
        item.card.toString(), item.upi.toString(),
        new Date(item.timestamp).toLocaleTimeString('en-IN')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collection-report-${selectedDate}.csv`;
    a.click();
    toast({ title: 'Collection report exported successfully!' });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">Today's Collection Report</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="date">Collection Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Showing collections for {new Date(selectedDate).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collection</p>
                <p className="text-2xl font-bold text-green-600">₹{totals.totalBill.toLocaleString('en-IN')}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash Payments</p>
                <p className="text-2xl font-bold text-blue-600">₹{totals.totalCash.toLocaleString('en-IN')}</p>
              </div>
              <Banknote className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Card Payments</p>
                <p className="text-2xl font-bold text-purple-600">₹{totals.totalCard.toLocaleString('en-IN')}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">UPI Payments</p>
                <p className="text-2xl font-bold text-orange-600">₹{totals.totalUPI.toLocaleString('en-IN')}</p>
              </div>
              <Smartphone className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Mode Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Mode Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Cash</span>
                </div>
                <div>
                  <span className="font-bold text-blue-600">₹{totals.totalCash.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({totals.totalBill > 0 ? ((totals.totalCash / totals.totalBill) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Card</span>
                </div>
                <div>
                  <span className="font-bold text-purple-600">₹{totals.totalCard.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({totals.totalBill > 0 ? ((totals.totalCard / totals.totalBill) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">UPI</span>
                </div>
                <div>
                  <span className="font-bold text-orange-600">₹{totals.totalUPI.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({totals.totalBill > 0 ? ((totals.totalUPI / totals.totalBill) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Transactions:</span>
                <span className="font-semibold">{totals.totalTransactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Transaction:</span>
                <span className="font-semibold">
                  ₹{totals.totalTransactions > 0 ? (totals.totalBill / totals.totalTransactions).toLocaleString('en-IN', {maximumFractionDigits: 0}) : 0}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span className="text-green-600">₹{totals.totalBill.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Details</CardTitle>
          <CardDescription>
            Detailed breakdown of all collections for {new Date(selectedDate).toLocaleDateString('en-IN')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone No</TableHead>
                  <TableHead>Total Bill</TableHead>
                  <TableHead>Cash</TableHead>
                  <TableHead>Card</TableHead>
                  <TableHead>UPI</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.invoiceNo}</TableCell>
                    <TableCell>{collection.customerName}</TableCell>
                    <TableCell>{collection.phoneNo}</TableCell>
                    <TableCell className="font-semibold">₹{collection.totalBill.toLocaleString('en-IN')}</TableCell>
                    <TableCell className={collection.cash > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                      ₹{collection.cash.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className={collection.card > 0 ? 'text-purple-600 font-medium' : 'text-gray-400'}>
                      ₹{collection.card.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className={collection.upi > 0 ? 'text-orange-600 font-medium' : 'text-gray-400'}>
                      ₹{collection.upi.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      {new Date(collection.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCollections.length === 0 && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No collections found for {new Date(selectedDate).toLocaleDateString('en-IN')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grand Total Summary */}
      {filteredCollections.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">Grand Total Collection</h3>
                <p className="text-sm text-green-600">
                  Cash: ₹{totals.totalCash.toLocaleString('en-IN')} | 
                  Card: ₹{totals.totalCard.toLocaleString('en-IN')} | 
                  UPI: ₹{totals.totalUPI.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-800">₹{totals.totalBill.toLocaleString('en-IN')}</div>
                <div className="text-sm text-green-600">{totals.totalTransactions} transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TodaysCollection;
