import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  response: string | null;
  createdAt: string;
}

interface AIChatProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChat({ open, onClose }: AIChatProps) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages?userId=1"],
    enabled: open,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", "/api/chat/message", {
        message: messageText,
        userId: 1
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <span>AI Assistant</span>
            <div className="flex items-center space-x-2 ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-900">
                      Hi! I'm your AI data assistant. I can help you analyze your data, generate insights, and answer questions about your datasets. What would you like to explore today?
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {/* User Message */}
                  <div className="flex items-start space-x-2 justify-end">
                    <div className="flex-1 bg-primary text-white rounded-lg p-3 max-w-xs">
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs text-primary-200 mt-1">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>

                  {/* AI Response */}
                  {msg.response && (
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-900">{msg.response}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {sendMessageMutation.isPending && (
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">AI is thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="flex space-x-2 pt-4 border-t">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your data..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              onClick={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
