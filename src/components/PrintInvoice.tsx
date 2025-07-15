
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
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: 'Arial', sans-serif; 
                  margin: 0; 
                  padding: 30px; 
                  color: #1a1a1a;
                  background: white;
                  line-height: 1.6;
                  font-size: 14px;
                }
                .invoice-container { 
                  max-width: 800px; 
                  margin: 0 auto; 
                  border: 2px solid #e5e7eb;
                  padding: 40px;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .header { 
                  border-bottom: 3px solid #2563eb; 
                  padding-bottom: 25px; 
                  margin-bottom: 30px; 
                  text-align: center;
                }
                .company-name { 
                  font-size: 32px; 
                  font-weight: 800; 
                  margin-bottom: 12px; 
                  color: #1e40af;
                  letter-spacing: 1px;
                }
                .company-details {
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.8;
                }
                .invoice-title { 
                  background: #2563eb;
                  color: white;
                  padding: 15px 0;
                  margin: 30px -40px;
                  text-align: center;
                  font-size: 24px;
                  font-weight: 700;
                  letter-spacing: 2px;
                }
                .invoice-details-section { 
                  display: flex; 
                  justify-content: space-between; 
                  margin: 30px 0;
                  gap: 40px;
                }
                .details-box {
                  flex: 1;
                  background: #f8fafc;
                  padding: 20px;
                  border-radius: 8px;
                  border-left: 4px solid #2563eb;
                }
                .details-title { 
                  font-size: 18px; 
                  font-weight: 700; 
                  margin-bottom: 15px;
                  color: #1e40af;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .detail-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                  padding: 4px 0;
                }
                .detail-label {
                  font-weight: 600;
                  color: #374151;
                  min-width: 120px;
                }
                .detail-value {
                  color: #1f2937;
                  font-weight: 500;
                }
                table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin: 30px 0; 
                  font-size: 13px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                th { 
                  background: linear-gradient(135deg, #2563eb, #1d4ed8);
                  color: white;
                  padding: 15px 10px;
                  text-align: center;
                  font-weight: 700;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border: 1px solid #1e40af;
                }
                td { 
                  padding: 12px 10px;
                  text-align: center;
                  border: 1px solid #d1d5db;
                  vertical-align: middle;
                }
                tbody tr:nth-child(even) {
                  background-color: #f9fafb;
                }
                tbody tr:hover {
                  background-color: #e0f2fe;
                }
                .description-cell {
                  text-align: left !important;
                  font-weight: 500;
                  max-width: 200px;
                }
                .amount-cell {
                  text-align: right !important;
                  font-weight: 600;
                  color: #059669;
                }
                .totals-section { 
                  margin-top: 30px;
                  display: flex;
                  justify-content: flex-end;
                }
                .totals-box {
                  min-width: 350px;
                  background: #f8fafc;
                  border: 2px solid #e5e7eb;
                  border-radius: 8px;
                  overflow: hidden;
                }
                .total-row { 
                  display: flex; 
                  justify-content: space-between; 
                  padding: 12px 20px;
                  border-bottom: 1px solid #e5e7eb;
                  font-size: 15px;
                }
                .total-row:last-child {
                  border-bottom: none;
                }
                .total-label {
                  font-weight: 600;
                  color: #374151;
                }
                .total-value {
                  font-weight: 700;
                  color: #1f2937;
                }
                .grand-total { 
                  background: #2563eb;
                  color: white;
                  font-size: 18px;
                  font-weight: 800;
                }
                .grand-total .total-label,
                .grand-total .total-value {
                  color: white;
                }
                .terms-section { 
                  margin-top: 40px;
                  background: #fef3c7;
                  padding: 25px;
                  border-radius: 8px;
                  border-left: 4px solid #f59e0b;
                }
                .terms-title {
                  font-size: 18px;
                  font-weight: 700;
                  margin-bottom: 15px;
                  color: #92400e;
                }
                .terms-list {
                  list-style: none;
                  padding: 0;
                }
                .terms-list li {
                  padding: 6px 0;
                  color: #78350f;
                  font-weight: 500;
                  position: relative;
                  padding-left: 20px;
                }
                .terms-list li:before {
                  content: "•";
                  color: #f59e0b;
                  font-weight: bold;
                  position: absolute;
                  left: 0;
                }
                .signature-section {
                  margin-top: 50px;
                  display: flex;
                  justify-content: space-between;
                  gap: 40px;
                }
                .signature-box {
                  flex: 1;
                  text-align: center;
                  padding: 20px;
                  background: #f8fafc;
                  border-radius: 8px;
                  border: 2px dashed #cbd5e1;
                  min-height: 100px;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-end;
                }
                .signature-line {
                  border-top: 2px solid #1f2937;
                  margin-bottom: 10px;
                }
                .signature-label {
                  font-weight: 600;
                  color: #374151;
                  font-size: 14px;
                }
                .footer {
                  margin-top: 40px;
                  text-align: center;
                  padding-top: 20px;
                  border-top: 2px solid #e5e7eb;
                  color: #6b7280;
                  font-style: italic;
                }
                .footer p {
                  margin: 5px 0;
                }
                @media print {
                  body { margin: 0; padding: 20px; }
                  .no-print { display: none !important; }
                  .invoice-container { 
                    border: none; 
                    box-shadow: none; 
                    padding: 20px;
                  }
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
    handlePrint();
  };

  const generateInvoiceContent = () => {
    const currentDate = new Date().toLocaleDateString('en-IN');
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');

    return (
      <div id="invoice-content" className="bg-white text-black">
        <div className="invoice-container">
          {/* Header */}
          <div className="header">
            <div className="company-name">{companyName}</div>
            <div className="company-details">
              <div>{address}</div>
              <div>Phone: {phone} | Email: {email}</div>
              {gstNumber && <div>GSTIN: {gstNumber}</div>}
            </div>
          </div>

          {/* Invoice Title */}
          <div className="invoice-title">PURCHASE INVOICE</div>

          {/* Invoice Details */}
          <div className="invoice-details-section">
            <div className="details-box">
              <div className="details-title">Bill To</div>
              <div className="detail-row">
                <span className="detail-label">Company:</span>
                <span className="detail-value">{invoiceData.vendorName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{invoiceData.vendorAddress}</span>
              </div>
              {invoiceData.vendorGSTIN && (
                <div className="detail-row">
                  <span className="detail-label">GSTIN:</span>
                  <span className="detail-value">{invoiceData.vendorGSTIN}</span>
                </div>
              )}
              {invoiceData.vendorPhone && (
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{invoiceData.vendorPhone}</span>
                </div>
              )}
            </div>
            
            <div className="details-box">
              <div className="details-title">Invoice Details</div>
              <div className="detail-row">
                <span className="detail-label">Invoice No:</span>
                <span className="detail-value">{invoiceData.invoiceNo}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Invoice Date:</span>
                <span className="detail-value">{new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Due Date:</span>
                <span className="detail-value">{dueDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Generated:</span>
                <span className="detail-value">{currentDate}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table>
            <thead>
              <tr>
                <th style={{width: '5%'}}>Sr.</th>
                <th style={{width: '25%'}}>Description</th>
                <th style={{width: '10%'}}>HSN</th>
                <th style={{width: '8%'}}>Qty</th>
                <th style={{width: '8%'}}>Unit</th>
                <th style={{width: '12%'}}>Rate (₹)</th>
                <th style={{width: '12%'}}>Amount (₹)</th>
                <th style={{width: '8%'}}>GST %</th>
                <th style={{width: '12%'}}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{String(index + 1).padStart(2, '0')}</td>
                  <td className="description-cell">{item.description}</td>
                  <td>{item.hsnNo}</td>
                  <td>{item.qty}</td>
                  <td>{item.unit}</td>
                  <td className="amount-cell">₹{item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  <td className="amount-cell">₹{item.taxableValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  <td>{item.gstPercent}%</td>
                  <td className="amount-cell">₹{item.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals-section">
            <div className="totals-box">
              <div className="total-row">
                <span className="total-label">Subtotal (Taxable Amount):</span>
                <span className="total-value">₹{totals.subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="total-row">
                <span className="total-label">Total GST Amount:</span>
                <span className="total-value">₹{totals.totalGST.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="total-row grand-total">
                <span className="total-label">GRAND TOTAL:</span>
                <span className="total-value">₹{totals.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="terms-section">
            <div className="terms-title">Terms & Conditions</div>
            <ul className="terms-list">
              <li>Payment due within 30 days from invoice date</li>
              <li>Late payment charges may apply as per company policy</li>
              <li>Goods once sold will not be taken back without prior approval</li>
              <li>Subject to local jurisdiction only</li>
              <li>All disputes subject to arbitration</li>
              <li>E. & O.E. (Errors and Omissions Excepted)</li>
            </ul>
          </div>

          {/* Signature Section */}
          <div className="signature-section">
            <div className="signature-box">
              <div className="signature-line"></div>
              <div className="signature-label">Customer Signature</div>
            </div>
            <div className="signature-box">
              <div className="signature-line"></div>
              <div className="signature-label">Authorized Signatory</div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>This is a computer generated invoice and does not require physical signature.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
          <FileText className="h-4 w-4 mr-2" />
          Generate Professional Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700">Professional Invoice Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-end space-x-3 no-print bg-gray-50 p-4 rounded-lg">
            <Button onClick={handlePrint} size="lg" className="bg-green-600 hover:bg-green-700">
              <Printer className="h-5 w-5 mr-2" />
              Print Invoice
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </Button>
          </div>
          
          {/* Invoice Preview */}
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            {generateInvoiceContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintInvoice;
