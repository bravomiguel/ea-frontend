'use server';

import { Client, Thread } from '@langchain/langgraph-sdk';

const apiUrl = process.env.LANGGRAPH_API_URL;
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
      limit: 100,
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

export async function checkGraphStatus(apiUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/info`);
    return res.ok;
  } catch (e) {
    console.error(e);
    // return false;
    throw e;
  }
}

export async function deleteThreadAction(threadId: string) {
  try {
    if (!apiUrl) return;

    await client.threads.delete(threadId);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete thread:', error);
    throw error;
  }
}
