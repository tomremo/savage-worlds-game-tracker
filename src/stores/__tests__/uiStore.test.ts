import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../uiStore';

describe('UI Store', () => {
  beforeEach(() => {
    useUIStore.setState({ activeTab: 'skills', rollOverlayVisible: false, activeRollResult: undefined });
  });

  it('should update active tab', () => {
    useUIStore.getState().setActiveTab('inventory');
    expect(useUIStore.getState().activeTab).toBe('inventory');
  });

  it('should toggle roll overlay', () => {
    useUIStore.getState().setRollOverlayVisible(true);
    expect(useUIStore.getState().rollOverlayVisible).toBe(true);
  });

  it('should set roll result and show overlay', () => {
    useUIStore.getState().setRollResult({ name: 'Test', result: {} });
    expect(useUIStore.getState().activeRollResult?.name).toBe('Test');
    expect(useUIStore.getState().rollOverlayVisible).toBe(true);
  });
});
