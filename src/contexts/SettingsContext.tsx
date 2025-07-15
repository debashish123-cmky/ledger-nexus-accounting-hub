
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  // UI Settings
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
  timeFormat: string;
  setTimeFormat: (format: string) => void;
  showAnimations: boolean;
  setShowAnimations: (show: boolean) => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
  
  // Role Settings
  adminAccess: boolean;
  setAdminAccess: (access: boolean) => void;
  accountantAccess: boolean;
  setAccountantAccess: (access: boolean) => void;
  salesAccess: boolean;
  setSalesAccess: (access: boolean) => void;
  viewerAccess: boolean;
  setViewerAccess: (access: boolean) => void;
  
  // Company Settings
  companyName: string;
  setCompanyName: (name: string) => void;
  gstNumber: string;
  setGstNumber: (gst: string) => void;
  panNumber: string;
  setPanNumber: (pan: string) => void;
  address: string;
  setAddress: (address: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  setEmail: (email: string) => void;
  financialYear: string;
  setFinancialYear: (year: string) => void;
  
  // Backup Settings
  autoBackup: boolean;
  setAutoBackup: (auto: boolean) => void;
  backupFrequency: string;
  setBackupFrequency: (frequency: string) => void;
  retentionDays: number;
  setRetentionDays: (days: number) => void;
  lastBackup: string;
  setLastBackup: (date: string) => void;

  // Translation function
  t: (key: string) => string;
}

// Translation dictionaries
const translations = {
  english: {
    dashboard: 'Dashboard',
    settings: 'Settings',
    purchaseEntry: 'Purchase Entry',
    vendors: 'Vendors',
    clients: 'Clients',
    reports: 'Reports',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    print: 'Print',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    amount: 'Amount',
    quantity: 'Quantity',
    rate: 'Rate',
    description: 'Description',
    date: 'Date',
    invoiceNo: 'Invoice No',
    vendorName: 'Vendor Name',
    companyName: 'Company Name',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    gstNumber: 'GST Number',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    confirmation: 'Confirmation'
  },
  bengali: {
    dashboard: 'ড্যাশবোর্ড',
    settings: 'সেটিংস',
    purchaseEntry: 'ক্রয় এন্ট্রি',
    vendors: 'বিক্রেতা',
    clients: 'ক্লায়েন্ট',
    reports: 'রিপোর্ট',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    delete: 'মুছে ফেলুন',
    edit: 'সম্পাদনা',
    add: 'যোগ করুন',
    search: 'অনুসন্ধান',
    filter: 'ফিল্টার',
    export: 'রপ্তানি',
    import: 'আমদানি',
    print: 'প্রিন্ট',
    total: 'মোট',
    subtotal: 'উপমোট',
    tax: 'কর',
    amount: 'পরিমাণ',
    quantity: 'পরিমাণ',
    rate: 'হার',
    description: 'বিবরণ',
    date: 'তারিখ',
    invoiceNo: 'চালান নম্বর',
    vendorName: 'বিক্রেতার নাম',
    companyName: 'কোম্পানির নাম',
    address: 'ঠিকানা',
    phone: 'ফোন',
    email: 'ইমেইল',
    gstNumber: 'জিএসটি নম্বর',
    loading: 'লোড হচ্ছে...',
    success: 'সফল',
    error: 'ত্রুটি',
    warning: 'সতর্কতা',
    confirmation: 'নিশ্চিতকরণ'
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // UI Settings
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');
  const [dateFormat, setDateFormat] = useState('dd-mm-yyyy');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [showAnimations, setShowAnimations] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  
  // Role Settings
  const [adminAccess, setAdminAccess] = useState(true);
  const [accountantAccess, setAccountantAccess] = useState(true);
  const [salesAccess, setSalesAccess] = useState(false);
  const [viewerAccess, setViewerAccess] = useState(false);
  
  // Company Settings
  const [companyName, setCompanyName] = useState('Accounting Pro');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [financialYear, setFinancialYear] = useState('2024-25');
  
  // Backup Settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionDays, setRetentionDays] = useState(30);
  const [lastBackup, setLastBackup] = useState('2024-01-15 10:30:00');

  // Translation function
  const t = (key: string): string => {
    const currentLang = language as keyof typeof translations;
    const langDict = translations[currentLang] || translations.english;
    return langDict[key as keyof typeof langDict] || key;
  };

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply compact mode
    if (compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Apply animations
    if (!showAnimations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
  }, [theme, compactMode, showAnimations]);

  // Save settings to localStorage
  useEffect(() => {
    const settings = {
      theme, language, dateFormat, timeFormat, showAnimations, compactMode,
      adminAccess, accountantAccess, salesAccess, viewerAccess,
      companyName, gstNumber, panNumber, address, phone, email, financialYear,
      autoBackup, backupFrequency, retentionDays, lastBackup
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [
    theme, language, dateFormat, timeFormat, showAnimations, compactMode,
    adminAccess, accountantAccess, salesAccess, viewerAccess,
    companyName, gstNumber, panNumber, address, phone, email, financialYear,
    autoBackup, backupFrequency, retentionDays, lastBackup
  ]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.theme) setTheme(settings.theme);
        if (settings.language) setLanguage(settings.language);
        if (settings.dateFormat) setDateFormat(settings.dateFormat);
        if (settings.timeFormat) setTimeFormat(settings.timeFormat);
        if (settings.showAnimations !== undefined) setShowAnimations(settings.showAnimations);
        if (settings.compactMode !== undefined) setCompactMode(settings.compactMode);
        if (settings.companyName) setCompanyName(settings.companyName);
        if (settings.gstNumber) setGstNumber(settings.gstNumber);
        if (settings.address) setAddress(settings.address);
        if (settings.phone) setPhone(settings.phone);
        if (settings.email) setEmail(settings.email);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  return (
    <SettingsContext.Provider value={{
      theme, setTheme,
      language, setLanguage,
      dateFormat, setDateFormat,
      timeFormat, setTimeFormat,
      showAnimations, setShowAnimations,
      compactMode, setCompactMode,
      adminAccess, setAdminAccess,
      accountantAccess, setAccountantAccess,
      salesAccess, setSalesAccess,
      viewerAccess, setViewerAccess,
      companyName, setCompanyName,
      gstNumber, setGstNumber,
      panNumber, setPanNumber,
      address, setAddress,
      phone, setPhone,
      email, setEmail,
      financialYear, setFinancialYear,
      autoBackup, setAutoBackup,
      backupFrequency, setBackupFrequency,
      retentionDays, setRetentionDays,
      lastBackup, setLastBackup,
      t
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
