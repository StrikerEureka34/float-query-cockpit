import { AlertTriangle, TrendingUp, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AnomaliesWidget = () => {
  const anomalies = [
    {
      id: 'ANOM-001',
      type: 'Temperature',
      severity: 'high',
      value: '+2.1°C',
      location: 'Arabian Sea (18.5°N, 68.2°E)',
      time: '2 hours ago',
      floatId: '#3847',
      status: 'active'
    },
    {
      id: 'ANOM-002', 
      type: 'Salinity',
      severity: 'medium',
      value: '+1.8 PSU',
      location: 'Bay of Bengal (15.1°N, 88.4°E)',
      time: '5 hours ago',
      floatId: '#2956',
      status: 'monitoring'
    },
    {
      id: 'ANOM-003',
      type: 'BGC-O2',
      severity: 'low',
      value: '-15% DO',
      location: 'Equatorial IO (2.3°N, 73.1°E)',
      time: '8 hours ago',
      floatId: '#4192',
      status: 'resolved'
    },
    {
      id: 'ANOM-004',
      type: 'Current',
      severity: 'medium',
      value: '0.8 m/s anomaly',
      location: 'Somalia Basin (8.7°N, 65.3°E)',
      time: '12 hours ago',
      floatId: '#3254',
      status: 'investigating'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'monitoring': return 'bg-yellow-400';
      case 'investigating': return 'bg-orange-400';
      case 'resolved': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const totalAnomalies = anomalies.length;
  const activeAnomalies = anomalies.filter(a => a.status === 'active').length;
  const highSeverity = anomalies.filter(a => a.severity === 'high').length;

  return (
    <Card className="glass-card p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-coral rounded-full animate-pulse"></div>
        <h3 className="font-semibold">Anomaly Detection</h3>
      </div>

      <div className="space-y-4 h-full">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="glass-panel p-2 rounded-lg text-center">
            <AlertTriangle className="h-4 w-4 text-coral mx-auto mb-1" />
            <p className="text-lg font-bold text-coral">{totalAnomalies}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="glass-panel p-2 rounded-lg text-center">
            <TrendingUp className="h-4 w-4 text-red-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-400">{activeAnomalies}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="glass-panel p-2 rounded-lg text-center">
            <AlertTriangle className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-yellow-400">{highSeverity}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="space-y-2 flex-1 overflow-y-auto max-h-64">
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className="glass-panel p-3 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(anomaly.status)} animate-pulse`}></div>
                  <span className="font-medium text-sm">{anomaly.type}</span>
                  <Badge className={`text-xs ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{anomaly.floatId}</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-accent">{anomaly.value}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{anomaly.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{anomaly.location}</span>
                </div>

                {/* Status Indicator */}
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium capitalize ${
                    anomaly.status === 'active' ? 'text-red-400' :
                    anomaly.status === 'monitoring' ? 'text-yellow-400' :
                    anomaly.status === 'investigating' ? 'text-orange-400' :
                    'text-green-400'
                  }`}>
                    {anomaly.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trend Chart */}
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium">Detection Trend (24h)</span>
            <span className="text-xs text-green-400">↓ -12% from yesterday</span>
          </div>
          
          <div className="flex items-end gap-1 h-12">
            {Array.from({ length: 12 }, (_, i) => {
              const height = Math.random() * 40 + 10;
              const isAnomaly = Math.random() > 0.7;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${isAnomaly ? 'bg-coral animate-pulse-glow' : 'bg-primary/40'}`}
                  style={{ height: `${height}px` }}
                ></div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnomaliesWidget;