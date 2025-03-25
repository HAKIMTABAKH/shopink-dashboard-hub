
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";

interface Order {
  id: string;
  customer: {
    name: string;
    avatar: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  total: number;
  date: Date;
}

const statusColors = {
  pending: "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  processing: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  shipped: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  delivered: "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  cancelled: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const orders: Order[] = [
  {
    id: "ORD-12345",
    customer: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
    },
    status: "processing",
    items: 3,
    total: 320.11,
    date: new Date(2023, 7, 15, 14, 30),
  },
  {
    id: "ORD-12344",
    customer: {
      name: "Sarah Smith",
      avatar: "/placeholder.svg",
    },
    status: "shipped",
    items: 2,
    total: 174.99,
    date: new Date(2023, 7, 14, 9, 15),
  },
  {
    id: "ORD-12343",
    customer: {
      name: "Mike Davidson",
      avatar: "/placeholder.svg",
    },
    status: "delivered",
    items: 5,
    total: 425.75,
    date: new Date(2023, 7, 13, 16, 45),
  },
  {
    id: "ORD-12342",
    customer: {
      name: "Emily Wilson",
      avatar: "/placeholder.svg",
    },
    status: "pending",
    items: 1,
    total: 89.99,
    date: new Date(2023, 7, 15, 11, 20),
  },
  {
    id: "ORD-12341",
    customer: {
      name: "David Cooper",
      avatar: "/placeholder.svg",
    },
    status: "cancelled",
    items: 2,
    total: 159.98,
    date: new Date(2023, 7, 12, 10, 10),
  },
];

const RecentOrders = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" className="font-medium text-sm">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <img src={order.customer.avatar} alt={order.customer.name} />
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium text-sm">{order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.customer.name}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${statusColors[order.status]}`}
                >
                  {statusLabels[order.status]}
                </Badge>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {order.items} {order.items === 1 ? "item" : "items"} · ${order.total.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(order.date, { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
