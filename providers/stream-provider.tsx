'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useStream } from '@langchain/langgraph-sdk/react';
import { type Message } from '@langchain/langgraph-sdk';
import {
  uiMessageReducer,
  type UIMessage,
  type RemoveUIMessage,
} from '@langchain/langgraph-sdk/react-ui';
import { updateThreadAction } from '@/lib/actions';
import { useThreads } from './thread-provider';
import { sleep } from '@/lib/utils';

type StreamProviderProps = {
  children: React.ReactNode;
};

export type StateType = {
  messages: Message[];
  ui?: UIMessage[];
  thread_title: string;
};

const useTypedStream = useStream<
  StateType,
  {
    UpdateType: {
      messages?: Message[] | Message | string;
      ui?: (UIMessage | RemoveUIMessage)[] | UIMessage | RemoveUIMessage;
      thread_title?: string;
    };
    CustomEventType: UIMessage | RemoveUIMessage;
    ConfigurableType: {
      user_id: string;
      model?: string;
    };
  }
>;

type StreamContextType = ReturnType<typeof useTypedStream>;
const StreamContext = createContext<StreamContextType | null>(null);

export function StreamProvider({ children }: StreamProviderProps) {
  const { activeThreadId, setActiveThreadId, refetchThreads } = useThreads();

  const streamValue = useTypedStream({
    apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL,
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_GRAPH_ID ?? 'agent',
    threadId: activeThreadId ?? null,
    onCustomEvent: (event, options) => {
      options.mutate((prev) => {
        const ui = uiMessageReducer(prev.ui ?? [], event);
        return { ...prev, ui };
      });
    },
    onThreadId: async (id) => {
      // await sleep(1000);
      await updateThreadAction(id);
      setActiveThreadId(id);
      refetchThreads();
      // Refetch threads list when thread ID changes.
      // Wait for some seconds before fetching so we're able to get the new thread that was created.
      // sleep().then(() => getThreads().then(setThreads).catch(console.error));
    },
  });

  useEffect(() => {
    if (
      streamValue.values.thread_title &&
      streamValue.values.thread_title.length > 0
    ) {
      refetchThreads();
    }
  }, [streamValue.values.thread_title, refetchThreads]);

  return (
    <StreamContext.Provider value={streamValue}>
      {children}
    </StreamContext.Provider>
  );
}

// Create a custom hook to use the context
export const useStreamContext = (): StreamContextType => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStreamContext must be used within a StreamProvider');
  }
  return context;
};

export default StreamContext;
