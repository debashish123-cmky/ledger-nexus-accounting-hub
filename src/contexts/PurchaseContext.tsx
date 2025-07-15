
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PurchaseItem {
  id: string;
  companyName: string;
  description: string;
  hsnNo: string;
  batchNo: string;
  expDate: string;
  qty: number;
  unit: string;
  freeQty: number;
  noOfPc: number;
  rate: number;
  salesRate: number;
  taxableValue: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
}

interface PurchaseRecord {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  vendorName: string;
  vendorGST: string;
  state: string;
  taxableAmt: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  items: PurchaseItem[];
}

interface PurchaseContextType {
  purchaseRecords: PurchaseRecord[];
  addPurchaseRecord: (record: PurchaseRecord) => void;
  getPurchaseRecords: (dateFrom?: string, dateTo?: string) => PurchaseRecord[];
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([]);

  const addPurchaseRecord = (record: PurchaseRecord) => {
    setPurchaseRecords(prev => [...prev, record]);
  };

  const getPurchaseRecords = (dateFrom?: string, dateTo?: string) => {
    if (!dateFrom || !dateTo) {
      return purchaseRecords;
    }
    
    return purchaseRecords.filter(record => {
      const recordDate = new Date(record.invoiceDate);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      
      return recordDate >= fromDate && recordDate <= toDate;
    });
  };

  return (
    <PurchaseContext.Provider value={{
      purchaseRecords,
      addPurchaseRecord,
      getPurchaseRecords
    }}>
      {children}
    </PurchaseContext.Provider>
  );
};
