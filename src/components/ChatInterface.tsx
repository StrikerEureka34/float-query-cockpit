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
  visualization?: 'map' | 'chart' | 'heatmap' | 'salinity-equator';
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

    // Simulate AI response with different visualizations
    setTimeout(() => {
      const query = inputValue.toLowerCase();
      let response;

      // Check for specific queries
      if (query.includes('salinity') && query.includes('profile') && query.includes('equator') && query.includes('march 2023')) {
        response = {
          content: "Found 5 ARGO floats near the equator (±5°) with salinity profiles from March 2023. Surface salinity ranges from 35.0-35.4 PSU, with fresh lens formation at 50-100m depth. Halocline zone clearly visible at 100-200m depth across all profiles.",
          visualization: 'salinity-equator' as const,
          sqlQuery: "SELECT depth, salinity, latitude, longitude, float_id FROM profiles WHERE ABS(latitude) <= 5 AND date BETWEEN '2023-03-01' AND '2023-03-31' ORDER BY float_id, depth"
        };
      } else {
        // Default responses for other queries
        const responses = [
          {
            content: "I found 127 ARGO floats in the Arabian Sea with temperature anomalies above +0.5°C. Here's the spatial distribution:",
            visualization: 'map' as const,
            sqlQuery: "SELECT * FROM argo_floats WHERE region='arabian_sea' AND temp_anomaly > 0.5"
          },
          {
            content: "Temperature profiles show significant warming at 200m depth. Peak anomaly: +1.2°C on July 15th.",
            visualization: 'chart' as const,
            sqlQuery: "SELECT depth, temperature, date FROM profiles WHERE float_id IN (SELECT id FROM argo_floats WHERE region='arabian_sea')"
          },
          {
            content: "Salinity comparison reveals Bay of Bengal: 33.2 PSU avg, Arabian Sea: 35.8 PSU avg. 2.6 PSU difference detected.",
            visualization: 'heatmap' as const,
            sqlQuery: "SELECT AVG(salinity) FROM profiles GROUP BY region WHERE region IN ('bay_bengal', 'arabian_sea')"
          }
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        visualization: response.visualization,
        sqlQuery: response.sqlQuery,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
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
            <span>Analyzing oceanographic data...</span>
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
          <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
            <span>Try:</span>
            <button 
              className="text-primary hover:underline"
              onClick={() => setInputValue("Show me salinity profiles near the equator in March 2023")}
            >
              Salinity profiles
            </button>
            <span>•</span>
            <button 
              className="text-primary hover:underline"
              onClick={() => setInputValue("Compare temperature trends between regions")}
            >
              Temperature trends
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatInterface;