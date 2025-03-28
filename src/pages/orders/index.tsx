
import { useState, useEffect } from "react";
import { 
  Search, Filter, ChevronDown, Eye, Truck, Clock, CheckCircle, XCircle, AlertTriangle, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import OrderAssignmentDialog from "@/components/orders/OrderAssignmentDialog";
import OrderDetailsDialog from "@/components/orders/OrderDetailsDialog";

// Order type definition
interface Order {
  id: string;
  order_number: string;
  customer: string;
  date: string;
  status: string;
  payment: string;
  items: number;
  total: number;
  priority?: "high" | "medium" | "low";
  customer_id?: string;
}

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
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
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to match our Order interface
        const transformedOrders = data.map(order => ({
          id: order.id,
          order_number: order.order_number,
          customer: order.customers?.name || 'Unknown',
          date: new Date(order.created_at).toLocaleDateString(),
          status: order.status,
          payment: order.payment_status,
          items: order.items_count || 0,
          total: order.total,
          priority: getPriorityFromTotal(order.total),
          customer_id: order.customer_id
        }));
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    // Setup realtime subscription for new/updated orders
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, async (payload) => {
        console.log('Order change received:', payload);
        
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
            
          if (!error && data) {
            const updatedOrder = {
              id: data.id,
              order_number: data.order_number,
              customer: data.customers?.name || 'Unknown',
              date: new Date(data.created_at).toLocaleDateString(),
              status: data.status,
              payment: data.payment_status,
              items: data.items_count || 0,
              total: data.total,
              priority: getPriorityFromTotal(data.total),
              customer_id: data.customer_id
            };
            
            // Handle insert/update
            if (payload.eventType === 'INSERT') {
              setOrders(prev => [updatedOrder, ...prev]);
              toast.success(`New order received: ${data.order_number}`);
            } else if (payload.eventType === 'UPDATE') {
              setOrders(prev => 
                prev.map(order => order.id === data.id ? updatedOrder : order)
              );
              toast.info(`Order ${data.order_number} has been updated`);
            }
          }
        }
        
        // Handle delete
        if (payload.eventType === 'DELETE' && payload.old) {
          setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          toast.info(`Order ${payload.old.order_number} has been deleted`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  // Determine priority based on order total
  const getPriorityFromTotal = (total: number): "high" | "medium" | "low" => {
    if (total >= 500) return "high";
    if (total >= 200) return "medium";
    return "low";
  };

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      order.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesTab = activeTab === "all" || (
      (activeTab === "new" && ["Pending"].includes(order.status)) ||
      (activeTab === "processing" && ["Processing"].includes(order.status)) ||
      (activeTab === "shipped" && ["Shipped"].includes(order.status)) ||
      (activeTab === "delivered" && ["Delivered"].includes(order.status)) ||
      (activeTab === "cancelled" && ["Cancelled"].includes(order.status))
    );
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);
        
      if (error) throw error;
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };
  
  // Get status badge with appropriate styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "Shipped":
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500 text-yellow-900">Pending</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get payment badge with appropriate styling
  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Paid</Badge>;
      case "Unpaid":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-500">Unpaid</Badge>;
      case "Refunded":
        return <Badge variant="outline" className="border-red-500 text-red-700 dark:text-red-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">{payment}</Badge>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: "high" | "medium" | "low" | undefined) => {
    if (!priority) return null;
    
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Medium</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Low</Badge>;
    }
  };
  
  // Get action button based on order status
  const getActionButton = (order: Order) => {
    switch (order.status) {
      case "Pending":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                <Clock className="mr-1 h-3 w-3" /> Process
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                updateOrderStatus(order.id, "Processing");
              }}>
                <Clock className="mr-2 h-4 w-4" /> Process Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedOrder(order);
                setShowAssignmentDialog(true);
              }}>
                <Truck className="mr-2 h-4 w-4" /> Assign to Courier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                updateOrderStatus(order.id, "Cancelled");
              }} className="text-red-600">
                <XCircle className="mr-2 h-4 w-4" /> Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "Processing":
        return (
          <Button size="sm" className="bg-purple-500 hover:bg-purple-600" onClick={() => {
            updateOrderStatus(order.id, "Shipped");
          }}>
            <Truck className="mr-1 h-3 w-3" /> Ship
          </Button>
        );
      case "Shipped":
        return (
          <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => {
            updateOrderStatus(order.id, "Delivered");
          }}>
            <CheckCircle className="mr-1 h-3 w-3" /> Deliver
          </Button>
        );
      case "Delivered":
        return (
          <Button size="sm" variant="outline" disabled>
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Button>
        );
      case "Cancelled":
        return (
          <Button size="sm" variant="outline" className="border-red-500 text-red-500" disabled>
            <XCircle className="mr-1 h-3 w-3" /> Cancelled
          </Button>
        );
      default:
        return (
          <Button size="sm" variant="outline">
            <Eye className="mr-1 h-3 w-3" /> View
          </Button>
        );
    }
  };

  // Get order counts by status for the tabs
  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      new: orders.filter(order => order.status === "Pending").length,
      processing: orders.filter(order => order.status === "Processing").length,
      shipped: orders.filter(order => order.status === "Shipped").length,
      delivered: orders.filter(order => order.status === "Delivered").length,
      cancelled: orders.filter(order => order.status === "Cancelled").length
    };
    return counts;
  };

  const orderCounts = getOrderCounts();

  return (
    <div className="space-y-6">
      {/* Order tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b dark:border-gray-700 grid grid-cols-6 bg-transparent">
          <TabsTrigger value="all" className="data-[state=active]:border-b-2 border-shopink-500 data-[state=active]:text-shopink-500 rounded-none">
            All Orders ({orderCounts.all})
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:border-b-2 border-shopink-500 data-[state=active]:text-shopink-500 rounded-none">
            New ({orderCounts.new})
          </TabsTrigger>
          <TabsTrigger value="processing" className="data-[state=active]:border-b-2 border-shopink-500 data-[state=active]:text-shopink-500 rounded-none">
            Processing ({orderCounts.processing})
          </TabsTrigger>
          <TabsTrigger value="shipped" className="data-[state=active]:border-b-2 border-shopink-500 data-[state=active]:text-shopink-500 rounded-none">
            Shipped ({orderCounts.shipped})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="data-[state=active]:border-b-2 border-shopink-500 data-[state=active]:text-shopink-500 rounded-none">
            Delivered ({orderCounts.delivered})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:border-b-2 border-shopink-500 data-[state=active]:text-shopink-500 rounded-none">
            Cancelled ({orderCounts.cancelled})
          </TabsTrigger>
        </TabsList>
        
        {/* Order content for all tabs */}
        <TabsContent value="all" className="pt-4">
          <OrdersContent 
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredOrders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
            getPriorityBadge={getPriorityBadge}
            getActionButton={getActionButton}
            setSelectedOrder={setSelectedOrder}
            setShowOrderDetails={setShowOrderDetails}
          />
        </TabsContent>
        
        <TabsContent value="new" className="pt-4">
          <OrdersContent 
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredOrders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
            getPriorityBadge={getPriorityBadge}
            getActionButton={getActionButton}
            setSelectedOrder={setSelectedOrder}
            setShowOrderDetails={setShowOrderDetails}
          />
        </TabsContent>
        
        <TabsContent value="processing" className="pt-4">
          <OrdersContent 
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredOrders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
            getPriorityBadge={getPriorityBadge}
            getActionButton={getActionButton}
            setSelectedOrder={setSelectedOrder}
            setShowOrderDetails={setShowOrderDetails}
          />
        </TabsContent>
        
        <TabsContent value="shipped" className="pt-4">
          <OrdersContent 
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredOrders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
            getPriorityBadge={getPriorityBadge}
            getActionButton={getActionButton}
            setSelectedOrder={setSelectedOrder}
            setShowOrderDetails={setShowOrderDetails}
          />
        </TabsContent>
        
        <TabsContent value="delivered" className="pt-4">
          <OrdersContent 
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredOrders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
            getPriorityBadge={getPriorityBadge}
            getActionButton={getActionButton}
            setSelectedOrder={setSelectedOrder}
            setShowOrderDetails={setShowOrderDetails}
          />
        </TabsContent>
        
        <TabsContent value="cancelled" className="pt-4">
          <OrdersContent 
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredOrders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
            getPriorityBadge={getPriorityBadge}
            getActionButton={getActionButton}
            setSelectedOrder={setSelectedOrder}
            setShowOrderDetails={setShowOrderDetails}
          />
        </TabsContent>
      </Tabs>
      
      {/* Order details dialog */}
      {selectedOrder && (
        <OrderDetailsDialog 
          order={selectedOrder}
          open={showOrderDetails}
          onOpenChange={setShowOrderDetails}
        />
      )}
      
      {/* Order assignment dialog */}
      {selectedOrder && (
        <OrderAssignmentDialog
          order={selectedOrder}
          open={showAssignmentDialog}
          onOpenChange={setShowAssignmentDialog}
        />
      )}
    </div>
  );
};

// Separate component for the orders content to avoid code duplication
interface OrdersContentProps {
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredOrders: Order[];
  getStatusBadge: (status: string) => JSX.Element;
  getPaymentBadge: (payment: string) => JSX.Element;
  getPriorityBadge: (priority?: "high" | "medium" | "low") => JSX.Element | null;
  getActionButton: (order: Order) => JSX.Element;
  setSelectedOrder: (order: Order) => void;
  setShowOrderDetails: (show: boolean) => void;
}

const OrdersContent = ({
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  filteredOrders,
  getStatusBadge,
  getPaymentBadge,
  getPriorityBadge,
  getActionButton,
  setSelectedOrder,
  setShowOrderDetails
}: OrdersContentProps) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search orders..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Payment Status</DropdownMenuItem>
              <DropdownMenuItem>Date Range</DropdownMenuItem>
              <DropdownMenuItem>Order Value</DropdownMenuItem>
              <DropdownMenuItem>Priority Level</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-shopink-500 hover:bg-shopink-600">Export</Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-shopink-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No Orders Found</h3>
            <p className="text-sm text-gray-500 mt-1">
              There are no orders matching your current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.payment)}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionButton(order)}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
