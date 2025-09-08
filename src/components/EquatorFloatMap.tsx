import { MapPin, Activity } from 'lucide-react';

const EquatorFloatMap = () => {
  // Mock ARGO float positions near equator
  const floatLocations = [
    { id: 'Float-2901832', lat: 2.1, lon: 15.3, status: 'active', lastProfile: '2023-03-28' },
    { id: 'Float-2902156', lat: -1.8, lon: 42.7, status: 'active', lastProfile: '2023-03-29' },
    { id: 'Float-2901965', lat: 3.2, lon: 28.9, status: 'active', lastProfile: '2023-03-27' },
    { id: 'Float-2901743', lat: -0.5, lon: 35.1, status: 'inactive', lastProfile: '2023-03-15' },
    { id: 'Float-2902034', lat: 1.9, lon: 48.6, status: 'active', lastProfile: '2023-03-30' },
  ];

  // Convert lat/lon to SVG coordinates
  const mapToSvg = (lat: number, lon: number) => {
    // Map longitude -10 to 60 -> 0 to 300
    // Map latitude -5 to 5 -> 150 to 50 (inverted for SVG)
    const x = ((lon + 10) / 70) * 300;
    const y = 100 - ((lat + 5) / 10) * 100;
    return { x: Math.max(0, Math.min(300, x)), y: Math.max(0, Math.min(200, y)) };
  };

  return (
    <div className="w-full h-80 relative overflow-hidden rounded-lg">
      {/* Title */}
      <div className="absolute top-2 left-2 text-sm font-medium text-primary z-30">
        ARGO Float Locations - Equatorial Region
      </div>

      {/* Legend */}
      <div className="absolute top-2 right-2 glass-card p-3 rounded-lg z-30 bg-background/80 backdrop-blur-sm">
        <div className="text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span>Active Float</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
            <span>Inactive Float</span>
          </div>
          <div className="text-ocean-cyan font-medium">
            March 2023 Data
          </div>
        </div>
      </div>

      {/* Background Ocean */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-cyan/20 to-primary/30 z-0"></div>

      {/* Grid Lines */}
      <div className="absolute inset-4 z-5">
        <svg className="w-full h-full opacity-30" viewBox="0 0 300 200">
          {/* Latitude lines */}
          <line x1="0" y1="50" x2="300" y2="50" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="0" y1="100" x2="300" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" />
          <line x1="0" y1="150" x2="300" y2="150" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Longitude lines */}
          {[60, 120, 180, 240].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="2,2" />
          ))}
        </svg>
      </div>

      {/* Map Container */}
      <div className="absolute inset-4 z-10">
        
        {/* Coordinate Labels */}
        <div className="absolute left-0 top-8 bottom-8 w-12 flex flex-col justify-between text-xs text-muted-foreground z-20">
          <span>5°N</span>
          <span>0°</span>
          <span>5°S</span>
        </div>

        <div className="absolute bottom-0 left-12 right-0 h-8 flex justify-between items-end text-xs text-muted-foreground z-20">
          <span>0°E</span>
          <span>20°E</span>
          <span>40°E</span>
          <span>60°E</span>
        </div>

        {/* Map Area */}
        <div className="absolute top-8 bottom-8 left-12 right-16 z-15">
          <svg className="w-full h-full" viewBox="0 0 300 200">
            {/* Equator Line */}
            <line 
              x1="0" 
              y1="100" 
              x2="300" 
              y2="100" 
              stroke="hsl(var(--accent))" 
              strokeWidth="3" 
              strokeDasharray="10,5"
              opacity="0.8"
            />
            <text x="10" y="95" fill="hsl(var(--accent))" fontSize="10" fontWeight="bold">
              Equator (0°)
            </text>

            {/* Float Markers */}
            {floatLocations.map((float, i) => {
              const pos = mapToSvg(float.lat, float.lon);
              const isActive = float.status === 'active';
              
              return (
                <g key={i}>
                  {/* Outer ring animation for active floats */}
                  {isActive && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="12"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* Main marker */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="6"
                    fill={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                    stroke="white"
                    strokeWidth="2"
                    className={isActive ? "animate-pulse-glow" : ""}
                  >
                    <title>
                      {float.id}
                      {'\n'}Position: {float.lat.toFixed(1)}°, {float.lon.toFixed(1)}°
                      {'\n'}Last Profile: {float.lastProfile}
                      {'\n'}Status: {float.status}
                    </title>
                  </circle>

                  {/* Float ID label */}
                  <text
                    x={pos.x + 10}
                    y={pos.y - 8}
                    fill="hsl(var(--foreground))"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {float.id.split('-')[1]}
                  </text>
                </g>
              );
            })}

            {/* Study Area Boundary */}
            <rect
              x="0"
              y="50"
              width="300"
              height="100"
              fill="none"
              stroke="hsl(var(--ocean-cyan))"
              strokeWidth="2"
              strokeDasharray="8,4"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 glass-card p-3 rounded-lg z-30 bg-background/80 backdrop-blur-sm">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-primary" />
            <span>5 floats detected</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-accent" />
            <span>±5° latitude range</span>
          </div>
          <div className="text-ocean-cyan font-medium">
            Region: Equatorial Indian Ocean
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquatorFloatMap;