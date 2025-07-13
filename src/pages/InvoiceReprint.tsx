
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Printer, Eye, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  clientName: string;
  clientPhone: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Paid' | 'Pending' | 'Partial';
  paymentMode: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
}

const InvoiceReprint = () => {
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNo: 'INV-2024-001',
      invoiceDate: '2024-01-15',
      clientName: 'ABC Corporation',
      clientPhone: '9876543210',
      totalAmount: 25000,
      paidAmount: 25000,
      status: 'Paid',
      paymentMode: 'Bank Transfer'
    },
    {
      id: '2',
      invoiceNo: 'INV-2024-002',
      invoiceDate: '2024-01-16',
      clientName: 'John Doe',
      clientPhone: '9123456789',
      totalAmount: 15000,
      paidAmount: 10000,
      status: 'Partial',
      paymentMode: 'UPI'
    },
    {
      id: '3',
      invoiceNo: 'INV-2024-003',
      invoiceDate: '2024-01-17',
      clientName: 'XYZ Enterprises',
      clientPhone: '9876541230',
      totalAmount: 35000,
      paidAmount: 0,
      status: 'Pending',
      paymentMode: 'Cash'
    }
  ]);

  const [searchFilters, setSearchFilters] = useState({
    invoiceNo: '',
    dateFrom: '',
    dateTo: '',
    clientPhone: '',
    clientName: ''
  });

  const filteredInvoices = invoices.filter(invoice => {
    return (
      (searchFilters.invoiceNo === '' || invoice.invoiceNo.toLowerCase().includes(searchFilters.invoiceNo.toLowerCase())) &&
      (searchFilters.clientPhone === '' || invoice.clientPhone.includes(searchFilters.clientPhone)) &&
      (searchFilters.clientName === '' || invoice.clientName.toLowerCase().includes(searchFilters.clientName.toLowerCase())) &&
      (searchFilters.dateFrom === '' || invoice.invoiceDate >= searchFilters.dateFrom) &&
      (searchFilters.dateTo === '' || invoice.invoiceDate <= searchFilters.dateTo)
    );
  });

  const handleView = (invoice: Invoice) => {
    toast({ title: `Viewing invoice ${invoice.invoiceNo}` });
    // Here you would typically open a modal or navigate to invoice details
  };

  const handlePrint = (invoice: Invoice) => {
    toast({ title: `Printing invoice ${invoice.invoiceNo}` });
    // Here you would typically trigger the print functionality
  };

  const handleDownload = (invoice: Invoice) => {
    toast({ title: `Downloading invoice ${invoice.invoiceNo}` });
    // Here you would typically generate and download PDF
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Invoice Reprint</h2>
        </div>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Invoices</CardTitle>
          <CardDescription>
            Search for invoices using various filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="invoiceNo">Invoice No</Label>
              <Input
                id="invoiceNo"
                placeholder="INV-2024-001"
                value={searchFilters.invoiceNo}
                onChange={(e) => setSearchFilters({...searchFilters, invoiceNo: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={searchFilters.dateFrom}
                onChange={(e) => setSearchFilters({...searchFilters, dateFrom: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={searchFilters.dateTo}
                onChange={(e) => setSearchFilters({...searchFilters, dateTo: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                placeholder="9876543210"
                value={searchFilters.clientPhone}
                onChange={(e) => setSearchFilters({...searchFilters, clientPhone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Client name"
                value={searchFilters.clientName}
                onChange={(e) => setSearchFilters({...searchFilters, clientName: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>
            {filteredInvoices.length} invoice(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Client Phone</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                    <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{invoice.clientPhone}</TableCell>
                    <TableCell>₹{invoice.totalAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>₹{invoice.paidAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.paymentMode}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrint(invoice)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No invoices found matching your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredInvoices.length}
              </div>
              <p className="text-sm text-gray-600">Total Invoices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ₹{filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString('en-IN')}
              </div>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₹{filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0).toLocaleString('en-IN')}
              </div>
              <p className="text-sm text-gray-600">Total Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                ₹{filteredInvoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0).toLocaleString('en-IN')}
              </div>
              <p className="text-sm text-gray-600">Pending Amount</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceReprint;
