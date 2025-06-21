'use server';

import { createClient } from '@/providers/client';
import { Thread } from '@langchain/langgraph-sdk';

export async function getThreadsAction(): Promise<Thread[]> {
  try {
    const apiUrl =
      process.env.VERCEL_ENV === 'development' ? 'http://127.0.0.1:2024' : null;
    if (!apiUrl) return [];
    const client = createClient(apiUrl);

    // List all assistants
    const assistants = await client.assistants.search({
      metadata: null,
      offset: 0,
      limit: 10,
    });

    // We auto-create an assistant for each graph you register in config.
    const agent = assistants[0];

    const threads = await client.threads.search({
      metadata: {
        assistant_id: agent.assistant_id,
      },
      limit: 10,
    });

    return threads;
  } catch (error) {
    console.error('Failed to fetch threads:', error);
    throw error;
  }
}

export async function createThread(): Promise<Thread> {
  try {
    const response = await fetch('http://127.0.0.1:2024/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // thread_id: '',
        metadata: {},
        if_exists: 'raise',
        ttl: {
          strategy: 'delete',
          ttl: 1,
        },
        // supersteps: [{
        //   updates: [{
        //     values: [{}],
        //     command: {
        //       update: null,
        //       resume: null,
        //       goto: {
        //         node: '',
        //         input: null
        //       }
        //     },
        //     as_node: ''
        //   }]
        // }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Error creating thread: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to create thread:', error);
    throw error;
  }
}

export async function searchThreads({
  metadata = {},
  values = {},
  status = 'idle',
  limit = 10,
  offset = 0,
  sort_by = 'thread_id',
  sort_order = 'asc',
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata,
        values,
        status,
        limit,
        offset,
        sort_by,
        sort_order,
      }),
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
