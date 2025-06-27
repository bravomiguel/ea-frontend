'use client';

import { useStreamContext } from '@/providers/stream-provider';
import { Loader2 } from 'lucide-react';
import { hasToolCalls } from '@/lib/utils';
import { EmailInterruptValue } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { AIMessage } from '@langchain/langgraph-sdk';

export function AIUpdate() {
  const { messages, interrupt, error } = useStreamContext();

  const lastMessage = messages[messages.length - 1];

  const interruptValue = interrupt?.value as EmailInterruptValue | undefined;

  if (lastMessage.type !== 'ai' && !error) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Thinking...</span>
      </div>
    );
  } else if (interruptValue) {
    return <ReviewEmailCard />;
  } else if (hasToolCalls(lastMessage)) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{`Using ${
          (lastMessage as AIMessage).tool_calls?.[0].name
        }...`}</span>
      </div>
    );
  } else {
    return null;
  }
}

function ReviewEmailCard() {
  const { interrupt, submit } = useStreamContext();

  const interruptValue = interrupt?.value as EmailInterruptValue | undefined;

  console.log({ interruptValue });

  const [messageBody, setMessageBody] = useState<string>(
    interruptValue?.message_body || interruptValue?.body || '',
  );
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  // Create a ref for the card container
  const cardRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom when showFeedback changes
  useEffect(() => {
    if (cardRef.current) {
      // Use setTimeout to ensure DOM has been updated
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [showFeedback]);

  // console.log({ messageBody });

  const handleSend = () => {
    submit(
      {},
      {
        command: {
          resume:
            messageBody !== interruptValue?.message_body
              ? {
                  action: 'edit_send',
                  edits: { message_body: messageBody },
                }
              : {
                  action: 'send',
                },
        },
      },
    );
  };

  const handleConfirmReject = () => {
    submit(
      {},
      {
        command: {
          resume: {
            action: 'reject',
            feedback:
              feedback.length > 0
                ? feedback
                : 'Email rejected, no feedback provided.',
          },
        },
      },
    );
  };

  return (
    <Card ref={cardRef} className="w-full border-2 border-gray-300 shadow-none">
      <CardHeader>
        <CardTitle className="text-center">
          {interruptValue?.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient</Label>
          <Input
            id="recipient"
            value={interruptValue?.recipient_email}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>

        {showFeedback && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="feedback">Feedback (optional)</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="E.g. Email sounds too formal, please make it more casual."
              rows={3}
              className="resize-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowFeedback(false);
                  setFeedback('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmReject}>Confirm Reject</Button>
            </div>
          </div>
        )}
      </CardContent>

      {!showFeedback && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowFeedback(true)}>
            Reject
          </Button>
          <Button onClick={handleSend}>Send</Button>
        </CardFooter>
      )}
    </Card>
  );
}
