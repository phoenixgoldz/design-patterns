import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const stats = [
    { icon: <Users className="w-8 h-8 text-blue-600" />, value: "10,000+", label: "Active Users" },
    { icon: <Globe className="w-8 h-8 text-green-600" />, value: "50+", label: "Countries" },
    { icon: <TrendingUp className="w-8 h-8 text-purple-600" />, value: "1M+", label: "Reports Generated" },
    { icon: <Award className="w-8 h-8 text-orange-600" />, value: "99.9%", label: "Uptime" },
  ];

  const values = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: "Innovation First",
      description: "We leverage cutting-edge AI technology to make data analysis accessible to everyone."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "User-Centric",
      description: "Every feature is designed with our users' needs in mind, ensuring intuitive and powerful experiences."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Security & Privacy",
      description: "Your data security is our top priority. We maintain the highest standards of data protection."
    },
    {
      icon: <Target className="w-6 h-6 text-red-600" />,
      title: "Results Driven",
      description: "We focus on delivering tangible business value through actionable insights and recommendations."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former data scientist at Google with 10+ years in AI and machine learning.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b632?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-founder",
      bio: "Ex-Microsoft engineer specializing in distributed systems and data infrastructure.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Emily Johnson",
      role: "Head of Product",
      bio: "Product leader with experience at Tableau and Palantir, passionate about data visualization.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800">About DataSync Pro</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transforming Data Communication
            <span className="block text-gradient">One Insight at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe that powerful data insights shouldn't be locked away in complex tools. 
            Our mission is to democratize data analysis and make it accessible to teams of all sizes.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                We started DataSync Pro because we saw too many brilliant insights buried in spreadsheets 
                and complex analytics tools. Data teams were spending more time wrestling with technology 
                than focusing on what matters: understanding their data and sharing insights.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Today, we're proud to serve thousands of teams worldwide, helping them turn raw data 
                into actionable insights that drive real business results.
              </p>
              <Link href="/contact">
                <Button size="lg">
                  Get in Touch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">80%</h3>
                <p className="text-gray-600">Faster Analysis</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-2">95%</h3>
                <p className="text-gray-600">User Satisfaction</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="text-2xl font-bold text-purple-600 mb-2">24/7</h3>
                <p className="text-gray-600">AI Assistant</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="text-2xl font-bold text-orange-600 mb-2">∞</h3>
                <p className="text-gray-600">Possibilities</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate experts dedicated to making data analysis simple and powerful
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Data Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who trust DataSync Pro to turn their data into actionable insights
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
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}