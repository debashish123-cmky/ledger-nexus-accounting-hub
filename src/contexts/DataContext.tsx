
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Customer {
  id: string;
  customerName: string;
  phoneNo: string;
  taxableAmt: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  invoices: number;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  status: 'active' | 'inactive';
  totalPurchases: number;
  lastPurchase: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  vendorNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  status: 'active' | 'inactive';
  category: string;
  totalSupplied: number;
  lastSupply: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  customer: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing';
  date: string;
}

export interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

export interface Account {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface DataContextType {
  customers: Customer[];
  clients: Client[];
  vendors: Vendor[];
  sales: Sale[];
  products: Product[];
  roles: Role[];
  accounts: Account[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Client) => void;
  deleteClient: (id: string) => void;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, vendor: Vendor) => void;
  deleteVendor: (id: string) => void;
  addSale: (sale: Sale) => void;
  updateSale: (id: string, sale: Sale) => void;
  deleteSale: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  addRole: (role: Role) => void;
  updateRole: (id: string, role: Role) => void;
  deleteRole: (id: string) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: string, account: Account) => void;
  deleteAccount: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const updateCustomer = (id: string, customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === id ? customer : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const updateClient = (id: string, client: Client) => {
    setClients(prev => prev.map(c => c.id === id ? client : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addVendor = (vendor: Vendor) => {
    setVendors(prev => [...prev, vendor]);
  };

  const updateVendor = (id: string, vendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === id ? vendor : v));
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  const addSale = (sale: Sale) => {
    setSales(prev => [...prev, sale]);
  };

  const updateSale = (id: string, sale: Sale) => {
    setSales(prev => prev.map(s => s.id === id ? sale : s));
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, product: Product) => {
    setProducts(prev => prev.map(p => p.id === id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addRole = (role: Role) => {
    setRoles(prev => [...prev, role]);
  };

  const updateRole = (id: string, role: Role) => {
    setRoles(prev => prev.map(r => r.id === id ? role : r));
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  const addAccount = (account: Account) => {
    setAccounts(prev => [...prev, account]);
  };

  const updateAccount = (id: string, account: Account) => {
    setAccounts(prev => prev.map(a => a.id === id ? account : a));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <DataContext.Provider value={{
      customers,
      clients,
      vendors,
      sales,
      products,
      roles,
      accounts,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addClient,
      updateClient,
      deleteClient,
      addVendor,
      updateVendor,
      deleteVendor,
      addSale,
      updateSale,
      deleteSale,
      addProduct,
      updateProduct,
      deleteProduct,
      addRole,
      updateRole,
      deleteRole,
      addAccount,
      updateAccount,
      deleteAccount
    }}>
      {children}
    </DataContext.Provider>
  );
};
