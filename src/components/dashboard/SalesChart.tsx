
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = {
  weekly: [
    { name: "Mon", sales: 3200 },
    { name: "Tue", sales: 4500 },
    { name: "Wed", sales: 5500 },
    { name: "Thu", sales: 3800 },
    { name: "Fri", sales: 6200 },
    { name: "Sat", sales: 8200 },
    { name: "Sun", sales: 4800 },
  ],
  monthly: [
    { name: "Jan", sales: 45000 },
    { name: "Feb", sales: 52000 },
    { name: "Mar", sales: 48000 },
    { name: "Apr", sales: 61000 },
    { name: "May", sales: 55000 },
    { name: "Jun", sales: 67000 },
    { name: "Jul", sales: 72000 },
    { name: "Aug", sales: 78000 },
    { name: "Sep", sales: 69000 },
    { name: "Oct", sales: 74000 },
    { name: "Nov", sales: 81000 },
    { name: "Dec", sales: 99000 },
  ],
  yearly: [
    { name: "2018", sales: 580000 },
    { name: "2019", sales: 690000 },
    { name: "2020", sales: 630000 },
    { name: "2021", sales: 820000 },
    { name: "2022", sales: 950000 },
    { name: "2023", sales: 1150000 },
  ],
};

type TimeRange = "weekly" | "monthly" | "yearly";

const SalesChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");

  const formatYAxis = (value: number) => {
    if (timeRange === "yearly") {
      return `$${value / 1000}k`;
    } else if (timeRange === "monthly") {
      return `$${value / 1000}k`;
    }
    return `$${value}`;
  };

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Sales Performance</CardTitle>
          <div className="flex space-x-1">
            <Button
              variant={timeRange === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("weekly")}
              className={timeRange === "weekly" ? "bg-shopink-500 hover:bg-shopink-600" : ""}
            >
              Week
            </Button>
            <Button
              variant={timeRange === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("monthly")}
              className={timeRange === "monthly" ? "bg-shopink-500 hover:bg-shopink-600" : ""}
            >
              Month
            </Button>
            <Button
              variant={timeRange === "yearly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("yearly")}
              className={timeRange === "yearly" ? "bg-shopink-500 hover:bg-shopink-600" : ""}
            >
              Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data[timeRange]}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD60A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFD60A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ strokeOpacity: 0.2 }}
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ strokeOpacity: 0.2 }}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#FFD60A"
                strokeWidth={2}
                fill="url(#salesGradient)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#FFD60A" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
