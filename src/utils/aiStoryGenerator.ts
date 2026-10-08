import { MaayotStory, AnkiWord } from '../types/fluent';
import { generateStoryFromAnkiWords } from '../data/storiesData';

const API_KEY_STORAGE_KEY = 'fluent_gemini_api_key';

/**
 * Récupérer la clé API Gemini configurée (soit en local storage, soit en variable d'environnement)
 */
export const getStoredAiApiKey = (): string => {
  try {
    const saved = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }
  return '';
};

/**
 * Sauvegarder la clé API Gemini dans le navigateur de l'utilisateur
 */
export const setStoredAiApiKey = (key: string): void => {
  try {
    if (!key.trim()) {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } else {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    }
  } catch (e) {
    console.error('Erreur stockage clé API Gemini :', e);
  }
};

export const hasAiApiKey = (): boolean => {
  return !!getStoredAiApiKey();
};

export interface GenerateStoryOptions {
  theme?: string;
  level?: 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5';
  ankiWords?: AnkiWord[];
  length?: 'short' | 'standard';
  apiKeyOverride?: string;
}

/**
 * Générer une histoire vivante et structurée en chinois avec l'API Google Gemini
 */
export const generateStoryWithAi = async (options: GenerateStoryOptions): Promise<MaayotStory> => {
  const apiKey = (options.apiKeyOverride || getStoredAiApiKey()).trim();

  // Si aucune clé n'est fournie, basculer sur le générateur hors-ligne avec les mots Anki
  if (!apiKey) {
    if (options.ankiWords && options.ankiWords.length > 0) {
      return generateStoryFromAnkiWords(options.ankiWords);
    }
    throw new Error("Aucune clé API Gemini n'est configurée. Connecte ta clé gratuite pour générer des histoires à l'infini.");
  }

  const level = options.level || 'HSK 3';
  const theme = options.theme?.trim() || "Une journée pleine de découvertes et de rencontres inattendues";
  const wordsToInclude = (options.ankiWords || []).slice(0, 5).map(w => `${w.hanzi} (${w.translation || ''})`).join(', ');

  const systemPrompt = `Tu es un auteur et professeur natif de chinois mandarin (Putonghua standard).
Ta mission est d'écrire une histoire immersive, captivante et pédagogique pour un étudiant de niveau ${level}.
Thème de l'histoire : « ${theme} ».
${wordsToInclude ? `Mots de vocabulaire cibles à intégrer impérativement dans l'histoire de façon fluide et naturelle : ${wordsToInclude}.` : ''}

Consignes impératives :
1. Utilise des sinogrammes simplifiés (简体中文).
2. Le ton doit être naturel, vivant, contemporain et immersif (comme une tranche de vie en Chine).
3. Le niveau de vocabulaire et de grammaire doit correspondre strictement à ${level}.
4. Le Pinyin doit être rigoureux et inclure les marques de tons sur les voyelles (ex: nǐ hǎo, lǎoshī, zhèige).
5. Chaque phrase doit être traduite en français avec naturel et précision.
6. Chaque phrase doit contenir la liste détaillée de ses mots ("words") avec hanzi, pinyin et traduction pour permettre le clic dictionnaire interactif.
7. Fournis 2 à 3 questions de compréhension à choix multiples (4 options avec une seule correcte) et explications.
8. Fournis un défi d'expression oral/écrit en lien avec l'histoire.
9. Rends UNIQUEMENT un objet JSON valide, sans texte d'introduction ni balises markdown.`;

  const jsonSchemaPrompt = `{
  "title": "Titre en sinogrammes",
  "titlePinyin": "Pinyin avec tons du titre",
  "titleTranslation": "Traduction française du titre",
  "level": "${level}",
  "category": "Catégorie courte (ex: Vie Quotidienne & Rencontres)",
  "readTime": "2 min",
  "wordCount": 140,
  "targetWords": [
    { "hanzi": "mot", "pinyin": "pīnyīn", "translation": "traduction" }
  ],
  "paragraphs": [
    {
      "sentences": [
        {
          "hanzi": "Phrase complète en sinogrammes avec ponctuation chinoise。",
          "pinyin": "Pinyin complet de la phrase avec ponctuation.",
          "translation": "Traduction en français fluide.",
          "words": [
            { "hanzi": "mot", "pinyin": "mò", "translation": "mot" }
          ]
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "Question en français sur la compréhension de l'histoire",
      "questionPinyin": "Optionnel",
      "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
      "correctIndex": 0,
      "explanation": "Pourquoi cette réponse est correcte selon le texte"
    }
  ],
  "discussionPrompt": {
    "question": "Question ouverte d'expression orale en chinois",
    "questionPinyin": "Pinyin de la question",
    "questionTranslation": "Traduction française de la question",
    "suggestedWords": ["mot1", "mot2"]
  }
}`;

  const promptText = `${systemPrompt}\n\nFormat JSON exact requis :\n${jsonSchemaPrompt}`;

  // Essayer d'abord gemini-2.0-flash, puis basculer sur gemini-1.5-flash si indisponible
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
      if (!rawText) throw new Error("Réponse vide reçue de l'IA.");

      const cleanJson = rawText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Valider et construire l'audioText
      const allSentences: string[] = [];
      (parsed.paragraphs || []).forEach((p: any) => {
        (p.sentences || []).forEach((s: any) => {
          if (s.hanzi) allSentences.push(s.hanzi);
        });
      });
      const audioText = allSentences.join(' ');

      const storyId = `custom-ai-${Date.now()}`;

      const finalStory: MaayotStory = {
        id: storyId,
        title: parsed.title || '我的中文故事',
        titlePinyin: parsed.titlePinyin || 'Wǒ de zhōngwén gùshì',
        titleTranslation: parsed.titleTranslation || 'Mon histoire en mandarin',
        level: (parsed.level as any) || level,
        category: parsed.category || 'Histoire IA Personnalisée',
        readTime: parsed.readTime || '2 min',
        wordCount: parsed.wordCount || 130,
        targetWords: parsed.targetWords || [],
        paragraphs: parsed.paragraphs || [],
        audioText: audioText || parsed.title,
        quiz: parsed.quiz || [],
        discussionPrompt: parsed.discussionPrompt || {
          question: '请用中文谈谈你对这个故事的看法。',
          questionPinyin: 'Qǐng yòng zhōngwén tántan nǐ duì zhè ge gùshì de kànfǎ.',
          questionTranslation: 'Donne ton avis sur cette histoire en mandarin.',
          suggestedWords: []
        }
      };

      return finalStory;
    } catch (err: any) {
      console.warn(`Tentative modèle ${model} échouée :`, err);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "Impossible de contacter l'IA. Vérifie ta clé API.");
};

