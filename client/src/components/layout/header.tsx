import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search, Bot } from "lucide-react";
import AIChat from "@/components/ai-chat";

export default function Header() {
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm" 
              className="lg:hidden p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search data, reports, insights..." 
                className="w-64 pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </Button>
            
            {/* AI Assistant Toggle */}
            <Button 
              onClick={() => setShowAIChat(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
            >
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
            </Button>
          </div>
        </div>
      </header>

      <AIChat open={showAIChat} onClose={() => setShowAIChat(false)} />
    </>
  );
}
