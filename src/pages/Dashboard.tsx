
import { useState, useEffect } from "react";
import { ShoppingBag, DollarSign, Users, Package, Clock, Eye } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import OrdersOverview from "@/components/dashboard/OrdersOverview";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import RecentOrders from "@/components/dashboard/RecentOrders";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const navigate = useNavigate();

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

        // Fetch recent pending orders for the live queue
        const { data: pendingOrdersData, error: pendingOrdersError } = await supabase
          .from("orders")
          .select(`
            id, 
            order_number, 
            status, 
            payment_status, 
            total, 
            items_count,
            created_at,
            customer_id,
            customers(name)
          `)
          .eq("status", "Pending")
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (pendingOrdersError) throw pendingOrdersError;
        
        // Transform the data
        const formattedOrders = pendingOrdersData.map(order => ({
          id: order.id,
          order_number: order.order_number,
          customer: order.customers?.name || 'Unknown',
          date: new Date(order.created_at).toLocaleString(),
          status: order.status,
          payment: order.payment_status,
          items: order.items_count || 0,
          total: order.total
        }));
        
        setRecentOrders(formattedOrders);
        
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

    // Setup real-time subscription for new orders
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'orders' 
      }, async (payload) => {
        console.log('New order received:', payload);
        
        // Fetch the complete order with customer info
        if (payload.new) {
          const { data, error } = await supabase
            .from("orders")
            .select(`
              id, 
              order_number, 
              status, 
              payment_status, 
              total, 
              items_count,
              created_at,
              customer_id,
              customers(name)
            `)
            .eq('id', payload.new.id)
            .single();
            
          if (!error && data && data.status === "Pending") {
            const newOrder = {
              id: data.id,
              order_number: data.order_number,
              customer: data.customers?.name || 'Unknown',
              date: new Date(data.created_at).toLocaleString(),
              status: data.status,
              payment: data.payment_status,
              items: data.items_count || 0,
              total: data.total
            };
            
            // Add to recent orders if it's pending
            setRecentOrders(prev => {
              const updated = [newOrder, ...prev].slice(0, 5);
              return updated;
            });
            
            // Update total orders count
            setStats(prev => ({
              ...prev,
              totalOrders: (parseInt(prev.totalOrders) + 1).toString()
            }));
            
            // Show toast notification
            toast.success("New order received", {
              description: `Order #${data.order_number} from ${data.customers?.name || 'Unknown'}`,
              action: {
                label: "View",
                onClick: () => navigate("/orders")
              }
            });
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [navigate]);

  const processOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: "Processing", 
          updated_at: new Date().toISOString() 
        })
        .eq("id", orderId);
        
      if (error) throw error;
      
      // Remove from recent orders list
      setRecentOrders(prev => prev.filter(order => order.id !== orderId));
      
      toast.success("Order moved to processing");
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process order");
    }
  };

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

      {/* Real-time Orders Queue */}
      {recentOrders.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              Orders Queue
              <Badge className="ml-2 bg-yellow-500 text-white">{recentOrders.length} New</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.order_number}</span>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer} • {order.items} items • ${order.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.date}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => processOrder(order.id)}
                    >
                      <Clock className="mr-1 h-3 w-3" /> Process
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center pt-2">
                <Button 
                  variant="link" 
                  className="text-shopink-500"
                  onClick={() => navigate("/orders")}
                >
                  View All Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
