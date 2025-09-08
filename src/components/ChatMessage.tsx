import { Code, Database, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OceanMap from '@/components/OceanMap';
import TemperatureChart from '@/components/TemperatureChart';
import SalinityHeatmap from '@/components/SalinityHeatmap';
import SalinityEquatorAnalysis from '@/components/SalinityEquatorAnalysis';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  visualization?: 'map' | 'chart' | 'heatmap' | 'salinity-equator';
  sqlQuery?: string;
}

interface ChatMessageProps {
  message: Message;
  compact?: boolean;
}

const ChatMessage = ({ message, compact = false }: ChatMessageProps) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 ${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary/20' : 'bg-accent/20'
      }`}>
        {isUser ? (
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        ) : (
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`glass-card p-3 rounded-xl ${compact ? 'text-sm' : ''} ${
          isUser ? 'bg-primary/10' : 'bg-muted/30'
        }`}>
          <p className="leading-relaxed">{message.content}</p>

          {/* SQL Query Display */}
          {message.sqlQuery && !compact && (
            <div className="mt-3 p-2 bg-background/50 rounded-lg border border-border/30">
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Executed Query:</span>
              </div>
              <code className="text-xs font-mono text-primary">{message.sqlQuery}</code>
            </div>
          )}

          {/* Embedded Visualization */}
          {message.visualization && !compact && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  {message.visualization === 'map' && 'Spatial Analysis'}
                  {message.visualization === 'chart' && 'Temporal Analysis'}  
                  {message.visualization === 'heatmap' && 'Statistical Analysis'}
                  {message.visualization === 'salinity-equator' && 'Equatorial Profile Analysis'}
                </Badge>
              </div>
              
              <div className="bg-background/30 rounded-lg p-3 border border-border/30">
            {message.visualization === 'map' && <OceanMap />}
            {message.visualization === 'chart' && <TemperatureChart />}
            {message.visualization === 'heatmap' && <SalinityHeatmap />}
            {message.visualization === 'salinity-equator' && <SalinityEquatorAnalysis />}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;