import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: React.ReactNode;
  iconColor: string;
}

export default function MetricsCard({ 
  title, 
  value, 
  change, 
  icon, 
  iconColor 
}: MetricsCardProps) {
  const TrendIcon = change?.trend === "up" ? TrendingUp : 
                   change?.trend === "down" ? TrendingDown : Minus;

  const trendColor = change?.trend === "up" ? "text-green-600" :
                    change?.trend === "down" ? "text-red-600" : "text-gray-500";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={cn("text-sm flex items-center mt-1", trendColor)}>
                <TrendIcon className="w-3 h-3 mr-1" />
                <span>{change.value}</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", iconColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
