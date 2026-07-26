'use client';

import React, { useState } from 'react';
import SpecialAbilities from './SpecialAbilities';
import Background from './Background';
import MoreEdges from './MoreEdges';
import Advances from './Advances';
import PowersTracker from './PowersTracker';
import SessionLogTracker from './SessionLogTracker';
import AdventureJournal from './AdventureJournal';
import DraggableModule from './DraggableModule';
import { useUIStore, BackModuleId, BackColumnId } from '@/stores/uiStore';

const BACK_COLUMN_OPTIONS = [
  { id: 'col1', label: 'Column 1' },
  { id: 'col2', label: 'Column 2' },
  { id: 'col3', label: 'Column 3' },
  { id: 'bottom', label: 'Bottom Section' },
];

export default function BackPage() {
  const backLayout = useUIStore((state) => state.backLayout);
  const isEditMode = useUIStore((state) => state.isEditMode);
  const moveBackModule = useUIStore((state) => state.moveBackModule);
  const [activeDragCol, setActiveDragCol] = useState<string | null>(null);

  const renderModule = (modId: BackModuleId) => {
    switch (modId) {
      case 'special_abilities':
        return <SpecialAbilities />;
      case 'background':
        return <Background />;
      case 'more_edges':
        return <MoreEdges />;
      case 'advances':
        return <Advances />;
      case 'powers':
        return <PowersTracker />;
      case 'session_log':
        return <SessionLogTracker />;
      case 'adventure_journal':
        return <AdventureJournal />;
      default:
        return null;
    }
  };

  const getModuleTitle = (modId: BackModuleId): string => {
    switch (modId) {
      case 'special_abilities':
        return 'Special Abilities';
      case 'background':
        return 'Character Background';
      case 'more_edges':
        return 'Additional Edges';
      case 'advances':
        return 'Character Advances';
      case 'powers':
        return 'Power Points & Powers';
      case 'session_log':
        return 'Session Activity Log';
      case 'adventure_journal':
        return 'Adventure Journal & Notes';
      default:
        return modId;
    }
  };

  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>, targetCol: BackColumnId) => {
    e.preventDefault();
    setActiveDragCol(null);
    try {
      const dataText = e.dataTransfer.getData('text/plain');
      if (!dataText) return;
      const data = JSON.parse(dataText);
      const targetIndex = backLayout[targetCol].length;
      moveBackModule(data.column as BackColumnId, data.index, targetCol, targetIndex);
    } catch {
      // Ignore parse error
    }
  };

  const handleColumnDragOver = (e: React.DragEvent<HTMLDivElement>, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDragCol !== colId) {
      setActiveDragCol(colId);
    }
  };

  // Build flattened list of modules to render directly in 3-column page grid
  const backModulesList = [
    ...backLayout.col1.map((id, index) => ({ id, col: 'col1' as const, index })),
    ...backLayout.col2.map((id, index) => ({ id, col: 'col2' as const, index })),
    ...backLayout.col3.map((id, index) => ({ id, col: 'col3' as const, index })),
    ...backLayout.bottom.map((id, index) => ({ id, col: 'bottom' as const, index })),
  ];

  return (
    <div className="space-y-6">
      {/* Main 3-Column Page CSS Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start ${
          isEditMode
            ? 'bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:32px_32px] bg-yellow-500/10 p-4 border-2 border-dashed border-red-800'
            : ''
        }`}
      >
        {backModulesList.map(({ id, col, index }) => (
          <DraggableModule
            key={id}
            id={id}
            title={getModuleTitle(id)}
            column={col}
            index={index}
            totalInColumn={backLayout[col].length}
            availableColumns={BACK_COLUMN_OPTIONS}
            onDropModule={(sourceCol, sourceIndex, targetCol, targetIndex) =>
              moveBackModule(
                sourceCol as BackColumnId,
                sourceIndex,
                targetCol as BackColumnId,
                targetIndex
              )
            }
          >
            {renderModule(id)}
          </DraggableModule>
        ))}

        {/* Edit Mode Drop Target Banner */}
        {isEditMode && (
          <div
            onDragOver={(e) => handleColumnDragOver(e, 'col1')}
            onDrop={(e) => handleColumnDrop(e, 'col1')}
            className="col-span-full py-3 px-2 border-2 border-dashed text-center text-xs font-serif font-bold uppercase tracking-wider bg-white/80 text-black border-black/40 hover:bg-black hover:text-white transition-all select-none cursor-pointer"
          >
            + Drag &amp; Drop Modules to Reorder or Resize Spans (1x = 1/3 page, 2x = 2/3 page, 3x = full page width)
          </div>
        )}
      </div>
    </div>
  );
}
