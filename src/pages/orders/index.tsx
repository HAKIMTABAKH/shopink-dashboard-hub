
import { useState } from "react";
import { Search, Filter, ChevronDown, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

// Sample data
const ordersData = [
  {
    id: "#ORD-5321",
    customer: "John Smith",
    date: "Jun 12, 2023",
    status: "Delivered",
    payment: "Paid",
    items: 3,
    total: 249.99,
  },
  {
    id: "#ORD-5322",
    customer: "Emily Johnson",
    date: "Jun 12, 2023",
    status: "Processing",
    payment: "Paid",
    items: 1,
    total: 59.99,
  },
  {
    id: "#ORD-5323",
    customer: "Michael Davis",
    date: "Jun 11, 2023",
    status: "Shipped",
    payment: "Paid",
    items: 2,
    total: 149.98,
  },
  {
    id: "#ORD-5324",
    customer: "Sarah Wilson",
    date: "Jun 11, 2023",
    status: "Pending",
    payment: "Unpaid",
    items: 4,
    total: 299.96,
  },
  {
    id: "#ORD-5325",
    customer: "Robert Brown",
    date: "Jun 10, 2023",
    status: "Cancelled",
    payment: "Refunded",
    items: 1,
    total: 79.99,
  },
  {
    id: "#ORD-5326",
    customer: "Lisa Miller",
    date: "Jun 10, 2023",
    status: "Delivered",
    payment: "Paid",
    items: 2,
    total: 159.98,
  },
  {
    id: "#ORD-5327",
    customer: "James Wilson",
    date: "Jun 9, 2023",
    status: "Delivered",
    payment: "Paid",
    items: 3,
    total: 229.97,
  },
  {
    id: "#ORD-5328",
    customer: "Jennifer Garcia",
    date: "Jun 9, 2023",
    status: "Shipped",
    payment: "Paid",
    items: 1,
    total: 99.99,
  },
];

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
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
  
  const getActionButton = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            <Truck className="mr-1 h-3 w-3" /> Process
          </Button>
        );
      case "Processing":
        return (
          <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
            <Truck className="mr-1 h-3 w-3" /> Ship
          </Button>
        );
      case "Shipped":
        return (
          <Button size="sm" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Deliver
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
  
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-shopink-500 hover:bg-shopink-600">Export</Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{getPaymentBadge(order.payment)}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getActionButton(order.status)}
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersPage;
