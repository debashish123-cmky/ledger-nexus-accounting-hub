
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PurchaseProvider } from './contexts/PurchaseContext';
import { DataProvider } from './contexts/DataContext';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SalesPage from './pages/SalesPage';
import CustomerEntry from './pages/CustomerEntry';
import PurchaseEntry from './pages/PurchaseEntry';
import ClientManagement from './pages/ClientManagement';
import VendorManagement from './pages/VendorManagement';
import StockManagement from './pages/StockManagement';
import StockExpiry from './pages/StockExpiry';
import SalesReport from './pages/SalesReport';
import PurchaseReport from './pages/PurchaseReport';
import InvoiceReprint from './pages/InvoiceReprint';
import VendorPayment from './pages/VendorPayment';
import TodaysCollection from './pages/TodaysCollection';
import LedgerView from './pages/LedgerView';
import Settings from './pages/Settings';
import AccountantPage from './pages/AccountantPage';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/sales" element={
        <ProtectedRoute>
          <Layout>
            <SalesPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/customer-entry" element={
        <ProtectedRoute>
          <Layout>
            <CustomerEntry />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/purchase-entry" element={
        <ProtectedRoute>
          <Layout>
            <PurchaseEntry />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Layout>
            <ClientManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/vendors" element={
        <ProtectedRoute>
          <Layout>
            <VendorManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/stock-management" element={
        <ProtectedRoute>
          <Layout>
            <StockManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/stock-expiry" element={
        <ProtectedRoute>
          <Layout>
            <StockExpiry />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/sales-report" element={
        <ProtectedRoute>
          <Layout>
            <SalesReport />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/purchase-report" element={
        <ProtectedRoute>
          <Layout>
            <PurchaseReport />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/invoice-reprint" element={
        <ProtectedRoute>
          <Layout>
            <InvoiceReprint />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/vendor-payment" element={
        <ProtectedRoute>
          <Layout>
            <VendorPayment />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/todays-collection" element={
        <ProtectedRoute>
          <Layout>
            <TodaysCollection />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/ledger-view" element={
        <ProtectedRoute>
          <Layout>
            <LedgerView />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/accountant" element={
        <ProtectedRoute>
          <Layout>
            <AccountantPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <PurchaseProvider>
          <DataProvider>
            <Router>
              <div className="App">
                <AppRoutes />
                <Toaster />
              </div>
            </Router>
          </DataProvider>
        </PurchaseProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
