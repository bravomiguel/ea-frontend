'use client';

import { Thread } from '@langchain/langgraph-sdk';
import { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createThreadAction,
  deleteThreadAction,
  getThreadsAction,
} from '@/lib/actions';
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
  deleteThread: (threadId: string) => void;
  isDeletingThread: boolean;
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string | null) => void;
  refetchThreads: () => void;
};

const ThreadContext = createContext<Threads | null>(null);

export function ThreadProvider({
  threads: initialData,
  children,
}: ThreadProviderProps) {
  const [activeThreadId, setActiveThreadId] = useQueryState('threadId');

  const queryClient = useQueryClient();

  const {
    data: threads,
    isLoading: isThreadsLoading,
    refetch: refetchThreads,
  } = useQuery({
    queryKey: [`threads`],
    queryFn: async () => {
      const threads = await getThreadsAction();
      return threads;
    },
    initialData: initialData,
    refetchOnMount: false,
  });

  // console.log({ threads })

  const {
    data: newThread,
    mutate: createThread,
    isPending: isCreatingThread,
  } = useMutation({
    mutationFn: createThreadAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`threads`] });
    },
  });

  const { mutate: deleteThread, isPending: isDeletingThread } = useMutation({
    mutationFn: deleteThreadAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`threads`] });
    },
    onSettled: () => {
      setActiveThreadId(null);
    },
  });

  useEffect(() => {
    if (newThread) {
      setActiveThreadId(newThread.thread_id);
    }
  }, [newThread, setActiveThreadId]);

  return (
    <ThreadContext.Provider
      value={{
        threads,
        isThreadsLoading,
        createThread,
        isCreatingThread,
        deleteThread,
        isDeletingThread,
        activeThreadId,
        setActiveThreadId,
        refetchThreads,
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
