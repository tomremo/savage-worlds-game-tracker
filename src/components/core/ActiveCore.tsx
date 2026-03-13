'use client';

import { useUIStore } from '@/stores/uiStore';
import TraitList from './TraitList';
import CombatState from './CombatState';
import AbilitiesTab from '../footer/AbilitiesTab';
import InventoryTab from '../footer/InventoryTab';
import PowersTab from '../footer/PowersTab';
import LogTab from '../footer/LogTab';

export default function ActiveCore() {
  const activeTab = useUIStore((state) => state.activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'skills':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-6">
              <TraitList type="attributes" title="Attributes" />
              <TraitList type="skills" title="Skills" />
            </section>
            <section className="space-y-6">
              <CombatState />
            </section>
          </div>
        );
      case 'abilities':
        return <AbilitiesTab />;
      case 'inventory':
        return <InventoryTab />;
      case 'powers':
        return <PowersTab />;
      case 'log':
        return <LogTab />;
      default:
        return <div className="text-center py-20 text-sepia-mid italic">Tab content under construction</div>;
    }
  };

  return <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">{renderContent()}</div>;
}
