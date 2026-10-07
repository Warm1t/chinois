import { DailyHanzi } from '../types/fluent';

export const DAILY_HANZI_COLLECTION: DailyHanzi[] = [
  {
    id: 'hanzi-wu',
    character: '悟',
    pinyin: 'wù',
    tone: 4,
    meaning: "Comprendre profondément, s'éveiller à, prise de conscience",
    radical: '忄',
    radicalMeaning: 'Cœur / Esprit (variante de 心)',
    strokeCount: 10,
    level: 'HSK 4',
    mnemonic: "Le cœur (忄) placé à côté de moi (吾) : quand mon propre cœur s'écoute en profondeur, la vraie compréhension et l'illumination apparaissent.",
    culturalContext: "Caractère fondamental de la philosophie bouddhiste Chan (Zen) et de la pensée chinoise, incarnant l'illumination spontanée (顿悟 dùnwù) opposée au simple apprentissage mécanique.",
    compoundWords: [
      { hanzi: '领悟', pinyin: 'lǐngwù', translation: 'Saisir le sens profond, assimiler', level: 'HSK 5' },
      { hanzi: '感悟', pinyin: 'gǎnwù', translation: 'Prise de conscience, réflexion vécue', level: 'HSK 4' },
      { hanzi: '觉悟', pinyin: 'juéwù', translation: 'Conscience politique/morale, éveil', level: 'HSK 5' },
      { hanzi: '恍然大悟', pinyin: 'huǎng rán dà wù', translation: 'Avoir une soudaine illumination (Idiotisme)', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '经过多次练习，我终于领悟了这个语法的真正逻辑。',
      pinyin: 'Jīngguò duō cì liànxí, wǒ zhōngyú lǐngwù le zhège yǔfǎ de zhēnzhèng luójí.',
      translation: "Après de multiples entraînements, j'ai enfin saisi la véritable logique de cette grammaire.",
    },
  },
  {
    id: 'hanzi-rong',
    character: '融',
    pinyin: 'róng',
    tone: 2,
    meaning: 'Fondre, fusionner, harmoniser, circuler librement',
    radical: '虫',
    radicalMeaning: 'Insecte / Souffle de vie',
    strokeCount: 16,
    level: 'HSK 4',
    mnemonic: "L'ancien chaudron en terre cuite (鬲) sous lequel circule la vapeur (虫) : les ingrédients se fondent ensemble jusqu'à l'harmonie parfaite.",
    culturalContext: "Évoque la fluidité suprême : la neige qui fond au printemps (融化), la finance où l'argent circule comme de l'eau (金融), et l'intégration harmonieuse dans un groupe (融入).",
    compoundWords: [
      { hanzi: '融入', pinyin: 'róngrù', translation: "S'intégrer, s'acclimater à", level: 'HSK 4' },
      { hanzi: '融合', pinyin: 'rónghé', translation: 'Fusionner, marier deux cultures/styles', level: 'HSK 5' },
      { hanzi: '金融', pinyin: 'jīnróng', translation: 'Finance, circulation monétaire', level: 'HSK 4' },
      { hanzi: '融洽', pinyin: 'róngqià', translation: 'Harmonieux, chaleureux (ambiance)', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '他很快就融入了北京的日常生活。',
      pinyin: 'Tā hěn kuài jiù róngrù le Běijīng de rìcháng shēnghuó.',
      translation: 'Il s’est très vite intégré à la vie quotidienne pékinoise.',
    },
  },
  {
    id: 'hanzi-guan',
    character: '贯',
    pinyin: 'guàn',
    tone: 4,
    meaning: "Traverser d'outre en outre, enfiler, relier en continu",
    radical: '贝',
    radicalMeaning: 'Coquillage / Monnaie / Précieux',
    strokeCount: 8,
    level: 'HSK 4',
    mnemonic: "Un fil métallique qui traverse et enfile une série de pièces de monnaie en coquillages (贝) pour former une longue chaîne continue.",
    culturalContext: "Représente la cohérence absolue : une pensée qui se tient du début à la fin (连贯) ou une volonté inébranlable appliquée de bout en bout (贯彻).",
    compoundWords: [
      { hanzi: '贯通', pinyin: 'guàntōng', translation: 'Relier les deux bouts, maîtriser de part en part', level: 'HSK 5' },
      { hanzi: '连贯', pinyin: 'liánguàn', translation: 'Cohérent, fluide, sans coupure', level: 'HSK 5' },
      { hanzi: '一贯', pinyin: 'yíguàn', translation: 'Constant, fidèle à ses principes', level: 'HSK 5' },
      { hanzi: '贯彻', pinyin: 'guànchè', translation: 'Mettre en œuvre scrupuleusement', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '学习汉语需要把听、说、读、写贯通起来。',
      pinyin: 'Xuéxí hànyǔ xūyào bǎ tīng, shuō, dú, xiě guàntōng qǐlái.',
      translation: "L'apprentissage du chinois nécessite de relier harmonieusement l'écoute, le parler, la lecture et l'écrit.",
    },
  },
  {
    id: 'hanzi-jing',
    character: '境',
    pinyin: 'jìng',
    tone: 4,
    meaning: "Frontière, territoire, environnement, état d'esprit",
    radical: '土',
    radicalMeaning: 'Terre / Sol',
    strokeCount: 14,
    level: 'HSK 3',
    mnemonic: "La terre (土) éclairée par la lumière (竟) : là où s'arrêtent tes pas et où s'étend l'espace qui t'entoure.",
    culturalContext: "Dans l'art chinois, le mot 意境 (yìjìng) désigne la résonance poétique suprême d'une peinture : ce n'est pas le paysage réel, mais le paysage intérieur créé par l'esprit.",
    compoundWords: [
      { hanzi: '环境', pinyin: 'huánjìng', translation: 'Environnement, cadre de vie', level: 'HSK 3' },
      { hanzi: '境遇', pinyin: 'jìngyù', translation: 'Circonstances, situation vécue', level: 'HSK 4' },
      { hanzi: '境界', pinyin: 'jìngjiè', translation: "Niveau d'élévation, palier spirituel", level: 'HSK 5' },
      { hanzi: '困境', pinyin: 'kùnjìng', translation: 'Impasse, situation difficile', level: 'HSK 4' },
    ],
    exampleSentence: {
      chinese: '良好的语言环境对提高口语至关重要。',
      pinyin: 'Liánghǎo de yǔyán huánjìng duì tígāo kǒuyǔ zhìguān zhòngyào.',
      translation: "Un bon environnement linguistique est crucial pour améliorer son expression orale.",
    },
  },
  {
    id: 'hanzi-jian',
    character: '渐',
    pinyin: 'jiàn',
    tone: 4,
    meaning: 'Progressivement, petit à petit, graduellement',
    radical: '氵',
    radicalMeaning: 'Eau',
    strokeCount: 11,
    level: 'HSK 4',
    mnemonic: "L'eau (氵) qui coupe (斩) la pierre non pas par la force brute, mais goutte après goutte avec une infinie patience.",
    culturalContext: "Symbole de la pédagogie chinoise classique : la maîtrise ne s'obtient jamais d'un coup de baguette magique, mais à travers une maturation graduelle (渐进).",
    compoundWords: [
      { hanzi: '渐渐', pinyin: 'jiànjiàn', translation: 'Peu à peu, graduellement', level: 'HSK 3' },
      { hanzi: '逐渐', pinyin: 'zhújiàn', translation: 'Progressivement, étape par étape', level: 'HSK 4' },
      { hanzi: '循序渐进', pinyin: 'xún xù jiàn jìn', translation: 'Avancer avec méthode pas à pas', level: 'HSK 5' },
      { hanzi: '渐入佳境', pinyin: 'jiàn rù jiā jìng', translation: "S'améliorer de mieux en mieux", level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '坚持每天练一句，你的发音就会渐渐变好。',
      pinyin: 'Jiānchí měitiān liàn yí jù, nǐ de fāyīn jiù huì jiànjiàn biàn hǎo.',
      translation: "En t'entraînant sur une phrase par jour, ta prononciation deviendra progressivement limpide.",
    },
  },
  {
    id: 'hanzi-hui',
    character: '慧',
    pinyin: 'huì',
    tone: 4,
    meaning: "Sagesse, perspicacité, clarté d'esprit",
    radical: '心',
    radicalMeaning: 'Cœur / Esprit',
    strokeCount: 15,
    level: 'HSK 4',
    mnemonic: "Deux balais (彗) qui nettoient la poussière au-dessus du cœur (心) : quand l'esprit est débarrassé de ses pensées parasites, la sagesse rayonne.",
    culturalContext: "Contrairement à 聪 (l'intelligence vive des oreilles et des yeux), 慧 désigne l'intuition profonde qui voit clair au-delà des apparences.",
    compoundWords: [
      { hanzi: '智慧', pinyin: 'zhìhuì', translation: 'Sagesse, intelligence profonde', level: 'HSK 4' },
      { hanzi: '聪慧', pinyin: 'cōnghuì', translation: 'Brillant et spirituel', level: 'HSK 5' },
      { hanzi: '慧心', pinyin: 'huìxīn', translation: 'Âme intuitive et sensible', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '学语言不仅是背单词，更要理解它背后的文化智慧。',
      pinyin: 'Xué yǔyán bùjǐn shì bèi dāncí, gèng yào lǐjiě tā bèihòu de wénhuà zhìhuì.',
      translation: "Apprendre une langue ne se résume pas à mémoriser des mots, c'est aussi comprendre la sagesse culturelle sous-jacente.",
    },
  },
  {
    id: 'hanzi-tou',
    character: '透',
    pinyin: 'tòu',
    tone: 4,
    meaning: 'Pénétrer, limpide, transparent, comprendre à fond',
    radical: '辶',
    radicalMeaning: 'Mouvement / Marche',
    strokeCount: 10,
    level: 'HSK 4',
    mnemonic: "Un épi de grain (秀) qui avance (辶) et traverse les obstacles jusqu'à ce que la clarté apparaisse de l'autre côté.",
    culturalContext: "Utilisé pour exprimer une maîtrise totale : quand on comprend un sujet si profondément qu'il devient limpide comme de l'eau claire (看透 / 摸透).",
    compoundWords: [
      { hanzi: '看透', pinyin: 'kàntòu', translation: 'Percer à jour, comprendre les ressorts secrets', level: 'HSK 4' },
      { hanzi: '透明', pinyin: 'tòumíng', translation: 'Transparent, clair, limpide', level: 'HSK 4' },
      { hanzi: '渗透', pinyin: 'shèntòu', translation: 'Pénétrer, imprégner doucement', level: 'HSK 5' },
      { hanzi: '透彻', pinyin: 'tòuchè', translation: 'Lucide, fouillé, exhaustif', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '把这篇短文读透，你的词汇量会有质的飞跃。',
      pinyin: 'Bǎ zhè piān duǎnwén dú tòu, nǐ de cíhuì liàng huì yǒu zhì de fēiyuè.',
      translation: "En assimilant ce texte à fond, ton vocabulaire fera un bond qualitatif.",
    },
  },
  {
    id: 'hanzi-zhi',
    character: '质',
    pinyin: 'zhì',
    tone: 4,
    meaning: 'Substance, matière essentielle, qualité, nature',
    radical: '贝',
    radicalMeaning: 'Coquillage / Valeur monétaire',
    strokeCount: 8,
    level: 'HSK 3',
    mnemonic: "Un gage de valeur (贝) déposé sous deux haches (斤) croisées : la valeur fondamentale et inaltérable d'une chose mise à l'épreuve.",
    culturalContext: "Distingue la quantité (量) de la qualité authentique (质). En chinois, progresser consiste souvent à passer d'un simple accumulation à un saut qualitatif (质变).",
    compoundWords: [
      { hanzi: '质量', pinyin: 'zhìliàng', translation: 'Qualité (de fabrication, d’expression)', level: 'HSK 3' },
      { hanzi: '本质', pinyin: 'běnzhì', translation: 'Nature fondamentale, essence', level: 'HSK 4' },
      { hanzi: '物质', pinyin: 'wùzhì', translation: 'Matière, biens matériels', level: 'HSK 4' },
      { hanzi: '素质', pinyin: 'sùzhì', translation: 'Éducation, maintien personnel', level: 'HSK 4' },
    ],
    exampleSentence: {
      chinese: '练习口语不要追求数量，而要在句子的质量上下功夫。',
      pinyin: 'Liànxí kǒuyǔ bú yào zhuīqiú shùliàng, ér yào zài jùzi de zhìliàng shàng xià gōngfu.',
      translation: "Pour pratiquer l'oral, ne cherche pas la quantité, concentre tes efforts sur la qualité de chaque phrase.",
    },
  },
  {
    id: 'hanzi-yuan',
    character: '源',
    pinyin: 'yuán',
    tone: 2,
    meaning: "Source d'eau, origine première, racine",
    radical: '氵',
    radicalMeaning: 'Eau',
    strokeCount: 13,
    level: 'HSK 4',
    mnemonic: "L'eau vive (氵) qui jaillit de la plaine rocheuse (原) : l'endroit exact où commence la rivière.",
    culturalContext: "Le proverbe 饮水思源 (Quand tu bois de l'eau, songe à sa source) rappelle d'honorer ceux qui ont ouvert la voie et permis notre réussite.",
    compoundWords: [
      { hanzi: '来源', pinyin: 'láiyuán', translation: 'Provenance, source', level: 'HSK 4' },
      { hanzi: '资源', pinyin: 'zīyuán', translation: 'Ressources naturelles / documentaires', level: 'HSK 4' },
      { hanzi: '源头', pinyin: 'yuántóu', translation: "Source originelle d'un fleuve ou problème", level: 'HSK 5' },
      { hanzi: '饮水思源', pinyin: 'yǐn shuǐ sī yuán', translation: 'Être reconnaissant envers ses racines', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '汉字的字形是了解古代中华文明的重要来源。',
      pinyin: 'Hànzì de zìxíng shì liǎojiě gǔdài zhōnghuá wénmíng de zhòngyào láiyuán.',
      translation: 'La forme des sinogrammes est une source majeure pour comprendre la civilisation antique chinoise.',
    },
  },
  {
    id: 'hanzi-heng',
    character: '衡',
    pinyin: 'héng',
    tone: 2,
    meaning: 'Équilibrer, peser avec justesse, balancer',
    radical: '行',
    radicalMeaning: 'Marcher / Chemin / Mouvement',
    strokeCount: 16,
    level: 'HSK 4',
    mnemonic: "Au milieu d'un carrefour (行), un poisson suspendu à une barre en bois (角+大) sert de balance pour mesurer les poids équitablement.",
    culturalContext: "L'idéal confucéen du juste milieu (中庸) repose entièrement sur la recherche d'un équilibre dynamique (平衡) entre les forces opposées.",
    compoundWords: [
      { hanzi: '平衡', pinyin: 'pínghéng', translation: 'Équilibre physique ou mental', level: 'HSK 4' },
      { hanzi: '衡量', pinyin: 'héngliáng', translation: 'Évaluer, peser le pour et le contre', level: 'HSK 5' },
      { hanzi: '权衡', pinyin: 'quánhéng', translation: 'Arbitrer entre deux choix', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '学好汉语需要平衡输入与输出。',
      pinyin: 'Xué hǎo hànyǔ xūyào pínghéng shūrù yǔ shūchū.',
      translation: 'Pour bien apprendre le chinois, il faut équilibrer la compréhension (écoute/lecture) et la production (parler/écrire).',
    },
  },
  {
    id: 'hanzi-xu',
    character: '绪',
    pinyin: 'xù',
    tone: 4,
    meaning: "Fil directeur, émotion ressentie, commencement d'une pensée",
    radical: '纟',
    radicalMeaning: 'Fil de soie',
    strokeCount: 11,
    level: 'HSK 4',
    mnemonic: "Un fil de soie (纟) dont on cherche le premier bout (者) pour pouvoir démêler l'écheveau.",
    culturalContext: "En chinois, les sentiments ne sont pas des blocs rigides, mais des fils de soie qui s'entremêlent dans l'esprit (情绪 / 思绪). Démêler ses émotions, c'est trouver le fil conducteur.",
    compoundWords: [
      { hanzi: '情绪', pinyin: 'qíngxù', translation: 'État émotionnel, humeur', level: 'HSK 4' },
      { hanzi: '思绪', pinyin: 'sīxù', translation: 'Fil des pensées, réflexion', level: 'HSK 5' },
      { hanzi: '头绪', pinyin: 'tóuxù', translation: 'Fil conducteur, piste claire', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '面对考试别紧张，先稳定自己的情绪。',
      pinyin: 'Miànduì kǎoshì bié jǐnzhāng, xiān wěndìng zìjǐ de qíngxù.',
      translation: "Face à l'examen ne stresse pas, commence par calmer tes émotions.",
    },
  },
  {
    id: 'hanzi-mo',
    character: '默',
    pinyin: 'mò',
    tone: 4,
    meaning: 'Silencieux, tacite, retenir sans bruit',
    radical: '黑',
    radicalMeaning: 'Noir / Encre de Chine',
    strokeCount: 16,
    level: 'HSK 4',
    mnemonic: "L'encre noire (黑) et le chien de garde (犬) aux aguets dans la nuit : une présence attentive qui ne dit pas un mot.",
    culturalContext: "La culture chinoise chérit le silence éloquent (默契 mòqì) : deux personnes qui se comprennent d'un simple regard sans avoir besoin de parler.",
    compoundWords: [
      { hanzi: '幽默', pinyin: 'yōumò', translation: 'Humour (translittéré et adapté par Lin Yutang)', level: 'HSK 3' },
      { hanzi: '沉默', pinyin: 'chénmò', translation: 'Silence solennel, se taire', level: 'HSK 4' },
      { hanzi: '默契', pinyin: 'mòqì', translation: 'Complicité tacite, entente mutuelle', level: 'HSK 5' },
      { hanzi: '默认', pinyin: 'mòrèn', translation: 'Consentement tacite, par défaut', level: 'HSK 5' },
    ],
    exampleSentence: {
      chinese: '他们之间有一种不需要多言的默契。',
      pinyin: 'Tāmen zhījiān yǒu yì zhǒng bù xūyào duō yán de mòqì.',
      translation: "Il règne entre eux une complicité tacite qui n'a pas besoin de mots.",
    },
  },
  {
    id: 'hanzi-yu',
    character: '语',
    pinyin: 'yǔ',
    tone: 3,
    meaning: 'Paroles articulées, langage, expression vivante',
    radical: '讠',
    radicalMeaning: 'Parole (variante de 言)',
    strokeCount: 9,
    level: 'HSK 3',
    mnemonic: "La parole (讠) de moi-même (吾) : ce que j'exprime de l'intérieur vers le monde pour tisser du lien.",
    culturalContext: "Contrairement à 文 (la culture écrite et les signes), 语 désigne la langue vivante parlée par les êtres humains. C'est l'essence même du nom de notre application 'Fluent'.",
    compoundWords: [
      { hanzi: '语言', pinyin: 'yǔyán', translation: 'Langue, langage', level: 'HSK 3' },
      { hanzi: '语法', pinyin: 'yǔfǎ', translation: 'Grammaire, règles du langage', level: 'HSK 3' },
      { hanzi: '汉语', pinyin: 'hànyǔ', translation: 'Langue chinoise / mandarin', level: 'HSK 1' },
      { hanzi: '成语', pinyin: 'chéngyǔ', translation: 'Expression idiomatique à 4 caractères', level: 'HSK 4' },
    ],
    exampleSentence: {
      chinese: '学语言最大的快乐是能用它和世界交流。',
      pinyin: 'Xué yǔyán zuì dà de kuàilè shì néng yòng tā hé shìjiè jiāoliú.',
      translation: "Le plus grand bonheur dans l'apprentissage d'une langue est de pouvoir échanger avec le monde.",
    },
  },
];

/**
 * Calcul déterministe du Hanzi du Jour basé sur la date du calendrier
 * Garantit que chaque jour de l'année propose un caractère précis et nouveau !
 */
export const getTodayDailyHanzi = (targetDate: Date = new Date()): DailyHanzi => {
  const year = targetDate.getFullYear();
  const startOfYear = new Date(year, 0, 0);
  const diff = targetDate.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = Math.abs(dayOfYear) % DAILY_HANZI_COLLECTION.length;
  return DAILY_HANZI_COLLECTION[index];
};

export interface AppleCalendarExportOptions {
  reminderTime?: string;
  daysCount?: number;
  mode?: 'all_day' | 'timed';
}

/**
 * Générer le fichier de calendrier Apple universel (.ics) pour l'iPhone / Mac.
 * Crée une séquence complète de 60 jours avec UN CARACTÈRE DIFFÉRENT CHAQUE JOUR !
 * Compatible 100% avec le Widget Calendrier iOS (Lock Screen + Écran d'accueil)
 * et les notifications matinales d'Apple.
 */
export const generateAppleCalendarIcsForHanzi = (
  _currentHanzi: DailyHanzi,
  reminderTime: string = '08:30',
  options: { daysCount?: number; mode?: 'all_day' | 'timed' } = {}
): string => {
  const daysCount = options.daysCount ?? 60;
  const mode = options.mode ?? 'all_day';
  const [hours, minutes] = reminderTime.split(':');
  const now = new Date();
  const nowStr = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fluent//Daily Hanzi Apple Widget Series//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:🇨🇳 Fluent - Hanzi du Jour',
    'X-WR-TIMEZONE:Europe/Paris'
  ];

  for (let i = 0; i < daysCount; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i + 1);

    // Caractère unique calculé pour ce jour précis
    const hanziForDay = getTodayDailyHanzi(targetDate);

    const yearStr = String(targetDate.getFullYear());
    const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(targetDate.getDate()).padStart(2, '0');
    const dateYmd = `${yearStr}${monthStr}${dayStr}`;

    const nextYearStr = String(nextDate.getFullYear());
    const nextMonthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
    const nextDayStr = String(nextDate.getDate()).padStart(2, '0');
    const nextDateYmd = `${nextYearStr}${nextMonthStr}${nextDayStr}`;

    const compoundSummary = hanziForDay.compoundWords.map(w => `${w.hanzi} (${w.translation})`).join(', ');

    const descriptionText = [
      `🏮 Caractère du Jour : ${hanziForDay.character} (${hanziForDay.pinyin})`,
      `📖 Signification : ${hanziForDay.meaning}`,
      `🪓 Clé : ${hanziForDay.radical} (${hanziForDay.radicalMeaning}) • ${hanziForDay.strokeCount} traits • Niveau ${hanziForDay.level}`,
      `💡 Mnémonique : ${hanziForDay.mnemonic}`,
      `🧩 Mots composés : ${compoundSummary}`,
      `🎯 Exemple : ${hanziForDay.exampleSentence.chinese} (${hanziForDay.exampleSentence.translation})`,
      ``,
      `🔗 Ouvre Fluent sur ton iPhone : https://warm1t.github.io/chinois/`
    ].join('\\n');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:fluent-daily-hanzi-${dateYmd}@fluent.apple`);
    lines.push(`DTSTAMP:${nowStr}`);

    if (mode === 'all_day') {
      // Mode Toute la journée : reste affiché en permanence du matin au soir sur le widget iOS !
      lines.push(`DTSTART;VALUE=DATE:${dateYmd}`);
      lines.push(`DTEND;VALUE=DATE:${nextDateYmd}`);
      lines.push('TRANSP:TRANSPARENT'); // Ne bloque pas l'agenda de l'utilisateur
      lines.push(`SUMMARY:🇨🇳 ${hanziForDay.character} (${hanziForDay.pinyin}) — ${hanziForDay.meaning}`);
      lines.push(`DESCRIPTION:${descriptionText}`);
      lines.push('LOCATION:Fluent Mandarin App');
      lines.push('STATUS:CONFIRMED');

      // Alerte matinale à l'heure choisie (ex: 08:30)
      lines.push('BEGIN:VALARM');
      lines.push(`TRIGGER:PT${hours}H${minutes}M`);
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:🏮 Hanzi du Jour : ${hanziForDay.character} (${hanziForDay.pinyin}) — ${hanziForDay.meaning}`);
      lines.push('END:VALARM');
    } else {
      // Mode Créneau horaire planifié (ex: 08:30 - 08:45)
      const endMinutesInt = parseInt(minutes, 10) + 15;
      const endHourInt = parseInt(hours, 10) + Math.floor(endMinutesInt / 60);
      const endHourStr = String(endHourInt % 24).padStart(2, '0');
      const endMinuteStr = String(endMinutesInt % 60).padStart(2, '0');

      lines.push(`DTSTART:${dateYmd}T${hours}${minutes}00`);
      lines.push(`DTEND:${dateYmd}T${endHourStr}${endMinuteStr}00`);
      lines.push(`SUMMARY:🇨🇳 Hanzi du Jour : ${hanziForDay.character} (${hanziForDay.pinyin}) — ${hanziForDay.meaning}`);
      lines.push(`DESCRIPTION:${descriptionText}`);
      lines.push('LOCATION:Fluent Mandarin App');
      lines.push('STATUS:CONFIRMED');

      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-PT0M');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:🏮 Hanzi du Jour : ${hanziForDay.character} (${hanziForDay.pinyin}) — ${hanziForDay.meaning}`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
};
