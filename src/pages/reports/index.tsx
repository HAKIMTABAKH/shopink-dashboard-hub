
import { useState, useEffect } from "react";
import { Calendar, BarChart3, PieChart, Download, Filter, ArrowRight, TrendingUp, TrendingDown, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from "recharts";
import {
  fetchSalesData,
  fetchCategoryData,
  fetchCustomerData,
  fetchTopProducts,
  exportReportData,
  SalesData,
  CategoryData,
  CustomerData,
  TopProduct
} from "@/services/reports";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Stats overview
const statsOverview = [
  { 
    title: "Total Revenue", 
    value: "$48,924.00", 
    trend: "+12.5%", 
    description: "Compared to previous period", 
    icon: <TrendingUp className="h-8 w-8 text-green-500" />,
    positive: true,
  },
  { 
    title: "Average Order Value", 
    value: "$89.42", 
    trend: "+2.3%", 
    description: "Compared to previous period", 
    icon: <BarChart3 className="h-8 w-8 text-shopink-500" />,
    positive: true,
  },
  { 
    title: "Conversion Rate", 
    value: "3.2%", 
    trend: "-0.4%", 
    description: "Compared to previous period", 
    icon: <TrendingDown className="h-8 w-8 text-red-500" />,
    positive: false,
  },
  { 
    title: "Total Orders", 
    value: "1,867", 
    trend: "+8.2%", 
    description: "Compared to previous period", 
    icon: <Layers className="h-8 w-8 text-blue-500" />,
    positive: true,
  },
];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchReportData();
  }, []);
  
  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const [sales, categories, customers, products] = await Promise.all([
        fetchSalesData(),
        fetchCategoryData(),
        fetchCustomerData(),
        fetchTopProducts()
      ]);
      
      setSalesData(sales);
      setCategoryData(categories);
      setCustomerData(customers);
      setTopProducts(products);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to load report data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = (data: any[], filename: string) => {
    exportReportData(data, filename, 'csv');
    
    toast({
      title: "Export Successful",
      description: `The ${filename} report has been exported to CSV.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Analytics & Reports</h2>
          <p className="text-gray-500 dark:text-gray-400">Track your business performance and gain insights.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Custom Date Range
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport(salesData, 'sales-report')}>
                Sales Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(topProducts, 'product-performance')}>
                Product Performance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(customerData, 'customer-acquisition')}>
                Customer Acquisition
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsOverview.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`flex items-center text-xs mt-1 ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.positive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                {stat.trend} <span className="text-gray-500 dark:text-gray-400 ml-1">{stat.description}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Report Tabs */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="mt-0 space-y-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Monthly sales and orders overview</CardDescription>
                </div>
                <div className="mt-3 md:mt-0">
                  <Select 
                    value={dateRange}
                    onValueChange={setDateRange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                  Loading sales data...
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stackId="1"
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        name="Sales ($)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="orders" 
                        stackId="2"
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        name="Orders"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Top Products Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Best performing products by sales</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport(topProducts, 'top-products')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">Loading product data...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-3">Product</th>
                        <th className="text-right pb-3">Units Sold</th>
                        <th className="text-right pb-3">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr 
                          key={index} 
                          className="border-b last:border-b-0 dark:border-gray-800"
                        >
                          <td className="py-3">{product.name}</td>
                          <td className="py-3 text-right">{product.sales}</td>
                          <td className="py-3 text-right">${product.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-shopink-500 hover:text-shopink-600 p-0 h-auto"
                >
                  View All Products <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>Product category distribution</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport(categoryData, 'category-breakdown')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    Loading category data...
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RPieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Product Performance */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Performance</CardTitle>
                    <CardDescription>Top products by revenue</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport(topProducts, 'product-revenue')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    Loading product performance data...
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topProducts.map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), revenue: p.revenue / 1000 }))}
                        margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}k`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue (thousands)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="mt-0 space-y-6">
          {/* Customer Acquisition */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Customer Acquisition</CardTitle>
                  <CardDescription>New vs. returning customers</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport(customerData, 'customer-acquisition')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                  Loading customer data...
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={customerData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="new" stackId="a" fill="#8884d8" name="New Customers" />
                      <Bar dataKey="returning" stackId="a" fill="#82ca9d" name="Returning Customers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Customer Location Map Card (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
              <CardDescription>Customer distribution by location and age</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Customer demographic map would be displayed here</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Top Locations</h4>
                  <p className="font-medium">New York, California, Texas</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Age Groups</h4>
                  <p className="font-medium">25-34 (42%), 18-24 (27%)</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gender Distribution</h4>
                  <p className="font-medium">Female (58%), Male (42%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
