'use client';

import { useUIStore, TabType } from '@/stores/uiStore';

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'skills', label: 'Traits', icon: '📜' },
  { id: 'abilities', label: 'Edges', icon: '⚔️' },
  { id: 'powers', label: 'Powers', icon: '✨' },
  { id: 'inventory', label: 'Gear', icon: '🛡️' },
  { id: 'log', label: 'Log', icon: '✍️' },
  { id: 'history', label: 'History', icon: '⌛' },
];

export default function ManagementFooter() {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[10vh] parchment-card border-t-2 border-sepia-mid z-50 flex items-center justify-around px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-1 ${
            activeTab === tab.id 
              ? 'bg-sepia-dark text-white scale-105 rounded-t-lg' 
              : 'text-sepia-mid hover:bg-sepia-light/20'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] uppercase font-black w-full text-center truncate px-1">
            {tab.label}
          </span>
        </button>
      ))}
    </footer>
  );
}
