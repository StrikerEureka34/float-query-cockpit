import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, BarChart3, Map, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import OceanMap from '@/components/OceanMap';
import TemperatureChart from '@/components/TemperatureChart';

interface ChatInterfaceProps {
  compact?: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  visualization?: 'map' | 'chart' | 'heatmap' | 'salinity-equator' | 'interactive-map' | 'interactive-chart';
  sqlQuery?: string;
}

const ChatInterface = ({ compact = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to FloatChat! I can help you explore ARGO oceanographic data. Try asking me: "Show me temperature anomalies in the Arabian Sea" or "Compare salinity between Bay of Bengal and Arabian Sea".',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with oceanographic data analysis
    setTimeout(() => {
      const query = inputValue.toLowerCase();
      let response;

      // Handle March queries (March one, March 2023, etc.)
      if (query.includes('march') || query.includes('salinity') && query.includes('equator')) {
        // First show the map visualization
        const mapResponse = {
          content: "📊 **March 2023 Equatorial Analysis Complete**\n\n🗺️ **Geographic Distribution**: Found 3 ARGO profiles in equatorial region (±5° latitude)\n\n📍 **Locations**:\n• Profile 7863: 1.369°N, 69.947°E (Indian Ocean)\n• Profile 8790: 0.721°N, 8.789°W (Atlantic Ocean) \n• Profile 9053: 3.505°N, 54.757°E (Arabian Sea)\n\n📦 **Data Source**: Global ARGO Index\n**Temporal Range**: March 2023\n**Search Methodology**: Spatial filter ±5° equatorial band",
          visualization: 'interactive-map' as const,
          sqlQuery: "SELECT latitude, longitude, date, file_reference, profile_index FROM profiles WHERE ABS(latitude) <= 5 AND date LIKE '2023-03-%' ORDER BY longitude"
        };

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: mapResponse.content,
          timestamp: new Date(),
          visualization: mapResponse.visualization,
          sqlQuery: mapResponse.sqlQuery,
        }]);

        // Then show the chart visualization after a delay
        setTimeout(() => {
          const chartResponse = {
            content: "📈 **Salinity Profile Analysis**\n\n🌊 **Surface Salinity**: 35.0-35.4 PSU across all profiles\n🔍 **Halocline Zone**: Clearly defined at 100-200m depth\n💧 **Fresh Lens**: Formation detected at 50-100m in profiles 8790 & 9053\n\n📊 **Statistical Summary**:\n• Mean surface salinity: 35.2 PSU\n• Depth range: 0-2000m\n• Temperature coupling: Strong correlation\n\n💾 **Download Options**: CSV, JSON, NetCDF formats available",
            visualization: 'interactive-chart' as const,
            sqlQuery: "SELECT depth, salinity, temperature, profile_index FROM profile_data WHERE profile_index IN (7863, 8790, 9053) ORDER BY profile_index, depth"
          };

          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            type: 'assistant',
            content: chartResponse.content,
            timestamp: new Date(),
            visualization: chartResponse.visualization,
            sqlQuery: chartResponse.sqlQuery,
          }]);
        }, 2000);

      } else if (query.includes('temperature') || query.includes('anomal')) {
        response = {
          content: "🌡️ **Temperature Anomaly Analysis**\n\nDetected 127 ARGO floats with significant warming patterns:\n• Peak anomaly: +1.2°C at 200m depth\n• Affected region: Arabian Sea basin\n• Temporal pattern: Consistent warming since July 2023\n\n📊 Statistical correlation with El Niño indices shows 0.73 coefficient.",
          visualization: 'chart' as const,
          sqlQuery: "SELECT depth, temperature_anomaly, date, latitude, longitude FROM temperature_profiles WHERE temp_anomaly > 0.5 AND region = 'arabian_sea' ORDER BY date DESC"
        };
      } else if (query.includes('salinity') || query.includes('compare')) {
        response = {
          content: "🧂 **Salinity Comparison Analysis**\n\n**Bay of Bengal**: 33.2 PSU average (low salinity zone)\n**Arabian Sea**: 35.8 PSU average (high salinity zone)\n**Difference**: 2.6 PSU gradient\n\n🌀 **Physical Process**: Freshwater influx from Ganges-Brahmaputra system creates the observed salinity front.",
          visualization: 'heatmap' as const,
          sqlQuery: "SELECT region, AVG(salinity) as avg_salinity, STDDEV(salinity) as std_salinity FROM profiles GROUP BY region HAVING region IN ('bay_of_bengal', 'arabian_sea')"
        };
      } else {
        // Default oceanographic responses
        const responses = [
          {
            content: "🌊 **ARGO Float Network Status**\n\nActive floats: 3,847 globally\nReal-time data streams: 2,156 profiles/day\nCoverage: All major ocean basins\n\n📊 Latest measurements show normal seasonal patterns with minor temperature anomalies in tropical regions.",
            visualization: 'map' as const,
            sqlQuery: "SELECT COUNT(*) as active_floats, region, AVG(data_quality_flag) as quality FROM argo_status GROUP BY region"
          },
          {
            content: "📈 **Ocean Heat Content Trends**\n\nUpper 2000m warming rate: +0.33°C/decade\nMost significant warming: North Atlantic (40-60°N)\nDeep ocean (>2000m): Stable temperatures\n\n🔬 Analysis based on 47,000+ temperature profiles from 2020-2024.",
            visualization: 'chart' as const,
            sqlQuery: "SELECT year, AVG(temperature) as avg_temp, depth_layer FROM climate_trends WHERE depth_layer IN ('surface', 'intermediate', 'deep') GROUP BY year, depth_layer ORDER BY year"
          }
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      if (response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.content,
          timestamp: new Date(),
          visualization: response.visualization,
          sqlQuery: response.sqlQuery,
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
      
      setIsLoading(false);
    }, 1800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Card className={`glass-panel h-full flex flex-col ${compact ? 'max-w-sm' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          {compact ? 'Chat' : 'AI Oceanographer'}
        </h2>
        {!compact && (
          <p className="text-sm text-muted-foreground">
            Natural language queries for ARGO data
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            compact={compact}
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-mono">Processing ARGO dataset • Spatial analysis • Rendering visualizations...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/30">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={compact ? "Ask me..." : "Query ARGO data: 'Show temperature anomalies...'"}
            disabled={isLoading}
            className="glass-card border-border/50"
          />
          <Button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="glow-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!compact && (
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
            <span>Try:</span>
            <button 
              className="text-primary hover:underline transition-colors"
              onClick={() => setInputValue("March one")}
            >
              March one
            </button>
            <span>•</span>
            <button 
              className="text-primary hover:underline transition-colors"
              onClick={() => setInputValue("Show me salinity profiles near the equator in March 2023")}
            >
              Equatorial salinity
            </button>
            <span>•</span>
            <button 
              className="text-primary hover:underline transition-colors"
              onClick={() => setInputValue("Temperature anomalies")}
            >
              Temperature anomalies
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatInterface;