import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore, DEFAULT_FRONT_LAYOUT, DEFAULT_BACK_LAYOUT } from '../uiStore';

describe('UI Store', () => {
  beforeEach(() => {
    useUIStore.getState().resetLayouts();
    useUIStore.setState({
      activeTab: 'skills',
      rollOverlayVisible: false,
      activeRollResult: undefined,
      isEditMode: false,
    });
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
    const dummyResult = {
      traitDie: { sides: 6, initial: 4, total: 4, aces: 0, rolls: [4] },
      finalResult: 4,
      isCriticalFailure: false,
    };
    useUIStore.getState().setRollResult({ name: 'Test', result: dummyResult });
    expect(useUIStore.getState().activeRollResult?.name).toBe('Test');
    expect(useUIStore.getState().rollOverlayVisible).toBe(true);
  });

  it('should toggle edit mode', () => {
    expect(useUIStore.getState().isEditMode).toBe(false);
    useUIStore.getState().toggleEditMode();
    expect(useUIStore.getState().isEditMode).toBe(true);
    useUIStore.getState().setIsEditMode(false);
    expect(useUIStore.getState().isEditMode).toBe(false);
  });

  it('should move front modules across columns', () => {
    const initialCol1First = useUIStore.getState().frontLayout.col1[0];
    useUIStore.getState().moveFrontModule('col1', 0, 'col2', 0);
    expect(useUIStore.getState().frontLayout.col2[0]).toBe(initialCol1First);
    expect(useUIStore.getState().frontLayout.col1).not.toContain(initialCol1First);
  });

  it('should move back modules across columns', () => {
    const initialCol1First = useUIStore.getState().backLayout.col1[0];
    useUIStore.getState().moveBackModule('col1', 0, 'col2', 0);
    expect(useUIStore.getState().backLayout.col2[0]).toBe(initialCol1First);
    expect(useUIStore.getState().backLayout.col1).not.toContain(initialCol1First);
  });

  it('should set module column span and custom height', () => {
    useUIStore.getState().setModuleSpan('background', 2);
    useUIStore.getState().setModuleHeight('background', 450);

    expect(useUIStore.getState().moduleSpans['background']).toBe(2);
    expect(useUIStore.getState().moduleHeights['background']).toBe(450);
  });

  it('should reset layouts and module sizes back to default', () => {
    useUIStore.getState().moveFrontModule('col1', 0, 'col2', 0);
    useUIStore.getState().moveBackModule('col1', 0, 'col2', 0);
    useUIStore.getState().setModuleSpan('background', 3);
    useUIStore.getState().setModuleHeight('background', 500);

    useUIStore.getState().resetLayouts();

    expect(useUIStore.getState().frontLayout).toEqual(DEFAULT_FRONT_LAYOUT);
    expect(useUIStore.getState().backLayout).toEqual(DEFAULT_BACK_LAYOUT);
    expect(useUIStore.getState().moduleSpans).toEqual({
      weapons: 3,
      session_log: 3,
    });
    expect(useUIStore.getState().moduleHeights).toEqual({});
  });
});
