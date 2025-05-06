
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CookingPot, UserPlus, ChevronLeft, Mail, Lock } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-cooking-pattern bg-repeat py-10">
      <div className="w-full max-w-md px-4 animate-fade-in">
        <Card className="card-gradient border-cooking-softOrange/20 overflow-hidden shadow-lg">
          <div className="absolute inset-0 cooking-gradient opacity-10 -z-10"></div>
          <CardHeader className="space-y-3 text-center pb-4">
            <div className="mx-auto bg-cooking-softOrange/30 w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <CookingPot className="h-10 w-10 text-amber-700" />
            </div>
            <CardTitle className="text-3xl text-center text-amber-800">
              Create Your Account
            </CardTitle>
            <p className="text-amber-600">Join our food inventory platform</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm block">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="chef@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-enhanced pl-10 border-cooking-softOrange/30 focus-visible:ring-primary/20 bg-white h-12"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm block">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-enhanced pl-10 border-cooking-softOrange/30 focus-visible:ring-primary/20 bg-white h-12"
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full btn-primary h-12 text-base"
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
              </div>
              <Button
                type="button"
                variant="link"
                className="w-full text-amber-700 hover:text-amber-900 font-medium"
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
