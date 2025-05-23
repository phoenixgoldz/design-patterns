import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, FileText, Eye, Download, Globe, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PublicReport {
  id: number;
  title: string;
  description: string;
  datasetIds: number[];
  insightIds: number[];
  isPublic: boolean;
  sharedWith: string[];
  createdAt: string;
}

export default function ClientPortal() {
  const { data: publicReports = [], isLoading } = useQuery<PublicReport[]>({
    queryKey: ["/api/reports/public"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
          <p className="text-gray-500 mt-1">Share insights and reports with your clients</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {publicReports.length} public report{publicReports.length !== 1 ? "s" : ""}
          </Badge>
          <Button className="flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share Report</span>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Globe className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Client Access</h3>
              <p className="text-sm text-blue-700 mt-1">
                Reports marked as "Public" are accessible to clients through a dedicated portal. 
                Clients can view interactive dashboards and download approved reports.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {publicReports.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Share2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No public reports</h3>
              <p className="text-gray-500 mb-4">
                Create and publish reports to share insights with your clients through the portal.
              </p>
              <Button className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Create Public Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {publicReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{report.title}</span>
                      <Globe className="w-4 h-4 text-green-600" />
                    </CardTitle>
                    {report.description && (
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Public
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Datasets:</span>
                    <p className="font-medium">{report.datasetIds.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Insights:</span>
                    <p className="font-medium">{report.insightIds.length}</p>
                  </div>
                </div>

                {report.sharedWith.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Shared with:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {report.sharedWith.slice(0, 2).map((email, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {email}
                        </Badge>
                      ))}
                      {report.sharedWith.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{report.sharedWith.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Published {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Lock className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Client Portal URL Card */}
      {publicReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Client Portal URL</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-700">
                  https://your-domain.com/client-portal
                </code>
                <Button size="sm" variant="outline">
                  Copy Link
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Share this URL with your clients to give them access to public reports and dashboards.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
