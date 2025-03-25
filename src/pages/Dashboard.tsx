
import { ShoppingBag, DollarSign, Users, Package, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import OrdersOverview from "@/components/dashboard/OrdersOverview";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import RecentOrders from "@/components/dashboard/RecentOrders";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value="$48,924.00"
          icon={DollarSign}
          trend={{ value: "12.5%", positive: true }}
        />
        <StatCard
          title="Total Orders"
          value="1,248"
          icon={ShoppingBag}
          trend={{ value: "8.2%", positive: true }}
        />
        <StatCard
          title="Active Customers"
          value="824"
          icon={Users}
          trend={{ value: "4.3%", positive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value="12"
          icon={Package}
          trend={{ value: "2 new", positive: false }}
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
