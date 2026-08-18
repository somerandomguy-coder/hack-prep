import { DEFAULT_SOPS } from '../data/defaultSOPs.js';

const STORAGE_KEY = 'shiftflow_sops_kb';

/**
 * Retrieves all active SOPs (combining defaults + user uploaded custom SOPs)
 */
export function getActiveSOPs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load SOPs from localStorage, fallback to default", e);
  }
  
  // Save default SOPs to local storage initial
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SOPS));
  return DEFAULT_SOPS;
}

/**
 * Saves or updates SOP list in localStorage
 */
export function saveSOPs(sopsList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sopsList));
}

/**
 * Simple client-side TF-IDF / Keyword Cosine Similarity Search Engine
 * @param {string} query - Worker voice or text question
 * @returns {object} Top matching SOP with confidence score and card metadata
 */
export function searchSOP(query) {
  const sops = getActiveSOPs();
  if (!query || query.trim() === '') {
    return { sop: sops[0], score: 0, context: sops[0].content };
  }

  const cleanQuery = query.toLowerCase().replace(/[^\w\s]/gi, '');
  const queryTerms = cleanQuery.split(/\s+/).filter(t => t.length > 2);

  let bestMatch = null;
  let highestScore = -1;

  sops.forEach(sop => {
    let score = 0;
    const searchableText = `${sop.title} ${sop.category} ${sop.content} ${(sop.metadata?.tags || []).join(' ')}`.toLowerCase();

    // Title / Tag direct match boosts score heavily
    if (cleanQuery.includes(sop.title.toLowerCase())) score += 10;
    (sop.metadata?.tags || []).forEach(tag => {
      if (cleanQuery.includes(tag.toLowerCase())) score += 5;
    });

    // Keyword match calculation
    queryTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = searchableText.match(regex);
      if (matches) {
        score += matches.length * 1.5;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = sop;
    }
  });

  const matchedSOP = bestMatch || sops[0];
  return {
    sop: matchedSOP,
    score: highestScore,
    context: matchedSOP.content,
    metadata: matchedSOP.metadata
  };
}

/**
 * Add a new Manager-uploaded SOP into local RAG DB
 */
export function addManagerSOP(newSOP) {
  const current = getActiveSOPs();
  const updated = [newSOP, ...current];
  saveSOPs(updated);
  return updated;
}

/**
 * Reset KB back to factory defaults
 */
export function resetToDefaults() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SOPS));
  return DEFAULT_SOPS;
}
