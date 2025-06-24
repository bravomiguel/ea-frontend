'use client';

import { Loader2 } from 'lucide-react';
import { Message } from '@langchain/langgraph-sdk';

import { cn } from '@/lib/utils';
import { getContentString } from '@/lib/utils';
import { MarkdownText } from '@/components/markdown-text';

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={cn('font-medium flex w-full py-4 max-w-full', {
        'justify-end': message.type === 'human',
      })}
    >
      {message.type === 'human' && <HumanMessage message={message} />}

      {message.type === 'ai' && <AIMessage message={message} />}
    </div>
  );
}

function HumanMessage({ message }: { message: Message }) {
  return (
    <div className="inline-block rounded-lg px-4 py-2 bg-primary text-primary-foreground self-end max-w-[80%]">
      {getContentString(message.content)}
    </div>
  );
}

function AIMessage({ message }: { message: Message }) {
  return <MarkdownText>{getContentString(message.content)}</MarkdownText>;
}
