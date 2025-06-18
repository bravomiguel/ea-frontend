'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

// Sample chat history items
const chatHistoryItems = [
  { id: 1, title: 'Essay on Silicon Valley' },
  { id: 2, title: 'Advantages of Next.js' },
];

export function ChatSidebar() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  return (
    <div className="w-64 flex flex-col h-full bg-white border-r">
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-semibold">Email Assistant</h2>
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="p-2">
          <h3 className="text-xs text-gray-500 px-2 py-1">Today</h3>
          <div className="space-y-1">
            {chatHistoryItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start text-sm font-normal text-left px-2 ${
                  selectedChat === item.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedChat(item.id)}
              >
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
            G
          </div>
          <span className="text-sm text-gray-700">Guest</span>
        </div>
      </div> */}
    </div>
  );
}
