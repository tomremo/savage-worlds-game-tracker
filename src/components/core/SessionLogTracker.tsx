'use client';

import React, { useState } from 'react';
import { useLogStore } from '@/stores/logStore';
import { ActivityType } from '@/types/log';

const MECHANIC_FILTER_OPTIONS: { id: string; label: string; types?: ActivityType[] }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'spells_cast', label: 'Spells', types: ['spells_cast'] },
  { id: 'attacks_made', label: 'Attacks', types: ['attacks_made'] },
  { id: 'wounds_fatigue', label: 'Wounds', types: ['wounds_fatigue'] },
  { id: 'bennies', label: 'Bennies', types: ['bennies'] },
  { id: 'statuses', label: 'Status', types: ['statuses'] },
  { id: 'trait_rolls', label: 'Rolls', types: ['trait_rolls'] },
];

export default function SessionLogTracker() {
  const entries = useLogStore((state) => state.entries || []);
  const addLogEntry = useLogStore((state) => state.addLogEntry);
  const deleteLogEntry = useLogStore((state) => state.deleteLogEntry);
  const clearLogs = useLogStore((state) => state.clearLogs);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDetails, setNoteDetails] = useState('');

  // Filter only mechanic category entries
  const mechanicEntries = entries.filter((e) => e.category === 'mechanic');

  const filteredEntries = mechanicEntries.filter((entry) => {
    // Type Filter
    if (activeFilter !== 'all') {
      const option = MECHANIC_FILTER_OPTIONS.find((o) => o.id === activeFilter);
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

  const handleAddManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addLogEntry({
      category: 'mechanic',
      type: 'adventure_note',
      title: noteTitle.trim(),
      details: noteDetails.trim() || 'Manual session entry',
    });
    setNoteTitle('');
    setNoteDetails('');
    setIsAddingNote(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all session mechanic logs?')) {
      clearLogs('mechanic');
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
        second: '2-digit',
      });
      return `${dateStr}, ${timeStr}`;
    } catch {
      return '';
    }
  }

  const getTypeBadge = (type: ActivityType) => {
    switch (type) {
      case 'spells_cast':
        return <span className="bg-purple-900 text-purple-100 text-[9px] font-mono font-bold px-1.5 py-0.5">SPELL</span>;
      case 'attacks_made':
        return <span className="bg-red-800 text-white text-[9px] font-mono font-bold px-1.5 py-0.5">ATTACK</span>;
      case 'wounds_fatigue':
        return <span className="bg-orange-800 text-white text-[9px] font-mono font-bold px-1.5 py-0.5">WOUNDS</span>;
      case 'bennies':
        return <span className="bg-yellow-600 text-black text-[9px] font-mono font-bold px-1.5 py-0.5">BENNIE</span>;
      case 'statuses':
        return <span className="bg-blue-900 text-blue-100 text-[9px] font-mono font-bold px-1.5 py-0.5">STATUS</span>;
      case 'trait_rolls':
        return <span className="bg-black text-white text-[9px] font-mono font-bold px-1.5 py-0.5">DICE</span>;
      default:
        return <span className="bg-gray-800 text-white text-[9px] font-mono font-bold px-1.5 py-0.5">LOG</span>;
    }
  };

  return (
    <div className="section-container relative">
      <div className="section-header flex items-center justify-between">
        <span>Session Log</span>
        <button
          type="button"
          onClick={() => setIsAddingNote(!isAddingNote)}
          className="text-[10px] bg-red-700 text-white px-2 py-0.5 uppercase tracking-wider font-sans font-bold hover:bg-red-800 cursor-pointer"
        >
          {isAddingNote ? 'Cancel' : '+ Add Note'}
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Search & Date Filter Controls */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search by text or date (e.g. Bolt, Wound, Jul 26, 2026)..."
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

          {/* Activity Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 select-none">
            {MECHANIC_FILTER_OPTIONS.map((opt) => (
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

        {/* Add Manual Action Note Form */}
        {isAddingNote && (
          <form onSubmit={handleAddManualEntry} className="border-2 border-black p-3 bg-yellow-50 space-y-2">
            <div className="text-xs font-serif font-bold uppercase tracking-wider text-black">
              Add Manual Action Log Note
            </div>
            <input
              type="text"
              placeholder="Action Title (e.g. Parried goblin spear)"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-2 py-1 border-2 border-black text-xs bg-white font-sans"
              required
            />
            <textarea
              placeholder="Details / Description"
              value={noteDetails}
              onChange={(e) => setNoteDetails(e.target.value)}
              className="w-full px-2 py-1 border-2 border-black text-xs bg-white font-sans h-14"
            />
            <button
              type="submit"
              className="w-full py-1.5 bg-black text-white text-xs font-serif font-bold uppercase tracking-widest hover:bg-gray-900 cursor-pointer"
            >
              Save Activity Note
            </button>
          </form>
        )}

        {/* History Feed List */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {filteredEntries.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-gray-500 border border-dashed border-gray-400">
              {mechanicEntries.length === 0
                ? 'No session activity recorded yet. Spells, rolls, wounds, and bennies will appear here automatically.'
                : 'No log entries match your search or date filter.'}
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="border-2 border-black bg-white p-2 flex flex-wrap items-start justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="space-y-0.5 flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-500 font-bold">
                      {formatDateTime(entry.timestamp)}
                    </span>
                    {getTypeBadge(entry.type)}
                    <span className="font-serif font-bold uppercase text-xs text-black">
                      {entry.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 font-sans leading-tight pl-0.5">
                    {entry.details}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteLogEntry(entry.id)}
                  className="text-[10px] font-mono text-gray-400 hover:text-red-700 cursor-pointer p-0.5"
                  title="Delete log entry"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats & Clear Button */}
        {mechanicEntries.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-300 text-[10px] font-mono text-gray-600">
            <span>
              Showing {filteredEntries.length} of {mechanicEntries.length} entries
            </span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-red-700 font-bold hover:underline cursor-pointer uppercase"
            >
              Clear Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
