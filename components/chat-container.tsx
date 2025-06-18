'use client';

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage, ChatMessageProps } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"

// Dummy initial messages for demonstration
const initialMessages: ChatMessageProps[] = [
  {
    role: "assistant",
    content: "Hello there!\nHow can I help you today?",
  },
]

// Sample suggested responses
const suggestedResponses = [
  "What are the advantages of using Next.js?",
  "Write code to demonstrate dijkstra's algorithm",
  "Help me write an essay about silicon valley",
  "What is the weather in San Francisco?"
]

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)

  // Dummy function to simulate AI response
  const simulateResponse = async (userMessage: string) => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add AI response
    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        content: `I received your message: "${userMessage}". This is a simulated response from the AI assistant.`
      }
    ])
    
    setIsLoading(false)
  }

  const handleSendMessage = async (message: string) => {
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: message
      }
    ])
    
    // Simulate AI response
    await simulateResponse(message)
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col justify-end min-h-full">
          <div className="space-y-4 max-w-3xl mx-auto w-full">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
            {isLoading && (
              <ChatMessage
                role="assistant"
                content=""
                isLoading={true}
              />
            )}
          </div>
        </div>
      </ScrollArea>
      
      {/* Show suggested responses if only initial message is present */}
      {messages.length === 1 && (
        <div className="px-4 py-3 w-full">
          <div className="max-w-3xl mx-auto w-full grid grid-cols-2 gap-2">
            {suggestedResponses.map((response, index) => (
              <button
                key={index}
                className="p-3 text-left text-sm border rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => handleSendMessage(response)}
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  )
}
