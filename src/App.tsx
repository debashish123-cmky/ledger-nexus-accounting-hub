
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PurchaseProvider } from "./contexts/PurchaseContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ClientManagement from "./pages/ClientManagement";
import VendorManagement from "./pages/VendorManagement";
import PurchaseEntry from "./pages/PurchaseEntry";
import InvoiceReprint from "./pages/InvoiceReprint";
import PurchaseOrder from "./pages/PurchaseOrder";
import VendorPayment from "./pages/VendorPayment";
import StockManagement from "./pages/StockManagement";
import StockExpiry from "./pages/StockExpiry";
import TodaysCollection from "./pages/TodaysCollection";
import PurchaseReport from "./pages/PurchaseReport";
import SalesReport from "./pages/SalesReport";
import LedgerView from "./pages/LedgerView";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SettingsProvider>
          <PurchaseProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
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
                <Route path="/purchase-entry" element={
                  <ProtectedRoute>
                    <Layout>
                      <PurchaseEntry />
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
                <Route path="/purchase-order" element={
                  <ProtectedRoute>
                    <Layout>
                      <PurchaseOrder />
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
                <Route path="/todays-collection" element={
                  <ProtectedRoute>
                    <Layout>
                      <TodaysCollection />
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
                <Route path="/sales-report" element={
                  <ProtectedRoute>
                    <Layout>
                      <SalesReport />
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
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </PurchaseProvider>
        </SettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
