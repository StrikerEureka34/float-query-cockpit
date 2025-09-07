import { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff, AlertCircle, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const DataFreshnessIndicator = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [status, setStatus] = useState<'fresh' | 'stale' | 'error'>('fresh');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Simulate data freshness checking
    const checkFreshness = () => {
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdate.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        setStatus('fresh');
      } else if (hoursDiff < 72) {
        setStatus('stale');
      } else {
        setStatus('error');
      }
    };

    checkFreshness();
    const interval = setInterval(checkFreshness, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'fresh':
        return {
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: CheckCircle,
          label: 'Fresh',
          description: 'Data updated < 24h ago'
        };
      case 'stale':
        return {
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: AlertCircle,
          label: 'Stale',
          description: 'Data 24-72h old'
        };
      case 'error':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: WifiOff,
          label: 'Error',
          description: 'Data > 72h old'
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          icon: Wifi,
          label: 'Unknown',
          description: 'Status unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="fixed bottom-6 right-6 w-80">
      <Card className="glass-panel p-4 animate-float">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Data Freshness
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 hover:bg-muted/50 rounded-md transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <CollapsibleTrigger asChild>
              <button className="p-1 hover:bg-muted/50 rounded-md transition-colors">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Always visible status badge */}
        <Badge className={`${statusConfig.color} gap-2 w-full justify-start mb-3`}>
          <StatusIcon className="h-4 w-4" />
          <div className="flex-1">
            <span className="font-medium">{statusConfig.label}</span>
            <span className="text-xs opacity-75 ml-2">{statusConfig.description}</span>
          </div>
        </Badge>

        <CollapsibleContent className="space-y-3">
          {/* Data Sources */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IFREMER GDAC</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">INCOIS Regional</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">BGC Parameters</span>
              <span className="text-yellow-400">●</span>
            </div>
          </div>

          {/* Last Update */}
          <div className="text-xs text-muted-foreground border-t border-border/30 pt-2">
            <div className="flex justify-between">
              <span>Last Update:</span>
              <span>{lastUpdate.toLocaleDateString()} {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Next Sync:</span>
              <span className="text-primary">
                {new Date(lastUpdate.getTime() + 6 * 60 * 60 * 1000).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default DataFreshnessIndicator;