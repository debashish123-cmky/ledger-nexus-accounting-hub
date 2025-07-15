
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Printer, Download } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface PrintInvoiceProps {
  invoiceData: {
    invoiceNo: string;
    invoiceDate: string;
    vendorName: string;
    vendorAddress: string;
    vendorGSTIN: string;
    vendorPhone: string;
  };
  items: Array<{
    id: string;
    companyName: string;
    description: string;
    hsnNo: string;
    qty: number;
    unit: string;
    rate: number;
    taxableValue: number;
    gstPercent: number;
    gstAmount: number;
    total: number;
  }>;
  totals: {
    subtotal: number;
    totalGST: number;
    grandTotal: number;
  };
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({ invoiceData, items, totals }) => {
  const { companyName, address, phone, email, gstNumber } = useSettings();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a new window with the invoice content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(getInvoiceHTML());
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .invoice-details div { width: 48%; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            .totals { text-align: right; }
            .print-only { display: block; }
            @media screen { .print-only { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${companyName}</h1>
            <p>${address}</p>
            <p>Phone: ${phone} | Email: ${email}</p>
            <p>GSTIN: ${gstNumber}</p>
          </div>
          
          <div class="invoice-details">
            <div>
              <h3>Bill To:</h3>
              <p><strong>${invoiceData.vendorName}</strong></p>
              <p>${invoiceData.vendorAddress}</p>
              <p>GSTIN: ${invoiceData.vendorGSTIN}</p>
              <p>Phone: ${invoiceData.vendorPhone}</p>
            </div>
            <div>
              <h3>Invoice Details:</h3>
              <p><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</p>
              <p><strong>Invoice Date:</strong> ${new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Description</th>
                <th>HSN Code</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>GST%</th>
                <th>GST Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.description}</td>
                  <td>${item.hsnNo}</td>
                  <td>${item.qty}</td>
                  <td>${item.unit}</td>
                  <td>₹${item.rate.toFixed(2)}</td>
                  <td>₹${item.taxableValue.toFixed(2)}</td>
                  <td>${item.gstPercent}%</td>
                  <td>₹${item.gstAmount.toFixed(2)}</td>
                  <td>₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <p><strong>Subtotal: ₹${totals.subtotal.toFixed(2)}</strong></p>
            <p><strong>Total GST: ₹${totals.totalGST.toFixed(2)}</strong></p>
            <h3>Grand Total: ₹${totals.grandTotal.toFixed(2)}</h3>
          </div>
          
          <div style="margin-top: 40px;">
            <p>Thank you for your business!</p>
            <p style="margin-top: 20px;">Terms and Conditions:</p>
            <ul>
              <li>Payment due within 30 days</li>
              <li>Late payment charges may apply</li>
              <li>Goods once sold will not be taken back</li>
            </ul>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
          <Printer className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-end space-x-2 print:hidden">
            <Button onClick={handlePrint} size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          {/* Invoice Preview */}
          <div className="border p-6 bg-white text-black" dangerouslySetInnerHTML={{ __html: getInvoiceHTML().replace(/<\/?html>|<\/?head>|<\/?body>|<title>.*<\/title>|<style>.*<\/style>/g, '') }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintInvoice;
