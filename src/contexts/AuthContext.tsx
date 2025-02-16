
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

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

  const signOut = async () => {
    try {
      // Clear local session state first
      setUser(null);
      setSession(null);
      
      // Then attempt to clear Supabase session
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      // Always navigate to login
      navigate('/login');
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setUser(currentSession.user);
          setSession(currentSession);
        } else {
          setUser(null);
          setSession(null);
          navigate('/login');
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

    // Listen for changes on auth state (login, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event);
      
      if (currentSession) {
        setUser(currentSession.user);
        setSession(currentSession);
      } else {
        setUser(null);
        setSession(null);
        navigate('/login');
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
