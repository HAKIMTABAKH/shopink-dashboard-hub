
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Truck, Package, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Order {
  id: string;
  order_number: string;
  customer: string;
  date: string;
  status: string;
  payment: string;
  items: number;
  total: number;
  priority?: "high" | "medium" | "low";
}

interface Courier {
  id: string;
  name: string;
  logo: string;
  deliveryTime: string;
}

const couriers: Courier[] = [
  {
    id: "fedex",
    name: "FedEx",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/FedEx_logo.svg/220px-FedEx_logo.svg.png",
    deliveryTime: "1-2 business days"
  },
  {
    id: "ups",
    name: "UPS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/United_Parcel_Service_logo_2014.svg/220px-United_Parcel_Service_logo_2014.svg.png",
    deliveryTime: "1-3 business days"
  },
  {
    id: "dhl",
    name: "DHL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/220px-DHL_Logo.svg.png",
    deliveryTime: "2-3 business days"
  },
  {
    id: "usps",
    name: "USPS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/USPS_Emblem.svg/220px-USPS_Emblem.svg.png",
    deliveryTime: "3-5 business days"
  }
];

interface OrderAssignmentDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderAssignmentDialog = ({ order, open, onOpenChange }: OrderAssignmentDialogProps) => {
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate random tracking number
  const generateTrackingNumber = () => {
    const prefix = selectedCourier.substring(0, 2).toUpperCase();
    const number = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    setTrackingNumber(`${prefix}${number}`);
  };

  // Handle assignment form submission
  const handleAssign = async () => {
    if (!selectedCourier) {
      toast.error("Please select a courier");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update order status to Processing
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: "Processing", 
          updated_at: new Date().toISOString() 
        })
        .eq("id", order.id);
        
      if (error) throw error;
      
      // In a real app, you would store the courier and tracking info in a separate table
      // For now, we'll just show a success message
      toast.success("Order assigned successfully", {
        description: `Order #${order.order_number} has been assigned to ${couriers.find(c => c.id === selectedCourier)?.name} for delivery.`
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning order:", error);
      toast.error("Failed to assign order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-shopink-500" />
            Assign Order to Courier
          </DialogTitle>
          <DialogDescription>
            Select a courier and shipping method for order #{order.order_number}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-shopink-100 dark:bg-shopink-900/20 flex items-center justify-center">
                <Package className="h-5 w-5 text-shopink-600 dark:text-shopink-400" />
              </div>
              <div>
                <p className="font-medium">{order.customer}</p>
                <p className="text-sm text-gray-500">{order.items} items • ${order.total.toFixed(2)}</p>
              </div>
            </div>
            {order.priority && (
              <Badge className={
                order.priority === 'high' 
                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" 
                  : order.priority === 'medium' 
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
              }>
                {order.priority === 'high' 
                  ? 'High Priority' 
                  : order.priority === 'medium' 
                  ? 'Medium' 
                  : 'Low'}
              </Badge>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Courier</Label>
              <Select 
                value={selectedCourier} 
                onValueChange={(value) => {
                  setSelectedCourier(value);
                  setTrackingNumber("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a courier" />
                </SelectTrigger>
                <SelectContent>
                  {couriers.map((courier) => (
                    <SelectItem key={courier.id} value={courier.id}>
                      <div className="flex items-center gap-2">
                        <span>{courier.name}</span>
                        <span className="text-xs text-gray-500">({courier.deliveryTime})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tracking Number</Label>
                {selectedCourier && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={generateTrackingNumber}
                    className="h-8 text-xs"
                  >
                    Generate
                  </Button>
                )}
              </div>
              <Input 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder={selectedCourier ? "Enter or generate tracking number" : "Select a courier first"}
                disabled={!selectedCourier}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Shipping Method</Label>
              <RadioGroup 
                value={shippingMethod} 
                onValueChange={setShippingMethod}
                className="grid grid-cols-1 gap-2"
              >
                <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div className="font-medium">Standard Shipping</div>
                    <div className="text-sm text-gray-500">3-5 business days</div>
                  </Label>
                  <div className="font-medium">Free</div>
                </div>
                
                <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex-1 cursor-pointer">
                    <div className="font-medium">Express Shipping</div>
                    <div className="text-sm text-gray-500">1-2 business days</div>
                  </Label>
                  <div className="font-medium">$15.00</div>
                </div>
                
                <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <RadioGroupItem value="overnight" id="overnight" />
                  <Label htmlFor="overnight" className="flex-1 cursor-pointer">
                    <div className="font-medium">Overnight Shipping</div>
                    <div className="text-sm text-gray-500">Next business day</div>
                  </Label>
                  <div className="font-medium">$25.00</div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            className="bg-shopink-500 hover:bg-shopink-600"
            onClick={handleAssign}
            disabled={!selectedCourier || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Assigning...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Assign Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderAssignmentDialog;
