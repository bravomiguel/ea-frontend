'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useThreadStore } from '@/store/thread-store';

export function ChatSidebar() {
  const { threads, isLoading, error, fetchThreads, selectedThread, setSelectedThread } = useThreadStore();
  
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

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
          <h3 className="text-xs text-gray-500 px-2 py-1">Chats</h3>
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Loading threads...</div>
          ) : error ? (
            <div className="p-2 text-sm text-red-500">{error}</div>
          ) : threads.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No threads found</div>
          ) : (
            <div className="space-y-1">
              {threads.map((thread) => (
                <Button
                  key={thread.thread_id}
                  variant="ghost"
                  className={`w-full justify-start text-sm font-normal text-left px-2 ${
                    selectedThread === thread.thread_id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => {
                    setSelectedThread(thread.thread_id);
                  }}
                >
                  {thread.thread_id.substring(0, 22)}...
                </Button>
              ))}
            </div>
          )}
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
