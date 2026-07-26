import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LogEntry, LogCategory, ActivityType } from '../types/log';

interface LogState {
  entries: LogEntry[];
  addLogEntry: (entry: {
    category: LogCategory;
    type: ActivityType;
    title: string;
    details: string;
    tags?: string[];
  }) => void;
  deleteLogEntry: (id: string) => void;
  clearLogs: (category?: LogCategory) => void;
}

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      entries: [],
      addLogEntry: (entry) =>
        set((state) => {
          const newEntry: LogEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp: Date.now(),
            ...entry,
          };
          // Newest entries at the top
          return { entries: [newEntry, ...(state.entries || [])] };
        }),
      deleteLogEntry: (id) =>
        set((state) => ({
          entries: (state.entries || []).filter((e) => e.id !== id),
        })),
      clearLogs: (category) =>
        set((state) => {
          if (!category) {
            return { entries: [] };
          }
          return {
            entries: (state.entries || []).filter((e) => e.category !== category),
          };
        }),
    }),
    {
      name: 'savage-session-log-storage',
    }
  )
);
