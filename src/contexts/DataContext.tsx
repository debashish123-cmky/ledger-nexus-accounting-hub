
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  createdAt: string;
}

interface Vendor {
  id: string;
  vendorNumber: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  paymentTerms: string;
  category: string;
  createdAt: string;
}

interface Sale {
  id: string;
  customerName: string;
  phoneNumber?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  invoiceNumber?: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

interface Account {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Purchase {
  id: string;
  vendorName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  invoiceNumber?: string;
}

interface LedgerEntry {
  id: string;
  ledgerName: string;
  amount: number;
  debit: number;
  credit: number;
  group: 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | 'Equity';
}

interface DataContextType {
  customers: Customer[];
  vendors: Vendor[];
  sales: Sale[];
  roles: Role[];
  accounts: Account[];
  purchases: Purchase[];
  ledgers: LedgerEntry[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id'>) => void;
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  addLedger: (ledger: Omit<LedgerEntry, 'id'>) => void;
  updateLedger: (id: string, ledger: Partial<LedgerEntry>) => void;
  deleteLedger: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [ledgers, setLedgers] = useState<LedgerEntry[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('medical-store-customers');
    const savedVendors = localStorage.getItem('medical-store-vendors');
    const savedSales = localStorage.getItem('medical-store-sales');
    const savedRoles = localStorage.getItem('medical-store-roles');
    const savedAccounts = localStorage.getItem('medical-store-accounts');
    const savedPurchases = localStorage.getItem('medical-store-purchases');
    const savedLedgers = localStorage.getItem('medical-store-ledgers');

    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedVendors) setVendors(JSON.parse(savedVendors));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedRoles) setRoles(JSON.parse(savedRoles));
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
    if (savedLedgers) setLedgers(JSON.parse(savedLedgers));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('medical-store-customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('medical-store-vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('medical-store-sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('medical-store-roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('medical-store-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('medical-store-purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('medical-store-ledgers', JSON.stringify(ledgers));
  }, [ledgers]);

  // Customer functions
  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, customer: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Vendor functions
  const addVendor = (vendor: Omit<Vendor, 'id' | 'createdAt'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setVendors(prev => [...prev, newVendor]);
  };

  const updateVendor = (id: string, vendor: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...vendor } : v));
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  // Sales functions
  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
    };
    setSales(prev => [...prev, newSale]);
  };

  // Role functions
  const addRole = (role: Omit<Role, 'id' | 'createdAt'>) => {
    const newRole: Role = {
      ...role,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = (id: string, role: Partial<Role>) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...role } : r));
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  // Account functions
  const addAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = (id: string, account: Partial<Account>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...account } : a));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  // Purchase functions
  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
    };
    setPurchases(prev => [...prev, newPurchase]);
  };

  // Ledger functions
  const addLedger = (ledger: Omit<LedgerEntry, 'id'>) => {
    const newLedger: LedgerEntry = {
      ...ledger,
      id: Date.now().toString(),
    };
    setLedgers(prev => [...prev, newLedger]);
  };

  const updateLedger = (id: string, ledger: Partial<LedgerEntry>) => {
    setLedgers(prev => prev.map(l => l.id === id ? { ...l, ...ledger } : l));
  };

  const deleteLedger = (id: string) => {
    setLedgers(prev => prev.filter(l => l.id !== id));
  };

  const value: DataContextType = {
    customers,
    vendors,
    sales,
    roles,
    accounts,
    purchases,
    ledgers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addVendor,
    updateVendor,
    deleteVendor,
    addSale,
    addRole,
    updateRole,
    deleteRole,
    addAccount,
    updateAccount,
    deleteAccount,
    addPurchase,
    addLedger,
    updateLedger,
    deleteLedger,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
