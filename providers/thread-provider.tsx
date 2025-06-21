'use client';

import { Thread } from '@langchain/langgraph-sdk';
import { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createThreadAction, getThreadsAction } from '@/lib/actions';
import { useQueryState } from 'nuqs';

type ThreadProviderProps = {
  threads: Thread[];
  children: React.ReactNode;
};

type Threads = {
  threads: Thread[];
  isThreadsLoading: boolean;
  createThread: () => void;
  isCreatingThread: boolean;
  threadIdUrlParam: string | null;
  setThreadIdUrlParam: (threadId: string | null) => void;
};

const ThreadContext = createContext<Threads | null>(null);

export function ThreadProvider({
  threads: initialData,
  children,
}: ThreadProviderProps) {
  const [threadIdUrlParam, setThreadIdUrlParam] = useQueryState('threadId');

  const queryClient = useQueryClient();

  const { data: threads, isLoading: isThreadsLoading } = useQuery({
    queryKey: [`threads`],
    queryFn: async () => {
      const threads = await getThreadsAction();
      return threads;
    },
    initialData: initialData,
    refetchOnMount: false,
  });

  const {
    data: newThread,
    mutate: createThread,
    isPending: isCreatingThread,
  } = useMutation({
    mutationFn: createThreadAction,
    onSuccess: () => {
      // revalidate data or show success toast
      queryClient.invalidateQueries({ queryKey: [`threads`] });
    },
  });

  useEffect(() => {
    if (newThread) {
      setThreadIdUrlParam(newThread.thread_id);
    }
  }, [newThread, setThreadIdUrlParam]);

  return (
    <ThreadContext.Provider
      value={{
        threads,
        isThreadsLoading,
        createThread,
        isCreatingThread,
        threadIdUrlParam,
        setThreadIdUrlParam,
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
