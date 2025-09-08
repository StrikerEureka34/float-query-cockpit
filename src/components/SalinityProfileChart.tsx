import { TrendingDown } from 'lucide-react';

const SalinityProfileChart = () => {
  // Mock salinity profile data for 4 different floats near equator
  const floatProfiles = [
    {
      id: 'Float-2901832',
      location: '2.1°N, 15.3°E',
      color: 'hsl(var(--primary))',
      data: [
        { depth: 0, salinity: 35.2 },
        { depth: 25, salinity: 35.1 },
        { depth: 50, salinity: 34.8 },
        { depth: 100, salinity: 34.6 },
        { depth: 200, salinity: 34.9 },
        { depth: 500, salinity: 35.1 },
        { depth: 1000, salinity: 34.7 },
        { depth: 1500, salinity: 34.6 },
      ]
    },
    {
      id: 'Float-2902156',
      location: '1.8°S, 42.7°E',
      color: 'hsl(var(--accent))',
      data: [
        { depth: 0, salinity: 35.4 },
        { depth: 25, salinity: 35.3 },
        { depth: 50, salinity: 34.9 },
        { depth: 100, salinity: 34.5 },
        { depth: 200, salinity: 35.0 },
        { depth: 500, salinity: 35.2 },
        { depth: 1000, salinity: 34.8 },
        { depth: 1500, salinity: 34.7 },
      ]
    },
    {
      id: 'Float-2901965',
      location: '3.2°N, 28.9°E',
      color: 'hsl(var(--ocean-cyan))',
      data: [
        { depth: 0, salinity: 35.0 },
        { depth: 25, salinity: 34.9 },
        { depth: 50, salinity: 34.7 },
        { depth: 100, salinity: 34.4 },
        { depth: 200, salinity: 34.8 },
        { depth: 500, salinity: 35.0 },
        { depth: 1000, salinity: 34.6 },
        { depth: 1500, salinity: 34.5 },
      ]
    }
  ];

  return (
    <div className="w-full h-80 relative overflow-hidden rounded-lg">
      {/* Title */}
      <div className="absolute top-2 left-2 text-sm font-medium text-primary z-30">
        Salinity Profiles - Equatorial Region (March 2023)
      </div>

      {/* Legend */}
      <div className="absolute top-2 right-2 glass-card p-3 rounded-lg z-30 bg-background/80 backdrop-blur-sm">
        <div className="text-xs space-y-1">
          {floatProfiles.map((profile, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: profile.color }}></div>
              <span className="text-xs">{profile.id}</span>
            </div>
          ))}
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
          <span>300m</span>
          <span>600m</span>
          <span>900m</span>
          <span>1500m</span>
        </div>

        {/* X-axis (Salinity) */}
        <div className="absolute bottom-0 left-12 right-0 h-8 flex justify-between items-end text-xs text-muted-foreground z-20">
          <span>34.0</span>
          <span>34.5</span>
          <span>35.0</span>
          <span>35.5</span>
        </div>

        {/* Chart Area */}
        <div className="absolute top-8 bottom-8 left-12 right-16 z-15">
          <svg className="w-full h-full" viewBox="0 0 300 200">
            {/* Salinity Profile Lines */}
            {floatProfiles.map((profile, profileIndex) => (
              <g key={profileIndex}>
                <path
                  d={profile.data.map((point, i) => {
                    const x = ((point.salinity - 34.0) / 1.5) * 280;
                    const y = (point.depth / 1500) * 180;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke={profile.color}
                  strokeWidth="2"
                  fill="none"
                  className="drop-shadow-lg"
                />

                {/* Data Points */}
                {profile.data.map((point, i) => {
                  const x = ((point.salinity - 34.0) / 1.5) * 280;
                  const y = (point.depth / 1500) * 180;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={profile.color}
                      className="animate-pulse-glow"
                    >
                      <title>{`${profile.id}: ${point.salinity} PSU at ${point.depth}m`}</title>
                    </circle>
                  );
                })}
              </g>
            ))}

            {/* Halocline Indicator */}
            <rect
              x="0"
              y="60"
              width="280"
              height="40"
              fill="hsl(var(--primary))"
              fillOpacity="0.1"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeDasharray="5,5"
            >
              <title>Halocline Zone (100-200m)</title>
            </rect>
          </svg>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-12 left-12 glass-card p-2 rounded-lg z-30 bg-background/80 backdrop-blur-sm">
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-3 w-3 text-accent" />
              <span>Fresh lens: 50-100m</span>
            </div>
            <div className="text-ocean-cyan font-medium">
              Avg surface: 35.2 PSU
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalinityProfileChart;