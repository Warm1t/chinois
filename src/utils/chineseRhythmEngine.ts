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

// Mots qui NE DOIVENT JAMAIS être coupés du mot suivant (adverbes, prépositions, classificateurs)
// Interdit formellement de mettre une pause de souffle après ces mots !
const DO_NOT_SPLIT_AFTER = new Set([
  // Adverbes de degré et négations (doivent impérativement rester liés au verbe/adjectif qu'ils qualifient)
  '非常', '特别', '很', '太', '最', '真', '极', '极其', '格外', '挺', '蛮', '更加', '更', '越发',
  '不', '没', '没有', '别', '千万', '绝不', '从不',
  // Adverbes temporels, d'aspect et de manière
  '刚', '刚刚', '刚才', '已经', '正在', '正', '总', '总是', '常常', '经常', '偶尔', '一直', '突然', '忽然', '立刻', '马上', '顿时', '渐渐', '悄悄', '一不小心',
  // Adverbes de portée et restriction
  '也', '都', '只', '只有', '仅仅', '还', '再', '又', '一起', '互相', '共同',
  // Modaux
  '一定', '肯定', '可能', '大概', '也许', '究竟', '到底', '偏偏', '竟然', '居然', '果然', '幸亏', '其实', '简直', '无论如何', '顺利', '准时',
  // Prépositions (introduisent un complément de lieu/temps/bénéficiaire : ne peuvent JAMAIS terminer un bloc !)
  '在', '从', '向', '朝', '往', '给', '对', '对于', '跟', '同', '和', '与', '把', '被', '叫', '让', '用', '为', '为了', '比', '关于', '按照', '根据',
  // Classificateurs et déterminants
  '一个', '一位', '一家', '一条', '一本', '几位', '整座', '这个', '那个', '这群', '那群', '无数', '每位', '每天'
]);

// Mots ou particules qui NE PEUVENT JAMAIS commencer un bloc autonome (doivent rester collés à gauche)
const DO_NOT_START_WITH = new Set([
  '的', '得', '地', '了', '着', '过', '里', '上', '下', '中', '起', '出', '来', '去'
]);

/**
 * Détections des sandhis tonals fréquents dans un chunk (3e ton + 3e ton, 不, 一)
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
 * Respecte rigoureusement la syntaxe chinoise : ne coupe JAMAIS après un adverbe (非常),
 * une préposition (在), ou avant une particule (的, 了, 地).
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

  // 2. Découpage dynamique basé sur la ponctuation réelle et les unités prosodiques chinoises
  const rawWords = sentence.words.filter(w => {
    const clean = w.hanzi.replace(/[，。？！、；：\s]/g, '');
    return clean.length > 0;
  });

  if (rawWords.length === 0) {
    return {
      sentenceHanzi: sentence.hanzi,
      sentencePinyin: sentence.pinyin,
      translation: sentence.translation,
      chunks: [],
      rhythmAdvice: '',
    };
  }

  // Repérage précis des ponctuations dans sentence.hanzi pour chaque mot
  let searchPos = 0;
  const wordPunctMap: ('comma' | 'period' | 'enumeration' | 'none')[] = [];

  for (let i = 0; i < rawWords.length; i++) {
    const wordText = rawWords[i].hanzi;
    const foundIndex = sentence.hanzi.indexOf(wordText, searchPos);
    let punct: 'comma' | 'period' | 'enumeration' | 'none' = 'none';

    if (foundIndex !== -1) {
      searchPos = foundIndex + wordText.length;
      let nextChar = sentence.hanzi[searchPos];
      while (nextChar === ' ' && searchPos < sentence.hanzi.length - 1) {
        searchPos++;
        nextChar = sentence.hanzi[searchPos];
      }
      if (nextChar === '。' || nextChar === '！' || nextChar === '？') {
        punct = 'period';
      } else if (nextChar === '，' || nextChar === '；' || nextChar === '：') {
        punct = 'comma';
      } else if (nextChar === '、') {
        punct = 'enumeration';
      }
    }
    wordPunctMap.push(punct);
  }

  const chunks: StoryRhythmChunk[] = [];
  let currentGroup: StoryWordToken[] = [];

  const flushGroup = (pauseType: 'breath' | 'comma' | 'period' | 'none', punctSymbol: string = '') => {
    if (currentGroup.length === 0) return;

    const groupText = currentGroup.map(w => w.hanzi).join('') + punctSymbol;
    const groupPinyin = currentGroup.map(w => w.pinyin).filter(Boolean).join(' ') + (punctSymbol ? punctSymbol : '');
    const groupTranslation = currentGroup.map(w => w.translation).filter(Boolean).join(' • ');

    // Détermination de l'accent tonique (stress level)
    let stressLevel: 'prominent' | 'standard' | 'light' = 'standard';
    const hasProminent = currentGroup.some(w => PROMINENT_WORDS.has(w.hanzi) || w.isTarget);
    const isAllLight = currentGroup.every(w => LIGHT_PARTICLES.has(w.hanzi));

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
      words: [...currentGroup],
      pauseType,
      stressLevel,
      sandhiHint: sandhi,
    });

    currentGroup = [];
  };

  for (let i = 0; i < rawWords.length; i++) {
    const word = rawWords[i];
    const isLastWord = i === rawWords.length - 1;
    const punct = wordPunctMap[i];

    currentGroup.push(word);

    // 1. Ponctuation terminale ou dernier mot : clôture de phrase
    if (punct === 'period' || isLastWord) {
      const punctChar = sentence.hanzi.includes('！') ? '！' : sentence.hanzi.includes('？') ? '？' : '。';
      flushGroup('period', punct === 'period' ? punctChar : (isLastWord ? punctChar : ''));
      continue;
    }

    // 2. Virgule ou point-virgule : pause de souffle naturelle
    if (punct === 'comma') {
      flushGroup('comma', '，');
      continue;
    }

    // 3. Virgule d'énumération
    if (punct === 'enumeration') {
      flushGroup('breath', '、');
      continue;
    }

    // 4. À l'intérieur d'une proposition sans ponctuation :
    // On ne coupe que si le groupe est SUFFISAMMENT LONG (>= 6 caractères)
    // ET si couper ici respecte scrupuleusement la grammaire chinoise !
    const nextWord = rawWords[i + 1];
    if (nextWord) {
      const currentLength = currentGroup.map(w => w.hanzi).join('').length;

      // Calcul du nombre de caractères restants dans la clause avant la prochaine ponctuation
      let remainingCharsInClause = 0;
      for (let j = i + 1; j < rawWords.length; j++) {
        remainingCharsInClause += rawWords[j].hanzi.length;
        if (wordPunctMap[j] !== 'none') break;
      }

      // Interdiction absolue de couper après un adverbe (非常), une préposition (在) ou un classificateur (一个)
      const cannotSplitAfter = 
        DO_NOT_SPLIT_AFTER.has(word.hanzi) ||
        word.hanzi.endsWith('的') || word.hanzi.endsWith('地') || word.hanzi.endsWith('得') ||
        word.hanzi.endsWith('在') || word.hanzi.endsWith('从') || word.hanzi.endsWith('很') ||
        word.hanzi.endsWith('最') || word.hanzi.endsWith('太');

      // Interdiction absolue de commencer un groupe par une particule (的, 了, 地)
      const cannotStartNext = 
        DO_NOT_START_WITH.has(nextWord.hanzi) ||
        nextWord.hanzi.startsWith('的') || nextWord.hanzi.startsWith('地') || nextWord.hanzi.startsWith('得') ||
        nextWord.hanzi.startsWith('了') || nextWord.hanzi.startsWith('着') || nextWord.hanzi.startsWith('过');

      // On ne coupe jamais s'il reste moins de 4 caractères avant la ponctuation (évite les orphelins comme "胡同。")
      if (currentLength >= 5 && remainingCharsInClause >= 4 && !cannotSplitAfter && !cannotStartNext) {
        // Coupure naturelle : avant un connecteur, une préposition qui ouvre un syntagme, ou un verbe après sujet long
        const isNaturalBoundary = 
          RHYTHM_STARTERS.has(nextWord.hanzi) ||
          nextWord.hanzi === '在' || nextWord.hanzi === '从' || nextWord.hanzi === '向' ||
          nextWord.hanzi === '带他' || nextWord.hanzi === '走出了' || nextWord.hanzi === '留学' ||
          (currentLength >= 6 && (word.hanzi === '热情地' || word.hanzi === '地')) ||
          currentLength >= 8;

        if (isNaturalBoundary) {
          flushGroup('breath');
        }
      }
    }
  }

  if (currentGroup.length > 0) {
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

  try {
    for (let i = 0; i < chunks.length; i++) {
      if (aborted) break;

      const chunk = chunks[i];
      if (onChunkChange && !aborted) onChunkChange(i);

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
      if (aborted) break;
    }
  } finally {
    if (onChunkChange) onChunkChange(null);
    isRhythmPlaying = false;
    rhythmAbortController = null;
  }
};

