'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useThreadStore } from '@/store/thread-store';
import { useRouter, useSearchParams } from 'next/navigation';

export function ChatSidebar() {
  const { threads, isLoading, error, fetchThreads, selectedThread, setSelectedThread, handleCreateThread } = useThreadStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Fetch threads when component mounts
    fetchThreads();
  }, []);
  
  // Handle thread selection from URL when threads are loaded
  useEffect(() => {
    if (!isLoading && threads.length > 0) {
      const threadId = searchParams.get('threadId');
      if (threadId) {
        // Check if the thread exists in our loaded threads
        const threadExists = threads.some(thread => thread.thread_id === threadId);
        if (threadExists) {
          setSelectedThread(threadId);
        }
      }
    }
  }, [threads, isLoading, searchParams, setSelectedThread]);

  return (
    <div className="w-64 flex flex-col h-full bg-white border-r">
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-semibold">Email Assistant</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={async () => {
            try {
              const newThread = await handleCreateThread();
              if (newThread) {
                // Update URL with the new thread
                const params = new URLSearchParams(searchParams);
                params.set('threadId', newThread.thread_id);
                router.push(`?${params.toString()}`);
              }
            } catch (error) {
              console.error('Error creating new thread:', error);
            }
          }}
        >
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
                    
                    // Update URL with the selected thread
                    const params = new URLSearchParams(searchParams);
                    params.set('threadId', thread.thread_id);
                    router.push(`?${params.toString()}`);
                  }}
                >
                  {thread.thread_id.substring(0, 23)}...
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
