import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import DataFreshnessIndicator from '@/components/DataFreshnessIndicator';

const Index = () => {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard'>('chat');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/4 w-72 h-72 bg-ocean-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header activeView={activeView} setActiveView={setActiveView} />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex gap-6 h-[calc(100vh-140px)]">
            {/* Chat Interface */}
            <div className={`transition-all duration-500 ${
              activeView === 'chat' ? 'flex-1' : 'w-80'
            }`}>
              <ChatInterface compact={activeView !== 'chat'} />
            </div>

            {/* Dashboard */}
            <div className={`transition-all duration-500 ${
              activeView === 'dashboard' ? 'flex-1' : 'w-80'
            }`}>
              <Dashboard compact={activeView !== 'dashboard'} />
            </div>
          </div>
        </main>

        {/* Data Freshness Indicator */}
        <DataFreshnessIndicator />
      </div>
    </div>
  );
};

export default Index;