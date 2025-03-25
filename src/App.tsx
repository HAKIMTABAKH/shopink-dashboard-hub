
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<div className="p-4 text-center">Orders Page Coming Soon</div>} />
            <Route path="products" element={<div className="p-4 text-center">Products Page Coming Soon</div>} />
            <Route path="customers" element={<div className="p-4 text-center">Customers Page Coming Soon</div>} />
            <Route path="payments" element={<div className="p-4 text-center">Payments Page Coming Soon</div>} />
            <Route path="discounts" element={<div className="p-4 text-center">Discounts Page Coming Soon</div>} />
            <Route path="inventory" element={<div className="p-4 text-center">Inventory Page Coming Soon</div>} />
            <Route path="reports" element={<div className="p-4 text-center">Reports Page Coming Soon</div>} />
            <Route path="marketing" element={<div className="p-4 text-center">Marketing Page Coming Soon</div>} />
            <Route path="settings" element={<div className="p-4 text-center">Settings Page Coming Soon</div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
