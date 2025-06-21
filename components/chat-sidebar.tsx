'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useThreads } from '@/providers/thread-provider';
import { cn } from '@/lib/utils';

export function ChatSidebar() {
  const { threads, activeThread, handleActiveThreadId } = useThreads();

  return (
    <div className="w-64 flex flex-col h-full bg-white border-r">
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-semibold">Email Assistant</h2>
        <Button variant="ghost" size="icon" onClick={async () => {}}>
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col flex-1 overflow-auto">
        <div className="p-2">
          <h3 className="text-xs text-gray-500 px-2 py-1">Chats</h3>
          {threads.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No threads found</div>
          ) : (
            <div className="space-y-1">
              {threads.map((thread) => (
                <Button
                  key={thread.thread_id}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-sm font-normal text-left px-2',
                    {
                      'bg-gray-100':
                        activeThread?.thread_id === thread.thread_id,
                    },
                  )}
                  onClick={() => {
                    handleActiveThreadId(thread.thread_id);
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
