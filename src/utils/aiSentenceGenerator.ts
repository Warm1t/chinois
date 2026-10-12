import { CuratedWordSentenceEntry } from '../data/curatedWordSentences';
import { getStoredAiApiKey } from './aiStoryGenerator';

const AI_SENTENCES_CACHE_KEY = 'fluent_ai_sentences_cache';

/**
 * Récupère le cache local de toutes les phrases générées par IA pour les mots Anki
 */
export const getAllCachedAiSentences = (): Record<string, CuratedWordSentenceEntry[]> => {
  try {
    const raw = localStorage.getItem(AI_SENTENCES_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Récupère les phrases IA déjà enregistrées en cache pour un mot spécifique
 */
export const getCachedAiSentences = (wordHanzi: string): CuratedWordSentenceEntry[] => {
  if (!wordHanzi) return [];
  const cache = getAllCachedAiSentences();
  return cache[wordHanzi.trim()] || [];
};

/**
 * Sauvegarde les phrases d'un mot dans le cache local
 */
export const saveCachedAiSentences = (wordHanzi: string, entries: CuratedWordSentenceEntry[]): void => {
  if (!wordHanzi || !entries || entries.length === 0) return;
  try {
    const cache = getAllCachedAiSentences();
    cache[wordHanzi.trim()] = entries;
    localStorage.setItem(AI_SENTENCES_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Erreur sauvegarde cache phrases IA :', e);
  }
};

/**
 * Génère 1 à 2 phrases d'exemples authentiques et concrètes avec l'API Google Gemini
 */
export const generateAiSentencesForWord = async (
  wordHanzi: string,
  wordTranslation?: string,
  apiKeyOverride?: string
): Promise<CuratedWordSentenceEntry[]> => {
  const cleanHanzi = wordHanzi.trim();
  if (!cleanHanzi) return [];

  // Vérifier le cache d'abord
  const cached = getCachedAiSentences(cleanHanzi);
  if (cached.length > 0) {
    return cached;
  }

  const apiKey = (apiKeyOverride || getStoredAiApiKey()).trim();
  if (!apiKey) {
    throw new Error("Clé API Gemini requise pour la génération IA. Tu peux configurer ta clé gratuite dans les paramètres ou l'onglet Histoires.");
  }

  const promptText = `Tu es un professeur natif de chinois mandarin (Putonghua standard).
Génère impérativement 1 à 2 phrases d'exemples concrètes, vivantes et naturelles du quotidien en chinois mandarin pour le mot de vocabulaire cible : "${cleanHanzi}" (${wordTranslation || ''}).

Consignes strictes :
1. Chaque phrase doit intégrer directement et naturellement le mot "${cleanHanzi}" dans une vraie situation de la vie courante (travail, commande au restaurant, voyage, vie sociale, émotions, maison, santé).
2. INTERDICTION ABSOLUE de formuler des phrases méta-linguistiques ou des citations telles que "j'utilise ce mot", "ce mot signifie", "peux-tu me donner un exemple avec ce mot". Le mot doit être utilisé directement en contexte comme par un locuteur natif.
3. Niveau de difficulté : Chinois contemporain clair (niveau HSK 2 à HSK 4).
4. Pinyin complet avec marques de tons rigoureuses sur chaque syllabe.
5. Traduction française naturelle, fluide et fidèle.
6. Catégorie parmi : "social", "work", "restaurant", "transport", "shopping", "health", "housing", "reactions".

Format JSON strict requis (tableau de 1 à 2 objets) :
[
  {
    "hanzi": "Phrase complète en chinois avec ponctuation chinoise",
    "pinyin": "Pinyin complet de la phrase avec ponctuation",
    "french": "Traduction française fidèle et naturelle",
    "situation": "Description courte de la situation réelle (ex: Déjeuner entre collègues)",
    "category": "work"
  }
]`;

  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData?.error?.message || `Erreur HTTP ${response.status}`;
        throw new Error(`[${model}] ${msg}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Réponse vide de l'IA.");

      const cleanJson = rawText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Format JSON inattendu (tableau attendu).");
      }

      const validEntries: CuratedWordSentenceEntry[] = [];
      for (const item of parsed) {
        if (item.hanzi && item.pinyin && item.french) {
          validEntries.push({
            hanzi: item.hanzi.trim(),
            pinyin: item.pinyin.trim(),
            french: item.french.trim(),
            situation: (item.situation || `Mise en contexte de « ${cleanHanzi} »`).trim(),
            category: (item.category || 'social') as any,
          });
        }
      }

      if (validEntries.length > 0) {
        saveCachedAiSentences(cleanHanzi, validEntries);
        return validEntries;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Échec de la génération des phrases d'exemples.");
};

