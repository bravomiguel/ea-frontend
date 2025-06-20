import { create } from 'zustand';
import { searchThreads } from '@/app/actions';

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
        limit: 10,
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
}));
