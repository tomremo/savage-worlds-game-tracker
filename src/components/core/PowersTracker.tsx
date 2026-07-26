'use client';

import React, { useState } from 'react';
import { useCharacterStore } from '@/stores/characterStore';
import { useUIStore } from '@/stores/uiStore';
import { powers as catalogPowers } from '@/data/powers';
import { rollTrait } from '@/engine/dice';
import { Power } from '@/types/resources';

export default function PowersTracker() {
  const character = useCharacterStore((state) => state.character);
  const updatePowerPoints = useCharacterStore((state) => state.updatePowerPoints);
  const setMaxPowerPoints = useCharacterStore((state) => state.setMaxPowerPoints);
  const resetPowerPoints = useCharacterStore((state) => state.resetPowerPoints);
  const castPower = useCharacterStore((state) => state.castPower);
  const toggleActivePower = useCharacterStore((state) => state.toggleActivePower);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);
  const setRollResult = useUIStore((state) => state.setRollResult);

  const [isEditingMax, setIsEditingMax] = useState(false);
  const [newMaxPP, setNewMaxPP] = useState<number>(character?.maxPowerPoints || 10);
  const [isAddingPower, setIsAddingPower] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPpCost, setCustomPpCost] = useState('1');
  const [customRange, setCustomRange] = useState('Smarts');
  const [customDuration, setCustomDuration] = useState('5 (1/rnd)');
  const [customSummary, setCustomSummary] = useState('');
  const [castMessage, setCastMessage] = useState<string | null>(null);

  if (!character) return null;

  const currentPP = character.currentPowerPoints ?? 0;
  const maxPP = character.maxPowerPoints ?? 0;
  const activePowerIds = character.activePowerIds || [];
  const powerIds = character.powerIds || [];

  // Resolve power objects from catalog or custom
  const knownPowers: Power[] = powerIds.map((id) => {
    const found = catalogPowers.find((p) => p.id === id);
    if (found) return found;
    return {
      id,
      name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      rank: 'Novice',
      ppCost: '1',
      range: 'Smarts',
      duration: '5 (1/rnd)',
      summary: 'Custom Power',
      description: 'Custom Power',
    };
  });

  const handleCast = (power: Power) => {
    const cost = parseInt(power.ppCost, 10) || 1;
    const success = castPower(power.id, cost);
    if (success) {
      setCastMessage(`Cast ${power.name} (-${cost} PP)!`);
      setTimeout(() => setCastMessage(null), 2500);
    } else {
      setCastMessage(`Not enough Power Points to cast ${power.name}!`);
      setTimeout(() => setCastMessage(null), 2500);
    }
  };

  const handleRollArcaneSkill = (power: Power) => {
    // Look for spellcasting, focus, faith, or weird science skill, fallback to Smarts
    const spellSkill = character.skills.find((s) =>
      ['spellcasting', 'focus', 'faith', 'weird-science'].includes(s.skillId)
    );
    const trait = spellSkill
      ? spellSkill.trait
      : { dieType: character.attributes.smarts.dieType, modifier: -2 };
    const rollRes = rollTrait(
      { dieType: trait.dieType, modifier: trait.modifier },
      true,
      true
    );
    const skillName = spellSkill ? spellSkill.skillId.toUpperCase() : 'SMARTS (UNSKILLED)';
    setRollResult({
      name: `${power.name} (${skillName})`,
      result: rollRes,
    });
  };

  const handleSaveMaxPP = () => {
    setMaxPowerPoints(newMaxPP);
    setIsEditingMax(false);
  };

  const handleAddCustomPower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const newId = customName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!powerIds.includes(newId)) {
      updateCharacter({
        powerIds: [...powerIds, newId],
      });
    }
    setCustomName('');
    setCustomSummary('');
    setIsAddingPower(false);
  };

  const ppPercent = maxPP > 0 ? Math.min(100, Math.max(0, (currentPP / maxPP) * 100)) : 0;

  return (
    <div className="section-container relative">
      <div className="section-header flex items-center justify-between">
        <span>Power Points & Powers</span>
        <button
          type="button"
          onClick={() => setIsAddingPower(!isAddingPower)}
          className="text-[10px] bg-red-700 text-white px-2 py-0.5 uppercase tracking-wider font-sans font-bold hover:bg-red-800 cursor-pointer"
        >
          {isAddingPower ? 'Cancel' : '+ Add Power'}
        </button>
      </div>

      <div className="p-3 space-y-4">
        {/* Cast Notification Message */}
        {castMessage && (
          <div className="p-2 bg-black text-white text-xs font-mono font-bold text-center border-2 border-red-600 animate-pulse">
            ⚡ {castMessage}
          </div>
        )}

        {/* Power Points Pool Header & Controls */}
        <div className="border-2 border-black p-3 bg-white space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-black/70">
                POWER POINTS POOL
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold font-serif text-black">{currentPP}</span>
                <span className="text-sm font-bold text-gray-500">/ {maxPP} PP</span>
              </div>
            </div>

            {/* PP Quick Adjust Buttons */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => updatePowerPoints(-5)}
                className="px-2 py-1 bg-black text-white text-xs font-mono font-bold hover:bg-gray-800 cursor-pointer border border-black"
                title="Subtract 5 PP"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => updatePowerPoints(-1)}
                className="px-2 py-1 bg-black text-white text-xs font-mono font-bold hover:bg-gray-800 cursor-pointer border border-black"
                title="Subtract 1 PP"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => updatePowerPoints(1)}
                className="px-2 py-1 bg-black text-white text-xs font-mono font-bold hover:bg-gray-800 cursor-pointer border border-black"
                title="Add 1 PP"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => updatePowerPoints(5)}
                className="px-2 py-1 bg-black text-white text-xs font-mono font-bold hover:bg-gray-800 cursor-pointer border border-black"
                title="Add 5 PP"
              >
                +5
              </button>
              <button
                type="button"
                onClick={resetPowerPoints}
                className="px-2 py-1 bg-red-700 text-white text-xs font-serif font-bold uppercase hover:bg-red-800 cursor-pointer border border-black"
                title="Reset PP to Max"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsEditingMax(!isEditingMax)}
                className="px-2 py-1 bg-gray-200 text-black text-xs font-mono font-bold hover:bg-gray-300 cursor-pointer border border-black"
                title="Set Max Power Points"
              >
                Max PP
              </button>
            </div>
          </div>

          {/* Edit Max PP Input Form */}
          {isEditingMax && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-300">
              <span className="text-xs font-mono uppercase">Max PP:</span>
              <input
                type="number"
                min="0"
                value={newMaxPP}
                onChange={(e) => setNewMaxPP(parseInt(e.target.value, 10) || 0)}
                className="w-20 px-2 py-1 border-2 border-black font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleSaveMaxPP}
                className="px-2 py-1 bg-black text-white text-xs uppercase font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 border border-black h-3 relative overflow-hidden">
            <div
              className="bg-red-700 h-full transition-all duration-300"
              style={{ width: `${ppPercent}%` }}
            />
          </div>
        </div>

        {/* Add Custom Power Form */}
        {isAddingPower && (
          <form onSubmit={handleAddCustomPower} className="border-2 border-black p-3 bg-yellow-50 space-y-2">
            <div className="text-xs font-serif font-bold uppercase tracking-wider text-black">
              Add Custom Power
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Power Name (e.g. Telekinesis)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="px-2 py-1 border-2 border-black text-xs bg-white font-sans"
                required
              />
              <input
                type="text"
                placeholder="PP Cost (e.g. 2)"
                value={customPpCost}
                onChange={(e) => setCustomPpCost(e.target.value)}
                className="px-2 py-1 border-2 border-black text-xs bg-white font-sans"
              />
              <input
                type="text"
                placeholder="Range (e.g. Smarts)"
                value={customRange}
                onChange={(e) => setCustomRange(e.target.value)}
                className="px-2 py-1 border-2 border-black text-xs bg-white font-sans"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 5 (1/rnd))"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="px-2 py-1 border-2 border-black text-xs bg-white font-sans"
              />
            </div>
            <textarea
              placeholder="Short Summary / Effect"
              value={customSummary}
              onChange={(e) => setCustomSummary(e.target.value)}
              className="w-full px-2 py-1 border-2 border-black text-xs bg-white font-sans h-14"
            />
            <button
              type="submit"
              className="w-full py-1.5 bg-black text-white text-xs font-serif font-bold uppercase tracking-widest hover:bg-gray-900 cursor-pointer"
            >
              Save Power
            </button>
          </form>
        )}

        {/* Powers List */}
        <div className="space-y-2">
          {knownPowers.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-gray-500 border border-dashed border-gray-400">
              No powers learned yet. Click &quot;+ Add Power&quot; to add one.
            </div>
          ) : (
            knownPowers.map((power) => {
              const isActive = activePowerIds.includes(power.id);
              const cost = parseInt(power.ppCost, 10) || 1;

              return (
                <div
                  key={power.id}
                  className={`border-2 p-2.5 transition-all ${
                    isActive
                      ? 'border-red-700 bg-red-50/80 shadow-[2px_2px_0px_0px_rgba(204,0,0,1)]'
                      : 'border-black bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-extrabold uppercase text-sm text-black">
                          {power.name}
                        </span>
                        <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.5">
                          {power.ppCost} PP
                        </span>
                        {isActive && (
                          <span className="bg-red-700 text-white text-[9px] font-mono font-bold px-1 py-0.5 uppercase tracking-wider">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-gray-600 space-x-2">
                        <span>Range: {power.range}</span>
                        <span>•</span>
                        <span>Duration: {power.duration}</span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleActivePower(power.id)}
                        className={`px-2 py-1 text-[10px] font-serif font-bold uppercase tracking-wider border cursor-pointer ${
                          isActive
                            ? 'bg-red-700 text-white border-red-900 hover:bg-red-800'
                            : 'bg-gray-100 text-black border-black hover:bg-gray-200'
                        }`}
                      >
                        {isActive ? 'Active' : 'Maintain'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCast(power)}
                        disabled={currentPP < cost}
                        className={`px-2.5 py-1 text-[10px] font-serif font-bold uppercase tracking-wider border border-black cursor-pointer ${
                          currentPP >= cost
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                        }`}
                        title={currentPP >= cost ? `Cast ${power.name} (-${cost} PP)` : 'Insufficient PP'}
                      >
                        Cast (-{cost} PP)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRollArcaneSkill(power)}
                        className="px-2 py-1 text-[10px] font-serif font-bold uppercase tracking-wider bg-red-700 text-white border border-black hover:bg-red-800 cursor-pointer"
                        title="Roll Arcane Skill / Smarts"
                      >
                        Roll
                      </button>
                    </div>
                  </div>

                  {/* Summary / Description */}
                  <p className="mt-1 text-xs text-gray-700 font-sans leading-tight">
                    {power.summary || power.description}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
