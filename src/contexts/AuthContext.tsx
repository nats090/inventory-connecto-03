
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null, 
  loading: true,
  signOut: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signOut = async () => {
    try {
      // First clear local state
      setUser(null);
      setSession(null);
      localStorage.removeItem('sb-xffinwdhcibvoeebfnlz-auth-token');

      // Then try to clear Supabase session
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error('Error during Supabase signOut:', signOutError);
        // Continue even if this fails
      }

      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Error during sign out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem logging you out.",
      });
    } finally {
      // Always ensure we redirect to login
      navigate('/login', { replace: true });
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setUser(currentSession.user);
          setSession(currentSession);
          if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
            navigate('/dashboard');
          }
        } else {
          setUser(null);
          setSession(null);
          if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setSession(null);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event);
      
      if (currentSession) {
        setUser(currentSession.user);
        setSession(currentSession);
        if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
          navigate('/dashboard');
        }
      } else {
        setUser(null);
        setSession(null);
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          navigate('/login');
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
