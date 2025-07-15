
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

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
      lastBackup, setLastBackup
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
