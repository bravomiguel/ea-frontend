'use client';

import { useState } from 'react';
import { ChatContainer } from '@/components/chat-container';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatHeader } from '@/components/chat-header';

export default function Home() {
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
            <ChatContainer />
          </div>
      </div>
    </div>
  );
}
