import { Map, BarChart3, Activity, Waves } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RegionalStatsWidget = () => {
  const regions = [
    {
      name: 'Arabian Sea',
      code: 'AS',
      floats: 1247,
      coverage: 94,
      avgTemp: 28.5,
      avgSalinity: 35.8,
      anomalies: 23,
      lastUpdate: '2 min ago',
      trend: 'stable',
      bgcActive: 156
    },
    {
      name: 'Bay of Bengal',
      code: 'BB', 
      floats: 856,
      coverage: 89,
      avgTemp: 29.2,
      avgSalinity: 33.2,
      anomalies: 12,
      lastUpdate: '5 min ago',
      trend: 'improving',
      bgcActive: 98
    },
    {
      name: 'Equatorial Indian Ocean',
      code: 'EIO',
      floats: 612,
      coverage: 76,
      avgTemp: 27.8,
      avgSalinity: 34.7,
      anomalies: 8,
      lastUpdate: '3 min ago', 
      trend: 'declining',
      bgcActive: 67
    },
    {
      name: 'Western Indian Ocean',
      code: 'WIO',
      floats: 734,
      coverage: 82,
      avgTemp: 26.9,
      avgSalinity: 35.1,
      anomalies: 15,
      lastUpdate: '1 min ago',
      trend: 'stable',
      bgcActive: 89
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      case 'stable': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗';
      case 'declining': return '↘';
      case 'stable': return '→';
      default: return '—';
    }
  };

  const totalFloats = regions.reduce((sum, region) => sum + region.floats, 0);
  const avgCoverage = regions.reduce((sum, region) => sum + region.coverage, 0) / regions.length;
  const totalAnomalies = regions.reduce((sum, region) => sum + region.anomalies, 0);

  return (
    <Card className="glass-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <h3 className="font-semibold">Regional Statistics</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          Live Data
        </Badge>
      </div>

      <div className="space-y-4 h-full">
        {/* Global Overview */}
        <div className="grid grid-cols-4 gap-3">
          <div className="glass-panel p-3 rounded-lg text-center">
            <Activity className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold">{totalFloats.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Floats</p>
          </div>
          <div className="glass-panel p-3 rounded-lg text-center">
            <Map className="h-4 w-4 text-ocean-cyan mx-auto mb-1" />
            <p className="text-lg font-bold">{avgCoverage.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Avg Coverage</p>
          </div>
          <div className="glass-panel p-3 rounded-lg text-center">
            <BarChart3 className="h-4 w-4 text-coral mx-auto mb-1" />
            <p className="text-lg font-bold">{totalAnomalies}</p>
            <p className="text-xs text-muted-foreground">Anomalies</p>
          </div>
          <div className="glass-panel p-3 rounded-lg text-center">
            <Waves className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold">4</p>
            <p className="text-xs text-muted-foreground">Regions</p>
          </div>
        </div>

        {/* Regional Details Table */}
        <div className="glass-panel rounded-lg overflow-hidden">
          <div className="p-3 border-b border-border/30">
            <h4 className="font-medium text-sm">Regional Breakdown</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/20">
                <tr>
                  <th className="text-left p-2 font-medium">Region</th>
                  <th className="text-center p-2 font-medium">Floats</th>
                  <th className="text-center p-2 font-medium">Coverage</th>
                  <th className="text-center p-2 font-medium">Temp (°C)</th>
                  <th className="text-center p-2 font-medium">Salinity</th>
                  <th className="text-center p-2 font-medium">BGC</th>
                  <th className="text-center p-2 font-medium">Anomalies</th>
                  <th className="text-center p-2 font-medium">Trend</th>
                  <th className="text-center p-2 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region, index) => (
                  <tr key={index} className="border-t border-border/20 hover:bg-muted/10">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <span className="font-medium">{region.code}</span>
                          <div className="text-muted-foreground text-xs">{region.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center p-2 font-medium">{region.floats.toLocaleString()}</td>
                    <td className="text-center p-2">
                      <div className="flex items-center justify-center gap-1">
                        <span className={region.coverage >= 90 ? 'text-green-400' : 
                                       region.coverage >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                          {region.coverage}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center p-2 text-accent font-medium">{region.avgTemp}</td>
                    <td className="text-center p-2 text-ocean-cyan font-medium">{region.avgSalinity}</td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="text-xs">
                        {region.bgcActive}
                      </Badge>
                    </td>
                    <td className="text-center p-2">
                      <span className={region.anomalies > 20 ? 'text-red-400' :
                                     region.anomalies > 10 ? 'text-yellow-400' : 'text-green-400'}>
                        {region.anomalies}
                      </span>
                    </td>
                    <td className="text-center p-2">
                      <span className={getTrendColor(region.trend)}>
                        {getTrendIcon(region.trend)}
                      </span>
                    </td>
                    <td className="text-center p-2 text-muted-foreground">{region.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="glass-panel p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Quick Insights</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Highest salinity region:</span>
              <span className="text-orange-400 font-medium">Arabian Sea (35.8 PSU)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Most anomalies detected in:</span>
              <span className="text-red-400 font-medium">Arabian Sea (23 alerts)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Best coverage:</span>
              <span className="text-green-400 font-medium">Arabian Sea (94%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Temperature range:</span>
              <span className="text-primary font-medium">26.9°C - 29.2°C</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RegionalStatsWidget;