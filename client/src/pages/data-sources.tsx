import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FileUpload from "@/components/file-upload";
import { Database, Trash2, Eye, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Dataset {
  id: number;
  name: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  rowCount: number;
  columns: string[];
  createdAt: string;
}

export default function DataSources() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: datasets = [], isLoading } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  const deleteDatasetMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/datasets/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete dataset");
      }
    },
    onSuccess: () => {
      toast({
        title: "Dataset deleted",
        description: "The dataset has been successfully removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Could not delete the dataset. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case "csv":
        return "bg-green-100 text-green-800";
      case "json":
        return "bg-blue-100 text-blue-800";
      case "xlsx":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800">Data Management</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upload and Manage Your
            <span className="block text-gradient">Data Sources</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload CSV, JSON, and Excel files to get started with AI-powered insights. 
            Our platform automatically parses and validates your data for immediate analysis.
          </p>
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {datasets.length} dataset{datasets.length !== 1 ? "s" : ""} uploaded
            </Badge>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Upload New Dataset</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload />
          </CardContent>
        </Card>

        {/* Datasets Grid */}
        {datasets.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets uploaded</h3>
                <p className="text-gray-500">Upload your first dataset to get started with AI-powered insights.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{dataset.name}</CardTitle>
                      {dataset.description && (
                        <p className="text-sm text-gray-500 mt-1">{dataset.description}</p>
                      )}
                    </div>
                    <Badge className={getFileTypeColor(dataset.fileType)}>
                      {dataset.fileType.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">File name:</span>
                      <p className="font-medium truncate">{dataset.fileName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <p className="font-medium">{formatFileSize(dataset.fileSize)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Rows:</span>
                      <p className="font-medium">{dataset.rowCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Columns:</span>
                      <p className="font-medium">{dataset.columns.length}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">Columns:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dataset.columns.slice(0, 3).map((column) => (
                        <Badge key={column} variant="outline" className="text-xs">
                          {column}
                        </Badge>
                      ))}
                      {dataset.columns.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{dataset.columns.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Uploaded {formatDistanceToNow(new Date(dataset.createdAt), { addSuffix: true })}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteDatasetMutation.mutate(dataset.id)}
                      disabled={deleteDatasetMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
