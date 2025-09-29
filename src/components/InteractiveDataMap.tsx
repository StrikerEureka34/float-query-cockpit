import React, { useState, useRef } from 'react';
import { MapPin, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import dataset from '@/data/dataset.json';

interface InteractiveDataMapProps {
  compact?: boolean;
}

const InteractiveDataMap = ({ compact = false }: InteractiveDataMapProps) => {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);

  const geographicData = dataset.datasets.find(d => d.type === 'geographic_map');
  const profileData = geographicData?.data.profiles || [];

  const handleDownload = (format: 'csv' | 'json' | 'netcdf') => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'csv':
        content = 'file_reference,date,latitude,longitude,profile_index,region,data_source\n' +
          profileData.map(p => `${p.file_reference},${p.date},${p.latitude},${p.longitude},${p.profile_index},${p.region},${p.data_source}`).join('\n');
        filename = 'equatorial_profiles_march_2023.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
        content = JSON.stringify(geographicData, null, 2);
        filename = 'equatorial_profiles_march_2023.json';
        mimeType = 'application/json';
        break;
      case 'netcdf':
        content = '# NetCDF format simulation\n# Real implementation would generate binary NetCDF data\n' +
          profileData.map(p => `Profile ${p.profile_index}: ${p.latitude}, ${p.longitude} (${p.date})`).join('\n');
        filename = 'equatorial_profiles_march_2023.nc';
        mimeType = 'application/x-netcdf';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${filename} is being downloaded`,
    });
  };

  const mapToSvg = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 400;
    const y = ((90 - lat) / 180) * 200;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className={`relative ${compact ? 'h-64' : 'h-96'} bg-gradient-to-b from-ocean-cyan/10 to-ocean-deep/20 rounded-lg overflow-hidden glass-card`}>
      {/* Title */}
      <div className="absolute top-3 left-3 text-sm font-medium text-primary z-30 font-mono">
        ARGO Float Locations - March 2023 Equatorial Profiles
      </div>

      {/* Controls */}
      <div className="absolute top-3 right-3 flex gap-2 z-30">
        <div className="flex gap-1 glass-card p-1 rounded-lg">
          <Button size="sm" variant="ghost" onClick={handleZoomIn} className="h-6 w-6 p-0">
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleZoomOut} className="h-6 w-6 p-0">
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset} className="h-6 w-6 p-0">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex gap-1 glass-card p-1 rounded-lg">
          <Button size="sm" variant="ghost" onClick={() => handleDownload('csv')} className="h-6 px-2 text-xs font-mono">
            CSV
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDownload('json')} className="h-6 px-2 text-xs font-mono">
            JSON
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDownload('netcdf')} className="h-6 px-2 text-xs font-mono">
            NC
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 glass-card p-3 rounded-lg z-30 bg-background/90 backdrop-blur-sm border border-border/30">
        <div className="text-xs space-y-1 font-mono">
          <div className="font-medium text-primary mb-2">Profile Locations</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span>ARGO Float ({profileData.length} total)</span>
          </div>
          <div className="text-ocean-cyan font-medium">
            Region: ±5° Equatorial
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-3 right-3 glass-card p-2 rounded-lg z-30 bg-background/80 backdrop-blur-sm">
        <div className="text-xs space-y-1 font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-accent" />
            <span>{profileData.length} profiles found</span>
          </div>
          <div className="text-ocean-cyan font-medium">
            Source: Global ARGO Index
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="absolute inset-0 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="w-full h-full transition-transform duration-200"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Equator Line */}
            <line 
              x1="0" 
              y1="100" 
              x2="400" 
              y2="100" 
              stroke="hsl(var(--accent))" 
              strokeWidth="2" 
              strokeDasharray="8,4"
              opacity="0.8"
            />
            <text x="10" y="95" fill="hsl(var(--accent))" fontSize="8" fontWeight="bold" className="font-mono">
              Equator (0°)
            </text>

            {/* Float Markers */}
            {profileData.map((profile, i) => {
              const pos = mapToSvg(profile.latitude, profile.longitude);
              return (
                <g key={i}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="8"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    opacity="0.8"
                    className="animate-ping"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="4"
                    fill="hsl(var(--primary))"
                    stroke="white"
                    strokeWidth="1"
                    className="animate-pulse-glow"
                  >
                    <title className="font-mono">
                      Profile {profile.profile_index}
                      {'\n'}Position: {profile.latitude.toFixed(3)}°, {profile.longitude.toFixed(3)}°
                      {'\n'}Date: {profile.date}
                      {'\n'}Source: {profile.data_source}
                    </title>
                  </circle>
                  <text
                    x={pos.x + 8}
                    y={pos.y - 6}
                    fill="hsl(var(--foreground))"
                    fontSize="6"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    {profile.profile_index}
                  </text>
                </g>
              );
            })}

            {/* Study Area Boundary */}
            <rect
              x="0"
              y="72"
              width="400"
              height="56"
              fill="none"
              stroke="hsl(var(--ocean-cyan))"
              strokeWidth="2"
              strokeDasharray="10,5"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDataMap;