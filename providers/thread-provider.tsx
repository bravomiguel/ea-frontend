'use client';

import { validate } from 'uuid';
import { Thread } from '@langchain/langgraph-sdk';
import { useQueryState } from 'nuqs';
import {
  createContext,
  useContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { createClient } from './client';
import { getThreadsAction } from '@/lib/actions';

type ThreadProviderProps = {
  threads: Thread[];
  children: React.ReactNode;
};

type Threads = {
  threads: Thread[];
  activeThread: Thread | undefined;
  handleActiveThreadId: (threadId: string) => void;
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

  return (
    <ThreadContext.Provider
      value={{
        threads,
        activeThread,
        handleActiveThreadId,
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
