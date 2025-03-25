
import { useState } from "react";
import { 
  User, 
  Key, 
  CreditCard, 
  Building, 
  Truck, 
  Bell, 
  Globe, 
  Shield, 
  RefreshCw,
  Save,
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

// Staff members sample data
const staffMembers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Admin",
    lastActive: "Just now",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "Manager",
    lastActive: "2 hours ago",
    avatar: "EJ",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Sales Representative",
    lastActive: "1 day ago",
    avatar: "MB",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Customer Support",
    lastActive: "3 days ago",
    avatar: "SW",
  },
];

// Roles & permissions data
const rolesData = [
  {
    name: "Admin",
    description: "Full access to all resources",
    permissions: [
      "Manage Products",
      "Manage Orders",
      "Manage Customers",
      "Manage Staff",
      "View Reports",
      "Manage Settings",
      "Process Refunds",
    ],
  },
  {
    name: "Manager",
    description: "Can manage most aspects of the store",
    permissions: [
      "Manage Products",
      "Manage Orders",
      "Manage Customers",
      "View Reports",
      "Process Refunds",
    ],
  },
  {
    name: "Sales Representative",
    description: "Can manage products and handle orders",
    permissions: [
      "Manage Products",
      "Manage Orders",
      "View Customers",
    ],
  },
  {
    name: "Customer Support",
    description: "Can handle customer inquiries and order issues",
    permissions: [
      "View Products",
      "View Orders",
      "Manage Customers",
      "Process Refunds",
    ],
  },
];

const SettingsPage = () => {
  const [storeDetails, setStoreDetails] = useState({
    name: "Shopink Store",
    email: "contact@shopink.com",
    phone: "+1 (555) 123-4567",
    address: "123 Commerce St, New York, NY 10001",
    currency: "USD",
    timezone: "America/New_York",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    lowStock: true,
    customerSignups: false,
    returnRequests: true,
    failedPayments: true,
    newsletterSignups: false,
  });
  
  const handleStoreInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-red-500">Admin</Badge>;
      case "Manager":
        return <Badge className="bg-blue-500">Manager</Badge>;
      case "Sales Representative":
        return <Badge className="bg-green-500">Sales Rep</Badge>;
      case "Customer Support":
        return <Badge className="bg-purple-500">Support</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-1">Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your store settings and preferences</p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="staff">Staff & Permissions</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Manage your store details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input 
                    id="storeName" 
                    name="name"
                    value={storeDetails.name}
                    onChange={handleStoreInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Support Email</Label>
                  <Input 
                    id="storeEmail" 
                    name="email" 
                    type="email"
                    value={storeDetails.email}
                    onChange={handleStoreInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Support Phone</Label>
                  <Input 
                    id="storePhone" 
                    name="phone"
                    value={storeDetails.phone}
                    onChange={handleStoreInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeCurrency">Default Currency</Label>
                  <Select 
                    value={storeDetails.currency}
                    onValueChange={(value) => setStoreDetails(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger id="storeCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea 
                  id="storeAddress" 
                  name="address"
                  value={storeDetails.address}
                  onChange={handleStoreInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeTimezone">Timezone</Label>
                <Select 
                  value={storeDetails.timezone}
                  onValueChange={(value) => setStoreDetails(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger id="storeTimezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Store Preferences</CardTitle>
              <CardDescription>
                Customize your store behavior and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Customer Reviews</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow customers to leave product reviews
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Track Inventory</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically update inventory when orders are placed
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow Guest Checkout</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Let customers check out without creating an account
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Display Stock Levels</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Show remaining stock for products on the store
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="mt-0 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Staff Members</h3>
            <Button className="bg-shopink-500 hover:bg-shopink-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-shopink-100 text-shopink-800">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.email}</CardDescription>
                      </div>
                    </div>
                    {getRoleBadge(member.role)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                      <span className="text-sm">{member.role}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Last Active</span>
                      <span className="text-sm">{member.lastActive}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20">
                    Revoke Access
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col items-center justify-center p-6">
              <User className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="font-medium mb-1">Add New Staff Member</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                Invite a team member to help manage your store
              </p>
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </Card>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Roles & Permissions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolesData.map((role, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{role.name}</CardTitle>
                      <Button variant="outline" size="sm">Edit Role</Button>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2 text-sm">Permissions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed flex flex-col items-center justify-center p-6">
                <Shield className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="font-medium mb-1">Create Custom Role</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                  Define a new role with custom permissions
                </p>
                <Button className="bg-shopink-500 hover:bg-shopink-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Role
                </Button>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure payment gateways and options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Credit & Debit Cards</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Accept Visa, Mastercard, Amex via Stripe
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 18C5.84315 18 4.5 16.6569 4.5 15C4.5 13.3431 5.84315 12 7.5 12H7.51L9.5 6H10.98C11.7512 6 12.3867 6.5699 12.4922 7.33333L13.3833 13.3333H16C17.6569 13.3333 19 14.6765 19 16.3333C19 17.9902 17.6569 19.3333 16 19.3333H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">PayPal</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow customers to pay with PayPal
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 15C8.10457 15 9 14.1046 9 13C9 11.8954 8.10457 11 7 11C5.89543 11 5 11.8954 5 13C5 14.1046 5.89543 15 7 15Z" fill="currentColor"/>
                      <path d="M15 11C13.8954 11 13 11.8954 13 13C13 14.1046 13.8954 15 15 15C16.1046 15 17 14.1046 17 13C17 11.8954 16.1046 11 15 11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Apple Pay / Google Pay</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable digital wallet payments
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    <Building className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Bank Transfer</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow direct bank transfer payments
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                General payment configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Test Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Process test payments without actual charges
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require CVV</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Request card verification value for card payments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Refunds</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow customers to request refunds through your store
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Transaction Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refundPeriod">Refund Period</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="refundPeriod">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
              <CardDescription>
                Configure shipping methods and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Standard Shipping</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      5-7 business days - $4.99
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Express Shipping</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      2-3 business days - $9.99
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Next Day Delivery</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Next business day - $14.99
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-md">
                    <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Free Shipping</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      On orders over $50 - 5-7 business days
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Shipping Option
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shipping Integrations</CardTitle>
              <CardDescription>
                Connect with shipping carriers and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13 7H17C18.6569 7 20 8.34315 20 10V14C20 15.6569 18.6569 17 17 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">DHL Express</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Connected - API integration
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 18H5C3.34315 18 2 16.6569 2 15V9C2 7.34315 3.34315 6 5 6H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 18H19C20.6569 18 22 16.6569 22 15V9C22 7.34315 20.6569 6 19 6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="8" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">FedEx</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Not connected
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                    <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 12H2C2 9.87827 2.84285 7.84344 4.34315 6.34315C5.84344 4.84285 7.87827 4 10 4H14C16.1217 4 18.1566 4.84285 19.6569 6.34315C21.1571 7.84344 22 9.87827 22 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 22C6.65685 22 8 20.6569 8 19C8 17.3431 6.65685 16 5 16C3.34315 16 2 17.3431 2 19C2 20.6569 3.34315 22 5 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 22C20.6569 22 22 20.6569 22 19C22 17.3431 20.6569 16 19 16C17.3431 16 16 17.3431 16 19C16 20.6569 17.3431 22 19 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">UPS</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Not connected
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Settings</CardTitle>
              <CardDescription>
                Manage email notifications sent to you and your staff
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Orders</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email when a new order is placed
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.newOrders} 
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, newOrders: checked }))
                  }
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Low Stock Alerts</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when products are running low
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.lowStock} 
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, lowStock: checked }))
                  }
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Customer Sign-ups</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email when a new customer creates an account
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.customerSignups} 
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, customerSignups: checked }))
                  }
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Return Requests</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when customers request a return
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.returnRequests} 
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, returnRequests: checked }))
                  }
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Failed Payments</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when a payment fails
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.failedPayments} 
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, failedPayments: checked }))
                  }
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Newsletter Sign-ups</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications for newsletter subscriptions
                  </p>
                </div>
                <Switch 
                  checked={notificationSettings.newsletterSignups} 
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, newsletterSignups: checked }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Default</Button>
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>App Notification Settings</CardTitle>
              <CardDescription>
                Manage notifications within the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable browser push notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Desktop Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Show notifications on your desktop when the app is minimized
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Sound Alerts</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Play sound when you receive important notifications
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
