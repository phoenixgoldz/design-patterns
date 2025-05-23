import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/datasets/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Dataset uploaded successfully",
        description: "Your data is now available for analysis.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
      setFile(null);
      setName("");
      setDescription("");
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again or check your file format.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
        if (!name) setName(droppedFile.name);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload CSV, JSON, or Excel files only.",
          variant: "destructive",
        });
      }
    }
  }, [name, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        if (!name) setName(selectedFile.name);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload CSV, JSON, or Excel files only.",
          variant: "destructive",
        });
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      "text/csv",
      "application/json",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];
    const validExtensions = [".csv", ".json", ".xlsx", ".xls"];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);

    uploadMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataset-name">Dataset Name</Label>
            <Input
              id="dataset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter dataset name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataset-description">Description (Optional)</Label>
            <Textarea
              id="dataset-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your dataset"
              rows={3}
            />
          </div>

          {/* Upload Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-gray-300",
              "hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <File className="h-8 w-8 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CloudUpload className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports CSV, JSON, Excel files up to 50MB
                  </p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".csv,.json,.xlsx,.xls"
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" asChild>
                      <span>Choose Files</span>
                    </Button>
                  </Label>
                </div>
              </div>
            )}
          </div>

          {file && (
            <Button 
              onClick={handleUpload}
              disabled={!name.trim() || uploadMutation.isPending}
              className="w-full"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Dataset"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
