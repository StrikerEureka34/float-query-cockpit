import { Thermometer, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

const TemperatureWidget = () => {
  const temperatureData = [
    { time: '00:00', surface: 28.5, deep: 4.2 },
    { time: '04:00', surface: 28.2, deep: 4.1 },
    { time: '08:00', surface: 29.1, deep: 4.3 },
    { time: '12:00', surface: 30.2, deep: 4.2 },
    { time: '16:00', surface: 31.1, deep: 4.4 },
    { time: '20:00', surface: 29.8, deep: 4.2 },
  ];

  const currentTemp = temperatureData[temperatureData.length - 1];
  const prevTemp = temperatureData[temperatureData.length - 2];
  const surfaceChange = currentTemp.surface - prevTemp.surface;

  return (
    <Card className="glass-card p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        <h3 className="font-semibold">Temperature Trends</h3>
      </div>

      <div className="space-y-4 h-full">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-panel p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <Thermometer className="h-4 w-4 text-accent" />
              <div className="flex items-center gap-1 text-xs">
                {surfaceChange > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={surfaceChange > 0 ? 'text-green-400' : 'text-red-400'}>
                  {surfaceChange > 0 ? '+' : ''}{surfaceChange.toFixed(1)}°C
                </span>
              </div>
            </div>
            <p className="text-xl font-bold text-accent">{currentTemp.surface}°C</p>
            <p className="text-xs text-muted-foreground">Surface Temp</p>
          </div>
          
          <div className="glass-panel p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <Thermometer className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">2000m</span>
            </div>
            <p className="text-xl font-bold text-primary">{currentTemp.deep}°C</p>
            <p className="text-xs text-muted-foreground">Deep Water</p>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="glass-panel p-3 rounded-lg flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium">24h Trend</span>
            <span className="text-xs text-muted-foreground">Surface Layer</span>
          </div>
          
          <div className="relative h-24">
            <svg className="w-full h-full" viewBox="0 0 300 80">
              {/* Grid Lines */}
              {[20, 40, 60].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                />
              ))}
              
              {/* Temperature Line */}
              <path
                d={temperatureData.map((point, i) => {
                  const x = (i / (temperatureData.length - 1)) * 280 + 10;
                  const y = 70 - ((point.surface - 28) / 4) * 50;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-sm"
              />
              
              {/* Data Points */}
              {temperatureData.map((point, i) => {
                const x = (i / (temperatureData.length - 1)) * 280 + 10;
                const y = 70 - ((point.surface - 28) / 4) * 50;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="hsl(var(--accent))"
                    className="animate-pulse-glow"
                  >
                    <title>{point.time}: {point.surface}°C</title>
                  </circle>
                );
              })}
              
              {/* Anomaly Indicator */}
              <circle
                cx="200"
                cy="25"
                r="4"
                fill="hsl(var(--coral-red))"
                className="animate-pulse"
              >
                <title>Temperature Anomaly Detected</title>
              </circle>
            </svg>
          </div>
          
          {/* Time Labels */}
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Anomaly Alert */}
        <div className="glass-panel p-2 rounded-lg border border-coral/30">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-coral rounded-full animate-pulse"></div>
            <span className="font-medium text-coral">Anomaly Detected</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Surface temperature spike: +1.8°C above normal at 16:00
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TemperatureWidget;