
import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CookingPot, Utensils, FileText, BarChart3, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();

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
      {/* Enhanced header with drop shadow and refined spacing */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-md border-b border-cooking-softOrange/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center mr-12">
                <CookingPot className="h-10 w-10 text-amber-700 mr-4" />
                <span className="text-3xl md:text-4xl font-bold text-amber-800 font-playfair tracking-tight">Food Inventory</span>
              </div>
              <div className="flex space-x-12">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `nav-link text-lg ${isActive ? "nav-link-active" : "nav-link-inactive"}`
                  }
                >
                  <Utensils className="w-6 h-6 mr-2.5" />
                  Inventory
                </NavLink>
                <NavLink
                  to="/activity-logs"
                  className={({ isActive }) =>
                    `nav-link text-lg ${isActive ? "nav-link-active" : "nav-link-inactive"}`
                  }
                >
                  <FileText className="w-6 h-6 mr-2.5" />
                  Activity Logs
                </NavLink>
                <NavLink
                  to="/sales-history"
                  className={({ isActive }) =>
                    `nav-link text-lg ${isActive ? "nav-link-active" : "nav-link-inactive"}`
                  }
                >
                  <BarChart3 className="w-6 h-6 mr-2.5" />
                  Sales History
                </NavLink>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center mr-4">
                <div className="bg-cooking-softYellow/50 p-2 rounded-full">
                  <User className="w-6 h-6 text-amber-700" />
                </div>
                <span className="ml-2 text-amber-800 font-medium text-lg">{user?.email?.split('@')[0]}</span>
              </div>
              <Button 
                variant="outline" 
                className="btn-outline text-lg px-5 py-2.5 h-auto border-2" 
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 mr-2.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Improved main content area with better spacing and animation */}
      <main className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12 animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-cooking-softOrange/10">
          <Outlet />
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="mt-12 py-6 border-t border-cooking-softOrange/20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-amber-700">Food Inventory Management System © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
