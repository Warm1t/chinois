/**
 * chinesePhonetics.ts
 * 
 * Moteur phonétique et d'alignement pour le mandarin :
 * 1. Normalisation 繁简转换 (Traditionnel -> Simplifié) pour corriger les transcriptions iOS/macOS Siri.
 * 2. Dictionnaire phonétique Pinyin et équivalence homophone (他/她/它, 的/得/地, 在/再, 买/買, etc.).
 * 3. Nettoyage des interjections et bruits parasites de la reconnaissance vocale.
 * 4. Alignement intelligent par fenêtre optimale (pour garantir 100% à un locuteur natif).
 */

// Table de conversion Traditionnel -> Simplifié pour les sinogrammes fréquents
export const TRADITIONAL_TO_SIMPLIFIED_MAP: Record<string, string> = {
  '這': '这', '個': '个', '們': '们', '點': '点', '買': '买', '賣': '卖',
  '錢': '钱', '會': '会', '話': '话', '說': '说', '讓': '让', '請': '请',
  '謝': '谢', '麼': '么', '樣': '样', '後': '后', '邊': '边', '幾': '几',
  '誰': '谁', '聽': '听', '書': '书', '歡': '欢', '迎': '迎', '嗎': '吗',
  '識': '识', '開': '开', '間': '间', '覺': '觉', '認': '认', '為': '为',
  '兒': '儿', '頭': '头', '東': '东', '機': '机', '車': '车', '飯': '饭',
  '麵': '面', '號': '号', '師': '师', '傅': '傅', '掃': '扫', '碼': '码',
  '賬': '账', '帳': '账', '結': '结', '條': '条', '隻': '只', '雙': '双',
  '兩': '两', '過': '过', '動': '动', '學': '学', '漢': '汉', '語': '语',
  '國': '国', '時': '时', '現': '现', '電': '电', '視': '视', '影': '影',
  '門': '门', '問': '问', '題': '题', '對': '对', '給': '给', '經': '经',
  '從': '从', '來': '来', '幫': '帮', '難': '难', '長': '长', '還': '还',
  '進': '进', '關': '关', '係': '系', '無': '无', '論': '论', '雖': '虽',
  '總': '总', '變': '变', '熱': '热', '貴': '贵', '紅': '红', '綠': '绿',
  '藍': '蓝', '黃': '黄', '黑': '黑', '帶': '带', '辦': '办', '發': '发',
  '選': '选', '擇': '择', '準': '准', '備': '备', '試': '试', '單': '单',
  '鐵': '铁', '場': '场', '鍵': '键', '盤': '盘', '腦': '脑', '網': '网',
  '絡': '络', '連': '连', '斷': '断', '啟': '启', '喫': '吃', '著': '着',
};

// Dictionnaire de syllabes Pinyin sans accent pour équivalence phonétique
export const PINYIN_LOOKUP: Record<string, string> = {
  // Prononciations & homophones fréquents
  '他': 'ta', '她': 'ta', '它': 'ta', '牠': 'ta',
  '的': 'de', '得': 'de', '地': 'de',
  '在': 'zai', '再': 'zai',
  '做': 'zuo', '作': 'zuo', '坐': 'zuo', '座': 'zuo',
  '那': 'na', '哪': 'na',
  '这': 'zhe', '這': 'zhe',
  '买': 'mai', '買': 'mai', '卖': 'mai', '賣': 'mai',
  '点': 'dian', '點': 'dian',
  '个': 'ge', '個': 'ge',
  '了': 'le',
  '过': 'guo', '過': 'guo',
  '着': 'zhe', '著': 'zhe',
  '把': 'ba', '爸': 'ba', '吧': 'ba',
  '被': 'bei', '杯': 'bei', '北': 'bei',
  '是': 'shi', '事': 'shi', '市': 'shi', '十': 'shi', '时': 'shi', '時': 'shi',
  '不': 'bu', '步': 'bu',
  '没': 'mei', '每': 'mei', '美': 'mei',
  '有': 'you', '又': 'you', '右': 'you', '友': 'you',
  '和': 'he', '喝': 'he', '河': 'he',
  '很': 'hen',
  '好': 'hao', '号': 'hao', '號': 'hao',
  '大': 'da', '打': 'da',
  '小': 'xiao', '笑': 'xiao',
  '多': 'duo',
  '少': 'shao',
  '钱': 'qian', '錢': 'qian', '前': 'qian',
  '快': 'kuai', '块': 'kuai', '塊': 'kuai',
  '要': 'yao',
  '想': 'xiang', '像': 'xiang', '向': 'xiang',
  '去': 'qu',
  '来': 'lai', '來': 'lai',
  '吃': 'chi', '喫': 'chi',
  '看': 'kan',
  '听': 'ting', '聽': 'ting',
  '说': 'shuo', '說': 'shuo',
  '写': 'xie', '寫': 'xie',
  '读': 'du', '讀': 'du',
  '给': 'gei', '給': 'gei',
  '就': 'jiu', '九': 'jiu', '久': 'jiu', '酒': 'jiu',
  '都': 'dou',
  '还': 'hai', '還': 'hai',
  '真': 'zhen',
  '太': 'tai',
  '最': 'zui',
  '已': 'yi', '以': 'yi', '一': 'yi', '衣': 'yi', '医': 'yi', '意': 'yi',
  '经': 'jing', '經': 'jing',
  '能': 'neng',
  '会': 'hui', '會': 'hui',
  '对': 'dui', '對': 'dui',
  '错': 'cuo', '錯': 'cuo',
  '起': 'qi', '氣': 'qi', '气': 'qi', '七': 'qi',
  '包': 'bao',
  '扫': 'sao', '掃': 'sao',
  '码': 'ma', '碼': 'ma', '吗': 'ma', '嗎': 'ma', '妈': 'ma', '媽': 'ma',
  '师': 'shi', '師': 'shi',
  '傅': 'fu',
  '辣': 'la',
  '水': 'shui', '睡': 'shui',
  '铁': 'tie', '鐵': 'tie',
  '站': 'zhan',
  '问': 'wen', '問': 'wen', '文': 'wen',
  '常': 'chang',
  '往': 'wang',
  '连': 'lian', '連': 'lian',
  '越': 'yue',
  '虽': 'sui', '雖': 'sui',
  '然': 'ran',
  '但': 'dan',
  '只': 'zhi', '隻': 'zhi', '支': 'zhi', '知': 'zhi',
  '完': 'wan', '晚': 'wan',
  '懂': 'dong', '动': 'dong', '東': 'dong', '东': 'dong',
  '见': 'jian', '見': 'jian', '件': 'jian',
  '到': 'dao', '道': 'dao',
  '双': 'shuang', '雙': 'shuang',
  '条': 'tiao', '條': 'tiao',
  '张': 'zhang', '張': 'zhang', '账': 'zhang', '賬': 'zhang',
  '结': 'jie', '結': 'jie',
  '试': 'shi', '試': 'shi',
  '穿': 'chuan',
  '便': 'pian',
  '宜': 'yi',
  '谢': 'xie', '謝': 'xie',
  '客': 'ke',
  '请': 'qing', '請': 'qing',
  '人': 'ren',
  '家': 'jia',
  '国': 'guo', '國': 'guo',
  '中': 'zhong',
  '汉': 'han', '漢': 'han',
  '语': 'yu', '語': 'yu',
  '年': 'nian',
  '月': 'yue',
  '日': 'ri',
  '天': 'tian',
  '星': 'xing',
  '期': 'qi',
  '分': 'fen',
  '钟': 'zhong', '鐘': 'zhong',
  '现': 'xian', '現': 'xian',
  '几': 'ji', '幾': 'ji',
  '什': 'shen',
  '么': 'me', '麼': 'me',
  '谁': 'shui', '誰': 'shui',
  '儿': 'er', '兒': 'er',
  '怎': 'zen',
  '样': 'yang', '樣': 'yang',
};

/**
 * Normalise un texte chinois en sinogrammes simplifiés et retire la ponctuation
 */
export const normalizeChineseText = (text: string): string => {
  if (!text) return '';
  return text
    .split('')
    .map(char => TRADITIONAL_TO_SIMPLIFIED_MAP[char] || char)
    .join('')
    .replace(/[^\u4e00-\u9fa5]/g, '')
    .trim();
};

/**
 * Vérifie si deux caractères chinois sont équivalents (même sinogramme, variante traditionnel/simplifié, ou même pinyin)
 */
export const areCharsPhoneticallyEquivalent = (charA: string, charB: string): boolean => {
  if (!charA || !charB) return false;
  if (charA === charB) return true;

  // 1. Normalisation Traditionnel -> Simplifié
  const simpA = TRADITIONAL_TO_SIMPLIFIED_MAP[charA] || charA;
  const simpB = TRADITIONAL_TO_SIMPLIFIED_MAP[charB] || charB;
  if (simpA === simpB) return true;

  // 2. Homophones Pinyin identiques
  const pinyinA = PINYIN_LOOKUP[simpA] || PINYIN_LOOKUP[charA];
  const pinyinB = PINYIN_LOOKUP[simpB] || PINYIN_LOOKUP[charB];
  if (pinyinA && pinyinB && pinyinA === pinyinB) {
    return true;
  }

  return false;
};

export interface AlignmentResult {
  score: number; // 0 à 100
  matchedCount: number;
  targetLength: number;
  isExact: boolean;
  charMatches: { targetChar: string; spokenChar?: string; isMatch: boolean }[];
}

/**
 * Évalue la concordance orale entre la phrase cible et ce qui a été capté.
 * Utilise une recherche par fenêtre optimale pour être parfaitement indulgent
 * avec les hésitations ("euh...", "ah...") et garantir 100% à un locuteur natif.
 */
export const alignChineseSpeech = (spokenRaw: string, targetRaw: string): AlignmentResult => {
  const normTarget = normalizeChineseText(targetRaw);
  const normSpoken = normalizeChineseText(spokenRaw);

  if (!normTarget) {
    return { score: 100, matchedCount: 0, targetLength: 0, isExact: true, charMatches: [] };
  }
  if (!normSpoken) {
    return {
      score: 0,
      matchedCount: 0,
      targetLength: normTarget.length,
      isExact: false,
      charMatches: normTarget.split('').map(c => ({ targetChar: c, isMatch: false }))
    };
  }

  // 1. Cas idéal : égalité directe ou inclusion exacte
  if (normSpoken === normTarget || normSpoken.includes(normTarget)) {
    return {
      score: 100,
      matchedCount: normTarget.length,
      targetLength: normTarget.length,
      isExact: true,
      charMatches: normTarget.split('').map(c => ({ targetChar: c, spokenChar: c, isMatch: true }))
    };
  }

  const targetChars = normTarget.split('');
  const spokenChars = normSpoken.split('');

  // 2. Recherche de la meilleure fenêtre d'alignement
  const m = targetChars.length;
  const n = spokenChars.length;

  // dp[i][j] = score de correspondance max
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = areCharsPhoneticallyEquivalent(targetChars[i - 1], spokenChars[j - 1]);
      const matchBonus = match ? 2 : -0.5;
      dp[i][j] = Math.max(
        dp[i - 1][j - 1] + matchBonus,
        dp[i - 1][j], // omission
        dp[i][j - 1]  // insertion / filler
      );
    }
  }

  // Backtracking pour extraire les correspondances
  let i = m;
  let j = n;
  const matchesRev: { targetChar: string; spokenChar?: string; isMatch: boolean }[] = [];
  let currentMatches = 0;

  while (i > 0) {
    if (j > 0 && areCharsPhoneticallyEquivalent(targetChars[i - 1], spokenChars[j - 1])) {
      matchesRev.push({
        targetChar: targetChars[i - 1],
        spokenChar: spokenChars[j - 1],
        isMatch: true,
      });
      currentMatches++;
      i--;
      j--;
    } else if (j > 0 && dp[i][j - 1] >= dp[i - 1][j]) {
      // Caractère spoken parasite (filler, hésitation)
      j--;
    } else {
      // Caractère cible non prononcé
      matchesRev.push({
        targetChar: targetChars[i - 1],
        isMatch: false,
      });
      i--;
    }
  }

  const bestCharMatches = matchesRev.reverse();
  const bestMatchedCount = currentMatches;

  // Calcul du score en pourcentage pur (sans pénalité arbitraire destructrice)
  const score = Math.min(100, Math.round((bestMatchedCount / m) * 100));
  const isExact = score === 100;

  return {
    score,
    matchedCount: bestMatchedCount,
    targetLength: m,
    isExact,
    charMatches: bestCharMatches
  };
};
