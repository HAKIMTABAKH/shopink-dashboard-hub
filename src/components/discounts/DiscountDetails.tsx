
import { useState } from "react";
import { Eye, Edit, Trash2, ArrowLeft, Percent, Calendar, Copy } from "lucide-react";
import { Discount } from "@/contexts/DiscountContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DiscountForm } from "./DiscountForm";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface DiscountDetailsProps {
  discount: Discount;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export function DiscountDetails({ discount, onBack, onDelete, onUpdate }: DiscountDetailsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(discount.code);
    toast.success("Discount code copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Discount Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{discount.name}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <div className="flex items-center">
                    <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
                      {discount.code}
                    </code>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1" onClick={copyCodeToClipboard}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {getStatusBadge(discount.status)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="text-red-500" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Discount Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="flex items-center">
                    <Percent className="h-4 w-4 mr-1 text-gray-500" />
                    {discount.type === "Percentage" ? "Percentage" : "Fixed Amount"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Value</p>
                  <p className="text-lg font-medium">
                    {discount.type === "Percentage" ? `${discount.value}%` : `$${discount.value.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Validity</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>From {discount.startDate} {discount.endDate ? `to ${discount.endDate}` : 'onwards'}</span>
                </div>
                
                {discount.minPurchase && discount.minPurchase > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Minimum Purchase</p>
                    <p>${discount.minPurchase.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>

            {discount.maxUsage !== null && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Usage</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{discount.usage} / {discount.maxUsage}</span>
                    <span className="text-sm">{calculateUsagePercentage(discount.usage, discount.maxUsage)}%</span>
                  </div>
                  <Progress 
                    value={calculateUsagePercentage(discount.usage, discount.maxUsage)} 
                    className="h-2"
                  />
                  {discount.maxUsage <= discount.usage && (
                    <p className="text-yellow-500 text-sm mt-1">Usage limit reached</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Discount
              </Button>
              <Button variant="outline" className="w-full" onClick={copyCodeToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </Button>
              <Button variant="outline" className="w-full text-red-500" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Discount
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
          </DialogHeader>
          <DiscountForm 
            discount={discount} 
            onSuccess={() => {
              setIsEditDialogOpen(false);
              onUpdate();
            }} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Discount</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{discount.name}" discount? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(discount.id);
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
