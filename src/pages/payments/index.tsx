
import { useState } from "react";
import { Search, Filter, Download, Eye, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const paymentsData = [
  {
    id: "PAY-1234567",
    orderId: "#ORD-5321",
    customer: "John Smith",
    method: "Credit Card",
    date: "Jun 12, 2023",
    amount: 249.99,
    status: "Completed",
  },
  {
    id: "PAY-1234568",
    orderId: "#ORD-5322",
    customer: "Emily Johnson",
    method: "PayPal",
    date: "Jun 12, 2023",
    amount: 59.99,
    status: "Completed",
  },
  {
    id: "PAY-1234569",
    orderId: "#ORD-5323",
    customer: "Michael Davis",
    method: "Credit Card",
    date: "Jun 11, 2023",
    amount: 149.98,
    status: "Completed",
  },
  {
    id: "PAY-1234570",
    orderId: "#ORD-5324",
    customer: "Sarah Wilson",
    method: "Pending",
    date: "Jun 11, 2023",
    amount: 299.96,
    status: "Pending",
  },
  {
    id: "PAY-1234571",
    orderId: "#ORD-5325",
    customer: "Robert Brown",
    method: "Credit Card",
    date: "Jun 10, 2023",
    amount: 79.99,
    status: "Refunded",
  },
  {
    id: "PAY-1234572",
    orderId: "#ORD-5326",
    customer: "Lisa Miller",
    method: "Apple Pay",
    date: "Jun 10, 2023",
    amount: 159.98,
    status: "Completed",
  },
  {
    id: "PAY-1234573",
    orderId: "#ORD-5327",
    customer: "James Wilson",
    method: "PayPal",
    date: "Jun 9, 2023",
    amount: 229.97,
    status: "Completed",
  },
  {
    id: "PAY-1234574",
    orderId: "#ORD-5328",
    customer: "Jennifer Garcia",
    method: "Credit Card",
    date: "Jun 9, 2023",
    amount: 99.99,
    status: "Failed",
  },
];

// Payment stats
const paymentStats = [
  {
    title: "Total Revenue",
    value: "$12,589.22",
    change: "+12.3%",
    positive: true,
    icon: <CheckCircle className="h-8 w-8 text-green-500" />,
    className: "border-green-100 dark:border-green-900/20",
  },
  {
    title: "Pending Payments",
    value: "$856.45",
    change: "3 transactions",
    positive: false,
    icon: <AlertCircle className="h-8 w-8 text-yellow-500" />,
    className: "border-yellow-100 dark:border-yellow-900/20",
  },
  {
    title: "Refunded",
    value: "$428.72",
    change: "5 transactions",
    positive: false,
    icon: <XCircle className="h-8 w-8 text-red-500" />,
    className: "border-red-100 dark:border-red-900/20",
  },
];

const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-500">Pending</Badge>;
      case "Failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      case "Refunded":
        return <Badge variant="outline" className="border-red-500 text-red-700 dark:text-red-500">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const filteredPayments = paymentsData.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      payment.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentStats.map((stat, index) => (
          <Card key={index} className={`border-l-4 ${stat.className}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`text-sm ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {stat.change}
                  </div>
                </div>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search payments..." 
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
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Date Range
          </Button>
          
          <Button className="bg-shopink-500 hover:bg-shopink-600">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.orderId}</TableCell>
                <TableCell>{payment.customer}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentsPage;
