import { Activity, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

const FloatDistributionWidget = () => {
  const regions = [
    { name: 'Arabian Sea', count: 1247, change: '+23', active: 94 },
    { name: 'Bay of Bengal', count: 856, change: '+12', active: 89 },
    { name: 'Indian Ocean', count: 2134, change: '+45', active: 96 },
    { name: 'Equatorial Belt', count: 610, change: '+8', active: 91 },
  ];

  const totalFloats = regions.reduce((sum, region) => sum + region.count, 0);

  return (
    <Card className="glass-card p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <h3 className="font-semibold">Float Distribution</h3>
      </div>

      <div className="space-y-3 h-full">
        {/* Total Stats */}
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{totalFloats.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Active Floats</p>
            </div>
            <Activity className="h-8 w-8 text-primary/60" />
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="space-y-2 flex-1">
          {regions.map((region, index) => {
            const percentage = (region.count / totalFloats) * 100;
            return (
              <div key={index} className="glass-panel p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-ocean-cyan" />
                    <span className="font-medium text-sm">{region.name}</span>
                  </div>
                  <span className="text-xs text-green-400">{region.change}</span>
                </div>
                
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold">{region.count}</span>
                  <span className="text-xs text-muted-foreground">{region.active}% active</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted/30 rounded-full h-2 mb-1">
                  <div 
                    className="bg-primary h-2 rounded-full glow-primary transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {percentage.toFixed(1)}% of total
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini Visualization */}
        <div className="glass-panel p-2 rounded-lg">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Last 24h Activity</span>
            <span className="text-green-400">+88 floats</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-6 rounded-sm ${
                  Math.random() > 0.3 ? 'bg-primary/60' : 'bg-muted/30'
                } ${Math.random() > 0.8 ? 'animate-pulse-glow' : ''}`}
                style={{ 
                  height: `${Math.random() * 20 + 10}px`,
                  opacity: Math.random() * 0.5 + 0.5 
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FloatDistributionWidget;