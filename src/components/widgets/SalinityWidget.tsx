import { Droplets, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

const SalinityWidget = () => {
  const regions = [
    { 
      name: 'Arabian Sea', 
      current: 35.8, 
      average: 35.2, 
      trend: 'up',
      change: 0.6 
    },
    { 
      name: 'Bay of Bengal', 
      current: 33.2, 
      average: 33.8, 
      trend: 'down',
      change: -0.6 
    },
    { 
      name: 'Equatorial IO', 
      current: 34.7, 
      average: 34.5, 
      trend: 'up',
      change: 0.2 
    },
  ];

  const maxSalinity = Math.max(...regions.map(r => Math.max(r.current, r.average)));
  const minSalinity = Math.min(...regions.map(r => Math.min(r.current, r.average)));

  return (
    <Card className="glass-card p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-ocean-cyan rounded-full animate-pulse"></div>
        <h3 className="font-semibold">Salinity Analysis</h3>
      </div>

      <div className="space-y-4 h-full">
        {/* Regional Comparison */}
        <div className="space-y-3 flex-1">
          {regions.map((region, index) => {
            const currentPercent = ((region.current - minSalinity) / (maxSalinity - minSalinity)) * 100;
            const avgPercent = ((region.average - minSalinity) / (maxSalinity - minSalinity)) * 100;
            
            return (
              <div key={index} className="glass-panel p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-ocean-cyan" />
                    <span className="font-medium text-sm">{region.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {region.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 text-red-400" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-blue-400" />
                    )}
                    <span className={region.trend === 'up' ? 'text-red-400' : 'text-blue-400'}>
                      {region.change > 0 ? '+' : ''}{region.change.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold">{region.current} PSU</span>
                  <span className="text-xs text-muted-foreground">
                    Avg: {region.average} PSU
                  </span>
                </div>
                
                {/* Comparison Bars */}
                <div className="space-y-1">
                  <div className="relative w-full bg-muted/30 rounded-full h-2">
                    <div 
                      className="bg-ocean-cyan h-2 rounded-full glow-primary transition-all duration-1000"
                      style={{ width: `${currentPercent}%` }}
                    ></div>
                  </div>
                  <div className="relative w-full bg-muted/20 rounded-full h-1">
                    <div 
                      className="bg-muted-foreground h-1 rounded-full opacity-50"
                      style={{ width: `${avgPercent}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Deviation Indicator */}
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">Deviation: </span>
                  <span className={`font-medium ${
                    Math.abs(region.change) > 0.5 ? 'text-coral' : 
                    Math.abs(region.change) > 0.3 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {Math.abs(region.change) > 0.5 ? 'High' : 
                     Math.abs(region.change) > 0.3 ? 'Moderate' : 'Normal'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gradient Scale */}
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium">Salinity Scale (PSU)</span>
            <span className="text-xs text-muted-foreground">Regional Range</span>
          </div>
          
          {/* Color Gradient Bar */}
          <div className="relative h-4 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 via-yellow-400 to-red-500"></div>
            <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium text-white">
              <span>32</span>
              <span>34</span>
              <span>36</span>
            </div>
          </div>
          
          {/* Current Values Indicators */}
          <div className="relative mt-1 h-2">
            {regions.map((region, index) => {
              const position = ((region.current - 32) / 4) * 100;
              return (
                <div
                  key={index}
                  className="absolute w-1 h-4 bg-white rounded-full shadow-lg animate-pulse"
                  style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                    {region.current}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="glass-panel p-2 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Max Difference</p>
            <p className="text-lg font-bold text-coral">2.6 PSU</p>
          </div>
          <div className="glass-panel p-2 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Active Monitors</p>
            <p className="text-lg font-bold text-primary">247</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SalinityWidget;