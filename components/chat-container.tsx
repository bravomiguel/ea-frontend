'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, ChatMessageProps } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';

export function ChatContainer() {
  const searchParams = useSearchParams();
  const threadId = searchParams.get('threadId');
  
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dummy function to simulate AI response
  const simulateResponse = async (userMessage: string) => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add AI response
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `I received your message: "${userMessage}". This is a simulated response from the AI assistant.`,
      },
    ]);

    setIsLoading(false);
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: message,
      },
    ]);

    // Simulate AI response
    await simulateResponse(message);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col justify-end min-h-full">
          <div className="space-y-4 max-w-3xl mx-auto w-full">
            <ChatMessage
              role="assistant"
              content={`Hello there!\nHow can I help you today?${
                threadId ? ` (Thread ID: ${threadId})` : ''
              }`}
            />

            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}

            {isLoading && (
              <ChatMessage role="assistant" content="" isLoading={true} />
            )}
          </div>
        </div>
      </ScrollArea>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
