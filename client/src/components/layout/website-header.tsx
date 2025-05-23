import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Menu, X, Bot } from "lucide-react";
import { Link, useLocation } from "wouter";
import AIChat from "@/components/ai-chat";

export default function WebsiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/data-sources" },
    { name: "AI Insights", href: "/ai-insights" },
    { name: "Reports", href: "/reports" },
    { name: "Team", href: "/team" },
    { name: "Client Portal", href: "/client-portal" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">DataSync Pro</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <span className={`text-sm font-medium transition-colors cursor-pointer ${
                      isActive 
                        ? "text-primary" 
                        : "text-gray-700 hover:text-primary"
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAIChat(true)}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Link href="/data-sources">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div 
                      className={`block px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </div>
                  </Link>
                );
              })}
              <div className="pt-4 pb-2 space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowAIChat(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
                <Link href="/data-sources">
                  <Button size="sm" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <AIChat open={showAIChat} onClose={() => setShowAIChat(false)} />
    </>
  );
}