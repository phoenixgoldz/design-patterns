import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, TrendingUp, AlertTriangle, Lightbulb, FileText, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Dataset {
  id: number;
  name: string;
}

interface Insight {
  id: number;
  datasetId: number;
  title: string;
  description: string;
  content: string;
  type: string;
  confidence: number;
  createdAt: string;
}

export default function AIInsights() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: datasets = [] } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  const { data: insights = [], isLoading } = useQuery<Insight[]>({
    queryKey: ["/api/insights"],
  });

  const generateInsightsMutation = useMutation({
    mutationFn: async (datasetId: number) => {
      const response = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datasetId, userId: 1 }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Insights generated successfully",
        description: "AI has analyzed your data and discovered new insights.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
    },
    onError: () => {
      toast({
        title: "Failed to generate insights",
        description: "Please try again or check your dataset.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateInsights = () => {
    if (selectedDatasetId) {
      generateInsightsMutation.mutate(parseInt(selectedDatasetId));
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case "anomaly":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "recommendation":
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case "summary":
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return <Bot className="w-5 h-5 text-purple-600" />;
    }
  };

  const getInsightBadgeColor = (type: string) => {
    switch (type) {
      case "trend":
        return "bg-blue-100 text-blue-800";
      case "anomaly":
        return "bg-red-100 text-red-800";
      case "recommendation":
        return "bg-yellow-100 text-yellow-800";
      case "summary":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <Badge variant="secondary">
          {insights.length} insight{insights.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Generate Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Generate New Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Dataset
              </label>
              <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a dataset to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {datasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id.toString()}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateInsights}
              disabled={!selectedDatasetId || generateInsightsMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Bot className="w-4 h-4" />
              <span>
                {generateInsightsMutation.isPending ? "Generating..." : "Generate Insights"}
              </span>
            </Button>
          </div>
          {datasets.length === 0 && (
            <p className="text-sm text-gray-500">
              Upload a dataset first to generate AI insights.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Insights List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : insights.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights yet</h3>
              <p className="text-gray-500">Generate your first AI insights by selecting a dataset above.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => {
            const dataset = datasets.find(d => d.id === insight.datasetId);
            return (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{insight.description}</p>
                        {dataset && (
                          <p className="text-xs text-gray-400 mt-1">
                            Dataset: {dataset.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getInsightBadgeColor(insight.type)}>
                        {insight.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700">{insight.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">Confidence:</span>
                      <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}%
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
