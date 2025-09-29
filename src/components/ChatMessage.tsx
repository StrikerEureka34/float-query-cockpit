import React from 'react';
import { User, Bot, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';
import OceanMap from '@/components/OceanMap';
import TemperatureChart from '@/components/TemperatureChart';
import SalinityHeatmap from '@/components/SalinityHeatmap';
import SalinityEquatorAnalysis from '@/components/SalinityEquatorAnalysis';
import InteractiveDataMap from '@/components/InteractiveDataMap';
import InteractiveProfileChart from '@/components/InteractiveProfileChart';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  visualization?: 'map' | 'chart' | 'heatmap' | 'salinity-equator' | 'interactive-map' | 'interactive-chart';
  sqlQuery?: string;
}

interface ChatMessageProps {
  message: Message;
  compact?: boolean;
}

const ChatMessage = ({ message, compact = false }: ChatMessageProps) => {
  const [isLoading, setIsLoading] = React.useState(message.type === 'assistant' && !!message.visualization);

  React.useEffect(() => {
    if (message.type === 'assistant' && message.visualization) {
      const timer = setTimeout(() => setIsLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 ${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary/20' : 'bg-accent/20'
      }`}>
        {isUser ? (
          <User className="h-3 w-3 text-primary" />
        ) : (
          <Bot className="h-3 w-3 text-accent" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`glass-card p-3 rounded-xl ${compact ? 'text-sm' : ''} ${
          isUser ? 'bg-primary/10' : 'bg-muted/30'
        }`}>
          <p className="leading-relaxed font-mono">{message.content}</p>

          {/* SQL Query Display */}
          {message.sqlQuery && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Database className="h-3 w-3" />
                <span>Executed Query</span>
              </div>
              <code className="text-xs text-primary break-all font-mono">
                {message.sqlQuery}
              </code>
            </div>
          )}

          {/* Visualization Component */}
          {message.visualization && (
            <div className="mt-4 w-full">
              {isLoading ? (
                <LoadingSpinner message="Rendering oceanographic visualization..." />
              ) : (
                <>
                  {message.visualization === 'map' && <OceanMap />}
                  {message.visualization === 'chart' && <TemperatureChart />}
                  {message.visualization === 'heatmap' && <SalinityHeatmap />}
                  {message.visualization === 'salinity-equator' && <SalinityEquatorAnalysis />}
                  {message.visualization === 'interactive-map' && <InteractiveDataMap compact={compact} />}
                  {message.visualization === 'interactive-chart' && <InteractiveProfileChart compact={compact} />}
                </>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1 px-1 font-mono">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;