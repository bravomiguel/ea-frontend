import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Message } from '@langchain/langgraph-sdk';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms = 4000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getContentString(content: Message['content']): string {
  if (typeof content === 'string') return content;
  const texts = content
    .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
    .map((c) => c.text);
  return texts.join(' ');
}

export function hasToolCalls(message: any): boolean {
  return (
    message &&
    'tool_calls' in message &&
    message.tool_calls &&
    message.tool_calls.length > 0
    // &&
    // message.tool_calls.some(
    //   (tc: any) => tc.args && Object.keys(tc.args).length > 0,
    // )
  );
}
