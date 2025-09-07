import { Activity, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeView: 'chat' | 'dashboard';
  setActiveView: (view: 'chat' | 'dashboard') => void;
}

const Header = ({ activeView, setActiveView }: HeaderProps) => {
  return (
    <header className="glass-panel border-b border-border/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="h-8 w-8 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-glow">FloatChat</h1>
              <p className="text-xs text-muted-foreground">ARGO Oceanographic AI</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'chat' ? 'default' : 'outline'}
              onClick={() => setActiveView('chat')}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;