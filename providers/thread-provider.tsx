'use client';

import { Thread } from '@langchain/langgraph-sdk';
import { createContext, useContext } from 'react';
import { createThreadAction } from '@/lib/actions';

type ThreadProviderProps = {
  threads: Thread[];
  children: React.ReactNode;
};

type Threads = {
  threads: Thread[];
  handleCreateThread: () => void;
};

const ThreadContext = createContext<Threads | null>(null);

export function ThreadProvider({ threads, children }: ThreadProviderProps) {
  const handleCreateThread = async () => {
    await createThreadAction();
  };

  return (
    <ThreadContext.Provider
      value={{
        threads,
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
