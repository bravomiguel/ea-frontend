'use client';

import { useStreamContext } from '@/providers/stream-provider';
import { Loader2 } from 'lucide-react';
import { hasToolCalls } from '@/lib/utils';

export function AIUpdate() {
  const { messages } = useStreamContext();
  const lastMessage = messages[messages.length - 1];

  return (
    <>
      {lastMessage.type !== 'ai' ? (
        <div className="flex items-center gap-2 text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      ) : hasToolCalls(lastMessage) ? (
        <div className="flex items-center gap-2 text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{`Using ${lastMessage.tool_calls?.[0].name}...`}</span>
        </div>
      ) : null}
    </>
  );
}
