'use client';

import SpecialAbilities from './SpecialAbilities';
import Background from './Background';
import MoreEdges from './MoreEdges';
import Advances from './Advances';

export default function BackPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Column 1: Special Abilities & Background */}
      <div className="space-y-6 flex flex-col justify-start">
        <SpecialAbilities />
        <Background />
      </div>

      {/* Column 2: More Edges & Advances */}
      <div className="space-y-6 flex flex-col justify-start">
        <MoreEdges />
        <Advances />
      </div>
    </div>
  );
}
