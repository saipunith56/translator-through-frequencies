import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, AlertTriangle, Cpu, HelpCircle, Check, Send, Volume2, Sparkles } from 'lucide-react';
import { DictionaryEntry, TranslationResult } from '../types';
import { findMatchingEntry, FREQUENCY_TOLERANCE } from '../data/dictionary';
import { playFrequency } from '../utils/audio';

interface TranslatorPanelProps {
  dictionary: DictionaryEntry[];
  onLearnFrequency: (entry: DictionaryEntry) => void;
  selectedFrequency: number | null;
  clearSelectedFrequency: () => void;
}

const PRESETS = [
  {
    name: "Standard Alliance Greeting",
    frequencies: "440, 523, 659",
    description: "Klaatu - Barada - Vesper (Greetings, Peace, Ally)"
  },
  {
    name: "Earth Mammal Acoustic Wave",
    frequencies: "25, 400, 1500",
    description: "Cat Purr (Contentment) - Wolf Howl (Assembly) - Dolphin Whistle (Identity)"
  },
  {
    name: "Mixed Biome Signal Train",
    frequencies: "523, 30, 349, 60",
    description: "Barada (Peace) - Elephant (Rumble) - Xylar (Danger) - Whale (Chant)"
  }
];

export default function TranslatorPanel({
  dictionary,
  onLearnFrequency,
  selectedFrequency,
  clearSelectedFrequency,
}: TranslatorPanelProps) {
  const [inputValue, setInputValue] = useState('440, 523, 659');
  const [results, setResults] = useState<TranslationResult[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlayIndex, setActivePlayIndex] = useState<number | null>(null);

  // Form states for learning a new frequency
  const [learningFreq, setLearningFreq] = useState<number | null>(null);
  const [alienWord, setAlienWord] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [category, setCategory] = useState<'greetings' | 'actions' | 'concepts' | 'objects' | 'warnings' | 'emotions' | 'social' | 'custom'>('custom');
  const [originType, setOriginType] = useState<'alien' | 'terrestrial' | 'custom'>('alien');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle selected frequency injection from the dictionary list
  useEffect(() => {
    if (selectedFrequency !== null) {
      setInputValue((prev) => {
        const trimmed = prev.trim();
        if (!trimmed) return String(selectedFrequency);
        // Append with a comma if it doesn't already end with a comma
        return trimmed.endsWith(',') ? `${prev} ${selectedFrequency}` : `${prev}, ${selectedFrequency}`;
      });
      clearSelectedFrequency();
    }
  }, [selectedFrequency, clearSelectedFrequency]);

  // Parse and translate inputs
  const handleTranslate = (frequenciesStr: string = inputValue) => {
    const rawMatches = frequenciesStr.match(/(\d+(\.\d+)?)/g);
    if (!rawMatches) {
      setResults([]);
      return;
    }

    const parsedFreqs = rawMatches
      .map((n) => parseFloat(n))
      .filter((n) => n > 0 && n <= 20000);

    const translationResults: TranslationResult[] = parsedFreqs.map((freq, idx) => {
      const match = findMatchingEntry(freq, dictionary);
      return {
        id: `${freq}-${idx}`,
        frequency: freq,
        entry: match,
        status: match ? 'known' : 'unknown',
      };
    });

    setResults(translationResults);

    // Play the translated musical sequence
    playSequence(parsedFreqs);
  };

  const playSequence = (frequencies: number[]) => {
    if (frequencies.length === 0) return;
    setIsPlaying(true);
    let index = 0;

    const playNext = () => {
      if (index < frequencies.length) {
        setActivePlayIndex(index);
        playFrequency(frequencies[index], 0.38);
        index++;
        setTimeout(playNext, 450);
      } else {
        setIsPlaying(false);
        setActivePlayIndex(null);
      }
    };

    playNext();
  };

  const handleLearnSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (learningFreq === null || !alienWord.trim() || !englishTranslation.trim()) return;

    const newEntry: DictionaryEntry = {
      frequency: learningFreq,
      alienWord: alienWord.trim(),
      translation: englishTranslation.trim(),
      category,
      originType,
      description: description.trim() || `User-defined frequency coordinate registered in transit.`,
    };

    onLearnFrequency(newEntry);
    setIsSuccess(true);

    // Reset forms
    setTimeout(() => {
      setLearningFreq(null);
      setAlienWord('');
      setEnglishTranslation('');
      setCategory('custom');
      setOriginType('alien');
      setDescription('');
      setIsSuccess(false);
      // Re-trigger translation so the updated dictionary matches the frequency immediately
      handleTranslate();
    }, 1200);
  };

  const loadPreset = (frequencies: string) => {
    setInputValue(frequencies);
    handleTranslate(frequencies);
  };

  return (
    <div className="space-y-6" id="translator-panel-root">
      {/* Input Console */}
      <div className="bg-[#07090d] rounded-2xl border border-slate-800/80 p-6 shadow-xl relative overflow-hidden" id="input-console-card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-lg text-[#00f5ff]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-serif uppercase tracking-widest text-white">Signal Input Console</h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Provide a list of musical frequencies in Hertz (Hz)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 mb-2">
              Frequency Signal Train
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 440, 523, 659, 880"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0c10] border border-slate-800 rounded-xl text-base font-mono focus:outline-none focus:border-[#00f5ff]/70 focus:ring-1 focus:ring-[#00f5ff]/10 transition-all text-[#00f5ff] placeholder-slate-700"
                id="frequency-input-field"
              />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mt-2">
              Format: list of numbers separated by commas, spaces, or lines. (E.g. A4 = 440 Hz, C5 = 523 Hz)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => handleTranslate()}
              disabled={isPlaying || !inputValue.trim()}
              className="flex-1 py-3.5 px-5 bg-[#00f5ff]/10 hover:bg-[#00f5ff]/25 disabled:bg-slate-900 border border-[#00f5ff]/40 hover:border-[#00f5ff]/80 text-[#00f5ff] disabled:text-slate-700 disabled:border-slate-800 font-mono text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_12px_rgba(0,245,255,0.1)] flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
              id="translate-button"
            >
              <Cpu className="w-4 h-4" />
              <span>Decode & Play Transmission</span>
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800/50">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2.5">
            Suggested Deep-Space Beacon Signals
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5" id="presets-container">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(preset.frequencies)}
                className="p-3 text-left border border-slate-800 bg-[#0a0c10]/70 hover:bg-[#00f5ff]/5 hover:border-[#00f5ff]/30 rounded-xl transition-all group cursor-pointer"
                id={`preset-btn-${idx}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#00f5ff]" />
                  <span className="text-xs font-serif text-white group-hover:text-[#00f5ff] transition-colors">
                    {preset.name}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#00f5ff]/80 font-medium mb-1">
                  [{preset.frequencies}]
                </p>
                <p className="text-[10px] text-slate-400 font-light italic leading-normal line-clamp-1">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizer & Decoded Streams */}
      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
            id="translation-results-container"
          >
            {/* Decoded Output Header */}
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-serif tracking-widest text-slate-400 uppercase">
                Decoded Semantic Stream
              </h3>
              {isPlaying && (
                <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#00f5ff]">
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  Streaming Audio Signals...
                </span>
              )}
            </div>

            {/* Signal Sequence Blocks */}
            <div className="grid grid-cols-1 gap-3" id="results-grid">
              {results.map((res, index) => {
                const isActive = activePlayIndex === index;
                const isMatched = res.status === 'known';

                return (
                  <motion.div
                    key={res.id}
                    layoutId={`result-block-${res.id}`}
                    className={`border rounded-2xl p-4 transition-all duration-300 relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isActive
                        ? 'border-[#00f5ff]/60 bg-[#00f5ff]/5 shadow-[0_0_15px_rgba(0,245,255,0.2)] ring-1 ring-[#00f5ff]/30'
                        : isMatched
                        ? 'border-slate-800/80 bg-[#07090d] shadow-md'
                        : 'border-amber-800/40 bg-amber-950/5 shadow-sm'
                    }`}
                    id={`result-item-${index}`}
                  >
                    {/* Left details */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          #{index + 1}
                        </span>
                        <div className="mt-2 text-sm font-mono font-bold text-white">
                          {res.frequency} <span className="text-[10px] text-[#00f5ff]">Hz</span>
                        </div>
                      </div>

                      <div className="h-10 w-[1px] bg-slate-800/50 self-center hidden md:block"></div>

                      <div className="space-y-1">
                        {isMatched && res.entry ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-serif italic text-white font-medium">
                                {res.entry.alienWord}
                              </span>
                              <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase rounded bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30">
                                {res.entry.category}
                              </span>
                              {Math.abs(res.entry.frequency - res.frequency) > 0.1 && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  (Matched within {FREQUENCY_TOLERANCE}Hz)
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-serif text-[#00f5ff]">
                              Meaning: "{res.entry.translation}"
                            </p>
                            {res.entry.description && (
                              <p className="text-xs text-slate-400 leading-relaxed max-w-xl font-light italic">
                                {res.entry.description}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-amber-500 font-semibold">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span className="text-sm font-serif">New Frequency Detected!</span>
                            </div>
                            <p className="text-xs text-slate-300 max-w-xl font-medium mt-1">
                              I have no acoustic mapping registered for <span className="text-[#00f5ff] font-mono">{res.frequency} Hz</span>. Please define the alien word or mammal call and its emotional/semantic translation below to expand our collective archives!
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right side interaction */}
                    <div className="flex items-center justify-end gap-2 self-end md:self-auto">
                      <button
                        onClick={() => playFrequency(res.frequency, 0.45)}
                        className="p-2 bg-[#0a0c10] hover:bg-[#00f5ff]/15 border border-slate-800 hover:border-[#00f5ff]/40 text-slate-400 hover:text-[#00f5ff] rounded-xl transition-all shadow-sm cursor-pointer"
                        title="Replay this coordinate alone"
                        id={`replay-item-btn-${index}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {!isMatched && (
                        <button
                          onClick={() => {
                            setLearningFreq(res.frequency);
                          }}
                          className="px-3 py-1.5 bg-transparent hover:bg-amber-500/10 border border-amber-800/60 hover:border-amber-500 text-amber-500 hover:text-amber-400 font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                          id={`define-btn-${res.frequency}`}
                        >
                          Define Signal
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaching / Dictionary Learning Portal */}
      <AnimatePresence>
        {learningFreq !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            id="teaching-portal-outer"
          >
            <div className="bg-[#0a0c10]/80 border border-amber-800/40 rounded-2xl p-6 animate-pulse" id="teaching-portal-card" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-950/50 text-amber-500 border border-amber-800/30 rounded-lg">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-serif tracking-wide">
                    Translate Coordinate: {learningFreq} Hz
                  </h3>
                  <p className="text-xs text-slate-400">
                    Map this unknown musical resonance to the alien dictionary.
                  </p>
                </div>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-950/20 border border-emerald-800/50 rounded-xl p-6 flex flex-col items-center text-center justify-center space-y-2"
                  id="teaching-success-feedback"
                >
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-400">Coordinate Mapping Successful!</h4>
                  <p className="text-xs text-emerald-500 font-mono">
                    The alien translator has acquired the linguistic coordinate. Integrating into data banks...
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleLearnSubmit} className="space-y-4" id="learn-frequency-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
                        Alien Word / Animal Call <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Valthor, Felis Purr"
                        value={alienWord}
                        onChange={(e) => setAlienWord(e.target.value)}
                        className="w-full px-3 py-2 bg-[#050608] border border-slate-800 text-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/15 font-semibold"
                        id="form-alien-word"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
                        English Translation / Emotion <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Serenity, Danger, Deep Alert"
                        value={englishTranslation}
                        onChange={(e) => setEnglishTranslation(e.target.value)}
                        className="w-full px-3 py-2 bg-[#050608] border border-slate-800 text-teal-400 rounded-xl text-sm focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/15 font-semibold"
                        id="form-english-translation"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
                        Cosmic Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#050608] border border-slate-800 text-slate-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/15 font-medium cursor-pointer"
                        id="form-category-select"
                      >
                        <option value="custom">Learned Signal (Default)</option>
                        <option value="greetings">Greetings & Introductions</option>
                        <option value="concepts">Abstract Concepts</option>
                        <option value="actions">Command / Actions</option>
                        <option value="objects">Celestial Entities / Objects</option>
                        <option value="warnings">Threat / Danger / Warnings</option>
                        <option value="emotions">Acoustic Emotions / Moods</option>
                        <option value="social">Social Calls / Group Bonding</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
                        Signal Origin Type
                      </label>
                      <select
                        value={originType}
                        onChange={(e) => setOriginType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#050608] border border-slate-800 text-slate-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/15 font-medium cursor-pointer"
                        id="form-origin-select"
                      >
                        <option value="alien">Interstellar / Alien</option>
                        <option value="terrestrial">Terrestrial / Earth Mammal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
                        Linguistic Description / Origin
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Feline vibration promoting tissue recovery..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-[#050608] border border-slate-800 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/15"
                        id="form-description"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setLearningFreq(null)}
                      className="px-4 py-2 bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer font-mono"
                      id="cancel-learn-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-950/40 border border-amber-800 hover:bg-amber-500/25 hover:border-amber-500 text-amber-400 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer font-mono uppercase tracking-wider"
                      id="submit-learn-btn"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Commit to Memory</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
