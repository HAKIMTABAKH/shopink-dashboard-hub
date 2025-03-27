
import { useState, useEffect } from "react";
import { ShoppingBag, DollarSign, Users, Package, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import OrdersOverview from "@/components/dashboard/OrdersOverview";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import RecentOrders from "@/components/dashboard/RecentOrders";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: "$0.00",
    salesTrend: "0%",
    totalOrders: "0",
    ordersTrend: "0%",
    activeCustomers: "0",
    customersTrend: "0%",
    lowStockItems: "0",
    lowStockTrend: "0 new",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch total sales
        const { data: salesData, error: salesError } = await supabase
          .from("orders")
          .select("total")
          .eq("payment_status", "Paid");
          
        if (salesError) throw salesError;
        
        // Calculate total sales
        const totalSales = salesData.reduce((sum, order) => sum + order.total, 0);
        
        // Fetch order count
        const { count: orderCount, error: orderError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });
          
        if (orderError) throw orderError;
        
        // Fetch customer count
        const { count: customerCount, error: customerError } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true });
          
        if (customerError) throw customerError;
        
        // Fetch low stock items
        const { data: lowStockData, error: stockError } = await supabase
          .from("products")
          .select("*")
          .or("status.eq.Low Stock,status.eq.Out of Stock");
          
        if (stockError) throw stockError;
        
        setStats({
          totalSales: `$${totalSales.toFixed(2)}`,
          salesTrend: "12.5%", // This would ideally be calculated by comparing to previous period
          totalOrders: orderCount?.toString() || "0",
          ordersTrend: "8.2%",  // This would ideally be calculated by comparing to previous period
          activeCustomers: customerCount?.toString() || "0",
          customersTrend: "4.3%",  // This would ideally be calculated by comparing to previous period
          lowStockItems: lowStockData?.length.toString() || "0",
          lowStockTrend: `${lowStockData?.filter(item => item.status === "Out of Stock").length} out`,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          icon={DollarSign}
          trend={{ value: stats.salesTrend, positive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend={{ value: stats.ordersTrend, positive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers}
          icon={Users}
          trend={{ value: stats.customersTrend, positive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={Package}
          trend={{ value: stats.lowStockTrend, positive: false }}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <OrdersOverview />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <LowStockAlert />
        </div>
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
