'use client';

import React, { useState } from 'react';
import { useLogStore } from '@/stores/logStore';
import { ActivityType } from '@/types/log';

const JOURNAL_FILTER_OPTIONS: { id: string; label: string; types?: ActivityType[] }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'npc_met', label: 'NPCs Met', types: ['npc_met'] },
  { id: 'location', label: 'Locations', types: ['location'] },
  { id: 'quest_clue', label: 'Quest Clues', types: ['quest_clue'] },
  { id: 'adventure_note', label: 'Notes', types: ['adventure_note'] },
];

export default function AdventureJournal() {
  const entries = useLogStore((state) => state.entries || []);
  const addLogEntry = useLogStore((state) => state.addLogEntry);
  const deleteLogEntry = useLogStore((state) => state.deleteLogEntry);
  const clearLogs = useLogStore((state) => state.clearLogs);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [entryType, setEntryType] = useState<ActivityType>('npc_met');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryDetails, setEntryDetails] = useState('');

  // Filter only journal category entries
  const journalEntries = entries.filter((e) => e.category === 'journal');

  const filteredEntries = journalEntries.filter((entry) => {
    // Type Filter
    if (activeFilter !== 'all') {
      const option = JOURNAL_FILTER_OPTIONS.find((o) => o.id === activeFilter);
      if (option?.types && !option.types.includes(entry.type)) {
        return false;
      }
    }

    // Specific Date Picker Filter (YYYY-MM-DD)
    if (selectedDate) {
      const entryLocalDate = new Date(entry.timestamp).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (entryLocalDate !== selectedDate) {
        return false;
      }
    }

    // Search Query Filter (Matches title, details, type, or formatted date strings)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const formattedDate = formatDateTime(entry.timestamp).toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchDetails = entry.details.toLowerCase().includes(q);
      const matchType = entry.type.toLowerCase().includes(q);
      const matchDate = formattedDate.includes(q);
      if (!matchTitle && !matchDetails && !matchType && !matchDate) {
        return false;
      }
    }
    return true;
  });

  const handleAddJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim()) return;
    addLogEntry({
      category: 'journal',
      type: entryType,
      title: entryTitle.trim(),
      details: entryDetails.trim() || 'No additional details.',
    });
    setEntryTitle('');
    setEntryDetails('');
    setIsAddingEntry(false);
  };

  const handleClearJournal = () => {
    if (window.confirm('Clear all adventure journal notes?')) {
      clearLogs('journal');
    }
  };

  function formatDateTime(ts: number): string {
    try {
      const d = new Date(ts);
      const dateStr = d.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${dateStr}, ${timeStr}`;
    } catch {
      return '';
    }
  }

  const getJournalBadge = (type: ActivityType) => {
    switch (type) {
      case 'npc_met':
        return <span className="bg-emerald-800 text-white text-[9px] font-mono font-bold px-1.5 py-0.5">NPC MET</span>;
      case 'location':
        return <span className="bg-amber-800 text-white text-[9px] font-mono font-bold px-1.5 py-0.5">LOCATION</span>;
      case 'quest_clue':
        return <span className="bg-indigo-900 text-indigo-100 text-[9px] font-mono font-bold px-1.5 py-0.5">CLUE</span>;
      default:
        return <span className="bg-black text-white text-[9px] font-mono font-bold px-1.5 py-0.5">NOTE</span>;
    }
  };

  return (
    <div className="section-container relative">
      <div className="section-header flex items-center justify-between">
        <span>Adventure Journal</span>
        <button
          type="button"
          onClick={() => setIsAddingEntry(!isAddingEntry)}
          className="text-[10px] bg-red-700 text-white px-2 py-0.5 uppercase tracking-wider font-sans font-bold hover:bg-red-800 cursor-pointer"
        >
          {isAddingEntry ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Search & Date Filter Controls */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search journal notes or date (e.g. Mayor Grak, Sunken Ruins, Jul 26, 2026)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[180px] px-2 py-1.5 border-2 border-black text-xs font-sans bg-white"
            />
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-1 border-2 border-black text-xs font-mono bg-white cursor-pointer"
                title="Filter by exact date"
              />
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className="px-1.5 py-1 bg-red-700 text-white text-[10px] font-mono font-bold cursor-pointer hover:bg-red-800"
                  title="Clear date filter"
                >
                  ✕ Date
                </button>
              )}
            </div>
          </div>

          {/* Journal Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 select-none">
            {JOURNAL_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveFilter(opt.id)}
                className={`px-2 py-0.5 text-[10px] font-serif font-bold uppercase tracking-wider border border-black cursor-pointer ${activeFilter === opt.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Journal Entry Form */}
        {isAddingEntry && (
          <form onSubmit={handleAddJournalEntry} className="border-2 border-black p-3 bg-yellow-50 space-y-2">
            <div className="text-xs font-serif font-bold uppercase tracking-wider text-black">
              New Campaign Journal Entry
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-mono font-bold uppercase">Type:</label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as ActivityType)}
                className="px-2 py-1 border-2 border-black text-xs bg-white font-sans cursor-pointer"
              >
                <option value="npc_met">NPC Met</option>
                <option value="location">Location Discovered</option>
                <option value="quest_clue">Quest Clue / Info</option>
                <option value="adventure_note">General Note</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Title (e.g. Met Lady Vespera at the Keep)"
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              className="w-full px-2 py-1 border-2 border-black text-xs bg-white font-sans"
              required
            />

            <textarea
              placeholder="Notes, dialogue details, or observations..."
              value={entryDetails}
              onChange={(e) => setEntryDetails(e.target.value)}
              className="w-full px-2 py-1 border-2 border-black text-xs bg-white font-sans h-20"
            />

            <button
              type="submit"
              className="w-full py-1.5 bg-black text-white text-xs font-serif font-bold uppercase tracking-widest hover:bg-gray-900 cursor-pointer"
            >
              Save Journal Entry
            </button>
          </form>
        )}

        {/* Journal Entries List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredEntries.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-gray-500 border border-dashed border-gray-400">
              {journalEntries.length === 0
                ? 'No campaign journal entries recorded yet. Click "+ New Journal Entry" to log NPCs, locations, or quest notes.'
                : 'No journal notes match your search or date filter.'}
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="border-2 border-black bg-white p-3 space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getJournalBadge(entry.type)}
                    <span className="font-serif font-extrabold uppercase text-xs text-black">
                      {entry.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-500 font-bold">
                      {formatDateTime(entry.timestamp)}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteLogEntry(entry.id)}
                      className="text-[10px] font-mono text-gray-400 hover:text-red-700 cursor-pointer"
                      title="Delete entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-800 font-sans whitespace-pre-wrap leading-normal pt-1">
                  {entry.details}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats & Clear Button */}
        {journalEntries.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-300 text-[10px] font-mono text-gray-600">
            <span>
              Showing {filteredEntries.length} of {journalEntries.length} journal notes
            </span>
            <button
              type="button"
              onClick={handleClearJournal}
              className="text-red-700 font-bold hover:underline cursor-pointer uppercase"
            >
              Clear Journal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
