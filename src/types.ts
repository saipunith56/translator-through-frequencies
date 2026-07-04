export interface DictionaryEntry {
  frequency: number; // In Hz
  alienWord: string; // Alien word / Animal call name
  translation: string; // English translation / Emotion meaning
  description?: string; // Additional context / scientific info
  category: 'greetings' | 'actions' | 'concepts' | 'objects' | 'warnings' | 'emotions' | 'social' | 'custom';
  originType: 'alien' | 'terrestrial' | 'custom';
}

export interface TranslationResult {
  id: string;
  frequency: number;
  entry: DictionaryEntry | null;
  status: 'known' | 'unknown';
}
