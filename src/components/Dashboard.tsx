import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, MapPin, Thermometer, Droplets, Activity, AlertTriangle } from 'lucide-react';
import FloatDistributionWidget from '@/components/widgets/FloatDistributionWidget';
import TemperatureWidget from '@/components/widgets/TemperatureWidget';
import SalinityWidget from '@/components/widgets/SalinityWidget';
import AnomaliesWidget from '@/components/widgets/AnomaliesWidget';
import RegionalStatsWidget from '@/components/widgets/RegionalStatsWidget';

interface DashboardProps {
  compact?: boolean;
}

const Dashboard = ({ compact = false }: DashboardProps) => {
  const stats = [
    { 
      label: 'Active Floats', 
      value: '3,847', 
      change: '+23', 
      icon: Activity, 
      color: 'text-primary' 
    },
    { 
      label: 'Regions Monitored', 
      value: '12', 
      change: '+1', 
      icon: MapPin, 
      color: 'text-ocean-cyan' 
    },
    { 
      label: 'Anomalies Detected', 
      value: '156', 
      change: '+12', 
      icon: AlertTriangle, 
      color: 'text-coral' 
    },
    { 
      label: 'Data Points Today', 
      value: '89.2K', 
      change: '+5.3K', 
      icon: TrendingUp, 
      color: 'text-accent' 
    },
  ];

  if (compact) {
    return (
      <Card className="glass-panel h-full p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          Dashboard
        </h2>
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                    <p className="text-sm font-semibold">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-panel h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <h2 className="text-2xl font-semibold flex items-center gap-3">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
          Oceanographic Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">
          Real-time ARGO float monitoring & analytics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="p-6 grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-xs text-green-400">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Widgets Grid */}
      <div className="flex-1 p-6 grid grid-cols-2 gap-6 overflow-y-auto">
        <FloatDistributionWidget />
        <TemperatureWidget />
        <SalinityWidget />
        <AnomaliesWidget />
        <div className="col-span-2">
          <RegionalStatsWidget />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-border/30">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Thermometer className="h-4 w-4" />
            Export Temperature Data
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Droplets className="h-4 w-4" />
            Export Salinity Data
          </Button>
          <Button variant="default" className="flex-1 gap-2 glow-primary">
            <AlertTriangle className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;