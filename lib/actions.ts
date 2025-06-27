'use server';

import { Client, Thread } from '@langchain/langgraph-sdk';
import { LangGraphToolSet } from 'composio-core';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { ThreadState } from './types';

const apiUrl = process.env.LANGGRAPH_API_URL;
const client = new Client({ apiUrl });

// Initialize the toolset with your API key
const toolset = new LangGraphToolSet({
  apiKey: process.env.COMPOSIO_API_KEY!,
});

export async function getThreadsAction(): Promise<Thread<ThreadState>[]> {
  try {
    const session = await auth();

    if (!apiUrl) return [];

    const threads = (await client.threads.search({
      metadata: { user_id: session?.user?.id },
      limit: 100,
      sortBy: 'updated_at',
      sortOrder: 'desc',
    })) as Thread<ThreadState>[];

    return threads;
  } catch (error) {
    console.error('Failed to fetch threads:', error);
    throw error;
  }
}

export async function createThreadAction(): Promise<Thread<ThreadState>> {
  try {
    const session = await auth();
    if (!session?.user?.id) redirect('/auth/signin');

    // if (!apiUrl) return;

    const thread = await client.threads.create({
      metadata: { user_id: session.user.id },
    });

    return thread as Thread<ThreadState>;
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

export async function updateThreadAction(threadId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) redirect('/auth/signin');

    if (!apiUrl) return;

    const thread = await client.threads.update(threadId, {
      metadata: { user_id: session.user.id },
    });

    return thread;
  } catch (error) {
    console.error('Failed to update thread:', error);
    throw error;
  }
}

export async function initiateConnectionAction(appName: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) redirect('/auth/signin');
    const userId = session.user.id;

    // Get entity for the user
    const entity = await toolset.getEntity(userId);

    // Initiate connection - this calls Entity.initiateConnection internally
    const connectionRequest = await entity.initiateConnection({
      appName: appName,
      redirectUri: `http://localhost:3000`,
    });

    // Return connection details for OAuth flow
    return {
      success: true,
      redirectUrl: connectionRequest.redirectUrl,
      connectedAccountId: connectionRequest.connectedAccountId,
      connectionStatus: connectionRequest.connectionStatus,
    };
  } catch (error) {
    console.error('Connection initiation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function waitForConnectionAction(connectedAccountId: string) {
  try {
    // Poll for connection status
    const connection = await toolset.client.connectedAccounts.get({
      connectedAccountId,
    });

    return {
      success: true,
      status: connection.status,
      isActive: connection.status === 'ACTIVE',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function checkConnectionAction(appName: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const entity = await toolset.getEntity(userId!);

    // Check for specific app connection
    try {
      const connection = await entity.getConnection({ app: appName });
      return {
        hasConnection: !!connection && connection.status === 'ACTIVE',
        connection: connection,
        appName: appName,
      };
    } catch (error) {
      return {
        hasConnection: false,
        connection: null,
        appName: appName,
      };
    }
  } catch (error) {
    console.error('Error checking connections:', error);
    return {
      hasConnection: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
