import { StorySentence, StoryRhythmChunk, SentenceRhythmAnalysis, StoryWordToken } from '../types/fluent';
import { playChineseAudio, stopChineseAudio } from './speechUtils';

// Particules grammaticales légères (ton neutre ou demi-ton fluide)
const LIGHT_PARTICLES = new Set([
  '的', '得', '地', '了', '着', '过', '吗', '吧', '呢', '呀', '啊', '哪', '们', '子', '头', '里', '上', '下'
]);

// Mots porteurs d'emphase ou d'intensité prosodique (重音)
const PROMINENT_WORDS = new Set([
  '非常', '特别', '最', '太', '真', '竟然', '突然', '究竟', '偏偏', '终于', '千万', '一定', '无论如何', '极其', '格外'
]);

// Conjonctions et articulateurs ouvrant un nouveau groupe de souffle
const RHYTHM_STARTERS = new Set([
  '虽然', '但是', '因为', '所以', '如果', '只有', '只要', '才', '然后', '而且', '无论', '竟然', '当年', '今天', '平时', '周末', '后来', '不过'
]);

/**
 * Détecte les sandhis tonals fréquents dans un chunk (3e ton + 3e ton, 不, 一)
 */
export const detectToneSandhiInText = (text: string, pinyin: string): string | undefined => {
  if (text.includes('不') && /bù\s+(shì|duì|huì|dào|kàn|yào|zài|qù)/i.test(pinyin)) {
    return 'Règle du 不 : se prononce bú (2e ton monté) devant un 4e ton !';
  }
  if (text.includes('一') && /yī\s+(gè|dìng|wèi|yàng|duàn)/i.test(pinyin)) {
    return 'Règle du 一 : se prononce yí (2e ton monté) devant un 4e ton.';
  }
  if (text.includes('一') && /yī\s+(tiān|tiáo|qǐ|bēi|zhāng)/i.test(pinyin)) {
    return 'Règle du 一 : se prononce yì (4e ton sec) devant un 1er, 2e ou 3e ton.';
  }
  if (text.includes('你好') || text.includes('可以') || text.includes('扫码') || text.includes('水饺') || text.includes('买好')) {
    return 'Sandhi 3+3 : le premier mot monte au 2e ton (ex: ní hǎo, kéyǐ) pour fluidifier le débit.';
  }
  return undefined;
};

/**
 * Analyse et découpe intelligemment une phrase chinoise en groupes de souffle (意群 - yìqún)
 */
export const analyzeSentenceRhythm = (sentence: StorySentence): SentenceRhythmAnalysis => {
  // 1. Si des chunks de rythme ont été définis à la main par un expert, on les priorise
  if (sentence.rhythmChunks && sentence.rhythmChunks.length > 0) {
    return {
      sentenceHanzi: sentence.hanzi,
      sentencePinyin: sentence.pinyin,
      translation: sentence.translation,
      chunks: sentence.rhythmChunks,
      rhythmAdvice: sentence.rhythmAdvice || generateAutomaticAdvice(sentence.rhythmChunks),
    };
  }

  // 2. Découpage dynamique basé sur les mots de la phrase
  const words = sentence.words.filter(w => w.hanzi.trim().length > 0);
  const chunks: StoryRhythmChunk[] = [];
  let currentWordGroup: StoryWordToken[] = [];

  const flushGroup = (pauseType: 'breath' | 'comma' | 'period' | 'none') => {
    if (currentWordGroup.length === 0) return;

    const groupText = currentWordGroup.map(w => w.hanzi).join('');
    const groupPinyin = currentWordGroup.map(w => w.pinyin).filter(Boolean).join(' ');
    const groupTranslation = currentWordGroup.map(w => w.translation).filter(Boolean).join(' • ');

    // Détermination de l'accent tonique (stress level)
    let stressLevel: 'prominent' | 'standard' | 'light' = 'standard';
    const hasProminent = currentWordGroup.some(w => PROMINENT_WORDS.has(w.hanzi) || w.isTarget);
    const isAllLight = currentWordGroup.every(w => LIGHT_PARTICLES.has(w.hanzi));

    if (hasProminent) {
      stressLevel = 'prominent';
    } else if (isAllLight) {
      stressLevel = 'light';
    }

    const sandhi = detectToneSandhiInText(groupText, groupPinyin);

    chunks.push({
      id: `chunk-${chunks.length}-${Date.now()}`,
      text: groupText,
      pinyin: groupPinyin,
      translation: groupTranslation,
      words: [...currentWordGroup],
      pauseType,
      stressLevel,
      sandhiHint: sandhi,
    });

    currentWordGroup = [];
  };

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isLastWord = i === words.length - 1;

    // Ponctuation explicite
    if (word.hanzi.includes('，') || word.hanzi.includes('、') || word.hanzi.includes('；')) {
      currentWordGroup.push(word);
      flushGroup('comma');
      continue;
    }

    if (word.hanzi.includes('。') || word.hanzi.includes('！') || word.hanzi.includes('？')) {
      currentWordGroup.push(word);
      flushGroup('period');
      continue;
    }

    // Si le mot suivant est un articulateur de rythme ou si le groupe courant atteint 3-4 mots significatifs
    const nextWord = words[i + 1];
    const isNextAStarter = nextWord && RHYTHM_STARTERS.has(nextWord.hanzi);
    const hasStructuralBreak = word.hanzi === '的' || word.hanzi === '地' || word.hanzi === '得';

    currentWordGroup.push(word);

    // Frontières de groupe de sens :
    // - Après une particule de structure '的' si le groupe dépasse 2 mots
    // - Avant un mot connecteur majeur (ex: 只有, 后来, 竟然)
    // - Quand la longueur du bloc atteint ~4-6 caractères sans ponctuation
    const currentLength = currentWordGroup.map(w => w.hanzi).join('').length;

    if (!isLastWord && (isNextAStarter || (hasStructuralBreak && currentLength >= 4) || currentLength >= 6)) {
      flushGroup('breath');
    }
  }

  // Évacuer le reste
  if (currentWordGroup.length > 0) {
    flushGroup('period');
  }

  return {
    sentenceHanzi: sentence.hanzi,
    sentencePinyin: sentence.pinyin,
    translation: sentence.translation,
    chunks,
    rhythmAdvice: generateAutomaticAdvice(chunks),
  };
};

/**
 * Génère un conseil de prosodie pour aider l'apprenant à visualiser le flux vocal
 */
const generateAutomaticAdvice = (chunks: StoryRhythmChunk[]): string => {
  const prominentCount = chunks.filter(c => c.stressLevel === 'prominent').length;
  if (prominentCount > 0) {
    return "💡 Regroupe les mots à l'intérieur des capsules sans marquer de pause. Respire uniquement aux barres de souffle ( / ) et fais résonner les mots clés surlignés.";
  }
  return "💡 Ne hache pas chaque caractère. Fais glisser les particules légères (的, 了, 着) pour garder un tempo régulier et fluide.";
};

/**
 * Joueur audio cadencé : lit chaque bloc de sens (意群) avec les vraies pauses respiratoires natives
 */
let isRhythmPlaying = false;
let rhythmAbortController: { abort: () => void } | null = null;

export const stopSentenceRhythmAudio = () => {
  if (rhythmAbortController) {
    rhythmAbortController.abort();
    rhythmAbortController = null;
  }
  isRhythmPlaying = false;
  stopChineseAudio();
};

export const playSentenceWithProsodicPauses = async (
  chunks: StoryRhythmChunk[],
  rate: number = 0.85,
  gender: 'female' | 'male' = 'female',
  onChunkChange?: (activeChunkIndex: number | null) => void
): Promise<void> => {
  stopSentenceRhythmAudio();

  isRhythmPlaying = true;
  let aborted = false;

  rhythmAbortController = {
    abort: () => {
      aborted = true;
      if (onChunkChange) onChunkChange(null);
    }
  };

  for (let i = 0; i < chunks.length; i++) {
    if (aborted) break;

    const chunk = chunks[i];
    if (onChunkChange) onChunkChange(i);

    // Lecture du chunk individuel via le moteur Edge TTS Neural ou synthèse haute fidélité
    await playChineseAudio(chunk.text, rate, gender);

    if (aborted) break;

    // Détermination de la pause respiratoire selon la ponctuation prosodique
    let pauseDurationMs = 280; // Micro-souffle standard entre deux 意群 (/)
    if (chunk.pauseType === 'comma') {
      pauseDurationMs = 520; // Pause à la virgule (//)
    } else if (chunk.pauseType === 'period') {
      pauseDurationMs = 700; // Pause terminale (///)
    }

    if (i < chunks.length - 1) {
      await new Promise(r => setTimeout(r, pauseDurationMs));
    }
  }

  if (onChunkChange) onChunkChange(null);
  isRhythmPlaying = false;
  rhythmAbortController = null;
};

