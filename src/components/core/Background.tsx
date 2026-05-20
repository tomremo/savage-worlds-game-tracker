'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function Background() {
  const character = useCharacterStore((state) => state.character);
  const text = character.backgroundText || '';

  // Separate paragraphs
  const paragraphs = text.split('\n\n');

  return (
    <div className="section-container bg-white text-black h-full flex flex-col">
      <div className="section-header">Background</div>
      <div className="p-4 space-y-4 text-xs leading-relaxed text-gray-900 select-none flex-grow">
        {paragraphs.map((p, idx) => {
          // If paragraph is a heading like "Kaelen Crowfoot..." style it bold
          if (p.startsWith('Kaelen Crowfoot')) {
            return (
              <div key={idx} className="font-extrabold text-sm text-black pt-2 text-center md:text-left">
                {p}
              </div>
            );
          }
          return (
            <p key={idx} className="text-[0.78rem] text-justify font-sans">
              {p}
            </p>
          );
        })}
      </div>
    </div>
  );
}
