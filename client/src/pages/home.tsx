import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Database, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Share2,
  ChevronRight,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import { Link } from "wouter";
import AIChat from "@/components/ai-chat";

export default function HomePage() {
  const [showAIChat, setShowAIChat] = useState(false);

  const features = [
    {
      icon: <Database className="w-6 h-6 text-blue-600" />,
      title: "Smart Data Upload",
      description: "Upload CSV, JSON, and Excel files with automatic data parsing and validation"
    },
    {
      icon: <Bot className="w-6 h-6 text-purple-600" />,
      title: "AI-Powered Insights",
      description: "Generate intelligent insights, trends, and recommendations from your data automatically"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-600" />,
      title: "Interactive Reports",
      description: "Create beautiful, shareable reports with charts and visualizations"
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "Team Collaboration",
      description: "Work together on data analysis with real-time collaboration features"
    },
    {
      icon: <Share2 className="w-6 h-6 text-red-600" />,
      title: "Client Portal",
      description: "Share insights securely with clients through a dedicated portal"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      title: "Real-time Analytics",
      description: "Monitor your data performance with live dashboards and metrics"
    }
  ];

  const benefits = [
    "Reduce data analysis time by 80%",
    "Generate insights in minutes, not hours",
    "Collaborate seamlessly with your team",
    "Share results with clients professionally",
    "No technical expertise required"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Data Analyst",
      company: "TechCorp",
      content: "DataSync Pro transformed how we handle client reporting. What used to take days now takes minutes.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Marketing Director",
      company: "GrowthCo",
      content: "The AI insights feature discovered patterns in our data that we never would have found manually.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Business Intelligence Lead",
      company: "DataFirst",
      content: "Finally, a tool that bridges the gap between complex data and actionable business insights.",
      rating: 5
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              ✨ AI-Powered Data Communication Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Data Into
              <span className="block text-gradient">Powerful Insights</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload your data, let AI discover insights, and share beautiful reports with your team and clients. 
              No technical expertise required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/data-sources">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowAIChat(true)}
                className="px-8"
              >
                <Bot className="w-4 h-4 mr-2" />
                Try AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Data Communication
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From data upload to client presentation, we've got every step covered
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Teams Choose DataSync Pro
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of data teams who've streamlined their workflow and improved client communication
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="outline" className="mr-4">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/data-sources">
                  <Button>
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">80%</h3>
                <p className="text-gray-600">Faster Analysis</p>
              </Card>
              <Card className="text-center p-6">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">100%</h3>
                <p className="text-gray-600">Secure</p>
              </Card>
              <Card className="text-center p-6">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">10k+</h3>
                <p className="text-gray-600">Active Users</p>
              </Card>
              <Card className="text-center p-6">
                <Globe className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                <p className="text-gray-600">Countries</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Data Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Data Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using DataSync Pro to streamline their data communication
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/data-sources">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AIChat open={showAIChat} onClose={() => setShowAIChat(false)} />
    </>
  );
}