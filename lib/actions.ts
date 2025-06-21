'use server';

import { Client, Thread } from '@langchain/langgraph-sdk';

const apiUrl =
  process.env.VERCEL_ENV === 'development'
    ? 'http://127.0.0.1:2024'
    : 'http://127.0.0.1:2024';
const client = new Client({ apiUrl });

export async function getThreadsAction(): Promise<Thread[]> {
  try {
    if (!apiUrl) return [];

    // List all assistants
    // const assistants = await client.assistants.search({
    //   metadata: null,
    //   offset: 0,
    //   limit: 10,
    // });

    // We auto-create an assistant for each graph you register in config.
    // const agent = assistants[0];

    const threads = await client.threads.search({
      metadata: {},
      limit: 10,
      sortBy: 'updated_at',
      sortOrder: 'desc',
    });

    return threads;
  } catch (error) {
    console.error('Failed to fetch threads:', error);
    throw error;
  }
}

export async function createThreadAction() {
  try {
    if (!apiUrl) return;

    const thread = await client.threads.create();

    return thread;
  } catch (error) {
    console.error('Failed to create thread:', error);
    throw error;
  }
}
