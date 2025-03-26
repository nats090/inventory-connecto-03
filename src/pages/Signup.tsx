
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CookingPot, UserPlus, ChevronLeft } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Check your email to confirm your account!",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cooking-pattern bg-repeat">
      <div className="w-full max-w-md px-4 py-8 animate-fade-in">
        <Card className="card-gradient border-cooking-softOrange/20 overflow-hidden">
          <div className="absolute inset-0 cooking-gradient opacity-20 -z-10"></div>
          <CardHeader className="space-y-2 text-center pb-2">
            <div className="mx-auto bg-cooking-softOrange/20 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <CookingPot className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center text-primary">
              Create Your Account
            </CardTitle>
            <p className="text-muted-foreground text-sm">Join our food inventory platform</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="chef@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-primary"
                onClick={() => navigate("/login")}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Already have an account? Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
