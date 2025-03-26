
import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CookingPot, Utensils, FileText, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem logging you out.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cooking-pattern bg-repeat">
      <nav className="bg-white/90 backdrop-blur-sm shadow-md border-b border-cooking-softOrange/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center mr-8">
                <CookingPot className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold text-primary font-playfair">Food Inventory</span>
              </div>
              <div className="flex space-x-8">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-primary hover:border-cooking-softOrange"
                    }`
                  }
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  Inventory
                </NavLink>
                <NavLink
                  to="/activity-logs"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-primary hover:border-cooking-softOrange"
                    }`
                  }
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Activity Logs
                </NavLink>
                <NavLink
                  to="/sales-history"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-primary hover:border-cooking-softOrange"
                    }`
                  }
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Sales History
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                className="text-primary border-primary hover:bg-primary/10" 
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
