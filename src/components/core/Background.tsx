'use client';

import React, { useState } from 'react';
import { useCharacterStore } from '@/stores/characterStore';
import MarkdownRenderer from './MarkdownRenderer';

export default function Background() {
  const character = useCharacterStore((state) => state.character);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);
  const [isEditing, setIsEditing] = useState(false);
  const [markdownText, setMarkdownText] = useState(character?.backgroundText || '');

  if (!character) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCharacter({ backgroundText: markdownText });
    setIsEditing(false);
  };

  return (
    <div className="section-container bg-white text-black h-full flex flex-col">
      <div className="section-header flex items-center justify-between">
        <span>Background Notes</span>
        <button
          type="button"
          onClick={() => {
            setMarkdownText(character.backgroundText || '');
            setIsEditing(!isEditing);
          }}
          className="text-[10px] bg-red-700 text-white px-2 py-0.5 uppercase tracking-wider font-sans font-bold hover:bg-red-800 cursor-pointer"
        >
          {isEditing ? 'Cancel' : '✍ Edit Notes'}
        </button>
      </div>

      <div className="p-4 flex-grow space-y-3 overflow-y-auto max-h-full">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-2">
            <div className="text-[10px] font-mono text-gray-600 uppercase">
              Supports Markdown (`# Heading`, `**bold**`, `*italic*`, `- list`, `&gt; quote`):
            </div>
            <textarea
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              className="w-full min-h-[220px] p-2 border-2 border-black font-mono text-xs bg-yellow-50 focus:bg-white"
            />
            <button
              type="submit"
              className="w-full py-1.5 bg-black text-white text-xs font-serif font-bold uppercase tracking-widest hover:bg-gray-900 cursor-pointer"
            >
              Save Background Notes
            </button>
          </form>
        ) : (
          <MarkdownRenderer content={character.backgroundText || 'No background text written yet.'} />
        )}
      </div>
    </div>
  );
}
