'use client';

import Image from 'next/image';
import TraitList from './TraitList';
import DerivedStats from './DerivedStats';
import ArmorTable from './ArmorTable';
import GearList from './GearList';
import CombatState from './CombatState';
import HindrancesAndEdges from './HindrancesAndEdges';
import WeaponsTable from './WeaponsTable';
import VitalHeader from '../header/VitalHeader';

export default function FrontPage() {
  return (
    <div className="space-y-6">
      <VitalHeader />
      {/* 3-Column Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Portrait, Attributes, Skills */}
        <div className="space-y-6 flex flex-col justify-start">
          {/* Portrait Container */}
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
          <TraitList type="attributes" title="Attributes" />
          <TraitList type="skills" title="Skills" />
        </div>

        {/* Column 2: Derived, Armor, Gear */}
        <div className="space-y-6 flex flex-col justify-start">
          <DerivedStats />
          <ArmorTable />
          <GearList />
        </div>

        {/* Column 3: Damage, Hindrances, Edges */}
        <div className="space-y-6 flex flex-col justify-start md:col-span-2 lg:col-span-1">
          <div className="section-container !overflow-visible">
            <div className="section-header">Damage</div>
            <CombatState />
          </div>
          <HindrancesAndEdges />
        </div>

      </div>

      {/* Weapons & Attacks Table */}
      <WeaponsTable />
    </div>
  );
}
