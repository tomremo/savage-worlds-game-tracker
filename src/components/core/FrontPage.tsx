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

  // Build flattened list of modules to render directly in 3-column page grid
  const frontModulesList = [
    ...frontLayout.col1.map((id, index) => ({ id, col: 'col1' as const, index })),
    ...frontLayout.col2.map((id, index) => ({ id, col: 'col2' as const, index })),
    ...frontLayout.col3.map((id, index) => ({ id, col: 'col3' as const, index })),
    ...frontLayout.bottom.map((id, index) => ({ id, col: 'bottom' as const, index })),
  ];

  return (
    <div className="space-y-6">
      <VitalHeader />

      {/* Main 3-Column Page CSS Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start ${
          isEditMode
            ? 'bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:32px_32px] bg-yellow-500/10 p-4 border-2 border-dashed border-red-800'
            : ''
        }`}
      >
        {frontModulesList.map(({ id, col, index }) => (
          <DraggableModule
            key={id}
            id={id}
            title={getModuleTitle(id)}
            column={col}
            index={index}
            totalInColumn={frontLayout[col].length}
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
