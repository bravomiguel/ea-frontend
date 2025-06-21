'use client';

import { Thread } from '@langchain/langgraph-sdk';
import { createContext, useContext, useState } from 'react';
import { createThreadAction, getThreadsAction } from '@/lib/actions';

type ThreadProviderProps = {
  threads: Thread[];
  children: React.ReactNode;
};

type Threads = {
  threads: Thread[];
  activeThread: Thread | undefined;
  handleActiveThreadId: (threadId: string) => void;
  handleCreateThread: () => void;
};

const ThreadContext = createContext<Threads | null>(null);

export function ThreadProvider({ threads, children }: ThreadProviderProps) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const activeThread = threads.find(
    (thread) => thread.thread_id === activeThreadId,
  );

  const handleActiveThreadId = (threadId: string) => {
    setActiveThreadId(threadId);
  };

  const handleCreateThread = async () => {
    const thread = await createThreadAction();
    if (thread) {
      setActiveThreadId(thread.thread_id);
    }
  };

  return (
    <ThreadContext.Provider
      value={{
        threads,
        activeThread,
        handleActiveThreadId,
        handleCreateThread,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
}

export function useThreads() {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThreads must be used within a ThreadProvider');
  }
  return context;
}
