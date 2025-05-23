import { useQuery } from "@tanstack/react-query";
import { Database, Bot, Users, BarChart3, TrendingUp, ArrowUpRight } from "lucide-react";
import MetricsCard from "@/components/metrics-card";
import FileUpload from "@/components/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface DashboardStats {
  activeDatasets: number;
  aiInsightsGenerated: number;
  teamMembers: number;
  clientReports: number;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: "insight" | "collaboration" | "report";
}

export default function Dashboard() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ["/api/users/team"],
  });

  // Mock activities for now - in a real app this would come from an API
  const activities: Activity[] = [
    {
      id: 1,
      title: "AI generated insights for Q4 Sales Data",
      description: "Found 3 key trends and 2 actionable recommendations",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: "insight"
    },
    {
      id: 2,
      title: "Team collaboration on Customer Segmentation",
      description: "3 team members added comments and suggestions",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      type: "collaboration"
    },
    {
      id: 3,
      title: "Client report exported for Acme Corp",
      description: "Monthly performance dashboard shared",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      type: "report"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "insight":
        return <BarChart3 className="w-4 h-4 text-primary" />;
      case "collaboration":
        return <Users className="w-4 h-4 text-purple-600" />;
      case "report":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case "insight":
        return "bg-primary/10";
      case "collaboration":
        return "bg-purple-100";
      case "report":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Active Datasets"
          value={stats?.activeDatasets || 0}
          change={{ value: "+12%", trend: "up" }}
          icon={<Database className="w-6 h-6" />}
          iconColor="bg-primary/10"
        />
        <MetricsCard
          title="AI Insights Generated"
          value={stats?.aiInsightsGenerated || 0}
          change={{ value: "+28%", trend: "up" }}
          icon={<Bot className="w-6 h-6" />}
          iconColor="bg-purple-100"
        />
        <MetricsCard
          title="Team Members"
          value={stats?.teamMembers || 0}
          change={{ value: "0%", trend: "neutral" }}
          icon={<Users className="w-6 h-6" />}
          iconColor="bg-green-100"
        />
        <MetricsCard
          title="Client Reports"
          value={stats?.clientReports || 0}
          change={{ value: "+18%", trend: "up" }}
          icon={<BarChart3 className="w-6 h-6" />}
          iconColor="bg-orange-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Data Upload Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quick Data Upload</CardTitle>
                <Button variant="ghost" size="sm">
                  View All Datasets
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <FileUpload />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityBgColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start h-auto p-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">New Report</p>
                    <p className="text-xs text-gray-500">Create AI-powered report</p>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-auto p-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Share with Client</p>
                    <p className="text-xs text-gray-500">Generate client dashboard</p>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-auto p-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Invite Team Member</p>
                    <p className="text-xs text-gray-500">Add collaborator</p>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-auto p-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Database className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Export Data</p>
                    <p className="text-xs text-gray-500">Download insights & charts</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card>
            <CardHeader>
              <CardTitle>Team Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.slice(0, 3).map((member: any) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.firstName} />
                      <AvatarFallback>
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.currentActivity || "Available"}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === "online" ? "bg-green-500" : "bg-gray-300"
                    }`} />
                  </div>
                ))}
                
                {teamMembers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No team members found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
