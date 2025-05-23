import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Share2, Eye, Download, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Report {
  id: number;
  title: string;
  description: string;
  datasetIds: number[];
  insightIds: number[];
  isPublic: boolean;
  sharedWith: string[];
  createdAt: string;
}

export default function Reports() {
  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
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
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {reports.length} report{reports.length !== 1 ? "s" : ""}
          </Badge>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </Button>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports created</h3>
              <p className="text-gray-500 mb-4">Create your first AI-powered report to share insights with your team and clients.</p>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create First Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    {report.description && (
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.isPublic && (
                      <Badge variant="secondary">Public</Badge>
                    )}
                    {report.sharedWith.length > 0 && (
                      <Badge variant="outline">
                        Shared with {report.sharedWith.length}
                      </Badge>
                    )}
                  </div>
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

                <div className="text-xs text-gray-500">
                  Created {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
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
