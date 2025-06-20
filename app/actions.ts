'use server';

import { Thread } from '@/store/thread-store';

export async function searchThreads({
  metadata = {},
  values = {},
  status = 'idle',
  limit = 10,
  offset = 0,
  sort_by = 'thread_id',
  sort_order = 'asc'
}: {
  metadata?: Record<string, unknown>;
  values?: Record<string, unknown>;
  status?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
} = {}): Promise<Thread[]> {
  try {
    const response = await fetch('http://127.0.0.1:2024/threads/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        metadata,
        values,
        status,
        limit,
        offset,
        sort_by,
        sort_order
      })
    });

    if (!response.ok) {
      throw new Error(`Error fetching threads: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch threads:', error);
    throw error;
  }
}
