'use client';

import { useUIStore } from '@/stores/uiStore';
import DerivedStats from './DerivedStats';
import ArmorTable from './ArmorTable';
import WeaponsTable from './WeaponsTable';
import HindrancesAndEdges from './HindrancesAndEdges';
import TraitList from './TraitList';
import CombatState from './CombatState';
import Image from 'next/image';

export default function ActiveCore() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-[1400px] mx-auto pb-12">
      {/* Column 1: Portrait, Attributes, Skills */}
      <div className="space-y-6">
        <div className="section-container aspect-[3/4] relative">
          <Image 
            src="/assets/portrait.png" 
            alt="Character Portrait" 
            fill 
            className="object-cover"
          />
        </div>
        <TraitList type="attributes" title="Attributes" />
        <TraitList type="skills" title="Skills" />
      </div>

      {/* Column 2: Derived, Armor, Gear */}
      <div className="space-y-6">
        <DerivedStats />
        <ArmorTable />
        <div className="section-container min-h-[200px]">
          <div className="section-header">Gear</div>
          <div className="p-2 text-[0.7rem] font-mono leading-tight">
             Backpack (11.0), Climber's Kit (10), Healer's Kit (1), Adventurer's Kit (8), Potion of Minor Healing, Everburning Torch, Horse (0)...
             <div className="mt-4 border-t border-black pt-2 flex justify-between">
               <span>Wealth: 0gp</span>
               <span>Weight: 38</span>
             </div>
          </div>
        </div>
      </div>

      {/* Column 3: Damage, Hindrances, Edges */}
      <div className="space-y-6">
        <div className="section-container">
          <div className="section-header">Damage</div>
          <CombatState />
        </div>
        <HindrancesAndEdges />
      </div>

      {/* Full width bottom: Weapons */}
      <WeaponsTable />
    </div>
  );
}
