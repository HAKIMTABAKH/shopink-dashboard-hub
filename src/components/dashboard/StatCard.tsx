
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, isLoading = false }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {trend && (
          <p className="mt-1 text-xs text-muted-foreground flex items-center">
            <span
              className={cn(
                "mr-1",
                trend.positive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.value}
            </span>
            from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
