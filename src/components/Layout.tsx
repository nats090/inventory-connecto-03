
import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CookingPot, Utensils, FileText, BarChart3, LogOut, User, Plus, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Layout = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-cooking-pattern bg-repeat">
      {/* Improved header with streamlined navigation */}
      <nav className="bg-amber-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <CookingPot className="h-7 w-7 text-amber-200 mr-2" />
                <span className="text-lg sm:text-xl font-bold text-white font-playfair tracking-tight">Food Inventory</span>
              </div>
              <div className="hidden md:flex ml-8 space-x-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-amber-700 text-amber-100" : "text-amber-100 hover:bg-amber-700/50 hover:text-white"}`
                  }
                >
                  <Utensils className="w-4 h-4 mr-1.5" />
                  Inventory
                </NavLink>
                <NavLink
                  to="/add-item"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-amber-700 text-amber-100" : "text-amber-100 hover:bg-amber-700/50 hover:text-white"}`
                  }
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Item
                </NavLink>
                <NavLink
                  to="/activity-logs"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-amber-700 text-amber-100" : "text-amber-100 hover:bg-amber-700/50 hover:text-white"}`
                  }
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  Activity
                </NavLink>
                <NavLink
                  to="/sales-history"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-amber-700 text-amber-100" : "text-amber-100 hover:bg-amber-700/50 hover:text-white"}`
                  }
                >
                  <BarChart3 className="w-4 h-4 mr-1.5" />
                  Sales
                </NavLink>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:flex bg-amber-700/80 px-2.5 py-1 rounded-md items-center">
                <div className="bg-amber-200 p-1 rounded-full">
                  <User className="w-3 h-3 text-amber-800" />
                </div>
                <span className="ml-1.5 text-amber-100 font-medium text-sm truncate max-w-[100px]">{user?.email?.split('@')[0]}</span>
              </div>
              <Button 
                variant="outline" 
                className="hidden sm:flex px-2 py-1 h-auto text-sm border border-amber-200/30 bg-transparent text-amber-100 hover:bg-amber-700/70" 
                onClick={handleSignOut}
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Sign Out
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-amber-100"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Improved mobile navigation with dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-amber-700 shadow-lg pb-2">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-amber-800 text-white" : "text-amber-100 hover:bg-amber-600"}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Utensils className="w-4 h-4 mr-2" />
                  <span>Inventory</span>
                </div>
              </NavLink>
              <NavLink
                to="/add-item"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-amber-800 text-white" : "text-amber-100 hover:bg-amber-600"}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Add Item</span>
                </div>
              </NavLink>
              <NavLink
                to="/activity-logs"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-amber-800 text-white" : "text-amber-100 hover:bg-amber-600"}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Activity</span>
                </div>
              </NavLink>
              <NavLink
                to="/sales-history"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-amber-800 text-white" : "text-amber-100 hover:bg-amber-600"}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>Sales</span>
                </div>
              </NavLink>
              <Button 
                variant="outline" 
                className="w-full mt-2 px-2 py-1 h-9 text-sm border border-amber-200/30 bg-transparent text-amber-100 hover:bg-amber-600" 
                onClick={handleSignOut}
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
        
        {/* Bottom mobile navigation tab bar - always visible on mobile */}
        <div className="md:hidden">
          <div className="grid grid-cols-4 gap-0 bg-amber-700 border-t border-amber-600">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-1 ${isActive ? "bg-amber-800 text-white" : "text-amber-100"}`
              }
            >
              <Utensils className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Inventory</span>
            </NavLink>
            <NavLink
              to="/add-item"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-1 ${isActive ? "bg-amber-800 text-white" : "text-amber-100"}`
              }
            >
              <Plus className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Add Item</span>
            </NavLink>
            <NavLink
              to="/activity-logs"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-1 ${isActive ? "bg-amber-800 text-white" : "text-amber-100"}`
              }
            >
              <FileText className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Activity</span>
            </NavLink>
            <NavLink
              to="/sales-history"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-1 ${isActive ? "bg-amber-800 text-white" : "text-amber-100"}`
              }
            >
              <BarChart3 className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Sales</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main content area with improved responsive padding */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8 animate-fade-in pb-16 md:pb-0">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-cooking-softOrange/10">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-6 sm:mt-12 py-4 sm:py-6 border-t border-cooking-softOrange/20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-700 text-sm">Food Inventory Management System © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
