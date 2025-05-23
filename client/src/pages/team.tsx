import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Mail, Shield, User } from "lucide-react";

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
  status: string;
  currentActivity: string;
}

export default function Team() {
  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/users/team"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "team_member":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
          </Badge>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Invite Member</span>
          </Button>
        </div>
      </div>

      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
              <p className="text-gray-500 mb-4">Invite team members to collaborate on data analysis and insights.</p>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Invite First Member</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.firstName} />
                      <AvatarFallback>
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {member.firstName} {member.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(member.role)}>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(member.role)}
                      <span className="capitalize">{member.role.replace("_", " ")}</span>
                    </div>
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {member.status}
                  </Badge>
                </div>

                {member.currentActivity && (
                  <div>
                    <span className="text-sm text-gray-500">Current activity:</span>
                    <p className="text-sm font-medium text-gray-900">{member.currentActivity}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
