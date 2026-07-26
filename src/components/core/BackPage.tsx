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

  const getColumnLabel = (colId: BackColumnId): string => {
    const opt = BACK_COLUMN_OPTIONS.find((c) => c.id === colId);
    return opt ? opt.label : colId;
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

  const renderColumnModules = (colId: BackColumnId, modules: BackModuleId[]) => {
    return (
      <div
        onDragOver={(e) => isEditMode && handleColumnDragOver(e, colId)}
        onDragLeave={() => setActiveDragCol(null)}
        onDrop={(e) => isEditMode && handleColumnDrop(e, colId)}
        className={`flex flex-col justify-start gap-6 w-full min-h-[300px] p-2 transition-all rounded-none ${
          isEditMode
            ? activeDragCol === colId
              ? 'border-2 border-dashed border-red-600 bg-red-50/60 shadow-[0_0_15px_rgba(204,0,0,0.25)]'
              : 'border-2 border-dashed border-black/30 hover:border-black/60 bg-black/[0.02]'
            : ''
        }`}
      >
        {modules.length === 0 && isEditMode && (
          <div className="p-6 text-center text-xs font-mono font-bold uppercase text-gray-600 border-2 border-dashed border-gray-400 bg-white/60">
            [ Empty Column - Drop Module Here ]
          </div>
        )}
        {modules.map((modId, index) => (
          <DraggableModule
            key={modId}
            id={modId}
            title={getModuleTitle(modId)}
            column={colId}
            index={index}
            totalInColumn={modules.length}
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
            {renderModule(modId)}
          </DraggableModule>
        ))}

        {/* Explicit Column Bottom Drop Zone in Edit Mode */}
        {isEditMode && (
          <div
            onDragOver={(e) => handleColumnDragOver(e, colId)}
            onDrop={(e) => handleColumnDrop(e, colId)}
            className={`mt-2 py-3 px-2 border-2 border-dashed text-center text-xs font-serif font-bold uppercase tracking-wider transition-all select-none cursor-pointer ${
              activeDragCol === colId
                ? 'bg-red-700 text-white border-red-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white/80 text-black border-black/40 hover:bg-black hover:text-white'
            }`}
          >
            + Drop to add to end of {getColumnLabel(colId)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`space-y-6 ${
        isEditMode
          ? 'bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:32px_32px] bg-yellow-500/10 p-4 border-2 border-dashed border-red-800'
          : ''
      }`}
    >
      {/* 3-Column Tight Vertical Stack Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1 */}
        <div className="flex flex-col justify-start">
          {renderColumnModules('col1', backLayout.col1)}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col justify-start">
          {renderColumnModules('col2', backLayout.col2)}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col justify-start">
          {renderColumnModules('col3', backLayout.col3)}
        </div>
      </div>

      {/* Bottom Full-Width Section */}
      <div className="w-full flex flex-col justify-start">
        {renderColumnModules('bottom', backLayout.bottom)}
      </div>
    </div>
  );
}
