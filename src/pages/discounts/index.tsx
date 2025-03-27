
import { useState } from "react";
import { Search, PlusCircle, Calendar, Percent, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Progress } from "@/components/ui/progress";
import { DiscountProvider, useDiscounts, Discount } from "@/contexts/DiscountContext";
import { DiscountForm } from "@/components/discounts/DiscountForm";
import { DiscountDetails } from "@/components/discounts/DiscountDetails";
import { toast } from "sonner";

const DiscountsPageContent = () => {
  const { discounts, isLoading, deleteDiscount, refreshDiscounts } = useDiscounts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Expired":
        return <Badge variant="outline" className="border-gray-500 text-gray-700 dark:text-gray-400">Expired</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const calculateUsagePercentage = (usage: number, maxUsage: number | null) => {
    if (maxUsage === null) return 0;
    return Math.min(Math.round((usage / maxUsage) * 100), 100);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteDiscount(id);
      if (selectedDiscount?.id === id) {
        setSelectedDiscount(null);
      }
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };
  
  const filteredDiscounts = discounts.filter(discount => 
    discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedDiscount) {
    return (
      <DiscountDetails
        discount={selectedDiscount}
        onBack={() => setSelectedDiscount(null)}
        onDelete={handleDelete}
        onUpdate={() => {
          refreshDiscounts();
          setSelectedDiscount(null);
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
            placeholder="Search discounts..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="bg-shopink-500 hover:bg-shopink-600"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Discount
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Discounts</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>Loading discounts...</p>
            </div>
          ) : filteredDiscounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No discounts found</p>
              <Button 
                className="mt-4 bg-shopink-500 hover:bg-shopink-600"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Create Your First Discount
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDiscounts.map((discount) => (
                <Card key={discount.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => setSelectedDiscount(discount)}>
                            {discount.name}
                          </h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
                              {discount.code}
                            </span>
                            {getStatusBadge(discount.status)}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => setSelectedDiscount(discount)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => {
                                navigator.clipboard.writeText(discount.code);
                                toast.success("Discount code copied to clipboard");
                              }}
                            >
                              <Percent className="mr-2 h-4 w-4" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400"
                              onClick={() => handleDelete(discount.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Discount</span>
                          </div>
                          <span className="font-semibold">
                            {discount.type === "Percentage" 
                              ? `${discount.value}%` 
                              : `$${discount.value.toFixed(2)}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Period</span>
                          </div>
                          <span>
                            {discount.startDate} {discount.endDate ? `- ${discount.endDate}` : 'onwards'}
                          </span>
                        </div>
                        
                        {discount.maxUsage !== null && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Usage</span>
                              <span className="text-sm">
                                {discount.usage} / {discount.maxUsage}
                              </span>
                            </div>
                            <Progress 
                              value={calculateUsagePercentage(discount.usage, discount.maxUsage)} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDiscount(discount)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      className="bg-shopink-500 hover:bg-shopink-600" 
                      size="sm"
                      onClick={() => setSelectedDiscount(discount)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDiscounts
              .filter(discount => discount.status === "Active")
              .map((discount) => (
                <Card key={discount.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => setSelectedDiscount(discount)}>
                            {discount.name}
                          </h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
                              {discount.code}
                            </span>
                            {getStatusBadge(discount.status)}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => setSelectedDiscount(discount)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => {
                                navigator.clipboard.writeText(discount.code);
                                toast.success("Discount code copied to clipboard");
                              }}
                            >
                              <Percent className="mr-2 h-4 w-4" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400"
                              onClick={() => handleDelete(discount.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Discount</span>
                          </div>
                          <span className="font-semibold">
                            {discount.type === "Percentage" 
                              ? `${discount.value}%` 
                              : `$${discount.value.toFixed(2)}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Period</span>
                          </div>
                          <span>
                            {discount.startDate} {discount.endDate ? `- ${discount.endDate}` : 'onwards'}
                          </span>
                        </div>
                        
                        {discount.maxUsage !== null && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Usage</span>
                              <span className="text-sm">
                                {discount.usage} / {discount.maxUsage}
                              </span>
                            </div>
                            <Progress 
                              value={calculateUsagePercentage(discount.usage, discount.maxUsage)} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDiscount(discount)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      className="bg-shopink-500 hover:bg-shopink-600"
                      size="sm"
                      onClick={() => setSelectedDiscount(discount)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDiscounts
              .filter(discount => discount.status === "Scheduled")
              .map((discount) => (
                <Card key={discount.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => setSelectedDiscount(discount)}>
                            {discount.name}
                          </h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
                              {discount.code}
                            </span>
                            {getStatusBadge(discount.status)}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => setSelectedDiscount(discount)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => {
                                navigator.clipboard.writeText(discount.code);
                                toast.success("Discount code copied to clipboard");
                              }}
                            >
                              <Percent className="mr-2 h-4 w-4" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400"
                              onClick={() => handleDelete(discount.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Discount</span>
                          </div>
                          <span className="font-semibold">
                            {discount.type === "Percentage" 
                              ? `${discount.value}%` 
                              : `$${discount.value.toFixed(2)}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Period</span>
                          </div>
                          <span>
                            {discount.startDate} {discount.endDate ? `- ${discount.endDate}` : 'onwards'}
                          </span>
                        </div>
                        
                        {discount.maxUsage !== null && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Usage</span>
                              <span className="text-sm">
                                {discount.usage} / {discount.maxUsage}
                              </span>
                            </div>
                            <Progress 
                              value={calculateUsagePercentage(discount.usage, discount.maxUsage)} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDiscount(discount)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      className="bg-shopink-500 hover:bg-shopink-600"
                      size="sm"
                      onClick={() => setSelectedDiscount(discount)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="expired" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDiscounts
              .filter(discount => discount.status === "Expired")
              .map((discount) => (
                <Card key={discount.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => setSelectedDiscount(discount)}>
                            {discount.name}
                          </h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
                              {discount.code}
                            </span>
                            {getStatusBadge(discount.status)}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => setSelectedDiscount(discount)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => {
                                navigator.clipboard.writeText(discount.code);
                                toast.success("Discount code copied to clipboard");
                              }}
                            >
                              <Percent className="mr-2 h-4 w-4" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400"
                              onClick={() => handleDelete(discount.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Discount</span>
                          </div>
                          <span className="font-semibold">
                            {discount.type === "Percentage" 
                              ? `${discount.value}%` 
                              : `$${discount.value.toFixed(2)}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Period</span>
                          </div>
                          <span>
                            {discount.startDate} {discount.endDate ? `- ${discount.endDate}` : 'onwards'}
                          </span>
                        </div>
                        
                        {discount.maxUsage !== null && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Usage</span>
                              <span className="text-sm">
                                {discount.usage} / {discount.maxUsage}
                              </span>
                            </div>
                            <Progress 
                              value={calculateUsagePercentage(discount.usage, discount.maxUsage)} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDiscount(discount)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      className="bg-shopink-500 hover:bg-shopink-600"
                      size="sm"
                      onClick={() => setSelectedDiscount(discount)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Discount Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Discount</DialogTitle>
          </DialogHeader>
          <DiscountForm onSuccess={() => {
            setIsAddDialogOpen(false);
            toast.success("Discount created successfully");
            refreshDiscounts();
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DiscountsPage = () => {
  return (
    <DiscountProvider>
      <DiscountsPageContent />
    </DiscountProvider>
  );
};

export default DiscountsPage;
