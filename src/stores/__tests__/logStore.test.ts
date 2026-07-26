import { describe, it, expect, beforeEach } from 'vitest';
import { useLogStore } from '../logStore';

describe('Log Store Actions', () => {
  beforeEach(() => {
    useLogStore.getState().clearLogs();
  });

  it('should add a mechanic log entry with generated ID and timestamp', () => {
    useLogStore.getState().addLogEntry({
      category: 'mechanic',
      type: 'spells_cast',
      title: 'Cast Bolt',
      details: 'Deducted 1 PP',
    });

    const entries = useLogStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0].title).toBe('Cast Bolt');
    expect(entries[0].category).toBe('mechanic');
    expect(entries[0].type).toBe('spells_cast');
    expect(entries[0].id).toBeDefined();
    expect(entries[0].timestamp).toBeGreaterThan(0);
  });

  it('should add an adventure journal entry', () => {
    useLogStore.getState().addLogEntry({
      category: 'journal',
      type: 'npc_met',
      title: 'Met Lord Blackwood',
      details: 'Offered 500 gold reward',
    });

    const entries = useLogStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0].category).toBe('journal');
    expect(entries[0].type).toBe('npc_met');
  });

  it('should delete a specific log entry by ID', () => {
    useLogStore.getState().addLogEntry({
      category: 'mechanic',
      type: 'bennies',
      title: 'Spent Bennie',
      details: 'Reroll attack',
    });
    const entryId = useLogStore.getState().entries[0].id;

    useLogStore.getState().deleteLogEntry(entryId);
    expect(useLogStore.getState().entries).toHaveLength(0);
  });

  it('should clear logs by category', () => {
    useLogStore.getState().addLogEntry({
      category: 'mechanic',
      type: 'wounds_fatigue',
      title: 'Took Wound',
      details: 'Current Wounds: 1',
    });
    useLogStore.getState().addLogEntry({
      category: 'journal',
      type: 'location',
      title: 'Sunken Ruins',
      details: 'Ancient temple entrance',
    });

    expect(useLogStore.getState().entries).toHaveLength(2);

    // Clear mechanic logs only
    useLogStore.getState().clearLogs('mechanic');
    expect(useLogStore.getState().entries).toHaveLength(1);
    expect(useLogStore.getState().entries[0].category).toBe('journal');

    // Clear all logs
    useLogStore.getState().clearLogs();
    expect(useLogStore.getState().entries).toHaveLength(0);
  });
});
