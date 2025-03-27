import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDiscounts, Discount, DiscountType } from "@/contexts/DiscountContext";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const discountSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z.string().min(2, { message: "Code must be at least 2 characters" }).toUpperCase(),
  type: z.enum(["Percentage", "Fixed"]),
  value: z.coerce.number().positive({ message: "Value must be positive" }),
  maxUsage: z.coerce.number().nullable().optional(),
  minPurchase: z.coerce.number().nullable().optional(),
  startDate: z.date(),
  endDate: z.date().nullable().optional(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountFormProps {
  discount?: Discount;
  onSuccess?: () => void;
}

export function DiscountForm({ discount, onSuccess }: DiscountFormProps) {
  const { addDiscount, updateDiscount } = useDiscounts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseDate = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  const formatDate = (date?: Date | null) => {
    if (!date) return null;
    return format(date, "MMM d, yyyy");
  };

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: discount?.name || "",
      code: discount?.code || "",
      type: discount?.type || "Percentage",
      value: discount?.value || 0,
      maxUsage: discount?.maxUsage || null,
      minPurchase: discount?.minPurchase || 0,
      startDate: parseDate(discount?.startDate) || new Date(),
      endDate: parseDate(discount?.endDate),
    },
  });

  async function onSubmit(data: DiscountFormValues) {
    setIsSubmitting(true);

    try {
      if (discount) {
        // Update existing discount
        await updateDiscount({
          ...discount,
          name: data.name,
          code: data.code,
          type: data.type as DiscountType,
          value: data.value,
          maxUsage: data.maxUsage || null,
          minPurchase: data.minPurchase || 0,
          startDate: formatDate(data.startDate) || new Date().toLocaleDateString(),
          endDate: formatDate(data.endDate),
          // Keep existing values
          usage: discount.usage,
          status: discount.status,
        });
      } else {
        // Add new discount
        await addDiscount({
          name: data.name,
          code: data.code,
          type: data.type as DiscountType,
          value: data.value,
          maxUsage: data.maxUsage || null,
          minPurchase: data.minPurchase || 0,
          startDate: formatDate(data.startDate) || new Date().toLocaleDateString(),
          endDate: formatDate(data.endDate),
        });
      }

      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting discount form:", error);
      toast.error("Failed to save discount");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Name</FormLabel>
              <FormControl>
                <Input placeholder="Summer Sale 2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Code</FormLabel>
              <FormControl>
                <Input placeholder="SUMMER20" {...field} />
              </FormControl>
              <FormDescription>
                This is the code customers will enter at checkout
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a discount type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage (%)</SelectItem>
                    <SelectItem value="Fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("type") === "Percentage" ? "Percentage" : "Amount"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">
                        {form.watch("type") === "Percentage" ? "%" : "$"}
                      </span>
                    </div>
                    <Input
                      type="number"
                      placeholder={form.watch("type") === "Percentage" ? "10" : "5.99"}
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minPurchase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Purchase (optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      {...field}
                      value={field.value || ""}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Minimum order amount required to use this discount
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Limit (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Leave blank for unlimited"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of times this discount can be used
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>No end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) => 
                        date < (form.watch("startDate") || new Date("1900-01-01"))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Leave blank for a discount that doesn't expire
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : discount ? "Update Discount" : "Create Discount"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
