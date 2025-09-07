import { useEffect, useRef } from 'react';
import { MapPin, Thermometer } from 'lucide-react';

const OceanMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock ARGO float data
  const floats = [
    { id: 1, lat: 15.5, lon: 68.2, temp: 28.5, status: 'active' },
    { id: 2, lat: 12.3, lon: 65.8, temp: 29.2, status: 'active' },
    { id: 3, lat: 18.7, lon: 70.1, temp: 27.8, status: 'warning' },
    { id: 4, lat: 14.2, lon: 72.5, temp: 30.1, status: 'critical' },
    { id: 5, lat: 16.8, lon: 67.3, temp: 28.9, status: 'active' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';  
      case 'critical': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="w-full h-64 relative overflow-hidden rounded-lg">
      {/* Ocean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep via-primary/30 to-ocean-teal opacity-70"></div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }, (_, i) => (
            <div key={i} className="border border-primary/20"></div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          
          {/* Region Labels */}
          <div className="absolute top-4 left-4 text-xs text-primary/80 font-medium">
            Arabian Sea
          </div>
          <div className="absolute bottom-4 right-4 text-xs text-primary/80 font-medium">
            Bay of Bengal
          </div>

          {/* ARGO Float Markers */}
          {floats.map((float) => (
            <div
              key={float.id}
              className="absolute group cursor-pointer"
              style={{
                left: `${((float.lon - 60) / 20) * 100}%`,
                top: `${((20 - float.lat) / 10) * 100}%`,
              }}
            >
              {/* Float Marker */}
              <div className={`w-3 h-3 rounded-full ${getStatusColor(float.status)} animate-pulse glow-primary`}>
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="glass-card p-2 rounded-lg text-xs whitespace-nowrap">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="font-medium">Float #{float.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-accent" />
                    <span>{float.temp}°C</span>
                  </div>
                  <div className="text-muted-foreground">
                    {float.lat}°N, {float.lon}°E
                  </div>
                </div>
              </div>

              {/* Pulse Animation for Active */}
              {float.status === 'active' && (
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
              )}
            </div>
          ))}

          {/* Current/Flow Indicators */}
          <div className="absolute top-1/3 left-1/4">
            <div className="flex items-center gap-1 text-xs text-ocean-cyan opacity-60">
              <div className="w-4 h-0.5 bg-ocean-cyan rounded animate-pulse"></div>
              <span>→</span>
            </div>
          </div>
          
          <div className="absolute bottom-1/3 right-1/4">
            <div className="flex items-center gap-1 text-xs text-ocean-cyan opacity-60">
              <div className="w-4 h-0.5 bg-ocean-cyan rounded animate-pulse"></div>
              <span>↗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-2 right-2 glass-card p-2 rounded-lg">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* Scale */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
        Scale: 1° = ~111km
      </div>
    </div>
  );
};

export default OceanMap;