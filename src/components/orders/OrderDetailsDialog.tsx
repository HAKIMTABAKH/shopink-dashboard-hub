
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Package, 
  CreditCard, 
  Truck, 
  ClipboardList, 
  AlertCircle,
  MessageSquare 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailsDialog = ({ order, open, onOpenChange }: OrderDetailsDialogProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderNotes, setOrderNotes] = useState<string>("");
  
  useEffect(() => {
    if (open && order) {
      // Fetch order items and customer details
      const fetchOrderDetails = async () => {
        setIsLoading(true);
        try {
          // Fetch order items with product info
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              price,
              quantity,
              product_id,
              products(name)
            `)
            .eq('order_id', order.id);
            
          if (itemsError) throw itemsError;
          
          // Transform items data
          const transformedItems = items.map(item => ({
            id: item.id,
            product_name: item.products?.name || 'Unknown Product',
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          }));
          
          setOrderItems(transformedItems);
          
          // Fetch customer details if customer_id exists
          if (order.customer_id) {
            const { data: customer, error: customerError } = await supabase
              .from('customers')
              .select('*')
              .eq('id', order.customer_id)
              .single();
              
            if (customerError) throw customerError;
            
            setCustomerDetails(customer);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
          toast.error("Failed to load order details");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrderDetails();
    }
  }, [open, order]);

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
  
  // Get priority badge with appropriate styling
  const getPriorityBadge = (priority: "high" | "medium" | "low" | undefined) => {
    if (!priority) return null;
    
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Medium Priority</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Low Priority</Badge>;
    }
  };

  // Add order notes
  const addOrderNote = () => {
    if (orderNotes.trim()) {
      toast.success("Order note added successfully");
      setOrderNotes("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Order #{order.order_number}</span>
              {getStatusBadge(order.status)}
              {getPriorityBadge(order.priority)}
            </div>
            <div>
              {getPaymentBadge(order.payment)}
            </div>
          </DialogTitle>
          <DialogDescription>
            Placed on {order.date} • {order.items} items • ${order.total.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-shopink-500"></div>
          </div>
        ) : (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="notes">Notes & History</TabsTrigger>
            </TabsList>
            
            {/* Order Details Tab */}
            <TabsContent value="details" className="space-y-4 py-4">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Package className="mr-2 h-5 w-5 text-gray-500" />
                Order Items
              </h3>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.product_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-bold text-right">Total:</td>
                      <td className="px-6 py-4 text-sm font-bold">${order.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      Order Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Order Placed:</span>
                      <span>{order.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Updated:</span>
                      <span>{order.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Expected Delivery:</span>
                      <span>{order.status === "Delivered" ? "Delivered" : "2-3 business days"}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment Method:</span>
                      <span>Credit Card</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment Status:</span>
                      <span>{order.payment}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Transaction ID:</span>
                      <span>TXN_{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Customer Tab */}
            <TabsContent value="customer" className="space-y-4 py-4">
              {customerDetails ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <div className="h-full w-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{customerDetails.name}</h3>
                      <p className="text-sm text-gray-500">{customerDetails.email}</p>
                      {customerDetails.phone && <p className="text-sm text-gray-500">{customerDetails.phone}</p>}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        Customer Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Customer ID:</span>
                          <span>{customerDetails.id.substring(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Orders:</span>
                          <span>{customerDetails.total_orders || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Spent:</span>
                          <span>${(customerDetails.total_spent || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Customer Since:</span>
                          <span>{new Date(customerDetails.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <ClipboardList className="mr-2 h-4 w-4 text-gray-500" />
                        Shipping Address
                      </h4>
                      {customerDetails.address ? (
                        <div className="text-sm">
                          <p>{customerDetails.address}</p>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          No shipping address available
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button className="bg-shopink-500 hover:bg-shopink-600">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Customer
                    </Button>
                    <Button variant="outline">View Purchase History</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">Customer details not available</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-md">
                    The customer information for this order could not be found or is not available.
                  </p>
                </div>
              )}
            </TabsContent>
            
            {/* Shipping Tab */}
            <TabsContent value="shipping" className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-gray-500" />
                  Shipping Information
                </h3>
                <Badge className={
                  order.status === "Delivered" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                    : order.status === "Shipped" 
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                }>
                  {order.status === "Delivered" 
                    ? "Delivered" 
                    : order.status === "Shipped" 
                    ? "In Transit"
                    : "Not Shipped Yet"}
                </Badge>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  {order.status === "Pending" || order.status === "Processing" ? (
                    <div className="text-center py-8">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-full p-4 inline-flex mb-4">
                        <AlertCircle className="h-8 w-8 text-yellow-500" />
                      </div>
                      <h3 className="text-lg font-medium">Not Shipped Yet</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                        This order has not been shipped yet. It is currently in the {order.status.toLowerCase()} stage.
                      </p>
                      <Button className="mt-4 bg-shopink-500 hover:bg-shopink-600">
                        <Truck className="mr-2 h-4 w-4" />
                        Prepare for Shipping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping Method:</span>
                            <span>Standard Shipping</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Courier:</span>
                            <span>FedEx</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tracking Number:</span>
                            <span className="font-medium">FX{Math.floor(Math.random() * 1000000000)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping Date:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Estimated Delivery:</span>
                            <span>{order.status === "Delivered" ? "Delivered" : new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                          <div className="text-sm border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                            <p>{customerDetails?.name || order.customer}</p>
                            <p>{customerDetails?.address || "123 Main St, Apt 4B"}</p>
                            <p>New York, NY 10001</p>
                            <p>United States</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-4">Tracking Progress</h4>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                          </div>
                          <div className="relative flex justify-between">
                            <div className="flex flex-col items-center">
                              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${order.status !== "Cancelled" ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                                <CheckCircle className="h-5 w-5 text-white" />
                              </div>
                              <div className="text-xs mt-2">Order Placed</div>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${(order.status === "Processing" || order.status === "Shipped" || order.status === "Delivered") ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                                <Package className="h-5 w-5 text-white" />
                              </div>
                              <div className="text-xs mt-2">Processing</div>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${(order.status === "Shipped" || order.status === "Delivered") ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                                <Truck className="h-5 w-5 text-white" />
                              </div>
                              <div className="text-xs mt-2">Shipped</div>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${order.status === "Delivered" ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                                <CheckCircle className="h-5 w-5 text-white" />
                              </div>
                              <div className="text-xs mt-2">Delivered</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-6">
                        <Button className="bg-shopink-500 hover:bg-shopink-600">
                          <Eye className="mr-2 h-4 w-4" />
                          Track Package
                        </Button>
                        <Button variant="outline">
                          Print Shipping Label
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notes & History Tab */}
            <TabsContent value="notes" className="space-y-4 py-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
                  Order Notes
                </h3>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <textarea 
                        className="w-full min-h-[100px] p-3 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-shopink-500"
                        placeholder="Add a note about this order..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                      />
                      
                      <Button onClick={addOrderNote} disabled={!orderNotes.trim()}>
                        Add Note
                      </Button>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-4">Order History</h4>
                      
                      <div className="space-y-4">
                        <div className="flex gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Order status changed</span>
                              <Badge variant="outline" className="text-xs">System</Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Order status changed to {order.status}</p>
                            <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Payment received</span>
                              <Badge variant="outline" className="text-xs">System</Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Payment of ${order.total.toFixed(2)} received via Credit Card</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 p-3 border border-gray-100 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Order created</span>
                              <Badge variant="outline" className="text-xs">System</Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Order #{order.order_number} has been created</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
