
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
      <nav className="bg-white/95 backdrop-blur-sm shadow-md border-b border-cooking-softOrange/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center mr-10">
                <CookingPot className="h-8 w-8 text-amber-700 mr-3" />
                <span className="text-2xl md:text-3xl font-bold text-amber-800 font-playfair">Food Inventory</span>
              </div>
              <div className="flex space-x-10">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`
                  }
                >
                  <Utensils className="w-5 h-5 mr-2" />
                  Inventory
                </NavLink>
                <NavLink
                  to="/activity-logs"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`
                  }
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Activity Logs
                </NavLink>
                <NavLink
                  to="/sales-history"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`
                  }
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Sales History
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                className="btn-outline text-base px-4 py-2 h-auto" 
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
