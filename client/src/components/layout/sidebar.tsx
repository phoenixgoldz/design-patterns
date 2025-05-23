import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Database, 
  Bot, 
  BarChart3, 
  Users, 
  Share2,
  TrendingUp
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, current: true },
  { name: "Data Sources", href: "/data-sources", icon: Database, current: false },
  { name: "AI Insights", href: "/ai-insights", icon: Bot, current: false },
  { name: "Reports", href: "/reports", icon: BarChart3, current: false },
  { name: "Team", href: "/team", icon: Users, current: false },
  { name: "Client Portal", href: "/client-portal", icon: Share2, current: false },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DataSync Pro</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                  <item.icon className={cn(
                    "mr-3 flex-shrink-0 h-4 w-4",
                    isActive
                      ? "text-primary"
                      : "text-gray-400 group-hover:text-gray-500"
                  )} />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <img 
              className="inline-block h-9 w-9 rounded-full" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="User avatar" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Sarah Chen</p>
              <p className="text-xs font-medium text-gray-500">Data Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
