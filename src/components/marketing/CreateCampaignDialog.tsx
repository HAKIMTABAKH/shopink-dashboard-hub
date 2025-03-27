
import { useState, useEffect } from "react";
import { Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAudienceSegments, createCampaign } from "@/services/marketing";
import type { AudienceSegment } from "@/services/marketing";

interface CreateCampaignDialogProps {
  onCampaignCreated: () => void;
}

const CreateCampaignDialog = ({ onCampaignCreated }: CreateCampaignDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState<"Email" | "Push Notification">("Email");
  const [audience, setAudience] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState<"now" | "later">("later");
  const [scheduleDate, setScheduleDate] = useState("");
  const [audiences, setAudiences] = useState<AudienceSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAudiences = async () => {
      try {
        const segments = await getAudienceSegments();
        setAudiences(segments);
        
        // Set default audience if available
        if (segments.length > 0) {
          setAudience(segments[0].name);
        }
      } catch (error) {
        console.error("Error fetching audience segments:", error);
      }
    };
    
    fetchAudiences();
  }, []);
  
  const handleCreate = async () => {
    if (!campaignName || !audience) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const selectedAudience = audiences.find(a => a.name === audience);
      const recipientCount = selectedAudience?.count || 0;
      
      // Create campaign
      await createCampaign({
        name: campaignName,
        type: campaignType,
        status: schedule === "now" ? "Active" : "Scheduled",
        audience: audience,
        recipients: recipientCount,
        scheduledDate: schedule === "now" ? "Immediate" : scheduleDate,
        openRate: null,
        clickRate: null,
      });
      
      toast({
        title: "Campaign Created",
        description: `Your ${campaignType} campaign has been ${schedule === "now" ? "sent" : "scheduled"}.`,
      });
      
      // Reset form and close dialog
      resetForm();
      setIsOpen(false);
      
      // Notify parent
      onCampaignCreated();
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setCampaignName("");
    setCampaignType("Email");
    setAudience(audiences.length > 0 ? audiences[0].name : "");
    setDescription("");
    setSchedule("later");
    setScheduleDate("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-shopink-500 hover:bg-shopink-600">Create Campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Design and launch a new marketing campaign to reach your customers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Summer Sale Promotion"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <Select value={campaignType} onValueChange={(value: "Email" | "Push Notification") => setCampaignType(value)}>
                <SelectTrigger id="campaign-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Push Notification">Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((segment) => (
                    <SelectItem key={segment.name} value={segment.name}>
                      {segment.name} ({segment.count.toLocaleString()} users)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Message Content</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the campaign message or description"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Send Schedule</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={schedule} onValueChange={(value: "now" | "later") => setSchedule(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="When to send" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Send Immediately</SelectItem>
                  <SelectItem value="later">Schedule for Later</SelectItem>
                </SelectContent>
              </Select>
              
              {schedule === "later" && (
                <div className="relative">
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-shopink-500 hover:bg-shopink-600"
            onClick={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {schedule === "now" ? "Send Campaign" : "Schedule Campaign"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
