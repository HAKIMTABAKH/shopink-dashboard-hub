
import { useState } from "react";
import { PlusCircle, Mail, BellRing, Send, Calendar, Search, Users, CheckCircle, Clock, Target, MoreHorizontal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data for campaigns
const campaignsData = [
  {
    id: "CAM001",
    name: "Summer Collection Launch",
    type: "Email",
    status: "Scheduled",
    audience: "All Customers",
    recipients: 3245,
    scheduledDate: "Jun 25, 2023",
    openRate: null,
    clickRate: null,
  },
  {
    id: "CAM002",
    name: "Flash Sale Weekend",
    type: "Push Notification",
    status: "Active",
    audience: "Previous Buyers",
    recipients: 1820,
    scheduledDate: "Jun 15, 2023",
    openRate: 62,
    clickRate: 28,
  },
  {
    id: "CAM003",
    name: "New User Welcome",
    type: "Email",
    status: "Active",
    audience: "New Customers",
    recipients: 420,
    scheduledDate: "Automated",
    openRate: 78,
    clickRate: 45,
  },
  {
    id: "CAM004",
    name: "Abandoned Cart Reminder",
    type: "Email",
    status: "Active",
    audience: "Cart Abandoners",
    recipients: 187,
    scheduledDate: "Automated",
    openRate: 54,
    clickRate: 32,
  },
  {
    id: "CAM005",
    name: "Holiday Season Promotion",
    type: "Email",
    status: "Draft",
    audience: "All Customers",
    recipients: 0,
    scheduledDate: "Not scheduled",
    openRate: null,
    clickRate: null,
  },
  {
    id: "CAM006",
    name: "Loyalty Program Rewards",
    type: "Push Notification",
    status: "Completed",
    audience: "VIP Customers",
    recipients: 576,
    scheduledDate: "Jun 02, 2023",
    openRate: 82,
    clickRate: 54,
  },
];

// Sample data for audience segments
const audienceSegments = [
  {
    name: "All Customers",
    count: 8725,
    description: "All registered customers",
  },
  {
    name: "Active Buyers",
    count: 5433,
    description: "Customers who made a purchase in the last 3 months",
  },
  {
    name: "New Users",
    count: 1245,
    description: "Customers who registered in the last 30 days",
  },
  {
    name: "Cart Abandoners",
    count: 876,
    description: "Customers who abandoned their cart in the last 7 days",
  },
  {
    name: "VIP Customers",
    count: 576,
    description: "Customers who spent over $1000 in the last year",
  },
];

const MarketingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case "Draft":
        return <Badge variant="outline" className="border-gray-500 text-gray-700 dark:text-gray-400">Draft</Badge>;
      case "Completed":
        return <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Email":
        return <Mail className="h-4 w-4 text-shopink-500" />;
      case "Push Notification":
        return <BellRing className="h-4 w-4 text-blue-500" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  
  const filteredCampaigns = campaignsData.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.audience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Marketing & Campaigns</h2>
          <p className="text-gray-500 dark:text-gray-400">Create and manage marketing campaigns</p>
        </div>
        <Button className="bg-shopink-500 hover:bg-shopink-600">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Campaigns</CardTitle>
              <Mail className="h-5 w-5 text-shopink-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignsData.length}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {campaignsData.filter(c => c.status === "Active").length} active campaigns
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Open Rate</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(campaignsData
                .filter(c => c.openRate !== null)
                .reduce((acc, curr) => acc + (curr.openRate || 0), 0) / 
                campaignsData.filter(c => c.openRate !== null).length)}%
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Industry avg: 21.5%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Audience</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,725</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Across {audienceSegments.length} segments
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience Segments</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-0 space-y-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(campaign.type)}
                      <div>
                        <CardTitle className="text-base">{campaign.name}</CardTitle>
                        <CardDescription className="text-xs">{campaign.id}</CardDescription>
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
                          <Send className="mr-2 h-4 w-4" />
                          Send Now
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Calendar className="mr-2 h-4 w-4" />
                          Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400">
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
                      <span className="text-sm">{campaign.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Audience</span>
                      <span className="text-sm">{campaign.audience}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Recipients</span>
                      <span className="text-sm">{campaign.recipients.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {campaign.status === "Scheduled" ? "Scheduled For" : "Sent On"}
                      </span>
                      <div className="flex items-center">
                        {campaign.scheduledDate === "Automated" ? (
                          <Badge variant="outline" className="text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-900/50">
                            Automated
                          </Badge>
                        ) : (
                          <span className="text-sm flex items-center">
                            {campaign.scheduledDate !== "Not scheduled" && (
                              <>
                                <Clock className="mr-1 h-3 w-3 text-gray-400" />
                                {campaign.scheduledDate}
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {campaign.openRate !== null && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Open Rate</span>
                          <span className="text-sm font-medium">{campaign.openRate}%</span>
                        </div>
                        <Progress value={campaign.openRate} className="h-2" />
                      </div>
                    )}
                    
                    {campaign.clickRate !== null && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Click Rate</span>
                          <span className="text-sm font-medium">{campaign.clickRate}%</span>
                        </div>
                        <Progress value={campaign.clickRate} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button 
                    className="bg-shopink-500 hover:bg-shopink-600" 
                    size="sm"
                    disabled={campaign.status === "Completed"}
                  >
                    {campaign.status === "Draft" ? "Edit" : campaign.status === "Scheduled" ? "Reschedule" : "Duplicate"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="audience" className="mt-0 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Customer Segments</h3>
            <Button className="bg-shopink-500 hover:bg-shopink-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Segment
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audienceSegments.map((segment, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{segment.name}</CardTitle>
                      <CardDescription>{segment.description}</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {segment.count.toLocaleString()} users
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">View Users</Button>
                  <Button 
                    className="bg-shopink-500 hover:bg-shopink-600" 
                    size="sm"
                  >
                    Target Campaign
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-6">
                <Target className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">Create Custom Segment</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                  Target specific customers based on purchase behavior and demographics
                </p>
                <Button className="bg-shopink-500 hover:bg-shopink-600">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Segment
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Email Templates</h3>
            <Button className="bg-shopink-500 hover:bg-shopink-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sample templates */}
            <Card className="overflow-hidden">
              <div className="h-40 bg-gray-100 dark:bg-gray-800 border-b flex items-center justify-center">
                <Mail className="h-12 w-12 text-gray-400" />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-1">Welcome Email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sent to new customers after registration
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm">Preview</Button>
                <Button 
                  className="bg-shopink-500 hover:bg-shopink-600" 
                  size="sm"
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-gray-100 dark:bg-gray-800 border-b flex items-center justify-center">
                <Mail className="h-12 w-12 text-gray-400" />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-1">Abandoned Cart</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reminder for customers who left items in cart
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm">Preview</Button>
                <Button 
                  className="bg-shopink-500 hover:bg-shopink-600" 
                  size="sm"
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-gray-100 dark:bg-gray-800 border-b flex items-center justify-center">
                <Mail className="h-12 w-12 text-gray-400" />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-1">Promotional</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Product announcements and special offers
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm">Preview</Button>
                <Button 
                  className="bg-shopink-500 hover:bg-shopink-600" 
                  size="sm"
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-6">
                <PlusCircle className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">Create New Template</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Design custom email templates for your campaigns
                </p>
                <Button className="bg-shopink-500 hover:bg-shopink-600 mt-4">
                  Create Template
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Resources</CardTitle>
                <CardDescription>
                  Tools and guides to help you create effective marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-shopink-100 dark:bg-shopink-900/50 rounded-full text-shopink-500">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email Marketing Guide</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Best practices for effective email campaigns</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-shopink-500">
                      View <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-shopink-100 dark:bg-shopink-900/50 rounded-full text-shopink-500">
                        <BellRing className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Push Notification Tips</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">How to boost engagement with push notifications</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-shopink-500">
                      View <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingPage;
