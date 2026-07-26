'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import TraitList from './TraitList';
import DerivedStats from './DerivedStats';
import ArmorTable from './ArmorTable';
import GearList from './GearList';
import CombatState from './CombatState';
import EncounterModifiers from './EncounterModifiers';
import HindrancesAndEdges from './HindrancesAndEdges';
import WeaponsTable from './WeaponsTable';
import VitalHeader from '../header/VitalHeader';
import PowersTracker from './PowersTracker';
import SessionLogTracker from './SessionLogTracker';
import AdventureJournal from './AdventureJournal';
import DraggableModule from './DraggableModule';
import { useUIStore, FrontModuleId, FrontColumnId } from '@/stores/uiStore';

const FRONT_COLUMN_OPTIONS = [
  { id: 'col1', label: 'Column 1' },
  { id: 'col2', label: 'Column 2' },
  { id: 'col3', label: 'Column 3' },
  { id: 'bottom', label: 'Bottom Section' },
];

export default function FrontPage() {
  const frontLayout = useUIStore((state) => state.frontLayout);
  const isEditMode = useUIStore((state) => state.isEditMode);
  const moveFrontModule = useUIStore((state) => state.moveFrontModule);
  const [activeDragCol, setActiveDragCol] = useState<string | null>(null);

  const renderModule = (modId: FrontModuleId) => {
    switch (modId) {
      case 'portrait':
        return (
          <div className="section-container relative overflow-hidden bg-white aspect-[3.1/4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Image
              src="/assets/portrait.png"
              alt="Astreus Helvetica Portrait"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
              className="object-cover object-top filter grayscale contrast-115"
            />
          </div>
        );
      case 'attributes':
        return <TraitList type="attributes" title="Attributes" />;
      case 'skills':
        return <TraitList type="skills" title="Skills" />;
      case 'derived':
        return <DerivedStats />;
      case 'armor':
        return <ArmorTable />;
      case 'gear':
        return <GearList />;
      case 'damage':
        return (
          <div className="section-container !overflow-visible">
            <div className="section-header">Damage</div>
            <CombatState />
          </div>
        );
      case 'modifiers':
        return <EncounterModifiers />;
      case 'hindrances_edges':
        return <HindrancesAndEdges />;
      case 'weapons':
        return <WeaponsTable />;
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

  const getModuleTitle = (modId: FrontModuleId): string => {
    switch (modId) {
      case 'portrait':
        return 'Character Portrait';
      case 'attributes':
        return 'Attributes';
      case 'skills':
        return 'Skills';
      case 'derived':
        return 'Derived Stats';
      case 'armor':
        return 'Armor Table';
      case 'gear':
        return 'Gear List';
      case 'damage':
        return 'Damage & Combat State';
      case 'modifiers':
        return 'Encounter Modifiers';
      case 'hindrances_edges':
        return 'Hindrances & Edges';
      case 'weapons':
        return 'Weapons & Attacks Table';
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

  const getColumnLabel = (colId: FrontColumnId): string => {
    const opt = FRONT_COLUMN_OPTIONS.find((c) => c.id === colId);
    return opt ? opt.label : colId;
  };

  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>, targetCol: FrontColumnId) => {
    e.preventDefault();
    setActiveDragCol(null);
    try {
      const dataText = e.dataTransfer.getData('text/plain');
      if (!dataText) return;
      const data = JSON.parse(dataText);
      const targetIndex = frontLayout[targetCol].length;
      moveFrontModule(data.column as FrontColumnId, data.index, targetCol, targetIndex);
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

  const renderColumnModules = (colId: FrontColumnId, modules: FrontModuleId[]) => {
    return (
      <div
        onDragOver={(e) => isEditMode && handleColumnDragOver(e, colId)}
        onDragLeave={() => setActiveDragCol(null)}
        onDrop={(e) => isEditMode && handleColumnDrop(e, colId)}
        className={`flex flex-col justify-between h-full min-h-[280px] p-2 transition-all rounded-none ${
          isEditMode
            ? activeDragCol === colId
              ? 'border-2 border-dashed border-red-600 bg-red-50/60 shadow-[0_0_15px_rgba(204,0,0,0.25)]'
              : 'border-2 border-dashed border-black/30 hover:border-black/60 bg-black/[0.02]'
            : ''
        }`}
      >
        <div className="space-y-6 w-full flex-grow">
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
              availableColumns={FRONT_COLUMN_OPTIONS}
              onDropModule={(sourceCol, sourceIndex, targetCol, targetIndex) =>
                moveFrontModule(
                  sourceCol as FrontColumnId,
                  sourceIndex,
                  targetCol as FrontColumnId,
                  targetIndex
                )
              }
            >
              {renderModule(modId)}
            </DraggableModule>
          ))}
        </div>

        {/* Explicit Column Bottom Drop Zone in Edit Mode */}
        {isEditMode && (
          <div
            onDragOver={(e) => handleColumnDragOver(e, colId)}
            onDrop={(e) => handleColumnDrop(e, colId)}
            className={`mt-4 py-3 px-2 border-2 border-dashed text-center text-xs font-serif font-bold uppercase tracking-wider transition-all select-none cursor-pointer ${
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
    <div className="space-y-6">
      <VitalHeader />

      {/* 3-Column Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Column 1 */}
        <div className="flex flex-col justify-start h-full">
          {renderColumnModules('col1', frontLayout.col1)}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col justify-start h-full">
          {renderColumnModules('col2', frontLayout.col2)}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col justify-start h-full md:col-span-2 lg:col-span-1">
          {renderColumnModules('col3', frontLayout.col3)}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col justify-start w-full">
        {renderColumnModules('bottom', frontLayout.bottom)}
      </div>
    </div>
  );
}
