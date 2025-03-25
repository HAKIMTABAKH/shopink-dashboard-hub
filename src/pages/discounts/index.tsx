
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
import { Progress } from "@/components/ui/progress";

// Sample discounts data
const discountsData = [
  {
    id: "DISC001",
    name: "Summer Sale 2023",
    code: "SUMMER23",
    type: "Percentage",
    value: 15,
    usage: 124,
    maxUsage: 500,
    startDate: "Jun 1, 2023",
    endDate: "Aug 31, 2023",
    status: "Active",
  },
  {
    id: "DISC002",
    name: "New User Discount",
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    usage: 287,
    maxUsage: 1000,
    startDate: "Jan 1, 2023",
    endDate: "Dec 31, 2023",
    status: "Active",
  },
  {
    id: "DISC003",
    name: "Weekend Flash Sale",
    code: "FLASH25",
    type: "Percentage",
    value: 25,
    usage: 78,
    maxUsage: 100,
    startDate: "Jun 24, 2023",
    endDate: "Jun 25, 2023",
    status: "Active",
  },
  {
    id: "DISC004",
    name: "Free Shipping",
    code: "FREESHIP",
    type: "Fixed",
    value: 10,
    usage: 312,
    maxUsage: 500,
    startDate: "May 1, 2023",
    endDate: "Jul 31, 2023",
    status: "Active",
  },
  {
    id: "DISC005",
    name: "Spring Clearance",
    code: "SPRING30",
    type: "Percentage",
    value: 30,
    usage: 450,
    maxUsage: 450,
    startDate: "Mar 1, 2023",
    endDate: "May 31, 2023",
    status: "Expired",
  },
  {
    id: "DISC006",
    name: "VIP Customer Discount",
    code: "VIP15",
    type: "Percentage",
    value: 15,
    usage: 89,
    maxUsage: null,
    startDate: "Jan 1, 2023",
    endDate: null,
    status: "Active",
  },
  {
    id: "DISC007",
    name: "Holiday Promotion",
    code: "HOLIDAY20",
    type: "Percentage",
    value: 20,
    usage: 0,
    maxUsage: 300,
    startDate: "Dec 1, 2023",
    endDate: "Dec 31, 2023",
    status: "Scheduled",
  },
  {
    id: "DISC008",
    name: "Clearance Items",
    code: "CLEAR50",
    type: "Percentage",
    value: 50,
    usage: 175,
    maxUsage: 200,
    startDate: "May 15, 2023",
    endDate: "Jun 15, 2023",
    status: "Expired",
  },
];

const DiscountsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
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
  
  const filteredDiscounts = discountsData.filter(discount => 
    discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Button className="bg-shopink-500 hover:bg-shopink-600">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDiscounts.map((discount) => (
              <Card key={discount.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{discount.name}</h3>
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
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400">
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
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Button>
                  <Button 
                    className="bg-shopink-500 hover:bg-shopink-600" 
                    size="sm"
                  >
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                          <h3 className="text-lg font-semibold">{discount.name}</h3>
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
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400">
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
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      className="bg-shopink-500 hover:bg-shopink-600" 
                      size="sm"
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
                          <h3 className="text-lg font-semibold">{discount.name}</h3>
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
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400">
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
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      className="bg-shopink-500 hover:bg-shopink-600" 
                      size="sm"
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
                          <h3 className="text-lg font-semibold">{discount.name}</h3>
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
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400">
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
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      className="bg-shopink-500 hover:bg-shopink-600" 
                      size="sm"
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
    </div>
  );
};

export default DiscountsPage;
