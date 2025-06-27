'use client';

import { useState } from 'react';
import { ChatContainer } from '@/components/chat-container';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatHeader } from '@/components/chat-header';
import { useComposioContext } from '@/providers/composio-provider';
import { Loader } from 'lucide-react';

export default function Home() {
  const { connectedAccountId, callbackStatus } =
    useComposioContext();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen">
      {sidebarVisible && <ChatSidebar />}
      <div className="flex flex-col flex-1">
        <ChatHeader onToggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-hidden">
          {callbackStatus === 'success' && connectedAccountId ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Confirming connection...</p>
            </div>
          ) : (
            <ChatContainer />
          )}
        </div>
      </div>
    </div>
  );
}
