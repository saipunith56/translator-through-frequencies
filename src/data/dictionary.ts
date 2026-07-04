import { DictionaryEntry } from '../types';

export const INITIAL_DICTIONARY: DictionaryEntry[] = [
  // --- ALIEN SECTOR SIGNALS ---
  {
    frequency: 440,
    alienWord: "Klaatu",
    translation: "Greetings / Hello",
    category: "greetings",
    originType: "alien",
    description: "Standard welcome signal broadcasted across deep-space atmospheric sectors."
  },
  {
    frequency: 523,
    alienWord: "Barada",
    translation: "Peace / Harmony",
    category: "concepts",
    originType: "alien",
    description: "Universal structural resonance signaling non-aggression and mutual alignment."
  },
  {
    frequency: 392,
    alienWord: "Nikto",
    translation: "Activate / Begin",
    category: "actions",
    originType: "alien",
    description: "Operational frequency used to trigger autonomous planetary probes."
  },
  {
    frequency: 349,
    alienWord: "Xylar",
    translation: "Warning / Danger",
    category: "warnings",
    originType: "alien",
    description: "High-energy sonic vibration indicating impending stellar flares or magnetic storms."
  },
  {
    frequency: 330,
    alienWord: "Oryx",
    translation: "Star / Solar Core",
    category: "objects",
    originType: "alien",
    description: "Astrological reference key representing main-sequence light emitters."
  },
  {
    frequency: 262,
    alienWord: "Valis",
    translation: "Sanctuary / Home",
    category: "concepts",
    originType: "alien",
    description: "Grounding sub-frequency designating safe planetary coordinates for rest."
  },
  {
    frequency: 587,
    alienWord: "Zalthor",
    translation: "Warp / Distance",
    category: "concepts",
    originType: "alien",
    description: "Relativistic compression signal indicating subspace velocity vectors."
  },
  {
    frequency: 659,
    alienWord: "Vesper",
    translation: "Ally / Biological Friend",
    category: "objects",
    originType: "alien",
    description: "Vocal resonance signature identifying a verified carbon-based friendly agent."
  },
  {
    frequency: 880,
    alienWord: "Kaelis",
    translation: "Goodbye / Safe Travels",
    category: "greetings",
    originType: "alien",
    description: "Harmonic high octave fade used to close transmission gates gracefully."
  },
  {
    frequency: 220,
    alienWord: "Gorgon",
    translation: "Critical Threat / Absolute Danger",
    category: "warnings",
    originType: "alien",
    description: "Sub-audible rumble indicating local dimensional collapse or extreme hostile interference."
  },

  // --- EARTH MAMMALIAN & ANIMAL ACOUSTIC COGNITION SIGNALS ---
  {
    frequency: 25,
    alienWord: "Felis Purr",
    translation: "Serenity & Cellular Healing",
    category: "emotions",
    originType: "terrestrial",
    description: "Feline contentment resonance. Scientific studies prove 25 Hz vibrations promote recovery and calm the nervous system."
  },
  {
    frequency: 180,
    alienWord: "Canis Whimper",
    translation: "Vulnerability / Requesting Comfort",
    category: "emotions",
    originType: "terrestrial",
    description: "Domestic canine high-frequency submissive whimpering, signaling desire for physical touch or reassurance."
  },
  {
    frequency: 400,
    alienWord: "Lupus Howl",
    translation: "Social Assembly & Pack Cohesion",
    category: "social",
    originType: "terrestrial",
    description: "Grey Wolf territorial locator wave designed to carry across vast forest regions to gather pack units."
  },
  {
    frequency: 30,
    alienWord: "Proboscidea Rumble",
    translation: "Long-Range Infrasonic Warning",
    category: "warnings",
    originType: "terrestrial",
    description: "Deep infrasound vibration produced by African Elephants to communicate threat levels up to 10km away through the soil."
  },
  {
    frequency: 1500,
    alienWord: "Delphinid Whistle",
    translation: "Personal Name / Acoustic Identity Tag",
    category: "social",
    originType: "terrestrial",
    description: "Bottlenose Dolphin unique signature whistle. Acts as a personal name identifier for pod members."
  },
  {
    frequency: 60,
    alienWord: "Megaptera Song",
    translation: "Epic Deep-Sea Emotional Chant",
    category: "emotions",
    originType: "terrestrial",
    description: "Humpback Whale acoustic waveform displaying complex repeating verses for biological signaling."
  },
  {
    frequency: 110,
    alienWord: "Panthera Roar",
    translation: "Territorial Dominance / Active Warning",
    category: "warnings",
    originType: "terrestrial",
    description: "Acoustic roar of a male lion, asserting absolute dominance and indicating hostile response if boundaries are breached."
  }
];

export const FREQUENCY_TOLERANCE = 2.5; // Allow matching within ±2.5 Hz

export function findMatchingEntry(frequency: number, dictionary: DictionaryEntry[]): DictionaryEntry | null {
  // Find the closest frequency within the tolerance
  const matches = dictionary.filter(entry => 
    Math.abs(entry.frequency - frequency) <= FREQUENCY_TOLERANCE
  );
  
  if (matches.length === 0) return null;
  
  // Return the closest match if there are multiple
  return matches.reduce((closest, current) => {
    const distCurrent = Math.abs(current.frequency - frequency);
    const distClosest = Math.abs(closest.frequency - frequency);
    return distCurrent < distClosest ? current : closest;
  });
}
