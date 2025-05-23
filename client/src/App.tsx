import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home";
import DataSources from "@/pages/data-sources";
import AIInsights from "@/pages/ai-insights";
import Reports from "@/pages/reports";
import Team from "@/pages/team";
import ClientPortal from "@/pages/client-portal";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import WebsiteHeader from "@/components/layout/website-header";
import WebsiteFooter from "@/components/layout/website-footer";

function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <WebsiteHeader />
      <main className="pt-16">
        {children}
      </main>
      <WebsiteFooter />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <WebsiteLayout><HomePage /></WebsiteLayout>} />
      <Route path="/data-sources" component={() => <WebsiteLayout><DataSources /></WebsiteLayout>} />
      <Route path="/ai-insights" component={() => <WebsiteLayout><AIInsights /></WebsiteLayout>} />
      <Route path="/reports" component={() => <WebsiteLayout><Reports /></WebsiteLayout>} />
      <Route path="/team" component={() => <WebsiteLayout><Team /></WebsiteLayout>} />
      <Route path="/client-portal" component={() => <WebsiteLayout><ClientPortal /></WebsiteLayout>} />
      <Route path="/about" component={() => <WebsiteLayout><About /></WebsiteLayout>} />
      <Route path="/contact" component={() => <WebsiteLayout><Contact /></WebsiteLayout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
