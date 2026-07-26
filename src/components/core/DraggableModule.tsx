'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';

interface ColumnOption {
  id: string;
  label: string;
}

interface DraggableModuleProps {
  id: string;
  title: string;
  column: string;
  index: number;
  totalInColumn: number;
  availableColumns: ColumnOption[];
  onDropModule: (
    sourceCol: string,
    sourceIndex: number,
    targetCol: string,
    targetIndex: number
  ) => void;
  children: React.ReactNode;
}

export default function DraggableModule({
  id,
  title,
  column,
  index,
  totalInColumn,
  availableColumns,
  onDropModule,
  children,
}: DraggableModuleProps) {
  const isEditMode = useUIStore((state) => state.isEditMode);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState<'top' | 'bottom' | null>(null);

  if (!isEditMode) {
    return <>{children}</>;
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.stopPropagation();
    const payload = JSON.stringify({ id, column, index });
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverPosition(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? 'top' : 'bottom';
    if (dragOverPosition !== pos) {
      setDragOverPosition(pos);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPosition(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentPos = dragOverPosition;
    setDragOverPosition(null);
    try {
      const dataText = e.dataTransfer.getData('text/plain');
      if (!dataText) return;
      const data = JSON.parse(dataText);

      // Determine insertion index based on top half vs bottom half drop
      const targetIndex = currentPos === 'bottom' ? index + 1 : index;

      if (data.column === column && (data.index === targetIndex || (data.index === index && currentPos === 'top'))) {
        return;
      }

      onDropModule(data.column, data.index, column, targetIndex);
    } catch {
      // Ignore parse error
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 transition-all duration-150 rounded-none bg-white/50 p-1 ${
        isDragging ? 'opacity-30 border-dashed border-red-600 scale-[0.98]' : ''
      } ${
        dragOverPosition === 'top'
          ? 'border-t-4 border-t-red-600 border-black/50 bg-red-50/50'
          : dragOverPosition === 'bottom'
          ? 'border-b-4 border-b-red-600 border-black/50 bg-red-50/50'
          : 'border-black/30 hover:border-black'
      }`}
    >
      {/* Visual Drop Placement Indicator Badges */}
      {dragOverPosition === 'top' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-700 text-white text-[9px] font-mono px-2 py-0.5 z-30 uppercase font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ↓ Insert Before {title} ↓
        </div>
      )}
      {dragOverPosition === 'bottom' && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-700 text-white text-[9px] font-mono px-2 py-0.5 z-30 uppercase font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ↑ Insert After {title} ↑
        </div>
      )}

      {/* Brutalist Drag Handle & Controls Bar */}
      <div className="bg-black text-white px-2 py-1 flex flex-wrap items-center justify-between gap-1 text-[11px] font-serif font-bold uppercase tracking-wider select-none cursor-grab active:cursor-grabbing mb-2 border-b-2 border-black">
        <div className="flex items-center gap-1.5">
          <span className="text-red-500 font-mono">⠿</span>
          <span>{title}</span>
          <span className="text-[9px] bg-red-700 text-white px-1 font-mono">
            DRAG HANDLE
          </span>
        </div>

        {/* Mobile & Keyboard Quick Move Buttons */}
        <div className="flex items-center gap-1 text-[10px]" onClick={(e) => e.stopPropagation()}>
          {index > 0 && (
            <button
              type="button"
              onClick={() => onDropModule(column, index, column, index - 1)}
              title="Move Up"
              className="px-1.5 py-0.5 bg-gray-800 hover:bg-red-700 text-white border border-gray-600 cursor-pointer font-sans"
            >
              ▲ Up
            </button>
          )}
          {index < totalInColumn - 1 && (
            <button
              type="button"
              onClick={() => onDropModule(column, index, column, index + 1)}
              title="Move Down"
              className="px-1.5 py-0.5 bg-gray-800 hover:bg-red-700 text-white border border-gray-600 cursor-pointer font-sans"
            >
              ▼ Down
            </button>
          )}

          {/* Target Column Select for Touch Devices */}
          <select
            value={column}
            onChange={(e) => {
              const targetCol = e.target.value;
              if (targetCol !== column) {
                onDropModule(column, index, targetCol, 999);
              }
            }}
            className="bg-gray-900 text-white text-[10px] border border-gray-700 px-1 py-0.5 cursor-pointer font-sans"
            title="Move to another column"
          >
            {availableColumns.map((col) => (
              <option key={col.id} value={col.id}>
                → {col.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Module Content */}
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}
