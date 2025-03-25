
import { useState } from "react";
import { Calendar, BarChart3, PieChart, Download, Filter, ArrowRight, TrendingUp, TrendingDown, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from "recharts";

// Sample data for sales report
const salesData = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 198 },
  { name: "Mar", sales: 5000, orders: 280 },
  { name: "Apr", sales: 2780, orders: 190 },
  { name: "May", sales: 1890, orders: 150 },
  { name: "Jun", sales: 6390, orders: 310 },
  { name: "Jul", sales: 3490, orders: 220 },
];

// Sample data for product category breakdown
const categoryData = [
  { name: "Footwear", value: 45 },
  { name: "Apparel", value: 30 },
  { name: "Electronics", value: 15 },
  { name: "Accessories", value: 10 },
];

// Sample data for customer acquisition
const customerData = [
  { name: "Jan", new: 500, returning: 300 },
  { name: "Feb", new: 450, returning: 290 },
  { name: "Mar", new: 600, returning: 400 },
  { name: "Apr", new: 550, returning: 380 },
  { name: "May", new: 700, returning: 480 },
  { name: "Jun", new: 650, returning: 520 },
  { name: "Jul", new: 800, returning: 600 },
];

// Sample data for top-selling products
const topProducts = [
  { name: "Nike Air Max 270", sales: 234, revenue: 34999.66 },
  { name: "Adidas Ultraboost 22", sales: 187, revenue: 29999.73 },
  { name: "Apple iPhone 14 Pro", sales: 156, revenue: 155844.44 },
  { name: "Levi's 501 Original Fit Jeans", sales: 132, revenue: 11879.68 },
  { name: "Samsung Galaxy S23", sales: 120, revenue: 107999.8 },
];

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
          
          <Button className="bg-shopink-500 hover:bg-shopink-600">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
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
                  <select 
                    className="rounded-md border border-gray-300 dark:border-gray-700 py-1.5 px-3 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-shopink-500"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="last-90-days">Last 90 Days</option>
                    <option value="last-year">Last Year</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          
          {/* Top Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products by sales</CardDescription>
            </CardHeader>
            <CardContent>
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
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Product category distribution</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
            
            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Top products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="mt-0 space-y-6">
          {/* Customer Acquisition */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition</CardTitle>
              <CardDescription>New vs. returning customers</CardDescription>
            </CardHeader>
            <CardContent>
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
