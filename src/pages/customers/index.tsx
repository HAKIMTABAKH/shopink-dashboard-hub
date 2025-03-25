
import { useState } from "react";
import { Search, Filter, Eye, Mail, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Sample data
const customersData = [
  {
    id: "C001",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    joinDate: "Mar 15, 2023",
    orders: 12,
    spent: 1249.99,
    status: "Active",
  },
  {
    id: "C002",
    name: "Liam Smith",
    email: "liam.smith@example.com",
    joinDate: "Apr 22, 2023",
    orders: 5,
    spent: 499.95,
    status: "Active",
  },
  {
    id: "C003",
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    joinDate: "Jan 08, 2023",
    orders: 8,
    spent: 859.92,
    status: "Inactive",
  },
  {
    id: "C004",
    name: "Noah Wilson",
    email: "noah.wilson@example.com",
    joinDate: "May 14, 2023",
    orders: 2,
    spent: 159.98,
    status: "Active",
  },
  {
    id: "C005",
    name: "Ava Miller",
    email: "ava.miller@example.com",
    joinDate: "Feb 17, 2023",
    orders: 0,
    spent: 0,
    status: "Inactive",
  },
  {
    id: "C006",
    name: "Sophia Anderson",
    email: "sophia.anderson@example.com",
    joinDate: "Apr 03, 2023",
    orders: 4,
    spent: 379.96,
    status: "Active",
  },
  {
    id: "C007",
    name: "Isabella Thomas",
    email: "isabella.thomas@example.com",
    joinDate: "Mar 29, 2023",
    orders: 7,
    spent: 699.93,
    status: "Active",
  },
  {
    id: "C008",
    name: "Mia Jackson",
    email: "mia.jackson@example.com",
    joinDate: "Jan 25, 2023",
    orders: 3,
    spent: 244.97,
    status: "Active",
  },
];

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="border-gray-500 text-gray-700 dark:text-gray-400">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const filteredCustomers = customersData.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search customers..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-shopink-500 hover:bg-shopink-600">Add Customer</Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-shopink-100 text-shopink-800">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="truncate text-lg mt-3">{customer.name}</CardTitle>
                  <CardDescription className="truncate">{customer.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Customer ID</span>
                      <span className="text-sm font-medium">{customer.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Join Date</span>
                      <span className="text-sm">{customer.joinDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                      <span className="text-sm">{customer.orders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                      <span className="text-sm font-medium">${customer.spent.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                      {getStatusBadge(customer.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCustomers
              .filter(customer => customer.status === "Active")
              .map((customer) => (
                <Card key={customer.id} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-shopink-100 text-shopink-800">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="truncate text-lg mt-3">{customer.name}</CardTitle>
                    <CardDescription className="truncate">{customer.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Customer ID</span>
                        <span className="text-sm font-medium">{customer.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Join Date</span>
                        <span className="text-sm">{customer.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                        <span className="text-sm">{customer.orders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                        <span className="text-sm font-medium">${customer.spent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        {getStatusBadge(customer.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCustomers
              .filter(customer => customer.status === "Inactive")
              .map((customer) => (
                <Card key={customer.id} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-shopink-100 text-shopink-800">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="truncate text-lg mt-3">{customer.name}</CardTitle>
                    <CardDescription className="truncate">{customer.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Customer ID</span>
                        <span className="text-sm font-medium">{customer.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Join Date</span>
                        <span className="text-sm">{customer.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                        <span className="text-sm">{customer.orders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                        <span className="text-sm font-medium">${customer.spent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        {getStatusBadge(customer.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCustomers
              .filter(customer => new Date(customer.joinDate).getMonth() === new Date().getMonth())
              .map((customer) => (
                <Card key={customer.id} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-shopink-100 text-shopink-800">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="truncate text-lg mt-3">{customer.name}</CardTitle>
                    <CardDescription className="truncate">{customer.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Customer ID</span>
                        <span className="text-sm font-medium">{customer.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Join Date</span>
                        <span className="text-sm">{customer.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                        <span className="text-sm">{customer.orders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                        <span className="text-sm font-medium">${customer.spent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        {getStatusBadge(customer.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomersPage;
