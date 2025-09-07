import { Droplets } from 'lucide-react';

const SalinityHeatmap = () => {
  // Mock salinity data grid (lat, lon, salinity)
  const salinityData = [
    [33.5, 34.2, 34.8, 35.1, 35.4, 35.8, 36.2],
    [33.2, 33.9, 34.5, 34.9, 35.3, 35.7, 36.0],
    [32.8, 33.6, 34.2, 34.6, 35.0, 35.4, 35.8],
    [32.5, 33.3, 33.9, 34.3, 34.7, 35.1, 35.5],
    [32.1, 32.9, 33.5, 33.9, 34.3, 34.7, 35.1],
  ];

  const getColor = (salinity: number) => {
    // Color scale from blue (low) to red (high)
    const normalized = (salinity - 32) / 4; // Normalize to 0-1
    if (normalized < 0.2) return 'bg-blue-500';
    if (normalized < 0.4) return 'bg-cyan-400';  
    if (normalized < 0.6) return 'bg-yellow-400';
    if (normalized < 0.8) return 'bg-orange-400';
    return 'bg-red-500';
  };

  const getOpacity = (salinity: number) => {
    const normalized = (salinity - 32) / 4;
    return Math.max(0.3, Math.min(1, normalized));
  };

  return (
    <div className="w-full h-80 relative overflow-hidden rounded-lg">
      {/* Title */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-medium text-primary text-center z-30">
        Regional Salinity Distribution  
      </div>

      {/* Color Scale Legend */}
      <div className="absolute top-2 right-2 glass-card p-2 rounded-lg z-30 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 mb-2">
          <Droplets className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium">Salinity (PSU)</span>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-blue-500 rounded"></div>
            <span>32-33</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-cyan-400 rounded"></div>
            <span>33-34</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-yellow-400 rounded"></div>
            <span>34-35</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-orange-400 rounded"></div>
            <span>35-36</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-red-500 rounded"></div>
            <span>36+</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-2 left-2 glass-card p-2 rounded-lg z-30 bg-background/80 backdrop-blur-sm">
        <div className="text-xs space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Bay of Bengal:</span>
            <span className="text-cyan-400 font-medium">33.2 PSU</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Arabian Sea:</span>
            <span className="text-orange-400 font-medium">35.8 PSU</span>
          </div>
          <div className="flex justify-between gap-4 text-coral font-medium">
            <span>Difference:</span>
            <span>+2.6 PSU</span>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep to-primary/20 z-0"></div>
      
      {/* Heatmap Grid */}
      <div className="absolute top-8 bottom-16 left-8 right-8 grid grid-rows-5 grid-cols-7 gap-1 z-10">
        {salinityData.map((row, rowIndex) =>
          row.map((salinity, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${getColor(salinity)} rounded-sm relative group cursor-pointer transition-all hover:scale-110`}
              style={{ opacity: getOpacity(salinity) }}
            >
              {/* Value Tooltip */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="glass-card p-1 rounded text-xs font-medium whitespace-nowrap">
                  {salinity} PSU
                </div>
              </div>
              
              {/* Shimmer effect for high salinity */}
              {salinity > 35.5 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-sm"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Coordinate Labels */}
      <div className="absolute top-8 left-2 text-xs text-muted-foreground z-20">
        20°N
      </div>
      <div className="absolute bottom-16 left-2 text-xs text-muted-foreground z-20">
        10°N
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground z-20">
        70°E - 75°E
      </div>
    </div>
  );
};

export default SalinityHeatmap;