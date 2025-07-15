
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Printer, Download, FileText } from 'lucide-react';
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
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice ${invoiceData.invoiceNo}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px; 
                  color: #000;
                  background: white;
                }
                .invoice-container { max-width: 800px; margin: 0 auto; }
                .header { 
                  text-align: center; 
                  border-bottom: 2px solid #000; 
                  padding-bottom: 20px; 
                  margin-bottom: 20px; 
                }
                .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .invoice-details { 
                  display: flex; 
                  justify-content: space-between; 
                  margin-bottom: 20px; 
                }
                .invoice-details > div { width: 48%; }
                .invoice-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin-bottom: 20px; 
                  font-size: 12px;
                }
                th, td { 
                  border: 1px solid #000; 
                  padding: 8px; 
                  text-align: left; 
                }
                th { 
                  background-color: #f0f0f0; 
                  font-weight: bold;
                }
                .totals { 
                  text-align: right; 
                  margin-top: 20px;
                }
                .total-row { 
                  display: flex; 
                  justify-content: space-between; 
                  margin-bottom: 5px;
                }
                .grand-total { 
                  font-size: 18px; 
                  font-weight: bold; 
                  border-top: 2px solid #000; 
                  padding-top: 10px;
                }
                .terms { 
                  margin-top: 40px; 
                  font-size: 12px;
                }
                .signature-section {
                  margin-top: 60px;
                  display: flex;
                  justify-content: space-between;
                }
                .signature-box {
                  width: 200px;
                  text-align: center;
                  border-top: 1px solid #000;
                  padding-top: 10px;
                }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const handleDownloadPDF = () => {
    // For now, this will trigger the print dialog which can save as PDF
    handlePrint();
  };

  const generateInvoiceContent = () => {
    const currentDate = new Date().toLocaleDateString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

    return (
      <div id="invoice-content" className="bg-white text-black p-6">
        <div className="invoice-container">
          {/* Header */}
          <div className="header">
            <div className="company-name">{companyName}</div>
            <div>{address}</div>
            <div>Phone: {phone} | Email: {email}</div>
            {gstNumber && <div>GSTIN: {gstNumber}</div>}
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-6">
            <h2 className="invoice-title">PURCHASE INVOICE</h2>
          </div>

          {/* Invoice Details */}
          <div className="invoice-details">
            <div>
              <h3 className="invoice-title">Bill To:</h3>
              <div><strong>{invoiceData.vendorName}</strong></div>
              <div>{invoiceData.vendorAddress}</div>
              {invoiceData.vendorGSTIN && <div>GSTIN: {invoiceData.vendorGSTIN}</div>}
              {invoiceData.vendorPhone && <div>Phone: {invoiceData.vendorPhone}</div>}
            </div>
            <div>
              <h3 className="invoice-title">Invoice Details:</h3>
              <div><strong>Invoice No:</strong> {invoiceData.invoiceNo}</div>
              <div><strong>Invoice Date:</strong> {new Date(invoiceData.invoiceDate).toLocaleDateString()}</div>
              <div><strong>Due Date:</strong> {dueDate}</div>
              <div><strong>Generated On:</strong> {currentDate}</div>
            </div>
          </div>

          {/* Items Table */}
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
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.description}</td>
                  <td>{item.hsnNo}</td>
                  <td>{item.qty}</td>
                  <td>{item.unit}</td>
                  <td>₹{item.rate.toFixed(2)}</td>
                  <td>₹{item.taxableValue.toFixed(2)}</td>
                  <td>{item.gstPercent}%</td>
                  <td>₹{item.gstAmount.toFixed(2)}</td>
                  <td>₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals">
            <div className="total-row">
              <span><strong>Subtotal (Taxable Amount):</strong></span>
              <span><strong>₹{totals.subtotal.toFixed(2)}</strong></span>
            </div>
            <div className="total-row">
              <span><strong>Total GST Amount:</strong></span>
              <span><strong>₹{totals.totalGST.toFixed(2)}</strong></span>
            </div>
            <div className="total-row grand-total">
              <span>Grand Total:</span>
              <span>₹{totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="terms">
            <h4>Terms and Conditions:</h4>
            <ul>
              <li>Payment due within 30 days from invoice date</li>
              <li>Late payment charges may apply as per company policy</li>
              <li>Goods once sold will not be taken back without prior approval</li>
              <li>Subject to local jurisdiction only</li>
              <li>All disputes subject to arbitration</li>
            </ul>
          </div>

          {/* Signature Section */}
          <div className="signature-section">
            <div className="signature-box">
              <div>Customer Signature</div>
            </div>
            <div className="signature-box">
              <div>Authorized Signatory</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm">
            <p>Thank you for your business!</p>
            <p>This is a computer generated invoice.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Invoice Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-end space-x-2 no-print">
            <Button onClick={handlePrint} size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
          
          {/* Invoice Preview */}
          {generateInvoiceContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintInvoice;
