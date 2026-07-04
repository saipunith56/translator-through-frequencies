import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Search, Filter, Music, HelpCircle, Check, Info } from 'lucide-react';
import { DictionaryEntry } from '../types';

interface DictionaryViewProps {
  dictionary: DictionaryEntry[];
  onPlayFrequency: (frequency: number) => void;
  onSelectFrequencyInput?: (frequency: number) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Signals' },
  { id: 'greetings', label: 'Greetings' },
  { id: 'concepts', label: 'Concepts' },
  { id: 'actions', label: 'Actions' },
  { id: 'objects', label: 'Objects' },
  { id: 'warnings', label: 'Warnings' },
  { id: 'emotions', label: 'Emotions / Moods' },
  { id: 'social', label: 'Social Calls' },
  { id: 'custom', label: 'Learned' },
];

export default function DictionaryView({
  dictionary,
  onPlayFrequency,
  onSelectFrequencyInput,
}: DictionaryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOrigin, setSelectedOrigin] = useState<'all' | 'alien' | 'terrestrial'>('all');

  const filteredEntries = useMemo(() => {
    return dictionary.filter((entry) => {
      const matchesSearch =
        entry.alienWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.frequency.toString().includes(searchTerm) ||
        (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || entry.category === selectedCategory;

      const matchesOrigin =
        selectedOrigin === 'all' || entry.originType === selectedOrigin;

      return matchesSearch && matchesCategory && matchesOrigin;
    });
  }, [dictionary, searchTerm, selectedCategory, selectedOrigin]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'greetings':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40';
      case 'concepts':
        return 'bg-indigo-950/40 text-indigo-400 border-indigo-800/40';
      case 'actions':
        return 'bg-amber-950/40 text-amber-400 border-amber-800/40';
      case 'objects':
        return 'bg-cyan-950/40 text-cyan-400 border-cyan-800/40';
      case 'warnings':
        return 'bg-rose-950/40 text-rose-400 border-rose-800/40';
      case 'emotions':
        return 'bg-violet-950/40 text-violet-400 border-violet-800/40';
      case 'social':
        return 'bg-teal-950/40 text-teal-400 border-teal-800/40';
      default:
        return 'bg-slate-950/40 text-slate-400 border-slate-800/40';
    }
  };

  return (
    <div className="bg-[#07090d] rounded-2xl border border-slate-800/80 p-6 shadow-xl flex flex-col h-full" id="dictionary-view-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-serif uppercase tracking-widest text-white" id="dictionary-title">
            Xeno-Lexicon
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
            Registered sonic coordinates and semantic mappings
          </p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#00f5ff]/10 text-[#00f5ff] rounded-full border border-[#00f5ff]/30">
          {dictionary.length} Active Nodes
        </span>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by frequency (Hz), alien word, or translation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0c10] border border-slate-800 rounded-xl text-xs font-mono focus:outline-none focus:border-[#00f5ff]/70 focus:ring-1 focus:ring-[#00f5ff]/10 transition-all text-slate-300 placeholder-slate-600"
            id="dictionary-search"
          />
        </div>

        {/* Origin Filter Tabs */}
        <div className="flex bg-[#030508] border border-slate-900 rounded-lg p-1 gap-1" id="origin-filter-tabs">
          {(['all', 'alien', 'terrestrial'] as const).map((origin) => (
            <button
              key={origin}
              onClick={() => setSelectedOrigin(origin)}
              className={`flex-1 py-1.5 px-3 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer text-center border ${
                selectedOrigin === origin
                  ? 'bg-[#00f5ff]/10 text-[#00f5ff] font-bold border-[#00f5ff]/20 shadow-[0_0_6px_rgba(0,245,255,0.08)]'
                  : 'text-slate-500 hover:text-slate-300 border-transparent'
              }`}
              id={`origin-btn-${origin}`}
            >
              {origin === 'all' ? 'All Origins' : origin === 'alien' ? 'Alien' : 'Mammal/Terrestrial'}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 custom-scrollbar" id="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-[#00f5ff]/15 text-[#00f5ff] border-[#00f5ff]/40 shadow-[0_0_8px_rgba(0,245,255,0.15)]'
                  : 'bg-[#0a0c10] text-slate-500 border-slate-900 hover:bg-slate-900/60 hover:text-slate-300'
              }`}
              id={`filter-btn-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary List */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-[500px] custom-scrollbar" id="dictionary-entries-list">
        <AnimatePresence mode="popLayout">
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.frequency}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                  className="group relative bg-[#080a0f]/50 hover:bg-[#00f5ff]/5 border border-slate-800/50 hover:border-[#00f5ff]/20 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between"
                  id={`dictionary-item-${entry.frequency}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-serif italic text-white tracking-wide font-medium">
                          {entry.alienWord}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-mono tracking-wider uppercase rounded border ${
                          entry.originType === 'alien'
                            ? 'bg-purple-950/40 text-purple-400 border-purple-800/40'
                            : entry.originType === 'terrestrial'
                            ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                            : 'bg-blue-950/40 text-blue-400 border-blue-800/40'
                        }`}>
                          {entry.originType === 'alien' ? 'Alien' : entry.originType === 'terrestrial' ? 'Mammal' : 'Custom'}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-mono tracking-wider uppercase rounded border ${getCategoryColor(entry.category)}`}>
                          {entry.category}
                        </span>
                      </div>
                      <p className="text-xs font-serif text-[#00f5ff] italic">
                        = {entry.translation}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-slate-400 bg-slate-950/70 group-hover:bg-[#00f5ff]/10 px-2 py-1 rounded-md border border-slate-900 transition-colors">
                        {entry.frequency} Hz
                      </span>
                      <button
                        onClick={() => onPlayFrequency(entry.frequency)}
                        className="p-1.5 bg-[#0a0c10] hover:bg-[#00f5ff]/15 border border-slate-800 hover:border-[#00f5ff]/40 text-slate-400 hover:text-[#00f5ff] rounded-lg transition-all shadow-sm cursor-pointer"
                        title="Play Frequency Chime"
                        id={`play-btn-${entry.frequency}`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                      {onSelectFrequencyInput && (
                        <button
                          onClick={() => onSelectFrequencyInput(entry.frequency)}
                          className="px-2 py-1 text-[10px] font-mono bg-[#0a0c10] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-md transition-all shadow-sm cursor-pointer"
                          title="Inject frequency into translator input"
                          id={`inject-btn-${entry.frequency}`}
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </div>

                  {entry.description && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-start gap-1.5 text-[11px] text-slate-400 leading-relaxed font-light italic">
                      <Info className="w-3.5 h-3.5 text-[#00f5ff]/40 shrink-0 mt-0.5" />
                      <span>{entry.description}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
              id="no-entries-fallback"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-950/40 flex items-center justify-center mb-3 border border-slate-800">
                <HelpCircle className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">No signals found</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Try refining your search or select a different coordinate category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
