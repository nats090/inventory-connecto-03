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
      {/* Updated header with smaller height */}
      <nav className="bg-amber-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center mr-8">
                <CookingPot className="h-8 w-8 text-amber-200 mr-3" />
                <span className="text-2xl font-bold text-white font-playfair tracking-tight">Food Inventory</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `nav-link text-lg py-1.5 ${isActive ? "text-amber-200 border-amber-200" : "text-amber-100 border-transparent hover:text-white"}`
                  }
                >
                  <Utensils className="w-5 h-5 mr-2" />
                  Inventory
                </NavLink>
                <NavLink
                  to="/activity-logs"
                  className={({ isActive }) =>
                    `nav-link text-lg py-1.5 ${isActive ? "text-amber-200 border-amber-200" : "text-amber-100 border-transparent hover:text-white"}`
                  }
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Activity Logs
                </NavLink>
                <NavLink
                  to="/sales-history"
                  className={({ isActive }) =>
                    `nav-link text-lg py-1.5 ${isActive ? "text-amber-200 border-amber-200" : "text-amber-100 border-transparent hover:text-white"}`
                  }
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Sales History
                </NavLink>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-amber-700 px-3 py-1.5 rounded-lg">
                <div className="bg-amber-200 p-1.5 rounded-full">
                  <User className="w-4 h-4 text-amber-800" />
                </div>
                <span className="ml-2 text-amber-100 font-medium text-base">{user?.email?.split('@')[0]}</span>
              </div>
              <Button 
                variant="outline" 
                className="text-base px-3 py-1.5 h-auto border-2 bg-white text-amber-800 hover:bg-amber-100" 
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation menu with adjusted sizes */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-amber-700">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block px-3 py-1.5 rounded-md text-sm font-medium ${isActive ? "bg-amber-900 text-white" : "text-amber-100 hover:bg-amber-600"}`
              }
            >
              <div className="flex items-center">
                <Utensils className="w-4 h-4 mr-2" />
                Inventory
              </div>
            </NavLink>
            <NavLink
              to="/activity-logs"
              className={({ isActive }) =>
                `block px-3 py-1.5 rounded-md text-sm font-medium ${isActive ? "bg-amber-900 text-white" : "text-amber-100 hover:bg-amber-600"}`
              }
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Activity Logs
              </div>
            </NavLink>
            <NavLink
              to="/sales-history"
              className={({ isActive }) =>
                `block px-3 py-1.5 rounded-md text-sm font-medium ${isActive ? "bg-amber-900 text-white" : "text-amber-100 hover:bg-amber-600"}`
              }
            >
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Sales History
              </div>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main content area with better spacing */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-cooking-softOrange/10">
          <Outlet />
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="mt-12 py-6 border-t border-cooking-softOrange/20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-700">Food Inventory Management System © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
