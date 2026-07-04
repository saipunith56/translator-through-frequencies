import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, RefreshCw, BookOpen, Music } from 'lucide-react';
import { DictionaryEntry } from './types';
import { INITIAL_DICTIONARY } from './data/dictionary';
import { playFrequency } from './utils/audio';
import DictionaryView from './components/DictionaryView';
import TranslatorPanel from './components/TranslatorPanel';

export default function App() {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);

  // Initialize dictionary from localStorage or use default
  useEffect(() => {
    const saved = localStorage.getItem('alien_translator_dictionary');
    if (saved) {
      try {
        setDictionary(JSON.parse(saved));
      } catch (err) {
        console.warn("Failed to parse saved dictionary. Falling back to default.");
        setDictionary(INITIAL_DICTIONARY);
      }
    } else {
      setDictionary(INITIAL_DICTIONARY);
    }
  }, []);

  // Save dictionary to localStorage
  const saveDictionary = (updatedDict: DictionaryEntry[]) => {
    setDictionary(updatedDict);
    localStorage.setItem('alien_translator_dictionary', JSON.stringify(updatedDict));
  };

  const handleLearnFrequency = (newEntry: DictionaryEntry) => {
    // Check if entry with same/extremely close frequency already exists and overwrite it, or append
    const cleaned = dictionary.filter((item) => Math.abs(item.frequency - newEntry.frequency) > 0.1);
    const updated = [...cleaned, newEntry].sort((a, b) => a.frequency - b.frequency);
    saveDictionary(updated);
  };

  const handleResetDictionary = () => {
    if (window.confirm("Restore translator dictionary to original factory coordinates? This will clear all learned signals.")) {
      saveDictionary(INITIAL_DICTIONARY);
    }
  };

  const handlePlayFrequency = (freq: number) => {
    playFrequency(freq, 0.4);
  };

  const handleSelectFrequencyInput = (freq: number) => {
    setSelectedFrequency(freq);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 font-sans selection:bg-[#00f5ff]/20 selection:text-white border-4 md:border-8 border-[#0a0c10]" id="app-root">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-radial from-[#00f5ff]/10 to-transparent pointer-events-none" />

      <header className="border-b border-slate-800/50 bg-[#080a0f] relative z-10" id="app-header">
        <div className="max-w-7xl mx-auto px-6 py-6 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-lg text-[#00f5ff]">
                <Cpu className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#00f5ff] uppercase">
                XENO-ACOUSTIC DECODER // MATRIX v4.0.12
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-white xeno-text-glow">
              Acoustic Signal Translator
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-medium">
              Interstellar & Terrestrial Species Frequency Decoder
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Signal Strength</span>
              <span className="text-xs text-[#00f5ff] font-mono font-bold">98.42%</span>
            </div>
            <button
              onClick={handleResetDictionary}
              className="px-4 py-2.5 bg-transparent hover:bg-[#00f5ff]/10 border border-slate-800 hover:border-[#00f5ff]/50 text-slate-400 hover:text-[#00f5ff] rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
              title="Reset dictionary to factory standards"
              id="reset-dictionary-button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Factory Signals</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 md:px-10 relative z-10" id="app-main">
        {/* Intro banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#07090d]/60 hover:bg-[#07090d]/90 border border-slate-800/80 hover:border-[#00f5ff]/20 rounded-2xl p-6 mb-8 flex items-start gap-4 transition-all duration-300 shadow-lg"
          id="intro-banner"
        >
          <div className="p-3 bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/20 rounded-xl shadow-sm hidden sm:block">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase font-serif">Acoustic & Species Translation Matrix</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
              This neural translation console decodes acoustic signal waveforms (frequencies measured in Hertz) of both interstellar alien species and earthly mammals (like whales, elephants, and felines). It maps pure musical sinusoids to semantic triggers and complex emotions.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl pt-1">
              When an unregistered vibration is encountered, use the <strong className="text-[#00f5ff] underline decoration-[#00f5ff]/40">"Define Signal"</strong> form to teach the translator. Choose the signal's category and origin type (Alien Interstellar vs Terrestrial Mammal) to build a comprehensive cross-species dictionary.
            </p>
          </div>
        </motion.div>

        {/* Dynamic Multi-Column Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="translator-hub">
          {/* Main Console Column */}
          <div className="lg:col-span-7 space-y-6" id="main-console-column">
            <TranslatorPanel
              dictionary={dictionary}
              onLearnFrequency={handleLearnFrequency}
              selectedFrequency={selectedFrequency}
              clearSelectedFrequency={() => setSelectedFrequency(null)}
            />
          </div>

          {/* Dictionary Directory Column */}
          <div className="lg:col-span-5" id="dictionary-directory-column">
            <DictionaryView
              dictionary={dictionary}
              onPlayFrequency={handlePlayFrequency}
              onSelectFrequencyInput={handleSelectFrequencyInput}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-[#050608] mt-20" id="app-footer">
        <div className="max-w-7xl mx-auto px-6 py-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-[#00f5ff]/70" />
            <span>SESSION ID: XG-992-BETA // SECURE DEEP-SPACE CHANNEL</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-mono">
            Universal Translation Matrix v.4.0.12
          </p>
        </div>
      </footer>
    </div>
  );
}
