'use client';

import { ArrowUp } from 'lucide-react';
import { FaStop } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@langchain/langgraph-sdk';
import { useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useStreamContext } from '@/providers/stream-provider';
import { useThreads } from '@/providers/thread-provider';
// import { useStreamHelper } from '@/lib/hooks';

export function ChatInput() {
  const { submit, isLoading, stop } = useStreamContext();
  const { activeThreadId } = useThreads();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Adjust textarea height based on content with a maximum of 6 lines
  const adjustHeight = () => {
    if (textareaRef.current) {
      // Reset height to calculate proper scrollHeight
      textareaRef.current.style.height = 'auto';

      // Calculate line height (approximation based on font size)
      const lineHeight = 24; // Approximate line height in pixels
      const maxHeight = lineHeight * 6; // Maximum height for 6 lines

      // Set the height based on content, but cap it at maxHeight
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;

      // Add overflow scrolling if content exceeds maxHeight
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  };

  // Reset height when form is submitted
  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Auto-focus the textarea on initial render and when active thread changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeThreadId]);

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
    resetHeight();
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      if (!isLoading && message?.trim() && isValid) {
        onSubmit();
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full p-4">
      <div className="max-w-3xl mx-auto w-full relative bg-gray-100 rounded-lg ring-offset-background transition-all focus-within:ring-2 focus-within:ring-gray-600">
        {/* Container for textarea and button */}
        <div className="relative p-3">
          {/* Textarea with bottom padding for button */}
          <div className="pb-12">
            <Textarea
              placeholder="Send a message..."
              disabled={isLoading}
              className="min-h-[24px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md w-full"
              {...register('message', {
                required: true,
                onChange: () => adjustHeight(),
              })}
              ref={(e) => {
                register('message', { required: true }).ref(e);
                textareaRef.current = e;
              }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Button positioned at the bottom right within the container */}
          <div className="absolute bottom-3 right-3">
            {isLoading ? (
              <Button
                onClick={stop}
                className="rounded-full h-9 w-9 border bg-gray-900 hover:bg-gray-700 flex items-center justify-center"
              >
                <FaStop className="absolute h-3.5 w-3.5 text-white" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-9 w-9 border bg-gray-900 hover:bg-gray-700 flex items-center justify-center"
                disabled={isLoading || !message?.trim() || !isValid}
              >
                <ArrowUp className="h-5 w-5 text-white" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
