export type LogCategory = 'mechanic' | 'journal';

export type ActivityType =
  // Mechanics activity types
  | 'spells_cast'
  | 'attacks_made'
  | 'wounds_fatigue'
  | 'bennies'
  | 'statuses'
  | 'trait_rolls'
  // Adventure Journal activity types
  | 'npc_met'
  | 'location'
  | 'quest_clue'
  | 'adventure_note';

export interface LogEntry {
  id: string;
  timestamp: number; // ISO epoch ms
  category: LogCategory;
  type: ActivityType;
  title: string;
  details: string;
  tags?: string[];
}
