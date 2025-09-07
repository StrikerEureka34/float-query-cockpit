import { TrendingUp, TrendingDown } from 'lucide-react';

const TemperatureChart = () => {
  // Mock temperature data
  const data = [
    { depth: 0, temp: 29.2, date: '2024-01-15' },
    { depth: 50, temp: 28.5, date: '2024-01-15' },
    { depth: 100, temp: 26.8, date: '2024-01-15' },
    { depth: 200, temp: 23.2, date: '2024-01-15' },
    { depth: 500, temp: 15.6, date: '2024-01-15' },
    { depth: 1000, temp: 8.4, date: '2024-01-15' },
    { depth: 1500, temp: 4.2, date: '2024-01-15' },
    { depth: 2000, temp: 2.1, date: '2024-01-15' },
  ];

  const maxTemp = Math.max(...data.map(d => d.temp));
  const minTemp = Math.min(...data.map(d => d.temp));

  return (
    <div className="w-full h-80 relative overflow-hidden rounded-lg">
      {/* Title */}
      <div className="absolute top-2 left-2 text-sm font-medium text-primary z-30">
        Temperature Profile - ARGO Float #3847
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-2 right-2 glass-card p-3 rounded-lg z-30 bg-background/80 backdrop-blur-sm">
        <div className="text-xs space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-accent" />
            <span>Surface: {data[0].temp}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3 w-3 text-primary" />
            <span>Deep: {data[data.length - 1].temp}°C</span>
          </div>
          <div className="text-coral font-medium">
            Anomaly: +1.2°C @ 200m
          </div>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="grid grid-cols-10 grid-rows-8 h-full w-full">
          {Array.from({ length: 80 }, (_, i) => (
            <div key={i} className="border border-primary/30"></div>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="absolute inset-4 z-10">
        
        {/* Y-axis (Depth) */}
        <div className="absolute left-0 top-8 bottom-8 w-12 flex flex-col justify-between text-xs text-muted-foreground z-20">
          <span>0m</span>
          <span>500m</span>
          <span>1000m</span>
          <span>1500m</span>
          <span>2000m</span>
        </div>

        {/* X-axis (Temperature) */}
        <div className="absolute bottom-0 left-12 right-0 h-8 flex justify-between items-end text-xs text-muted-foreground z-20">
          <span>0°C</span>
          <span>10°C</span>
          <span>20°C</span>
          <span>30°C</span>
        </div>

        {/* Chart Area */}
        <div className="absolute top-8 bottom-8 left-12 right-16 z-15">
          <svg className="w-full h-full" viewBox="0 0 300 200">
            {/* Temperature Profile Line */}
            <path
              d={data.map((point, i) => {
                const x = (point.temp / maxTemp) * 280;
                const y = (point.depth / 2000) * 180;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-lg"
            />

            {/* Temperature Gradient Fill */}
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            <path
              d={[
                `M 0 0`,
                ...data.map((point) => {
                  const x = (point.temp / maxTemp) * 280;
                  const y = (point.depth / 2000) * 180;
                  return `L ${x} ${y}`;
                }),
                `L 0 180`,
                `Z`
              ].join(' ')}
              fill="url(#tempGradient)"
            />

            {/* Data Points */}
            {data.map((point, i) => {
              const x = (point.temp / maxTemp) * 280;
              const y = (point.depth / 2000) * 180;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="hsl(var(--primary))"
                    className="animate-pulse-glow"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="hsl(var(--primary))"
                    fillOpacity="0.2"
                    className="animate-ping"
                  />
                </g>
              );
            })}

            {/* Anomaly Indicators */}
            <circle cx="180" cy="80" r="6" fill="hsl(var(--coral-red))" className="animate-pulse">
              <title>Temperature Anomaly: +1.2°C at 200m</title>
            </circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;