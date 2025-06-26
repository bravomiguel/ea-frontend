'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2, MoreHorizontalIcon } from 'lucide-react';
import { useThreads } from '@/providers/thread-provider';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export function ChatSidebar() {
  const {
    threads,
    createThread,
    isCreatingThread,
    deleteThread,
    isDeletingThread,
    activeThreadId,
    setActiveThreadId,
  } = useThreads();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="w-64 flex flex-col h-full bg-white border-r">
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-semibold">Email Assistant</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={createThread}
          disabled={isCreatingThread}
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col flex-1 overflow-auto">
        <div className="p-2">
          {threads.length > 0 && (
            <h3 className="text-xs text-gray-500 px-2 py-1">Chats</h3>
          )}
          <div className="space-y-1.5">
            {threads.map((thread) => (
              <div
                key={thread.thread_id}
                className={cn(
                  'flex items-center group relative rounded-lg hover:bg-gray-50 transition-colors',
                  {
                    'bg-gray-100': activeThreadId === thread.thread_id,
                  },
                )}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-sm font-normal text-left px-2',
                  )}
                  onClick={() => {
                    setActiveThreadId(thread.thread_id);
                  }}
                >
                  {thread.thread_id.substring(0, 23)}...
                </Button>
                <div
                  className={cn(
                    'absolute right-1 opacity-0 transition-opacity',
                    {
                      'opacity-100': openMenuId === thread.thread_id,
                      'group-hover:opacity-100':
                        openMenuId !== thread.thread_id,
                    },
                  )}
                >
                  <DropdownMenu
                    open={openMenuId === thread.thread_id}
                    onOpenChange={(open) => {
                      setOpenMenuId(open ? thread.thread_id : null);
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteThread(thread.thread_id);
                          setOpenMenuId(null);
                        }}
                        disabled={isDeletingThread}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
