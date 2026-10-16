import { MaayotStory, AnkiWord, StoryParagraph, StorySentence, StoryWordToken } from '../types/fluent';
import { BUILT_IN_STORIES, generateStoryFromAnkiWords } from '../data/storiesData';
import { AUDIO_NOVELS } from '../data/novelsData';
import { PINYIN_LOOKUP } from './chinesePhonetics';

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

export interface ImportChineseStoryOptions {
  rawChineseText: string;
  customTitle?: string;
  customTranslation?: string;
  level?: 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5';
  apiKeyOverride?: string;
}

/**
 * Construit un dictionnaire local à partir de toutes les histoires et romans existants
 * pour permettre le découpage mot-à-mot hors-ligne d'un texte chinois collé par l'utilisateur.
 */
const buildLocalWordDictionary = (): Map<string, { pinyin: string; translation: string }> => {
  const dict = new Map<string, { pinyin: string; translation: string }>();

  const registerWord = (hanzi?: string, pinyin?: string, translation?: string) => {
    if (!hanzi) return;
    const clean = hanzi.replace(/[，。？！、；：“”‘’"\s]/g, '').trim();
    if (!clean) return;
    if (!dict.has(clean) || (!dict.get(clean)?.translation && translation)) {
      dict.set(clean, {
        pinyin: pinyin || PINYIN_LOOKUP[clean] || '',
        translation: translation || '',
      });
    }
  };

  for (const story of BUILT_IN_STORIES) {
    (story.targetWords || []).forEach((w) => registerWord(w.hanzi, w.pinyin, w.translation));
    for (const p of story.paragraphs || []) {
      for (const s of p.sentences || []) {
        (s.words || []).forEach((w) => registerWord(w.hanzi, w.pinyin, w.translation));
      }
    }
  }

  for (const novel of AUDIO_NOVELS) {
    (novel.keyVocabulary || []).forEach((w) => registerWord(w.hanzi, w.pinyin, w.translation));
    for (const page of novel.pages || []) {
      for (const p of page.paragraphs || []) {
        for (const s of p.sentences || []) {
          (s.words || []).forEach((w) => registerWord(w.hanzi, w.pinyin, w.translation));
        }
      }
    }
  }

  return dict;
};

/**
 * Découpe une phrase chinoise en tokens à l'aide du dictionnaire local (hors-ligne)
 */
const tokenizeChineseSentenceOffline = (
  sentenceHanzi: string,
  dict: Map<string, { pinyin: string; translation: string }>
): { words: StoryWordToken[]; sentencePinyin: string } => {
  const cleanText = sentenceHanzi.trim();
  const words: StoryWordToken[] = [];
  const pinyinParts: string[] = [];

  let i = 0;
  while (i < cleanText.length) {
    const ch = cleanText[i];
    // Ignorer la ponctuation pure dans les tokens mais garder l'avancement
    if (/[，。？！、；：“”‘’"«»\s（）()—…]/.test(ch)) {
      i++;
      continue;
    }

    let matched = false;
    // Chercher la plus longue correspondance (de 6 caractères à 1 caractère)
    for (let len = Math.min(6, cleanText.length - i); len >= 1; len--) {
      const candidate = cleanText.slice(i, i + len);
      if (/[，。？！、；：“”‘’"«»\s（）()—…]/.test(candidate)) continue;

      if (dict.has(candidate)) {
        const entry = dict.get(candidate)!;
        words.push({
          hanzi: candidate,
          pinyin: entry.pinyin || candidate.split('').map((c) => PINYIN_LOOKUP[c] || '').join(' '),
          translation: entry.translation || 'Expression / mot du texte',
        });
        if (entry.pinyin) pinyinParts.push(entry.pinyin);
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const fallbackPy = PINYIN_LOOKUP[ch] || '';
      words.push({
        hanzi: ch,
        pinyin: fallbackPy,
        translation: 'Caractère du texte',
      });
      if (fallbackPy) pinyinParts.push(fallbackPy);
      i++;
    }
  }

  return {
    words,
    sentencePinyin: pinyinParts.join(' '),
  };
};

/**
 * Convertit une histoire en chinois existante fournie par l'utilisateur
 * exactement sous la forme interactive du site (avec IA si clé dispo, ou hors-ligne instantané).
 */
export const importAndFormatChineseStory = async (
  options: ImportChineseStoryOptions
): Promise<MaayotStory> => {
  const rawText = options.rawChineseText.trim();
  if (!rawText) {
    throw new Error('Veuillez coller un texte ou une histoire en chinois.');
  }

  const level = options.level || 'HSK 3';
  const apiKey = (options.apiKeyOverride || getStoredAiApiKey()).trim();

  // 1. Si une clé API Gemini est disponible : enrichissement complet (Pinyin tonique exact, traduction française de chaque phrase et mot, quiz)
  if (apiKey) {
    const systemPrompt = `Tu es un professeur expert de chinois mandarin et traducteur littéraire franco-chinois.
L'utilisateur te fournit une VRAIE histoire en chinois ci-dessous.
Ta mission est de la mettre EXACTEMENT sous la forme interactive du site :
1. CONSERVE fidèlement toutes les phrases chinoises d'origine fournies par l'utilisateur (en sinogrammes simplifiés).
2. Découpe le texte en paragraphes et en phrases complètes.
3. Pour CHAQUE phrase, fournis :
   - "hanzi" : la phrase exacte en chinois
   - "pinyin" : le Pinyin complet avec les marques de tons exactes
   - "translation" : la traduction française fidèle et élégante
   - "words" : le découpage complet de TOUS les mots de la phrase (dans l'ordre exact, couvrant 100% des caractères) avec { "hanzi", "pinyin", "translation" }.
4. Extrais 6 à 10 mots clés importants dans "targetWords".
5. Génère 3 questions de quiz de compréhension sur cette histoire.
6. Rends UNIQUEMENT un objet JSON valide suivant le schéma demandé.

Texte chinois fourni par l'utilisateur :
"""
${rawText}
"""
${options.customTitle ? `Titre souhaité : ${options.customTitle}` : ''}`;

    const jsonSchemaPrompt = `{
  "title": "Titre en sinogrammes",
  "titlePinyin": "Pinyin avec tons du titre",
  "titleTranslation": "Traduction française du titre",
  "level": "${level}",
  "category": "Histoire Importée Authentique",
  "readTime": "3 min",
  "wordCount": ${rawText.replace(/[^\u4e00-\u9fa5]/g, '').length || 150},
  "targetWords": [
    { "hanzi": "mot", "pinyin": "pīnyīn", "translation": "traduction" }
  ],
  "paragraphs": [
    {
      "sentences": [
        {
          "hanzi": "Phrase complète en sinogrammes。",
          "pinyin": "Pinyin complet avec tons.",
          "translation": "Traduction en français.",
          "words": [
            { "hanzi": "mot", "pinyin": "mò", "translation": "sens" }
          ]
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "Question en français sur l'histoire",
      "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
      "correctIndex": 0,
      "explanation": "Explication"
    }
  ],
  "discussionPrompt": {
    "question": "你对这个故事有什么感想？",
    "questionPinyin": "Nǐ duì zhège gùshì yǒu shénme gǎnxiǎng?",
    "questionTranslation": "Quelles sont tes impressions sur cette histoire ?",
    "suggestedWords": []
  }
}`;

    const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nSchéma JSON :\n${jsonSchemaPrompt}` }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawJson) {
            const cleanJson = rawJson.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
            const parsed = JSON.parse(cleanJson);
            const allSentences: string[] = [];
            (parsed.paragraphs || []).forEach((p: any) => {
              (p.sentences || []).forEach((s: any) => {
                if (s.hanzi) allSentences.push(s.hanzi);
              });
            });

            return {
              id: `custom-imported-${Date.now()}`,
              title: options.customTitle?.trim() || parsed.title || '导入的中文故事',
              titlePinyin: parsed.titlePinyin || 'Dǎorù de zhōngwén gùshì',
              titleTranslation: options.customTranslation?.trim() || parsed.titleTranslation || 'Histoire chinoise importée',
              level: (parsed.level as any) || level,
              category: '📥 Histoire Importée',
              readTime: parsed.readTime || '3 min',
              wordCount: rawText.replace(/[^\u4e00-\u9fa5]/g, '').length || parsed.wordCount || 150,
              targetWords: parsed.targetWords || [],
              paragraphs: parsed.paragraphs || [],
              audioText: allSentences.join(' ') || rawText,
              quiz: parsed.quiz || [],
              discussionPrompt: parsed.discussionPrompt || {
                question: '请用中文复述这个故事的主要内容。',
                questionPinyin: 'Qǐng yòng zhōngwén fùshù zhège gùshì de zhǔyào nèiróng.',
                questionTranslation: 'Résume avec tes propres mots le contenu principal de cette histoire.',
                suggestedWords: [],
              },
            };
          }
        }
      } catch (e) {
        console.warn(`Import IA (${model}) repli sur le segmenteur local :`, e);
      }
    }
  }

  // 2. Mode Hors-Ligne Instantané : découpage avec notre dictionnaire local
  const dict = buildLocalWordDictionary();
  const rawParagraphs = rawText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const paragraphs: StoryParagraph[] = [];
  const allTargetWordsMap = new Map<string, { hanzi: string; pinyin: string; translation: string }>();

  for (const rawP of rawParagraphs) {
    // Découper en phrases selon la ponctuation chinoise (。！？；)
    const rawSentences = rawP
      .split(/(?<=[。！？!?；;])/)
      .map((s) => s.trim())
      .filter(Boolean);

    const sentences: StorySentence[] = rawSentences.map((sHanzi) => {
      const { words, sentencePinyin } = tokenizeChineseSentenceOffline(sHanzi, dict);
      words.forEach((w) => {
        if (w.hanzi.length >= 2 && w.translation && w.translation !== 'Caractère du texte' && allTargetWordsMap.size < 10) {
          allTargetWordsMap.set(w.hanzi, {
            hanzi: w.hanzi,
            pinyin: w.pinyin,
            translation: w.translation,
          });
        }
      });

      const knownMeanings = words
        .filter((w) => w.translation && !w.translation.includes('du texte'))
        .map((w) => w.translation)
        .slice(0, 8);

      return {
        hanzi: sHanzi,
        pinyin: sentencePinyin,
        translation:
          options.customTranslation ||
          (knownMeanings.length > 0
            ? `Sens clé : ${knownMeanings.join(' • ')}`
            : 'Clique sur chaque mot pour écouter la prononciation et l’épingler dans Anki.'),
        words,
      };
    });

    if (sentences.length > 0) {
      paragraphs.push({ sentences });
    }
  }

  const charCount = rawText.replace(/[^\u4e00-\u9fa5]/g, '').length || rawText.length;
  const firstSentenceTitle = rawText.split(/[，。！？\n]/)[0]?.slice(0, 12) || '我的中文故事';
  const title = options.customTitle?.trim() || firstSentenceTitle;
  const { sentencePinyin: titlePy } = tokenizeChineseSentenceOffline(title, dict);

  return {
    id: `custom-imported-${Date.now()}`,
    title,
    titlePinyin: titlePy || 'Wǒ de zhōngwén gùshì',
    titleTranslation: options.customTranslation?.trim() || 'Histoire chinoise importée',
    level: level as any,
    category: '📥 Histoire Importée',
    readTime: `${Math.max(1, Math.ceil(charCount / 120))} min`,
    wordCount: charCount,
    targetWords: Array.from(allTargetWordsMap.values()),
    paragraphs,
    audioText: rawText.replace(/\n+/g, ' '),
    quiz: [
      {
        question: `Quel est le sujet principal de « ${title} » ?`,
        options: [
          'Comprendre et pratiquer le récit en immersion',
          'Uniquement des listes de grammaire',
          'Un exercice de calligraphie',
          'Une chanson traditionnelle',
        ],
        correctIndex: 0,
        explanation: 'Cette histoire a été importée et découpée pour ta lecture interactive.',
      },
    ],
    discussionPrompt: {
      question: '请用自己的话谈谈这篇中文故事。',
      questionPinyin: 'Qǐng yòng zìjǐ de huà tántan zhè piān zhōngwén gùshì.',
      questionTranslation: 'Raconte avec tes propres mots ce que tu as retenu de cette histoire.',
      suggestedWords: Array.from(allTargetWordsMap.keys()).slice(0, 4),
    },
  };
};


