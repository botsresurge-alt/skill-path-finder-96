import { Button } from "@/components/ui/button";
import { Sparkles, Brain } from "lucide-react";

interface HeaderProps {
  onGetStarted?: () => void;
  showAuth?: boolean;
}

const Header = ({ onGetStarted, showAuth = true }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg gradient-primary">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gradient">AI Job Suggester</h1>
        </div>
        
        {showAuth && (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button variant="hero" size="sm" onClick={onGetStarted}>
              <Sparkles className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;