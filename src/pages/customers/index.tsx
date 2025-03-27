
import { useState } from "react";
import { Search, Filter, Eye, Mail, MoreHorizontal, PlusCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerProvider, useCustomers, Customer } from "@/contexts/CustomerContext";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { EmailCustomerForm } from "@/components/customers/EmailCustomerForm";
import { toast } from "sonner";

const CustomersPageContent = () => {
  const { customers, isLoading, deleteCustomer, refreshCustomers } = useCustomers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [emailCustomer, setEmailCustomer] = useState<Customer | null>(null);
  
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
  
  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id);
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleSendEmail = (customer: Customer) => {
    setEmailCustomer(customer);
  };
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine customer status based on orders/activity
  const getCustomerStatus = (customer: Customer): string => {
    return customer.total_orders > 0 ? "Active" : "Inactive";
  };

  // Check if a customer is from current month (new)
  const isNewCustomer = (joinDate: string): boolean => {
    const customerDate = new Date(joinDate);
    const currentDate = new Date();
    return customerDate.getMonth() === currentDate.getMonth() && 
           customerDate.getFullYear() === currentDate.getFullYear();
  };

  if (selectedCustomer) {
    return (
      <CustomerDetails
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        onDelete={handleDelete}
        onUpdate={() => {
          refreshCustomers();
          setSelectedCustomer(null);
        }}
      />
    );
  }

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
          <Button 
            className="bg-shopink-500 hover:bg-shopink-600"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
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
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found</p>
              <Button 
                className="mt-4 bg-shopink-500 hover:bg-shopink-600"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add Your First Customer
              </Button>
            </div>
          ) : (
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
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleSendEmail(customer)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-500 focus:text-red-500"
                            onClick={() => handleDelete(customer.id)}
                          >
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle 
                      className="truncate text-lg mt-3 cursor-pointer hover:underline"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      {customer.name}
                    </CardTitle>
                    <CardDescription className="truncate">{customer.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Customer ID</span>
                        <span className="text-sm font-medium">{customer.id.substring(0, 8)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Join Date</span>
                        <span className="text-sm">{customer.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                        <span className="text-sm">{customer.total_orders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                        <span className="text-sm font-medium">${customer.total_spent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        {getStatusBadge(getCustomerStatus(customer))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCustomers
              .filter(customer => getCustomerStatus(customer) === "Active")
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
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleSendEmail(customer)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-500 focus:text-red-500"
                            onClick={() => handleDelete(customer.id)}
                          >
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle 
                      className="truncate text-lg mt-3 cursor-pointer hover:underline"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      {customer.name}
                    </CardTitle>
                    <CardDescription className="truncate">{customer.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Customer ID</span>
                        <span className="text-sm font-medium">{customer.id.substring(0, 8)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Join Date</span>
                        <span className="text-sm">{customer.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                        <span className="text-sm">{customer.total_orders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                        <span className="text-sm font-medium">${customer.total_spent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        {getStatusBadge(getCustomerStatus(customer))}
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
              .filter(customer => getCustomerStatus(customer) === "Inactive")
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
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleSendEmail(customer)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-500 focus:text-red-500"
                            onClick={() => handleDelete(customer.id)}
                          >
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle 
                      className="truncate text-lg mt-3 cursor-pointer hover:underline"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      {customer.name}
                    </CardTitle>
                    <CardDescription className="truncate">{customer.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Customer ID</span>
                        <span className="text-sm font-medium">{customer.id.substring(0, 8)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Join Date</span>
                        <span className="text-sm">{customer.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                        <span className="text-sm">{customer.total_orders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                        <span className="text-sm font-medium">${customer.total_spent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        {getStatusBadge(getCustomerStatus(customer))}
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
              .filter(customer => isNewCustomer(customer.joinDate))
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
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleSendEmail(customer)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-500 focus:text-red-500"
                            onClick={() => handleDelete(customer.id)}
                          >
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle 
                      className="truncate text-lg mt-3 cursor-pointer hover:underline"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      {customer.name}
                    </CardTitle>
                    <CardDescription className="truncate">{customer.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Customer ID</span>
                        <span className="text-sm font-medium">{customer.id.substring(0, 8)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Join Date</span>
                        <span className="text-sm">{customer.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                        <span className="text-sm">{customer.total_orders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                        <span className="text-sm font-medium">${customer.total_spent.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        {getStatusBadge(getCustomerStatus(customer))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm onSuccess={() => {
            setIsAddDialogOpen(false);
            toast.success("Customer added successfully");
            refreshCustomers();
          }} />
        </DialogContent>
      </Dialog>

      {/* Email Customer Dialog */}
      {emailCustomer && (
        <EmailCustomerForm
          customer={emailCustomer}
          open={Boolean(emailCustomer)}
          onOpenChange={(open) => {
            if (!open) setEmailCustomer(null);
          }}
        />
      )}
    </div>
  );
};

const CustomersPage = () => {
  return (
    <CustomerProvider>
      <CustomersPageContent />
    </CustomerProvider>
  );
};

export default CustomersPage;
