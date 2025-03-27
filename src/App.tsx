
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/products";
import OrdersPage from "./pages/orders";
import CustomersPage from "./pages/customers";
import PaymentsPage from "./pages/payments";
import DiscountsPage from "./pages/discounts";
import InventoryPage from "./pages/inventory";
import ReportsPage from "./pages/reports";
import MarketingPage from "./pages/marketing";
import SettingsPage from "./pages/settings";
import AuthPage from "./pages/auth";
import NotFound from "./pages/NotFound";
import { ProductProvider } from "./contexts/ProductContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import { DiscountProvider } from "./contexts/DiscountContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <CustomerProvider>
          <DiscountProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="payments" element={<PaymentsPage />} />
                    <Route path="discounts" element={<DiscountsPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="marketing" element={<MarketingPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </DiscountProvider>
        </CustomerProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
