
import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CreateCampaignDialog from "@/components/marketing/CreateCampaignDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  getCampaigns, 
  getAudienceSegments, 
  sendCampaignNow, 
  rescheduleCampaign, 
  deleteCampaign 
} from "@/services/marketing";
import type { Campaign, AudienceSegment } from "@/services/marketing";

const MarketingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [audienceSegments, setAudienceSegments] = useState<AudienceSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [newScheduleDate, setNewScheduleDate] = useState("");
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [campaignsData, audienceData] = await Promise.all([
        getCampaigns(),
        getAudienceSegments()
      ]);
      
      setCampaigns(campaignsData);
      setAudienceSegments(audienceData);
    } catch (error) {
      console.error("Error fetching marketing data:", error);
      toast({
        title: "Error",
        description: "Failed to load marketing data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.audience.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendNow = async (campaignId: string) => {
    try {
      await sendCampaignNow(campaignId);
      
      // Update the campaign status in the local state
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: "Active" } 
            : campaign
        )
      );
      
      toast({
        title: "Campaign Sent",
        description: "Your campaign has been queued and will be sent immediately.",
      });
    } catch (error) {
      console.error("Error sending campaign:", error);
      toast({
        title: "Error",
        description: "Failed to send campaign. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const openRescheduleDialog = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setNewScheduleDate("");
    setRescheduleDialogOpen(true);
  };
  
  const handleReschedule = async () => {
    if (!selectedCampaignId || !newScheduleDate) return;
    
    try {
      await rescheduleCampaign(selectedCampaignId, newScheduleDate);
      
      // Update the campaign in the local state
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign.id === selectedCampaignId 
            ? { ...campaign, scheduledDate: new Date(newScheduleDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) } 
            : campaign
        )
      );
      
      toast({
        title: "Campaign Rescheduled",
        description: `Campaign has been rescheduled to ${new Date(newScheduleDate).toLocaleDateString()}.`,
      });
      
      setRescheduleDialogOpen(false);
    } catch (error) {
      console.error("Error rescheduling campaign:", error);
      toast({
        title: "Error",
        description: "Failed to reschedule campaign. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
      
      // Remove the campaign from the local state
      setCampaigns(prevCampaigns => 
        prevCampaigns.filter(campaign => campaign.id !== campaignId)
      );
      
      toast({
        title: "Campaign Deleted",
        description: "Your campaign has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Marketing & Campaigns</h2>
          <p className="text-gray-500 dark:text-gray-400">Create and manage marketing campaigns</p>
        </div>
        <CreateCampaignDialog onCampaignCreated={fetchData} />
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
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {campaigns.filter(c => c.status === "Active").length} active campaigns
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
              {Math.round(campaigns
                .filter(c => c.openRate !== null)
                .reduce((acc, curr) => acc + (curr.openRate || 0), 0) / 
                campaigns.filter(c => c.openRate !== null).length || 0)}%
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
            {isLoading ? (
              <Card className="col-span-full">
                <CardContent className="flex items-center justify-center py-8">
                  Loading campaigns...
                </CardContent>
              </Card>
            ) : filteredCampaigns.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="mb-4 text-gray-500">No campaigns found matching your search criteria.</p>
                  <CreateCampaignDialog onCampaignCreated={fetchData} />
                </CardContent>
              </Card>
            ) : (
              filteredCampaigns.map((campaign) => (
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
                          <DropdownMenuItem 
                            onClick={() => handleSendNow(campaign.id)}
                            disabled={campaign.status === "Completed" || campaign.status === "Active"}
                            className="cursor-pointer"
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Now
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openRescheduleDialog(campaign.id)}
                            disabled={campaign.status === "Completed" || campaign.status === "Active"}
                            className="cursor-pointer"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400"
                          >
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
              ))
            )}
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
        </TabsContent>
      </Tabs>
      
      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Campaign</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="schedule-date" className="text-sm font-medium">
                New Schedule Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="schedule-date"
                  type="date"
                  className="pl-10"
                  value={newScheduleDate}
                  onChange={(e) => setNewScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-shopink-500 hover:bg-shopink-600"
              onClick={handleReschedule}
              disabled={!newScheduleDate}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingPage;
