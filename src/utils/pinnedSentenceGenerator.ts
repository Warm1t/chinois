import { AnkiWord } from '../types/fluent';
import { EverydayPhrase, EVERYDAY_PHRASES } from '../data/everydayPhrasesData';
import { BUILT_IN_STORIES } from '../data/storiesData';
import { NUANCE_CARDS } from '../data/curriculumData';
import { CURATED_SENTENCES_BY_KEYWORD, CuratedWordSentenceEntry } from '../data/curatedWordSentences';
import { getCachedAiSentences } from './aiSentenceGenerator';

export interface PinnedWordSentenceOption {
  id: string;
  wordHanzi: string;
  wordPinyin: string;
  wordTranslation: string;
  phrase: EverydayPhrase;
}

export interface WordExampleSentence {
  id: string;
  hanzi: string;
  pinyin: string;
  french: string;
  sourceType: 'curated' | 'story' | 'everyday' | 'curriculum' | 'custom' | 'ai' | 'pattern';
  sourceLabel?: string;
  situation?: string;
  tip?: string;
}

/**
 * Nettoie une chaîne de ponctuation pour la recherche
 */
const cleanWord = (text: string) => text.trim().replace(/[.,!?;:，。！？；：“”‘’"']/g, '');

/**
 * Génère 1 à 2 phrases d'exemples authentiques et vivantes du quotidien pour un mot donné.
 * Priorise :
 * 1. Phrase d'exemple enregistrée sur la carte Anki
 * 2. Dictionnaire riche de phrases natives (CURATED_SENTENCES_BY_KEYWORD)
 * 3. Phrases réelles des Histoires Immersives (BUILT_IN_STORIES)
 * 4. Phrases réelles des Cours et Dialogues de Grammaire (NUANCE_CARDS)
 * 5. Phrases réelles du Quotidien (EVERYDAY_PHRASES)
 * 6. Phrases générées par IA déjà en cache local
 * 
 * AUCUN patron méta-linguistique générique ("Dans la vie quotidienne j'utilise ce mot").
 */
export const generateSentencesForWord = (word: AnkiWord): EverydayPhrase[] => {
  const cleanHanzi = cleanWord(word.hanzi);
  const cleanPinyin = (word.pinyin || '').trim();
  const cleanTranslation = (word.translation || cleanHanzi).trim();
  const results: EverydayPhrase[] = [];
  const seenHanzi = new Set<string>();

  if (!cleanHanzi) return [];

  // A. Si le mot a déjà un exemple personnalisé enregistré sur la carte
  if (word.exampleSentence && word.exampleSentence.trim().length > 0) {
    const customHanzi = word.exampleSentence.trim();
    seenHanzi.add(customHanzi);
    results.push({
      id: `gen-${word.id}-custom-example`,
      category: 'social',
      categoryLabel: 'Exemple Enregistré sur la Carte',
      categoryIcon: '⭐',
      hanzi: customHanzi,
      pinyin: (word.examplePinyin || '').trim() || cleanPinyin,
      french: (word.exampleTranslation || '').trim() || `Exemple concret lié à « ${cleanHanzi} »`,
      situation: `Exemple actif sur la carte Anki`,
      tip: `Mot cible : ${cleanHanzi} (${cleanPinyin})`,
      difficulty: 'Indispensable',
    });
  }

  // B. Dictionnaire de phrases authentiques rédigées à la main (1-2 phrases maximum)
  if (CURATED_SENTENCES_BY_KEYWORD[cleanHanzi]) {
    for (const entry of CURATED_SENTENCES_BY_KEYWORD[cleanHanzi]) {
      if (!seenHanzi.has(entry.hanzi) && results.length < 2) {
        seenHanzi.add(entry.hanzi);
        results.push({
          id: `gen-${word.id}-curated-${results.length}`,
          category: entry.category,
          categoryLabel: getCategoryLabel(entry.category),
          categoryIcon: getCategoryIcon(entry.category),
          hanzi: entry.hanzi,
          pinyin: entry.pinyin,
          french: entry.french,
          situation: entry.situation,
          tip: entry.tip || `Contient : ${cleanHanzi}`,
          difficulty: 'Courant',
        });
      }
    }
  }

  // C. Cache des phrases générées par IA pour ce mot
  if (results.length < 2) {
    const aiCached = getCachedAiSentences(cleanHanzi);
    for (const entry of aiCached) {
      if (!seenHanzi.has(entry.hanzi) && results.length < 2) {
        seenHanzi.add(entry.hanzi);
        results.push({
          id: `gen-${word.id}-ai-${results.length}`,
          category: entry.category,
          categoryLabel: 'Généré par IA',
          categoryIcon: '✨',
          hanzi: entry.hanzi,
          pinyin: entry.pinyin,
          french: entry.french,
          situation: entry.situation,
          tip: `Phrase sur mesure pour : ${cleanHanzi}`,
          difficulty: 'Courant',
        });
      }
    }
  }

  // D. Recherche dans les histoires immersives réelles (BUILT_IN_STORIES)
  if (results.length < 2) {
    for (const story of BUILT_IN_STORIES) {
      for (const p of story.paragraphs) {
        for (const s of p.sentences) {
          if (s.hanzi.includes(cleanHanzi) && !seenHanzi.has(s.hanzi) && results.length < 2) {
            seenHanzi.add(s.hanzi);
            results.push({
              id: `gen-${word.id}-story-${story.id}-${results.length}`,
              category: 'social',
              categoryLabel: `Histoire : ${story.title}`,
              categoryIcon: '📖',
              hanzi: s.hanzi,
              pinyin: s.pinyin,
              french: s.translation,
              situation: `Extrait de l'histoire « ${story.title} »`,
              tip: `Contexte immersif authentique`,
              difficulty: 'Courant',
            });
            if (results.length >= 2) break;
          }
        }
        if (results.length >= 2) break;
      }
      if (results.length >= 2) break;
    }
  }

  // E. Recherche dans les cours et dialogues de grammaire (NUANCE_CARDS)
  if (results.length < 2) {
    for (const card of NUANCE_CARDS) {
      // 1. Phrase cible du cours
      if (card.targetChinese.includes(cleanHanzi) && !seenHanzi.has(card.targetChinese)) {
        seenHanzi.add(card.targetChinese);
        results.push({
          id: `gen-${word.id}-lesson-target-${card.id}`,
          category: 'work',
          categoryLabel: `Cours : ${card.title}`,
          categoryIcon: '🎓',
          hanzi: card.targetChinese,
          pinyin: card.targetPinyin,
          french: card.translationFrench,
          situation: card.situationFrench || `Exemple clé du cours « ${card.title} »`,
          tip: `Formule : ${card.structuralFormula}`,
          difficulty: 'Indispensable',
        });
        if (results.length >= 2) break;
      }

      // 2. Exemples additionnels du cours
      if (card.additionalExamples) {
        for (const ex of card.additionalExamples) {
          if (ex.chinese.includes(cleanHanzi) && !seenHanzi.has(ex.chinese)) {
            seenHanzi.add(ex.chinese);
            results.push({
              id: `gen-${word.id}-lesson-add-${card.id}-${results.length}`,
              category: 'social',
              categoryLabel: `Cours : ${card.title}`,
              categoryIcon: '🎓',
              hanzi: ex.chinese,
              pinyin: ex.pinyin,
              french: ex.translation,
              situation: ex.contextNote || `Mise en pratique du cours « ${card.title} »`,
              difficulty: 'Courant',
            });
            if (results.length >= 2) break;
          }
        }
      }
      if (results.length >= 2) break;

      // 3. Lignes de dialogue du cours
      if (card.dialogue) {
        for (const line of card.dialogue) {
          if (line.chinese.includes(cleanHanzi) && !seenHanzi.has(line.chinese)) {
            seenHanzi.add(line.chinese);
            results.push({
              id: `gen-${word.id}-lesson-dialogue-${card.id}-${results.length}`,
              category: 'social',
              categoryLabel: `Dialogue : ${card.title}`,
              categoryIcon: '💬',
              hanzi: line.chinese,
              pinyin: line.pinyin,
              french: line.translation,
              situation: `Dialogue naturel (${line.speaker})`,
              difficulty: 'Courant',
            });
            if (results.length >= 2) break;
          }
        }
      }
      if (results.length >= 2) break;
    }
  }

  // F. Recherche dans les phrases pratiques du quotidien (EVERYDAY_PHRASES)
  if (results.length < 2) {
    for (const phrase of EVERYDAY_PHRASES) {
      if (phrase.hanzi.includes(cleanHanzi) && !seenHanzi.has(phrase.hanzi)) {
        seenHanzi.add(phrase.hanzi);
        results.push({
          id: `gen-${word.id}-everyday-${phrase.id}`,
          category: phrase.category,
          categoryLabel: phrase.categoryLabel,
          categoryIcon: phrase.categoryIcon,
          hanzi: phrase.hanzi,
          pinyin: phrase.pinyin,
          french: phrase.french,
          situation: phrase.situation,
          tip: phrase.tip,
          difficulty: phrase.difficulty,
        });
        if (results.length >= 2) break;
      }
    }
  }

  // G. Recherche par correspondance partielle dans le dictionnaire de phrases (ex: mot composé)
  if (results.length < 2 && cleanHanzi.length >= 2) {
    for (const [key, entries] of Object.entries(CURATED_SENTENCES_BY_KEYWORD)) {
      if (key !== cleanHanzi && (key.includes(cleanHanzi) || cleanHanzi.includes(key))) {
        for (const entry of entries) {
          if (entry.hanzi.includes(cleanHanzi) && !seenHanzi.has(entry.hanzi)) {
            seenHanzi.add(entry.hanzi);
            results.push({
              id: `gen-${word.id}-sub-${results.length}`,
              category: entry.category,
              categoryLabel: getCategoryLabel(entry.category),
              categoryIcon: getCategoryIcon(entry.category),
              hanzi: entry.hanzi,
              pinyin: entry.pinyin,
              french: entry.french,
              situation: entry.situation,
              tip: entry.tip || `Emploi naturel lié à « ${cleanHanzi} »`,
              difficulty: 'Courant',
            });
            if (results.length >= 2) break;
          }
        }
      }
      if (results.length >= 2) break;
    }
  }

  // Retourne exactement 1 à 2 phrases authentiques (ou tableau vide si aucun exemple authentique trouvé).
  // JAMAIS de faux patron passe-partout.
  return results.slice(0, 2);
};

/**
 * Génère toutes les options de phrases pour une collection entière de mots épinglés.
 */
export const generateSentencesForAllPinnedWords = (words: AnkiWord[]): PinnedWordSentenceOption[] => {
  const all: PinnedWordSentenceOption[] = [];

  words.forEach(word => {
    const phrases = generateSentencesForWord(word);
    phrases.forEach(phrase => {
      all.push({
        id: phrase.id,
        wordHanzi: word.hanzi,
        wordPinyin: word.pinyin || '',
        wordTranslation: word.translation || '',
        phrase
      });
    });
  });

  return all;
};

/**
 * Recherche et génère des phrases d'exemple authentiques contenant un mot spécifique.
 * Idéal pour afficher sur le bandeau de définition dans les histoires ou les listes.
 */
export const getWordExampleSentences = (
  word: { hanzi: string; pinyin?: string; translation?: string },
  currentSentenceHanzi?: string
): WordExampleSentence[] => {
  const cleanHanzi = cleanWord(word.hanzi);
  const cleanPinyin = (word.pinyin || '').trim();
  const cleanTranslation = (word.translation || cleanHanzi).trim();
  const results: WordExampleSentence[] = [];
  const seenHanzi = new Set<string>();

  if (!cleanHanzi) return [];

  // Exclure la phrase actuelle si fournie pour ne pas répéter ce que l'utilisateur lit déjà
  if (currentSentenceHanzi) {
    seenHanzi.add(currentSentenceHanzi.trim());
  }

  // 1. Dictionnaire CURATED_SENTENCES_BY_KEYWORD
  if (CURATED_SENTENCES_BY_KEYWORD[cleanHanzi]) {
    for (const item of CURATED_SENTENCES_BY_KEYWORD[cleanHanzi]) {
      if (!seenHanzi.has(item.hanzi) && results.length < 2) {
        seenHanzi.add(item.hanzi);
        results.push({
          id: `ex-curated-${cleanHanzi}-${results.length}`,
          hanzi: item.hanzi,
          pinyin: item.pinyin,
          french: item.french,
          situation: item.situation,
          tip: item.tip,
          sourceType: 'curated',
          sourceLabel: 'Usage courant',
        });
      }
    }
  }

  // 2. Cache IA
  if (results.length < 2) {
    const aiCached = getCachedAiSentences(cleanHanzi);
    for (const item of aiCached) {
      if (!seenHanzi.has(item.hanzi) && results.length < 2) {
        seenHanzi.add(item.hanzi);
        results.push({
          id: `ex-ai-${cleanHanzi}-${results.length}`,
          hanzi: item.hanzi,
          pinyin: item.pinyin,
          french: item.french,
          situation: item.situation,
          sourceType: 'ai',
          sourceLabel: 'Généré par IA',
        });
      }
    }
  }

  // 3. Histoires immersives (BUILT_IN_STORIES)
  if (results.length < 2) {
    for (const story of BUILT_IN_STORIES) {
      for (const p of story.paragraphs) {
        for (const s of p.sentences) {
          if (s.hanzi.includes(cleanHanzi) && !seenHanzi.has(s.hanzi)) {
            seenHanzi.add(s.hanzi);
            results.push({
              id: `ex-story-${story.id}-${results.length}`,
              hanzi: s.hanzi,
              pinyin: s.pinyin,
              french: s.translation,
              situation: `Extrait de l'histoire : ${story.title}`,
              sourceType: 'story',
              sourceLabel: `Histoire : ${story.title}`,
            });
            if (results.length >= 2) break;
          }
        }
        if (results.length >= 2) break;
      }
      if (results.length >= 2) break;
    }
  }

  // 4. Cours de grammaire (NUANCE_CARDS)
  if (results.length < 2) {
    for (const card of NUANCE_CARDS) {
      if (card.targetChinese.includes(cleanHanzi) && !seenHanzi.has(card.targetChinese)) {
        seenHanzi.add(card.targetChinese);
        results.push({
          id: `ex-card-${card.id}-${results.length}`,
          hanzi: card.targetChinese,
          pinyin: card.targetPinyin,
          french: card.translationFrench,
          situation: card.situationFrench,
          sourceType: 'curriculum',
          sourceLabel: `Cours : ${card.title}`,
        });
        if (results.length >= 2) break;
      }
    }
  }

  // 5. Phrases du quotidien (EVERYDAY_PHRASES)
  if (results.length < 2) {
    for (const phrase of EVERYDAY_PHRASES) {
      if (phrase.hanzi.includes(cleanHanzi) && !seenHanzi.has(phrase.hanzi)) {
        seenHanzi.add(phrase.hanzi);
        results.push({
          id: `ex-everyday-${phrase.id}`,
          hanzi: phrase.hanzi,
          pinyin: phrase.pinyin,
          french: phrase.french,
          situation: phrase.situation,
          tip: phrase.tip,
          sourceType: 'everyday',
          sourceLabel: phrase.categoryLabel,
        });
        if (results.length >= 2) break;
      }
    }
  }

  return results.slice(0, 2);
};

// Fonctions d'aide visuelle
function getCategoryLabel(category: EverydayPhrase['category']): string {
  switch (category) {
    case 'restaurant': return 'Restaurant & Café';
    case 'transport': return 'Transports';
    case 'shopping': return 'Achats & Boutiques';
    case 'work': return 'Travail & Bureau';
    case 'health': return 'Santé & Bien-être';
    case 'housing': return 'Logement & Maison';
    case 'reactions': return 'Réactions Spontanées';
    case 'social':
    default:
      return 'Vie Sociale & Échanges';
  }
}

function getCategoryIcon(category: EverydayPhrase['category']): string {
  switch (category) {
    case 'restaurant': return '🍜';
    case 'transport': return '🚕';
    case 'shopping': return '🛍️';
    case 'work': return '💼';
    case 'health': return '🏥';
    case 'housing': return '🏠';
    case 'reactions': return '⚡';
    case 'social':
    default:
      return '💬';
  }
}
