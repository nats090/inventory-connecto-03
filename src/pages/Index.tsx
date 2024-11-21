import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to Inventory Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;