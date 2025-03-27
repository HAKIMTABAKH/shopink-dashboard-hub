
import { supabase } from "@/integrations/supabase/client";

export interface Campaign {
  id: string;
  name: string;
  type: "Email" | "Push Notification";
  status: "Active" | "Scheduled" | "Draft" | "Completed";
  audience: string;
  recipients: number;
  scheduledDate: string;
  openRate: number | null;
  clickRate: number | null;
}

export interface AudienceSegment {
  name: string;
  count: number;
  description: string;
}

export const createCampaign = async (campaign: Omit<Campaign, 'id'>) => {
  try {
    // For now, just return a mock response since the campaigns table doesn't exist yet
    // In a real implementation, we would create the table first
    
    // Mock campaign creation response
    const mockId = `CAM${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
    return {
      id: mockId,
      ...campaign
    };

    // Uncommenting the below code would require creating a campaigns table first
    /*
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        name: campaign.name,
        type: campaign.type,
        status: campaign.status,
        audience: campaign.audience,
        recipients: campaign.recipients,
        scheduled_date: campaign.scheduledDate,
        open_rate: campaign.openRate,
        click_rate: campaign.clickRate,
        created_at: new Date().toISOString() // Convert Date to string
      }])
      .select();
      
    if (error) throw error;
    return data[0];
    */
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

export const getAudienceSegments = async (): Promise<AudienceSegment[]> => {
  // This would normally fetch from the database
  // For now we'll use the mock data
  return [
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
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  // This would normally fetch from the database
  // For now we'll use the mock data
  return [
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
};

// For now, we'll just implement a placeholder campaign creation function
// that returns a mock response
export const sendCampaignNow = async (campaignId: string) => {
  // Simulate an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: "Campaign sent successfully" });
    }, 1000);
  });
};

export const rescheduleCampaign = async (campaignId: string, newDate: string) => {
  // Simulate an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: `Campaign rescheduled to ${newDate}` });
    }, 1000);
  });
};

export const deleteCampaign = async (campaignId: string) => {
  // Simulate an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: "Campaign deleted successfully" });
    }, 1000);
  });
};
