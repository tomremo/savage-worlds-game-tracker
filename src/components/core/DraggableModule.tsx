'use client';

import React, { useState, useRef } from 'react';
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
  const span = useUIStore((state) => state.moduleSpans[id] || 1);
  const customHeight = useUIStore((state) => state.moduleHeights[id]);
  const setModuleSpan = useUIStore((state) => state.setModuleSpan);
  const setModuleHeight = useUIStore((state) => state.setModuleHeight);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState<'top' | 'bottom' | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const moduleRef = useRef<HTMLDivElement>(null);

  const spanClass =
    span === 3
      ? 'col-span-1 md:col-span-2 lg:col-span-3'
      : span === 2
      ? 'col-span-1 md:col-span-2 lg:col-span-2'
      : 'col-span-1';

  if (!isEditMode) {
    // Read-only mode rendering
    return (
      <div
        className={`${spanClass} w-full flex flex-col`}
        style={customHeight ? { height: `${customHeight}px` } : undefined}
      >
        <div className={`w-full h-full ${customHeight ? 'overflow-y-auto pr-1' : ''}`}>
          {children}
        </div>
      </div>
    );
  }

  // HTML5 Drag & Drop event handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isResizing) {
      e.preventDefault();
      return;
    }
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
      const targetIndex = currentPos === 'bottom' ? index + 1 : index;

      if (data.column === column && (data.index === targetIndex || (data.index === index && currentPos === 'top'))) {
        return;
      }
      onDropModule(data.column, data.index, column, targetIndex);
    } catch {
      // Ignore parse error
    }
  };

  // Interactive Edge & Corner Drag Resizing Handlers
  const handleRightResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const startX = e.clientX;
    const initialSpan = span;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Grid column threshold delta (~180px per column step)
      if (deltaX > 120 && initialSpan < 3) {
        const nextSpan = (Math.min(3, initialSpan + Math.floor(deltaX / 150)) as 1 | 2 | 3);
        setModuleSpan(id, nextSpan);
      } else if (deltaX < -120 && initialSpan > 1) {
        const nextSpan = (Math.max(1, initialSpan + Math.ceil(deltaX / 150)) as 1 | 2 | 3);
        setModuleSpan(id, nextSpan);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleBottomResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const startY = e.clientY;
    const startHeight = moduleRef.current?.getBoundingClientRect().height || 320;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const rawHeight = startHeight + deltaY;
      // Snap to nearest 32px grid unit (minimum 9 grid units = 288px)
      const gridUnits = Math.max(9, Math.min(40, Math.round(rawHeight / 32)));
      const snappedHeight = gridUnits * 32;
      setModuleHeight(id, snappedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleCornerResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialSpan = span;
    const startHeight = moduleRef.current?.getBoundingClientRect().height || 320;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Span adjustment (full column units)
      let nextSpan = initialSpan;
      if (deltaX > 120 && initialSpan < 3) {
        nextSpan = Math.min(3, initialSpan + Math.floor(deltaX / 150)) as 1 | 2 | 3;
      } else if (deltaX < -120 && initialSpan > 1) {
        nextSpan = Math.max(1, initialSpan + Math.ceil(deltaX / 150)) as 1 | 2 | 3;
      }
      setModuleSpan(id, nextSpan);

      // Height adjustment (snapped to 32px grid units)
      const rawHeight = startHeight + deltaY;
      const gridUnits = Math.max(9, Math.min(40, Math.round(rawHeight / 32)));
      const snappedHeight = gridUnits * 32;
      setModuleHeight(id, snappedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={moduleRef}
      draggable={!isResizing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={customHeight ? { height: `${customHeight}px` } : undefined}
      className={`${spanClass} w-full relative group border-2 transition-all duration-150 rounded-none bg-white/60 p-1 flex flex-col ${
        isDragging ? 'opacity-30 border-dashed border-red-600 scale-[0.98]' : ''
      } ${
        dragOverPosition === 'top'
          ? 'border-t-4 border-t-red-600 border-black/50 bg-red-50/50'
          : dragOverPosition === 'bottom'
          ? 'border-b-4 border-b-red-600 border-black/50 bg-red-50/50'
          : 'border-black/40 hover:border-black'
      }`}
    >
      {/* Top/Bottom Placement Badges */}
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

      {/* Brutalist Drag & Resize Header */}
      <div className="bg-black text-white px-2 py-1 flex flex-wrap items-center justify-between gap-1 text-[11px] font-serif font-bold uppercase tracking-wider select-none cursor-grab active:cursor-grabbing mb-2 border-b-2 border-black">
        <div className="flex items-center gap-1.5">
          <span className="text-red-500 font-mono">⠿</span>
          <span>{title}</span>
          <span className="text-[9px] bg-red-700 text-white px-1 font-mono font-bold">
            {span}x COL
          </span>
          {customHeight && (
            <span className="text-[9px] bg-yellow-500 text-black px-1 font-mono font-bold">
              {Math.round(customHeight / 32)} GRID UNITS ({customHeight}PX)
            </span>
          )}
        </div>

        {/* Span & Height Quick Controls */}
        <div className="flex items-center gap-1 text-[10px]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-0.5 bg-gray-900 border border-gray-700 px-1 py-0.5">
            <span className="text-[9px] text-gray-400 mr-0.5 font-mono">SPAN:</span>
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setModuleSpan(id, s as 1 | 2 | 3)}
                className={`px-1 py-0.2 text-[9px] font-mono font-bold cursor-pointer ${
                  span === s ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {customHeight && (
            <button
              type="button"
              onClick={() => setModuleHeight(id, undefined)}
              className="px-1.5 py-0.5 bg-gray-800 hover:bg-red-700 text-white border border-gray-600 cursor-pointer font-mono text-[9px]"
              title="Reset to automatic content height"
            >
              Reset H
            </button>
          )}

          {/* Quick Mobile Order Buttons */}
          {index > 0 && (
            <button
              type="button"
              onClick={() => onDropModule(column, index, column, index - 1)}
              title="Move Up"
              className="px-1 py-0.5 bg-gray-800 hover:bg-red-700 text-white border border-gray-600 cursor-pointer font-sans"
            >
              ▲
            </button>
          )}
          {index < totalInColumn - 1 && (
            <button
              type="button"
              onClick={() => onDropModule(column, index, column, index + 1)}
              title="Move Down"
              className="px-1 py-0.5 bg-gray-800 hover:bg-red-700 text-white border border-gray-600 cursor-pointer font-sans"
            >
              ▼
            </button>
          )}

          {/* Target Column Selector */}
          <select
            value={column}
            onChange={(e) => {
              const targetCol = e.target.value;
              if (targetCol !== column) {
                onDropModule(column, index, targetCol, 999);
              }
            }}
            className="bg-gray-900 text-white text-[9px] border border-gray-700 px-1 py-0.5 cursor-pointer font-sans"
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

      {/* Internal Scrollable Content Viewport */}
      <div className="flex-grow overflow-y-auto pr-1">
        {children}
      </div>

      {/* Manual Drag Resizing Handles */}
      {/* Right Edge Handle */}
      <div
        onMouseDown={handleRightResizeMouseDown}
        className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-red-600/60 transition-colors z-20 flex items-center justify-center"
        title="Drag right edge to resize column width"
      >
        <div className="w-0.5 h-6 bg-black/40 group-hover:bg-black" />
      </div>

      {/* Bottom Edge Handle */}
      <div
        onMouseDown={handleBottomResizeMouseDown}
        className="absolute bottom-0 left-0 right-0 h-2.5 cursor-ns-resize hover:bg-red-600/60 transition-colors z-20 flex items-center justify-center"
        title="Drag bottom edge to resize module height"
      >
        <div className="h-0.5 w-6 bg-black/40 group-hover:bg-black" />
      </div>

      {/* Bottom-Right Corner Handle */}
      <div
        onMouseDown={handleCornerResizeMouseDown}
        className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize bg-black text-white hover:bg-red-700 flex items-center justify-center z-30 font-mono text-[8px] font-bold select-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        title="Drag corner to resize width and height simultaneously"
      >
        ◢
      </div>
    </div>
  );
}
