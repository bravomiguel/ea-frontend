'use client';

import { SendIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@langchain/langgraph-sdk';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStreamContext } from '@/providers/stream-provider';
// import { useStreamHelper } from '@/lib/hooks';

export function ChatInput() {
  const { submit, isLoading } = useStreamContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
    watch,
  } = useForm<{ message: string }>({
    defaultValues: {
      message: '',
    },
    mode: 'onChange',
  });

  const message = watch('message');

  // const { setFirstTokenReceived } = useStreamHelper();

  const onSubmit = handleSubmit(async ({ message }) => {
    if (!message.trim() || isLoading) return;
    // setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: 'human',
      content: message,
    };

    // const toolMessages = ensureToolCallsHaveResponses(stream.messages);
    submit(
      {
        messages: [
          // ...toolMessages,
          newHumanMessage,
        ],
      },
      {
        streamMode: ['values'],
        optimisticValues: (prev) => ({
          ...prev,
          messages: [
            ...(prev.messages ?? []),
            // ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );

    reset();
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full items-center p-4">
      <div className="max-w-3xl mx-auto w-full relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5">
        <Input
          type="text"
          placeholder="Send a message..."
          disabled={isLoading}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          {...register('message', { required: true })}
        />

        <Button
          type="submit"
          size="icon"
          className="rounded-full h-8 w-8 bg-gray-900 hover:bg-gray-700 ml-2"
          disabled={isLoading || !message?.trim() || !isValid}
        >
          <SendIcon className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  );
}
