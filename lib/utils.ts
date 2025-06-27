import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Message } from '@langchain/langgraph-sdk';
import { Thread } from '@langchain/langgraph-sdk';
import { ThreadState } from './types';

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

/**
 * Predicate function to check if a thread has a valid title
 * @param thread Thread object to check
 * @returns Boolean indicating if the thread has a valid title
 */
export function hasValidThreadTitle(thread: Thread<ThreadState>): boolean {
  return !!(
    thread.values && 
    thread.values.thread_title &&
    thread.values.thread_title.length > 0
  );
}
