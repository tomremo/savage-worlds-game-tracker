'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useCharacterStore } from '@/stores/characterStore';
import ActiveCore from '@/components/core/ActiveCore';
import RollResult from '@/components/overlay/RollResult';

export default function Home() {
  const { viewMode, setViewMode } = useUIStore();
  const characterName = useCharacterStore((state) => state.character?.name);

  useEffect(() => {
    const appName = 'Savage Worlds Game Tracker';
    if (characterName) {
      document.title = `${appName} - ${characterName}`;
    } else {
      document.title = appName;
    }
  }, [characterName]);

  return (
    <main className="relative min-h-screen bg-[#1a120b] p-4 lg:p-8 flex flex-col items-center justify-start">
      
      {/* Brutalist View Switcher Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 select-none z-20">
        <button 
          onClick={() => setViewMode('front')}
          className={`px-4 py-2 border-2 border-black font-extrabold font-serif text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer ${
            viewMode === 'front' 
              ? 'bg-black text-white hover:bg-black/90' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Page 1: Front Side
        </button>
        <button 
          onClick={() => setViewMode('back')}
          className={`px-4 py-2 border-2 border-black font-extrabold font-serif text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer ${
            viewMode === 'back' 
              ? 'bg-black text-white hover:bg-black/90' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Page 2: Back Side
        </button>
        <button 
          onClick={() => setViewMode('dual')}
          className={`px-4 py-2 border-2 border-black font-extrabold font-serif text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer ${
            viewMode === 'dual' 
              ? 'bg-black text-white hover:bg-black/90' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Side-By-Side View
        </button>
      </div>

      {/* Render core content */}
      {viewMode === 'dual' ? (
        <div className="w-full max-w-[1800px] z-10">
          <ActiveCore />
        </div>
      ) : (
        /* Single Page view wrapper */
        <div className="w-full max-w-[1100px] parchment-paper border-4 border-black p-4 lg:p-6 shadow-2xl relative z-10">
          <div className="relative z-10 w-full space-y-6">
            <ActiveCore />
          </div>
        </div>
      )}

      {/* Interactive wild card dice roll results overlay */}
      <RollResult />
    </main>
  );
}
