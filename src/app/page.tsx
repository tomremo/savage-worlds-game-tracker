'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useCharacterStore } from '@/stores/characterStore';
import ActiveCore from '@/components/core/ActiveCore';
import RollResult from '@/components/overlay/RollResult';

export default function Home() {
  const {
    viewMode,
    setViewMode,
    enable3dDice,
    setEnable3dDice,
    isEditMode,
    toggleEditMode,
    resetLayouts,
  } = useUIStore();
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
      
      {/* Brutalist View & Mode Switcher Navigation */}
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
        <button 
          onClick={() => setEnable3dDice(!enable3dDice)}
          className={`px-4 py-2 border-2 border-black font-extrabold font-serif text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer ${
            enable3dDice 
              ? 'bg-red-700 text-white hover:bg-red-800' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          3D Dice: {enable3dDice ? 'ON' : 'OFF'}
        </button>
        <button 
          onClick={toggleEditMode}
          className={`px-4 py-2 border-2 border-black font-extrabold font-serif text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer ${
            isEditMode 
              ? 'bg-red-700 text-white hover:bg-red-800 ring-2 ring-yellow-400' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Mode: {isEditMode ? 'CUSTOMIZE LAYOUT' : 'READ-ONLY'}
        </button>
        {isEditMode && (
          <button 
            onClick={resetLayouts}
            className="px-3 py-2 border-2 border-black font-extrabold font-serif text-[10px] sm:text-xs uppercase tracking-widest bg-yellow-400 text-black hover:bg-yellow-500 transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer"
            title="Restore default module layout"
          >
            Reset Layout
          </button>
        )}
      </div>

      {isEditMode && (
        <div className="w-full max-w-[1100px] mb-4 p-2 bg-red-950/90 border-2 border-red-500 text-red-100 text-center text-xs font-serif uppercase tracking-widest select-none z-20 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          <span className="font-bold text-yellow-400">⚡ CUSTOMIZE LAYOUT MODE ACTIVE:</span> Drag modules by their header handles or use the action buttons to reorder sections.
        </div>
      )}

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
