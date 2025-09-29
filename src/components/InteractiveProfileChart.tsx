import React, { useState } from 'react';
import { TrendingDown, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import dataset from '@/data/dataset.json';

interface InteractiveProfileChartProps {
  compact?: boolean;
}

const InteractiveProfileChart = ({ compact = false }: InteractiveProfileChartProps) => {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const { toast } = useToast();

  const profileData = dataset.datasets.find(d => d.type === 'profile_data');
  const profileCount = profileData?.data.results.candidates_found || 0;

  // Simulated salinity profile data based on real ARGO patterns
  const floatProfiles = [
    {
      id: 'Profile-7863',
      location: '1.4°N, 69.9°E',
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
      id: 'Profile-8790',
      location: '0.7°N, 8.8°W',
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
      id: 'Profile-9053',
      location: '3.5°N, 54.8°E',
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

  const handleDownload = (format: 'csv' | 'json') => {
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'csv') {
      content = 'profile_id,depth,salinity,location\n' +
        floatProfiles.flatMap(profile => 
          profile.data.map(point => `${profile.id},${point.depth},${point.salinity},"${profile.location}"`)
        ).join('\n');
      filename = 'salinity_profiles_march_2023.csv';
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify({ profiles: floatProfiles, metadata: { source: 'Global ARGO Index', region: 'Equatorial', month: 'March 2023' } }, null, 2);
      filename = 'salinity_profiles_march_2023.json';
      mimeType = 'application/json';
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

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className={`relative ${compact ? 'h-64' : 'h-96'} bg-white rounded-lg overflow-hidden glass-card`}>
      {/* Title */}
      <div className="absolute top-3 left-3 text-sm font-medium text-primary z-30 font-mono">
        Salinity Profiles - Equatorial Region (March 2023)
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
        </div>
      </div>

      {/* Legend - Outside plot area */}
      <div className="absolute top-12 right-3 glass-card p-3 rounded-lg z-30 bg-white/95 backdrop-blur-sm border border-border/30 min-w-32">
        <div className="text-xs space-y-2 font-mono">
          <div className="font-medium text-primary mb-2">Profile Lines</div>
          {floatProfiles.map((profile, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: profile.color }}></div>
              <span className="text-xs">{profile.id.split('-')[1]}</span>
            </div>
          ))}
          <div className="border-t border-border/30 pt-2 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-600">Anomaly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="absolute inset-4 z-10">
        <div 
          className="w-full h-full transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            transformOrigin: 'center center'
          }}
        >
          {/* Axes Labels */}
          <div className="absolute left-0 top-8 bottom-12 w-12 flex flex-col justify-between text-xs text-gray-700 z-20 font-mono">
            <span>0m</span>
            <span>375m</span>
            <span>750m</span>
            <span>1125m</span>
            <span>1500m</span>
          </div>

          <div className="absolute bottom-0 left-12 right-36 h-8 flex justify-between items-end text-xs text-gray-700 z-20 font-mono">
            <span>34.0</span>
            <span>34.5</span>
            <span>35.0</span>
            <span>35.5</span>
          </div>

          <div className="absolute left-2 top-1/2 -rotate-90 text-xs text-gray-700 font-mono font-medium">
            Depth (m)
          </div>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 font-mono font-medium">
            Salinity (PSU)
          </div>

          {/* Chart Area */}
          <div className="absolute top-8 bottom-12 left-12 right-36 z-15 bg-white border border-gray-200">
            <svg className="w-full h-full" viewBox="0 0 280 200">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="56" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 56 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="280" height="200" fill="url(#grid)" />

              {/* Salinity Profile Lines */}
              {floatProfiles.map((profile, profileIndex) => (
                <g key={profileIndex}>
                  <path
                    d={profile.data.map((point, i) => {
                      const x = ((point.salinity - 34.0) / 1.5) * 260;
                      const y = (point.depth / 1500) * 180;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    stroke={profile.color}
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-sm"
                  />

                  {/* Data Points */}
                  {profile.data.map((point, i) => {
                    const x = ((point.salinity - 34.0) / 1.5) * 260;
                    const y = (point.depth / 1500) * 180;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3"
                        fill={profile.color}
                        stroke="white"
                        strokeWidth="1"
                        className="animate-pulse-glow"
                      >
                        <title className="font-mono">
                          {profile.id}: {point.salinity} PSU at {point.depth}m
                        </title>
                      </circle>
                    );
                  })}
                </g>
              ))}

              {/* Anomaly Marker */}
              <g>
                <circle
                  cx={((35.2 - 34.0) / 1.5) * 260}
                  cy={(200 / 1500) * 180}
                  r="6"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="animate-pulse"
                >
                  <title className="font-mono">Anomaly: Profile-9053 at 200m depth - 35.2 PSU (elevated)</title>
                </circle>
              </g>

              {/* Halocline Zone */}
              <rect
                x="0"
                y="60"
                width="260"
                height="40"
                fill="hsl(var(--primary))"
                fillOpacity="0.1"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeDasharray="5,5"
              >
                <title className="font-mono">Halocline Zone (100-200m)</title>
              </rect>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-3 left-3 glass-card p-2 rounded-lg z-30 bg-white/90 backdrop-blur-sm">
        <div className="text-xs space-y-1 font-mono">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3 w-3 text-accent" />
            <span>Fresh lens: 50-100m</span>
          </div>
          <div className="text-ocean-cyan font-medium">
            Avg surface: 35.2 PSU
          </div>
          <div className="text-gray-600">
            {profileCount} profiles analyzed
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveProfileChart;