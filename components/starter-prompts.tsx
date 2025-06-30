'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface StarterPromptsProps {
  onPromptClick: (prompt: string) => void;
}

export function StarterPrompts({ onPromptClick }: StarterPromptsProps) {
  const examplePrompts = [
    "Get my latest unread emails",
    "Tell my boss I'm sick and won't be at work",
    "Ask me about my email writing style",
    "What have you learned about me?"
  ];

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {examplePrompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto py-3 px-4 font-md justify-start text-left text-sm bg-white hover:bg-gray-50 border border-gray-200"
          onClick={() => onPromptClick(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
}
