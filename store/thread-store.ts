import { create } from 'zustand';
import { searchThreads, createThread } from '@/app/actions';

export interface Thread {
  thread_id: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
  status: string;
  values: Record<string, unknown>;
}

interface ThreadState {
  threads: Thread[];
  isLoading: boolean;
  error: string | null;
  selectedThread: string | null;
  fetchThreads: () => Promise<void>;
  setSelectedThread: (threadId: string | null) => void;
  handleCreateThread: () => Promise<Thread | undefined>;
}

export const useThreadStore = create<ThreadState>((set) => ({
  threads: [],
  isLoading: false,
  error: null,
  selectedThread: null,
  fetchThreads: async () => {
    set({ isLoading: true, error: null });
    try {
      const threads = await searchThreads({
        limit: 10, // Increased limit to ensure we get all threads
        sort_by: 'updated_at', // Sort by most recently updated
        sort_order: 'desc', // Show newest first
      });

      set({ threads, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },
  setSelectedThread: (threadId: string | null) => {
    set({ selectedThread: threadId });
  },
  handleCreateThread: async () => {
    set({ isLoading: true, error: null });
    try {
      const newThread = await createThread();
      
      // Fetch all threads again to ensure we have the latest data
      // This ensures thread persistence even after page reload
      const threads = await searchThreads({
        limit: 10,
        sort_by: 'updated_at',
        sort_order: 'desc',
      });
      
      // Update the store with all threads and set the new one as selected
      set({
        threads,
        selectedThread: newThread.thread_id,
        isLoading: false
      });
      
      return newThread;
    } catch (error) {
      console.error('Failed to create thread:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },
}));
