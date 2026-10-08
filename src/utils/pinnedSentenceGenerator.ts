import { AnkiWord } from '../types/fluent';
import { EverydayPhrase } from '../data/everydayPhrasesData';

export interface PinnedWordSentenceOption {
  id: string;
  wordHanzi: string;
  wordPinyin: string;
  wordTranslation: string;
  phrase: EverydayPhrase;
}

// 1. Dictionnaire étendu de phrases authentiques du quotidien pour le vocabulaire fréquent
const CURATED_SENTENCES_BY_KEYWORD: Record<string, { hanzi: string; pinyin: string; french: string; situation: string; tip?: string; category: EverydayPhrase['category'] }[]> = {
  '咖啡': [
    {
      hanzi: '服务员，请给我一杯热美式咖啡，不加糖。',
      pinyin: 'Fúwùyuán, qǐng gěi wǒ yì bēi rè Měishì kāfēi, bù jiā táng.',
      french: 'Serveur, s’il vous plaît donnez-moi un café americano chaud, sans sucre.',
      situation: 'Commander dans un café ou un salon de thé.',
      tip: '不加糖 (bù jiā táng) = sans sucre ajouté.',
      category: 'restaurant'
    },
    {
      hanzi: '我习惯每天早上喝一杯咖啡提神。',
      pinyin: 'Wǒ xíguàn měitiān zǎoshang hē yì bēi kāfēi tíshén.',
      french: 'J’ai l’habitude de boire une tasse de café chaque matin pour me réveiller.',
      situation: 'Partager sa routine quotidienne.',
      tip: '提神 (tíshén) = donner un coup de fouet / réveiller l’esprit.',
      category: 'social'
    }
  ],
  '水': [
    {
      hanzi: '可以帮我倒一杯温水吗？谢谢！',
      pinyin: 'Kěyǐ bāng wǒ dào yì bēi wēn shuǐ ma? Xièxie!',
      french: 'Pouvez-vous me verser un verre d’eau tiède s’il vous plaît ? Merci !',
      situation: 'Au restaurant ou chez un hôte.',
      tip: 'En Chine, l’eau tiède (温水 wēnshuǐ) est la boisson de prédilection.',
      category: 'restaurant'
    }
  ],
  '茶': [
    {
      hanzi: '你喜欢喝绿茶还是红茶？',
      pinyin: 'Nǐ xǐhuan hē lǜchá háishì hóngchá?',
      french: 'Tu préfères boire du thé vert ou du thé noir ?',
      situation: 'Inviter un ami ou un collègue.',
      tip: '红茶 (thé rouge en chinois) correspond au thé noir occidental.',
      category: 'social'
    }
  ],
  '牛肉': [
    {
      hanzi: '老板，来一碗牛肉面，面条要劲道一点。',
      pinyin: 'Lǎobǎn, lái yì wǎn niúròumiàn, miàntiáo yào jìndao yìdiǎn.',
      french: 'Patron, apportez un bol de nouilles au bœuf, avec des nouilles bien fermes.',
      situation: 'Dans un petit resto de quartier.',
      tip: '劲道 (jìndao) = avec de la mâche / al dente.',
      category: 'restaurant'
    }
  ],
  '买单': [
    {
      hanzi: '服务员，我们这桌买单，微信扫码。',
      pinyin: 'Fúwùyuán, wǒmen zhè zhuō mǎidān, Wēixìn sǎomǎ.',
      french: 'Serveur, l’addition pour notre table, je règle par WeChat.',
      situation: 'En fin de repas au restaurant.',
      tip: '买单 (mǎidān) est très naturel et dynamique.',
      category: 'shopping'
    }
  ],
  '结账': [
    {
      hanzi: '老板，结账！请问一共多少钱？',
      pinyin: 'Lǎobǎn, jiézhàng! Qǐngwèn yígòng duōshao qián?',
      french: 'Patron, l’addition ! Combien cela fait au total s’il vous plaît ?',
      situation: 'Dans une échoppe ou un restaurant.',
      category: 'shopping'
    }
  ],
  '便宜': [
    {
      hanzi: '老板，买两个可以算便宜一点吗？',
      pinyin: 'Lǎobǎn, mǎi liǎng gè kěyǐ suàn piányi yìdiǎn ma?',
      french: 'Patron, si j’en prends deux, pouvez-vous me faire un petit prix ?',
      situation: 'Négocier gentiment sur un marché.',
      tip: '算便宜一点 (suàn piányi yìdiǎn) = faire un geste commercial.',
      category: 'shopping'
    }
  ],
  '贵': [
    {
      hanzi: '这个质量很好，虽然有点贵但很值。',
      pinyin: 'Zhè ge zhìliàng hěn hǎo, suīrán yǒudiǎn guì dàn hěn zhí.',
      french: 'La qualité est très bonne, bien qu’un peu chère, ça en vaut la peine.',
      situation: 'Donner son avis sur un achat.',
      category: 'shopping'
    }
  ],
  '地铁': [
    {
      hanzi: '请问去外滩坐地铁哪条线最快？',
      pinyin: 'Qǐngwèn qù Wàitān zuò dìtiě nǎ tiáo xiàn zuì kuài?',
      french: 'Pour aller au Bund, quelle ligne de métro est la plus rapide s’il vous plaît ?',
      situation: 'Demander son chemin dans le métro.',
      category: 'transport'
    }
  ],
  '出租车': [
    {
      hanzi: '师傅，我去高铁站，大概需要多长时间？',
      pinyin: 'Shīfu, wǒ qù gāotiě zhàn, dàgài xūyào duō cháng shíjiān?',
      french: 'Chauffeur, je vais à la gare TGV, combien de temps ça prendra environ ?',
      situation: 'En montant dans un taxi.',
      tip: '师傅 (shīfu) est la manière la plus polie d’appeler un chauffeur.',
      category: 'transport'
    }
  ],
  '机场': [
    {
      hanzi: '师傅，请开快一点，我赶着去机场登机。',
      pinyin: 'Shīfu, qǐng kāi kuài yìdiǎn, wǒ gǎnzhe qù jīchǎng dēngjī.',
      french: 'Chauffeur, accélérez un peu s’il vous plaît, je dois embarquer à l’aéroport.',
      situation: 'Course pressée en taxi vers l’aéroport.',
      category: 'transport'
    }
  ],
  '酒店': [
    {
      hanzi: '你好，我有预订，想办理入住手续。',
      pinyin: 'Nǐ hǎo, wǒ yǒu yùdìng, xiǎng bànlǐ rùzhù shǒuxù.',
      french: 'Bonjour, j’ai une réservation, je souhaite m’enregistrer.',
      situation: 'À la réception d’un hôtel.',
      category: 'housing'
    }
  ],
  '朋友': [
    {
      hanzi: '这周末我有几个朋友要来家里聚会。',
      pinyin: 'Zhè zhōumò wǒ yǒu jǐ gè péngyou yào lái jiālǐ jùhuì.',
      french: 'Ce week-end, quelques amis viennent à la maison pour se retrouver.',
      situation: 'Parler de ses plans avec ses amis.',
      category: 'social'
    }
  ],
  '工作': [
    {
      hanzi: '我最近工作有点忙，下班后再联系你。',
      pinyin: 'Wǒ zuìjìn gōngzuò yǒudiǎn máng, xiàbān hòu zài liánxì nǐ.',
      french: 'Je suis un peu débordé par le travail ces temps-ci, je te recontacte après le travail.',
      situation: 'Envoyer un message à un proche ou un collègue.',
      category: 'work'
    }
  ],
  '努力': [
    {
      hanzi: '只要每天努力练习，中文一定会越来越流利。',
      pinyin: 'Zhǐyào měitiān nǔlì liànxí, Zhōngwén yídìng huì yuèláiyuè liúlì.',
      french: 'Tant qu’on s’exerce avec assiduité chaque jour, notre chinois deviendra de plus en plus fluide.',
      situation: 'Encouragement et motivation personnelle.',
      category: 'social'
    }
  ],
  '学习': [
    {
      hanzi: '我觉得用讲故事的方式学习中文效果最好。',
      pinyin: 'Wǒ juéde yòng jiǎng gùshi de fāngshì xuéxí Zhōngwén xiàoguǒ zuì hǎo.',
      french: 'Je trouve qu’apprendre le chinois à travers des histoires est la méthode la plus efficace.',
      situation: 'Partager sa méthode d’apprentissage.',
      category: 'social'
    }
  ],
  '时间': [
    {
      hanzi: '明天下午你有没有时间？我们一起喝杯咖啡吧。',
      pinyin: 'Míngtiān xiàwǔ nǐ yǒu méiyǒu shíjiān? Wǒmen yìqǐ hē bēi kāfēi ba.',
      french: 'As-tu du temps demain après-midi ? Prenons un café ensemble.',
      situation: 'Proposer un rendez-vous amical.',
      category: 'social'
    }
  ],
  '医生': [
    {
      hanzi: '我感觉头有点疼，想去看一下医生。',
      pinyin: 'Wǒ gǎnjué tóu yǒudiǎn téng, xiǎng qù kàn yíxià yīshēng.',
      french: 'J’ai mal à la tête, je souhaite consulter un médecin.',
      situation: 'Exprimer un problème de santé.',
      category: 'health'
    }
  ],
  '头疼': [
    {
      hanzi: '医生，我从昨天开始有点头疼和发烧。',
      pinyin: 'Yīshēng, wǒ cóng zuótiān kāishǐ yǒudiǎn tóuténg hé fāshāo.',
      french: 'Docteur, depuis hier j’ai un peu mal à la tête et de la fièvre.',
      situation: 'Expliquer ses symptômes en consultation.',
      category: 'health'
    }
  ],
  '手机': [
    {
      hanzi: '我的手机快没电了，请问这里有充电宝吗？',
      pinyin: 'Wǒ de shǒujī kuài méidiàn le, qǐngwèn zhèlǐ yǒu chōngdiànbǎo ma?',
      french: 'Mon téléphone n’a presque plus de batterie, avez-vous une batterie partagée ici ?',
      situation: 'Dans un café ou restaurant en Chine.',
      tip: '充电宝 (chōngdiànbǎo) = batterie externe à louer en libre service.',
      category: 'reactions'
    }
  ],
  '密码': [
    {
      hanzi: '服务员，请问店里的无线网密码是多少？',
      pinyin: 'Fúwùyuán, qǐngwèn diàn lǐ de wúxiànwǎng mìmǎ shì duōshao?',
      french: 'Serveur, quel est le mot de passe du wifi s’il vous plaît ?',
      situation: 'Se connecter au wifi dans un commerce.',
      category: 'reactions'
    }
  ],
  '辣': [
    {
      hanzi: '我不太能吃辣，请帮我做微辣或者不辣。',
      pinyin: 'Wǒ bú tài néng chī là, qǐng bāng wǒ zuò wēilà huòzhě bùlà.',
      french: 'Je ne supporte pas très bien le piment, pouvez-vous faire très peu épicé ou sans piment ?',
      situation: 'Préciser ses restrictions culinaires.',
      tip: '微辣 (wēilà) = piment très léger.',
      category: 'restaurant'
    }
  ],
  '喜欢': [
    {
      hanzi: '我很喜欢这座城市的氛围，生活很方便。',
      pinyin: 'Wǒ hěn xǐhuan zhè zuò chéngshì de fēnwéi, shēnghuó hěn fāngbiàn.',
      french: 'J’aime beaucoup l’atmosphère de cette ville, la vie y est très pratique.',
      situation: 'Exprimer ses impressions de voyage ou de vie.',
      category: 'social'
    }
  ],
  '明白': [
    {
      hanzi: '我大概明白了，你能再说慢一点吗？',
      pinyin: 'Wǒ dàgài míngbai le, nǐ néng zài shuō màn yìdiǎn ma?',
      french: 'J’ai compris dans les grandes lignes, peux-tu répéter un peu plus lentement ?',
      situation: 'En pleine conversation avec un locuteur natif.',
      category: 'social'
    }
  ],
  '觉得': [
    {
      hanzi: '我觉得这个提议挺好的，大家都赞同。',
      pinyin: 'Wǒ juéde zhè ge tíyì tǐng hǎo de, dàjiā dōu zàntóng.',
      french: 'Je trouve que cette proposition est très bonne, tout le monde est d’accord.',
      situation: 'Donner son avis en réunion ou entre amis.',
      category: 'work'
    }
  ],
  '意思': [
    {
      hanzi: '这句话很有意思，是什么意思呢？',
      pinyin: 'Zhè jù huà hěn yǒu yìsi, shì shénme yìsi ne?',
      french: 'Cette expression est très intéressante, que veut-elle dire au juste ?',
      situation: 'Poser une question sur une tournure idiomatique.',
      category: 'reactions'
    }
  ],
  '天气': [
    {
      hanzi: '今天天气真舒服，不冷也不热。',
      pinyin: 'Jīntiān tiānqì zhēn shūfu, bù lěng yě bú rè.',
      french: 'Le temps est vraiment agréable aujourd’hui, ni trop froid ni trop chaud.',
      situation: 'Entamer une petite conversation de politesse.',
      category: 'social'
    }
  ],
  '回家': [
    {
      hanzi: '今天太累了，我想早点回家好好休息。',
      pinyin: 'Jīntiān tài lèi le, wǒ xiǎng zǎo diǎn huíjiā hǎohǎo xiūxi.',
      french: 'Je suis épuisé aujourd’hui, je veux rentrer tôt à la maison pour bien me reposer.',
      situation: 'Exprimer la fatigue après une longue journée.',
      category: 'reactions'
    }
  ],
  '散步': [
    {
      hanzi: '晚饭后我们一起去公园散散步吧。',
      pinyin: 'Wǎnfàn hòu wǒmen yìqǐ qù gōngyuán sànsan bù ba.',
      french: 'Après le dîner, allons faire une petite promenade dans le parc.',
      situation: 'Proposer une activité détente en fin de journée.',
      category: 'social'
    }
  ]
};

// 2. Modèles de patrons syntaxiques naturels pour tout mot personnalisé
const FALLBACK_TEMPLATES = [
  {
    makeHanzi: (word: string) => `在日常生活中，我经常用到“${word}”这个表达。`,
    makePinyin: (wordPinyin: string) => `Zài rìcháng shēnghuó zhōng, wǒ jīngcháng yòng dào "${wordPinyin}" zhè ge biǎodá.`,
    makeFrench: (wordTrans: string) => `Dans la vie quotidienne, j’utilise souvent l’expression liée à « ${wordTrans} ».`,
    situation: 'Mise en contexte conversationnelle active',
    category: 'social' as const,
  },
  {
    makeHanzi: (word: string) => `请问在这种情况，我可以说“${word}”吗？`,
    makePinyin: (wordPinyin: string) => `Qǐngwèn zài zhè zhǒng qíngkuàng, wǒ kěyǐ shuō "${wordPinyin}" ma?`,
    makeFrench: (wordTrans: string) => `Dans cette situation, puis-je employer « ${wordTrans} » s’il vous plaît ?`,
    situation: 'Valider l’usage naturel avec un interlocuteur',
    category: 'reactions' as const,
  },
  {
    makeHanzi: (word: string) => `关于“${word}”，你能给我举一个更地道的例子吗？`,
    makePinyin: (wordPinyin: string) => `Guānyú "${wordPinyin}", nǐ néng gěi wǒ jǔ yí gè gèng dìdao de lìzi ma?`,
    makeFrench: (wordTrans: string) => `À propos de « ${wordTrans} », peux-tu me donner un exemple encore plus authentique ?`,
    situation: 'Pratique interactive d’approfondissement',
    category: 'work' as const,
  }
];

/**
 * Génère une liste de phrases pratiques du quotidien pour un mot épinglé donné.
 * Priorise les phrases authentiques enregistrées ou construites spécialement.
 */
export const generateSentencesForWord = (word: AnkiWord): EverydayPhrase[] => {
  const cleanHanzi = word.hanzi.trim();
  const cleanPinyin = (word.pinyin || '').trim();
  const cleanTranslation = (word.translation || cleanHanzi).trim();
  const results: EverydayPhrase[] = [];

  // A. Si le mot avait déjà une phrase d'exemple personnalisée enregistrée
  if (word.exampleSentence && word.exampleSentence.trim().length > 0) {
    results.push({
      id: `gen-${word.id}-custom-example`,
      category: 'social',
      categoryLabel: 'Exemple Enregistré',
      categoryIcon: '⭐',
      hanzi: word.exampleSentence.trim(),
      pinyin: (word.examplePinyin || '').trim() || cleanPinyin,
      french: (word.exampleTranslation || '').trim() || `Phrase d'usage avec ${cleanHanzi}`,
      situation: `Exemple direct lié à « ${cleanHanzi} »`,
      tip: `Mot cible : ${cleanHanzi} (${cleanPinyin})`,
      difficulty: 'Indispensable',
    });
  }

  // B. Chercher une correspondance exacte ou partielle dans les phrases authentiques
  let matchedEntries: { hanzi: string; pinyin: string; french: string; situation: string; tip?: string; category: EverydayPhrase['category'] }[] = [];

  if (CURATED_SENTENCES_BY_KEYWORD[cleanHanzi]) {
    matchedEntries = CURATED_SENTENCES_BY_KEYWORD[cleanHanzi];
  } else {
    // Recherche par inclusion (ex: si le mot est "喝咖啡" ou "一杯咖啡")
    for (const [key, entries] of Object.entries(CURATED_SENTENCES_BY_KEYWORD)) {
      if (cleanHanzi.includes(key) || key.includes(cleanHanzi)) {
        matchedEntries = entries;
        break;
      }
    }
  }

  matchedEntries.forEach((entry, idx) => {
    results.push({
      id: `gen-${word.id}-curated-${idx}`,
      category: entry.category,
      categoryLabel: entry.category === 'restaurant' ? 'Restaurant & Café' : entry.category === 'transport' ? 'Transports' : entry.category === 'shopping' ? 'Achats' : entry.category === 'work' ? 'Travail' : entry.category === 'health' ? 'Santé' : 'Vie Quotidienne',
      categoryIcon: entry.category === 'restaurant' ? '🍜' : entry.category === 'transport' ? '🚕' : entry.category === 'shopping' ? '🛍️' : entry.category === 'work' ? '💼' : entry.category === 'health' ? '🏥' : '💬',
      hanzi: entry.hanzi,
      pinyin: entry.pinyin,
      french: entry.french,
      situation: entry.situation,
      tip: entry.tip || `Contient ton mot épinglé : ${cleanHanzi}`,
      difficulty: 'Courant',
    });
  });

  // C. Si aucune phrase authentique trouvée ou s'il en faut au moins 2, appliquer les patrons contextuels intelligents
  if (results.length < 2) {
    FALLBACK_TEMPLATES.forEach((tmpl, idx) => {
      if (results.length >= 3) return;
      results.push({
        id: `gen-${word.id}-tmpl-${idx}`,
        category: tmpl.category,
        categoryLabel: 'Mise en Pratique',
        categoryIcon: '💡',
        hanzi: tmpl.makeHanzi(cleanHanzi),
        pinyin: tmpl.makePinyin(cleanPinyin || cleanHanzi),
        french: tmpl.makeFrench(cleanTranslation),
        situation: tmpl.situation,
        tip: `Intègre « ${cleanHanzi} » dans une phrase complète et fluide.`,
        difficulty: 'Courant',
      });
    });
  }

  return results;
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

