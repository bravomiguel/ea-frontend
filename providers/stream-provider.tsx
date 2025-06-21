import React, { createContext, useContext } from 'react';
import { useStream } from '@langchain/langgraph-sdk/react';
import { type Message } from '@langchain/langgraph-sdk';
import {
  uiMessageReducer,
  type UIMessage,
  type RemoveUIMessage,
} from '@langchain/langgraph-sdk/react-ui';

import { useThreads } from './thread-provider';

type StreamProviderProps = {
  children: React.ReactNode;
};

export type StateType = { messages: Message[]; ui?: UIMessage[] };

const useTypedStream = useStream<
  StateType,
  {
    UpdateType: {
      messages?: Message[] | Message | string;
      ui?: (UIMessage | RemoveUIMessage)[] | UIMessage | RemoveUIMessage;
    };
    CustomEventType: UIMessage | RemoveUIMessage;
  }
>;

type StreamContextType = ReturnType<typeof useTypedStream>;
const StreamContext = createContext<StreamContextType | null>(null);

export function StreamProvider({ children }: StreamProviderProps) {
  const { activeThreadId, setActiveThreadId, refetchThreads } = useThreads();

  const streamValue = useTypedStream({
    apiUrl: process.env.LANGGRAPH_API_URL,
    assistantId: process.env.LANGGRAPH_GRAPH_ID ?? 'agent',
    threadId: activeThreadId ?? null,
    onCustomEvent: (event, options) => {
      options.mutate((prev) => {
        const ui = uiMessageReducer(prev.ui ?? [], event);
        return { ...prev, ui };
      });
    },
    onThreadId: (id) => {
      refetchThreads();
      setActiveThreadId(id);
      // Refetch threads list when thread ID changes.
      // Wait for some seconds before fetching so we're able to get the new thread that was created.
      // sleep().then(() => getThreads().then(setThreads).catch(console.error));
    },
  });

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
