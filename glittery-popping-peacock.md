# Plan: Wild Card Manager (Savage Worlds)

## Context

Initialize a new private GitHub repo (`savage-worlds`) and build a PWA character sheet manager for the Savage Worlds TTRPG system. The app provides a "Fast, Furious, and Fun" digital companion that minimizes math and bookkeeping during gameplay. The spec covers wound/fatigue tracking, an acing dice engine, inventory, abilities, roll history, and adventure logging — all in a parchment-themed mobile-first UI.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 (mobile-first, parchment theme)
- **State Management**: Zustand (lightweight, persists to localStorage)
- **PWA**: `@serwist/next` (modern service worker tooling for Next.js)
- **Dice**: Crypto.getRandomValues() for PRNG (per spec)
- **Storage**: localStorage via Zustand persist middleware (JSON character data)
- **Testing**: Vitest + React Testing Library (TDD — tests written before implementation)
- **Linting**: ESLint + Prettier (Next.js defaults)

## Development Methodology: Test-Driven Development (TDD)

Every feature follows red-green-refactor:
1. **Red**: Write failing tests first that define expected behavior
2. **Green**: Write minimal code to make tests pass
3. **Refactor**: Clean up while keeping tests green

Test structure mirrors `src/`:
```
__tests__/
├── engine/
│   ├── dice.test.ts          # Dice rolling, acing, wild die logic
│   ├── penalties.test.ts     # Penalty calculation
│   └── derived.test.ts       # Parry, Toughness calculations
├── stores/
│   ├── characterStore.test.ts
│   ├── rollHistoryStore.test.ts
│   └── uiStore.test.ts
├── components/
│   ├── header/               # VitalHeader component tests
│   ├── core/                 # ActiveCore component tests
│   ├── overlay/              # RollResult component tests
│   └── footer/               # Footer tab component tests
└── setup.ts                  # Test setup (jsdom, mocks)
```

## Reference Materials

- Savage Pathfinder Core Rules: `/Users/tomremo/Documents/Savaged Worlds/SW_Pathfinder_Core.pdf`
- Advanced Players Guide: `/Users/tomremo/Documents/Savaged Worlds/Savage Pathfinder Advanced Players Guide v10.pdf`
- (Note: PDFs blocked by macOS permissions during planning — will reference during implementation if access is granted)

## Project Structure

```
savage-worlds/
├── public/
│   ├── manifest.json
│   ├── icons/                    # PWA icons
│   └── sw.js                     # Service worker (generated)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with parchment theme
│   │   ├── page.tsx              # Main character dashboard
│   │   └── globals.css           # Tailwind + parchment theme vars
│   ├── components/
│   │   ├── header/
│   │   │   ├── VitalHeader.tsx   # Top 15% - Bennies + Penalty Badge
│   │   │   ├── BenniePool.tsx    # Interactive coin icons
│   │   │   └── PenaltyBadge.tsx  # Global penalty display
│   │   ├── core/
│   │   │   ├── ActiveCore.tsx    # Middle 50% container
│   │   │   ├── TraitList.tsx     # Attributes & Skills (tappable)
│   │   │   ├── TraitItem.tsx     # Single trait row (tap to roll)
│   │   │   ├── CombatState.tsx   # Right column - wounds/fatigue/status
│   │   │   ├── WoundTracker.tsx  # 0-3 wound counter
│   │   │   ├── FatigueTracker.tsx# 0-2 fatigue counter
│   │   │   └── StatusGrid.tsx    # Shaken, Distracted, etc.
│   │   ├── overlay/
│   │   │   └── RollResult.tsx    # Pop-up with dice math breakdown
│   │   ├── footer/
│   │   │   ├── ManagementFooter.tsx  # Bottom 35% tabbed container
│   │   │   ├── AbilitiesTab.tsx      # Powers & Edges "Short Order"
│   │   │   ├── InventoryTab.tsx      # Gear list + search
│   │   │   ├── LogTab.tsx            # Adventure Log
│   │   │   ├── HistoryTab.tsx        # Session roll history
│   │   │   └── AdvancementTab.tsx    # Leveling progress
│   │   └── ui/
│   │       ├── Modal.tsx         # Reusable confirmation modal
│   │       └── Counter.tsx       # Reusable +/- counter
│   ├── engine/
│   │   ├── dice.ts              # Core dice rolling with acing
│   │   ├── penalties.ts         # Global modifier calculation
│   │   └── derived.ts           # Parry, Toughness calculations
│   ├── stores/
│   │   ├── characterStore.ts    # Character data (Zustand + persist)
│   │   ├── rollHistoryStore.ts  # Session roll log (Zustand, max 100)
│   │   └── uiStore.ts           # Active tab, overlay state
│   ├── types/
│   │   └── character.ts         # TypeScript interfaces for all data
│   └── data/
│       ├── defaultCharacter.ts  # Default/blank character template
│       ├── sampleCharacter.ts   # Astreus Helvetica pre-built character
│       ├── skills.ts            # All skills with linked attributes
│       ├── edges.ts             # All edges with requirements & descriptions
│       ├── hindrances.ts        # All hindrances with severity & descriptions
│       ├── powers.ts            # All powers with rank, PP cost, range, duration
│       ├── ancestries.ts        # Ancestries with racial abilities
│       ├── armor.ts             # Armor catalog with stats
│       ├── weapons.ts           # Weapons catalog with damage, range, AP
│       ├── gear.ts              # General gear/equipment catalog
│       └── classes.ts           # Class edges with requirements
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── .gitignore
```

## Data Model (`types/character.ts`)

```typescript
type DieType = 4 | 6 | 8 | 10 | 12;
type DieModifier = number; // For d12+1, d12+2, etc.
type Rank = "Novice" | "Seasoned" | "Veteran" | "Heroic" | "Legendary";
type StatusCondition = "Shaken" | "Distracted" | "Vulnerable" | "Entangled" | "Bound" | "Stunned";

interface Trait {
  dieType: DieType;
  modifier: DieModifier; // 0 for normal, +1/+2 for d12+1, d12+2
}

interface Skill {
  id: string;
  name: string;
  linkedAttribute: keyof Character["attributes"];
  trait: Trait;
  isCore: boolean;       // Core skills start at d4
  marked: boolean;       // Quick access tray
}

interface Character {
  id: string;
  name: string;
  ancestry: string;      // "Human", "Elf", "Dwarf", "Half-Elf", etc.
  className: string;     // "Ranger", "Wizard", "Cleric", etc.
  rank: Rank;
  experience: number;
  size: number;          // Default 0, range -1 to +3

  // Attributes
  attributes: {
    agility: Trait;
    smarts: Trait;
    spirit: Trait;
    strength: Trait;
    vigor: Trait;
  };

  skills: Skill[];

  // Combat state
  wounds: number;        // 0-3 (Wild Cards take 3 before Incapacitated)
  fatigue: number;       // 0-2 (Fatigued=-1, Exhausted=-2, then Incapacitated)
  bennies: number;       // Default 3 per session
  statuses: StatusCondition[];

  // Derived stats (auto-calculated)
  pace: number;          // Default 6
  parry: number;         // 2 + Fighting/2 (+ shield/weapon bonuses)
  toughness: number;     // 2 + Vigor/2 + armor (torso)

  // Powers & Arcane
  arcaneBackground?: string;  // "Cleric", "Wizard", "Sorcerer", etc.
  arcaneSkill?: string;       // "Faith", "Spellcasting", "Performance", etc.
  powerPoints: { current: number; max: number };
  powers: Power[];
  activePowers: ActivePower[];

  // Edges & Hindrances
  edges: Edge[];
  hindrances: Hindrance[];

  // Inventory
  inventory: InventoryItem[];
  armor: ArmorItem[];
  weapons: Weapon[];
  wealth: number;        // Gold pieces

  // Marks (quick access)
  markedItems: string[];

  // Special abilities (racial/class)
  specialAbilities: SpecialAbility[];

  // Languages
  languages: string[];

  // Advances
  advances: Advance[];

  // Adventure Log
  adventureLog: LogEntry[];
}
```

### Skills Reference (from Savage Pathfinder Core)
Core Skills (start at d4): Athletics (Agility), Common Knowledge (Smarts), Notice (Smarts), Persuasion (Spirit), Stealth (Agility)

All Skills with linked attributes:
- Academics (Smarts), Alchemy (Smarts) [APG], Athletics (Agility), Battle (Smarts)
- Boating (Agility), Common Knowledge (Smarts), Driving (Agility), Faith (Spirit)
- Fighting (Agility), Gambling (Smarts), Healing (Smarts), Intimidation (Spirit)
- Notice (Smarts), Occult (Smarts), Performance (Spirit), Persuasion (Spirit)
- Piloting (Agility), Repair (Smarts), Riding (Agility), Science (Smarts)
- Shooting (Agility), Spellcasting (Smarts), Stealth (Agility), Survival (Smarts)
- Taunt (Smarts), Thievery (Agility)

### Status Conditions Reference
- **Shaken**: Only free actions. Spirit roll to recover (free action at start of turn). Benny to remove instantly.
- **Distracted**: -2 to all Trait rolls until end of next turn.
- **Vulnerable**: Attacks against target at +2 until end of next turn.
- **Entangled**: Can't move, is Distracted.
- **Bound**: Can't move, is Distracted AND Vulnerable, no physical actions except breaking free.
- **Stunned**: Victim is Distracted and Vulnerable, can't take actions until end of next turn.

### Wound/Fatigue Penalty Reference
- Each Wound: -1 to Pace and all Trait rolls (cumulative, max -3 at 3 wounds)
- Fatigued (1 level): -1 to all Trait rolls
- Exhausted (2 levels): -2 to all Trait rolls
- Distracted: -2 to all Trait rolls
- **Global Penalty** = -(wounds) + -(fatigue) + (distracted ? -2 : 0)

### Sample Character: Astreus Helvetica (from PDF)
Used for the pre-populated example character:
- **Name**: Astreus Helvetica, Novice Male Half-Elf Ranger (game warden)
- **Attributes**: Agility d8, Smarts d6, Spirit d6, Strength d8, Vigor d8
- **Skills**: Athletics d6, Common Knowledge d4, Fighting d8, Healing d6, Notice d6, Persuasion d4, Shooting d8, Stealth d8, Survival d8, Unskilled d4-2
- **Derived**: Pace 6, Parry 6, Toughness 10(5) with armor
- **Edges**: Alertness, Ambidextrous, Quick, Ranger, Two-Weapon Fighting
- **Hindrances**: Driven (Major), Quirk (Minor) x2
- **Weapons**: Composite Bow (Str+d6, 12/24/48, AP1), Bastard Sword (Str+d8, AP1), Masterwork Bastard Sword (Str+d8, AP2)
- **Armor**: Aegis Breastplate (+5 torso), Leather Cap (+2 head), Leather Leggings (+2 legs)
- **Special Abilities**: Low Light Vision, Elven Magic, Flexibility, Favored Enemy (Humanoids), Favored Terrain (Forest), Wilderness Stride
- **Languages**: Common, Elven
- **Bennies**: 3, **Wealth**: 105gp

## Core Engine (`engine/dice.ts`)

The dice engine implements Savage Worlds trait roll mechanics:

1. **Roll Trait Die** (d4-d12, with optional +modifier for d12+1, d12+2) using crypto PRNG
2. **Roll Wild Die** (d6) alongside the trait die
3. **Acing**: Both dice explode on max value — re-roll and sum. Can ace multiple times.
4. **Higher of Two**: Take the higher total between Trait Die Total and Wild Die Total
5. **Apply Modifiers**: Add/subtract situational modifiers (e.g., +2 Alertness for Notice)
6. **Apply Global Penalty**: -(wounds) -(fatigue) -(distracted × 2). Applied AFTER acing totals.
7. **Success Detection**: Final result >= TN (default 4) = Success. Each +4 over TN = a Raise.
8. **Critical Failure**: Both Trait die AND Wild Die show natural 1 = Critical Failure (cannot be rerolled).
9. **Unskilled**: If character doesn't have the skill, roll d4 for trait die and subtract 2.
10. **Return full math breakdown** for display and history log (e.g., "Fighting: 11 (8+3) - 2 = 9 (Success)")

### Bennies in dice engine:
- Spending a Benny allows rerolling all dice (new total, keep best unless Critical Failure)
- Spending a Benny instantly removes Shaken status

## Implementation Phases

### Phase 1: Project Initialization
- Create GitHub repo (`gh repo create savage-worlds --private`)
- Initialize Next.js with TypeScript + Tailwind + ESLint
- Install deps: Zustand, Vitest, React Testing Library, @testing-library/jest-dom
- Configure Vitest (vitest.config.ts with jsdom environment)
- Set up project folder structure
- Verify: `npm run test` runs (even with 0 tests), `npm run dev` boots

### Phase 2: Data Model, Types & Resource Files (TDD)
- Define TypeScript interfaces (`types/character.ts`) — Character, Skill, Power, Edge, InventoryItem, RollResult, Weapon, Armor, etc.
- Define resource data types (`types/resources.ts`) — SkillDefinition, EdgeDefinition, PowerDefinition, etc.
- Populate resource files from rulebooks (separate files for easy updates):
  - `data/skills.ts` — all skills with linked attributes, core skill flag
  - `data/edges.ts` — edges with rank requirements, prerequisites, descriptions
  - `data/hindrances.ts` — hindrances with major/minor severity
  - `data/powers.ts` — powers with PP cost, range, duration, rank requirement
  - `data/ancestries.ts` — ancestries with racial abilities and bonuses
  - `data/armor.ts` — armor items with toughness bonus, coverage, weight, cost
  - `data/weapons.ts` — weapons with damage, range, AP, ROF, weight, cost
  - `data/gear.ts` — general equipment with weight, cost, description
  - `data/classes.ts` — class edges with requirements
- Write tests for default/sample character template validation
- Implement default blank character + Astreus Helvetica sample character

### Phase 3: Dice Engine (TDD)
- **Write tests first** for:
  - Single die roll returns value in valid range
  - Acing (exploding): when max is rolled, die re-rolls and sums
  - Wild Die: d6 rolled alongside trait die, higher total wins
  - Penalty application: wounds + fatigue + status modifiers subtracted
  - Raise detection: result >= TN+4 is a raise, >= TN is success, < TN is failure
  - Derived stats: Parry = 2 + Fighting/2, Toughness = 2 + Vigor/2
- Implement `engine/dice.ts`, `engine/penalties.ts`, `engine/derived.ts` to pass all tests

### Phase 4: Stores (TDD)
- **Write tests first** for:
  - Character store: load/save character, modify wounds/fatigue/bennies
  - Roll history store: add entry, cap at 100, clear with confirmation
  - UI store: active tab switching, overlay visibility
- Implement stores with Zustand + persist middleware

### Phase 5: UI Shell & Layout
- Build root layout with parchment theme CSS variables
- Build the 3-zone responsive layout (header, core, footer)
- Build reusable UI components (Modal, Counter)
- Build tab navigation for footer
- Write component render tests

### Phase 6: Vital Header (TDD)
- Write tests for BenniePool (spend/add) and PenaltyBadge (auto-calc)
- Implement components

### Phase 7: Active Core (TDD)
- Write tests for TraitList rendering, tap-to-roll interaction
- Write tests for CombatState (wound/fatigue counters, status toggles)
- Write tests for RollResult overlay (displays math breakdown)
- Implement components and wire to dice engine + stores

### Phase 8: Management Footer Tabs (TDD)
- Write tests then implement each tab:
  1. AbilitiesTab — Powers & Edges list, active power tracking
  2. InventoryTab — searchable gear list
  3. LogTab — Adventure Log with session notes
  4. HistoryTab — roll history list with "Clear All" + confirmation modal
  5. AdvancementTab — XP/rank display

### Phase 9: PWA & Polish
- Configure PWA manifest + service worker
- Add to homescreen support
- Offline caching strategy
- Final parchment theming pass
- Verify: all tests pass, `npm run build` succeeds, app installable on mobile

## Verification

After each phase:
1. `npm run test` — all tests pass (TDD gate)
2. `npm run dev` — app loads without errors

End-to-end checklist:
3. Tap a trait -> dice engine fires, roll result overlay shows with full math
4. Roll history tab populates with each roll
5. Wound/fatigue counters modify global penalty badge
6. Bennies can be spent/added
7. Data persists across page refreshes (localStorage)
8. `npm run build` succeeds with no errors
9. PWA installable on mobile browser
10. All tests green: `npm run test -- --coverage`
