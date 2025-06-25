'use client';

import { useStreamContext } from '@/providers/stream-provider';
import { Loader2 } from 'lucide-react';
import { hasToolCalls } from '@/lib/utils';
import { Message, Interrupt } from '@langchain/langgraph-sdk';
import { EmailInterruptReview, EmailInterruptValue } from '@/lib/types';
import { useState } from 'react';
import { Button } from './ui/button';

export function AIUpdate() {
  const { messages, interrupt } = useStreamContext();

  const lastMessage = messages[messages.length - 1];

  const interruptValue = interrupt?.value as EmailInterruptValue | undefined;

  const [review, setReview] = useState<EmailInterruptReview | null>(null);

  if (lastMessage.type !== 'ai') {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Thinking...</span>
      </div>
    );
  } else if (interruptValue) {
    return (
      <div className="space-y-2">
        <p>{interruptValue.question}</p>
        <p>recipient: {interruptValue.recipient_email}</p>
        <p>message: {interruptValue.message_body}</p>
        <Button>Send</Button>
        <Button>Reject</Button>
        <div>feedback: {review?.feedback}</div>
      </div>
    );
  } else if (hasToolCalls(lastMessage)) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{`Using ${lastMessage.tool_calls?.[0].name}...`}</span>
      </div>
    );
  } else {
    return null;
  }
}
