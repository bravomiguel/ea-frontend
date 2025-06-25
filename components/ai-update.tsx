'use client';

import { useStreamContext } from '@/providers/stream-provider';
import { Loader2 } from 'lucide-react';
import { hasToolCalls } from '@/lib/utils';
import { AIMessage, Message } from '@langchain/langgraph-sdk';

export function AIUpdate() {
  const { isLoading, messages } = useStreamContext();
  const lastMessage = messages[messages.length - 1];
  const lastAIMessage = lastMessage as AIMessage;

  return (
    <>
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>
            {lastMessage.type !== 'ai' && 'Thinking...'}
            {hasToolCalls(lastAIMessage) &&
              `Using ${lastAIMessage.tool_calls?.[0].name}...`}
          </span>
        </div>
      ) : null}
    </>
  );
}
