export interface AiCharAnalysis {
  targetChar: string;
  spokenChar?: string;
  targetPinyin?: string;
  spokenPinyin?: string;
  status: 'exact' | 'substituted' | 'omitted' | 'extra';
  explanation?: string;
}

export interface AiPronunciationFeedback {
  targetText: string;
  spokenText: string;
  accuracyScore: number;
  status: 'mastered' | 'good' | 'hesitant' | 'poor';
  summaryTitle: string;
  aiDiagnosis: string;
  actionableTip: string;
  characterBreakdown: AiCharAnalysis[];
  isPassed: boolean; // Nécessite >= 80% ET aucune omission majeure
}

// Table de repères phonétiques des confusions fréquentes en mandarin (Tons & Consonnes)
const COMMON_PHONETIC_PAIRS: Record<string, { expectedPinyin: string; tip: string }> = {
  '买': { expectedPinyin: 'mǎi (3e ton)', tip: "Ne confonds pas 买 (mǎi, 3e ton creusé = acheter) avec 卖 (mài, 4e ton sec = vendre)." },
  '卖': { expectedPinyin: 'mài (4e ton)', tip: "Veille à bien faire chuter le ton pour 卖 (mài, 4e ton = vendre)." },
  '问': { expectedPinyin: 'wèn (4e ton)', tip: "Chute nette sur 问 (wèn). Attention à ne pas faire le 2e ton monté (wén = sentir/entendre)." },
  '结账': { expectedPinyin: 'jiézhàng (2e + 4e)', tip: "Attention : '结' monte au 2e ton (jié), et '账' chute au 4e ton (zhàng). Ne pas adoucir en 1er ton !" },
  '水': { expectedPinyin: 'shuǐ (3e ton)', tip: "Attention à la voyelle creusée au 3e ton (shuǐ) pour éviter la confusion avec 睡 (shuì, 4e ton = dormir)." },
  '辣': { expectedPinyin: 'là (4e ton)', tip: "Prononce fermement avec une descente franche pour 辣 (là, pimenté)." },
  '多少': { expectedPinyin: 'duōshao (1er + neutre)', tip: "'多' doit rester bien haut et plat (1er ton 55), ne le fais pas monter ni descendre." },
  '师傅': { expectedPinyin: 'shīfu (1er + neutre)', tip: "Consonne rétroflexe 'sh' : langue relevée vers le palais. 'fu' est léger et neutre." },
  '地铁': { expectedPinyin: 'dìtiě (4e + 3e)', tip: "'地' (4e ton descendant) suivi de '铁' (3e ton plongeant). Deux tons opposés à bien marquer." },
  '可以': { expectedPinyin: 'kěyǐ (3e + 3e -> 2e + 3e)', tip: "Règle de sandhi tonal : deux 3e tons consécutifs transforment '可' en 2e ton monté (ké-yǐ) !" },
  '扫码': { expectedPinyin: 'sǎomǎ (3e + 3e -> 2e + 3e)', tip: "Sandhi tonal : '扫' devient 2e ton monté (sáo-mǎ) devant un autre 3e ton." },
  '打包': { expectedPinyin: 'dǎbāo (3e + 1er)', tip: "'打' creuse bien dans les graves (3e ton) avant d'attaquer '包' haut et plat (1er ton)." },
  '便宜': { expectedPinyin: 'piányi (2e + neutre)', tip: "'便' monte franchement (pián) et '宜' est murmuré sans accent (yi)." },
  '试穿': { expectedPinyin: 'shìchuān (4e + 1er)', tip: "Rétroflexes 'sh' et 'ch' : ne pas prononcer comme 's' ou 'ts' français." },
  '谢谢': { expectedPinyin: 'xièxie (4e + neutre)', tip: "Le premier '谢' chute vigoureusement, le second s'éteint sans énergie." },
  '不': { expectedPinyin: 'bù / bú', tip: "Règle de ton : '不' est au 4e ton (bù), mais devient 2e ton (bú) devant un 4e ton (ex: 不是 bú shì, 不对 bú duì) !" },
};

/**
 * Algorithme d'alignement de séquences Needleman-Wunsch (Programmation Dynamique)
 * Évite rigoureusement l'illusion de l'ancien 'includes()' qui validait des phrases fausses.
 */
export const analyzePronunciationWithAi = (
  spokenRaw: string,
  targetRaw: string
): AiPronunciationFeedback => {
  const cleanTarget = targetRaw.replace(/[^\u4e00-\u9fa5]/g, '');
  const cleanSpoken = spokenRaw.replace(/[^\u4e00-\u9fa5]/g, '');

  if (!cleanSpoken) {
    return {
      targetText: cleanTarget,
      spokenText: '',
      accuracyScore: 0,
      status: 'poor',
      summaryTitle: 'Micro inactif ou aucun son capté',
      aiDiagnosis: "La reconnaissance n'a détecté aucun mot chinois. Assure-toi d'autoriser le micro, de t'approcher et d'articuler clairement.",
      actionableTip: "Maintiens le micro allumé et commence à lire dès que le voyant clignote en rouge.",
      characterBreakdown: cleanTarget.split('').map(char => ({
        targetChar: char,
        status: 'omitted',
        explanation: 'Non prononcé',
      })),
      isPassed: false,
    };
  }

  const t = cleanTarget.split('');
  const s = cleanSpoken.split('');
  const m = t.length;
  const n = s.length;

  // Matrice de programmation dynamique pour l'alignement optimal
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = -i * 1.5;
  for (let j = 0; j <= n; j++) dp[0][j] = -j * 0.8;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const isMatch = t[i - 1] === s[j - 1];
      const matchScore = isMatch ? 2 : -1.2;
      dp[i][j] = Math.max(
        dp[i - 1][j - 1] + matchScore, // Substitution ou Match
        dp[i - 1][j] - 1.5,            // Omission dans ce qui a été dit
        dp[i][j - 1] - 0.8             // Insertion d'un mot parasite
      );
    }
  }

  // Backtracking pour extraire l'alignement précis
  let i = m;
  let j = n;
  const alignedTarget: (string | null)[] = [];
  const alignedSpoken: (string | null)[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const isMatch = t[i - 1] === s[j - 1];
      const matchScore = isMatch ? 2 : -1.2;
      if (dp[i][j] === dp[i - 1][j - 1] + matchScore) {
        alignedTarget.unshift(t[i - 1]);
        alignedSpoken.unshift(s[j - 1]);
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] - 1.5) {
      alignedTarget.unshift(t[i - 1]);
      alignedSpoken.unshift(null);
      i--;
    } else {
      alignedTarget.unshift(null);
      alignedSpoken.unshift(s[j - 1]);
      j--;
    }
  }

  // Analyse caractère par caractère
  const breakdown: AiCharAnalysis[] = [];
  let exactMatches = 0;
  let substitutedCount = 0;
  let omittedCount = 0;
  const phoneticAlerts: string[] = [];

  for (let k = 0; k < alignedTarget.length; k++) {
    const targetChar = alignedTarget[k];
    const spokenChar = alignedSpoken[k];

    if (targetChar && spokenChar) {
      if (targetChar === spokenChar) {
        breakdown.push({
          targetChar,
          spokenChar,
          status: 'exact',
        });
        exactMatches++;
      } else {
        // Substitution détectée : l'utilisateur a confondu un mot ou un ton !
        const pairInfo = COMMON_PHONETIC_PAIRS[targetChar];
        const explanation = pairInfo 
          ? `Attendu: ${pairInfo.expectedPinyin} — Tu as dit '${spokenChar}'`
          : `Remplacé par '${spokenChar}' (son ou ton décalé)`;

        if (pairInfo) {
          phoneticAlerts.push(pairInfo.tip);
        }

        breakdown.push({
          targetChar,
          spokenChar,
          status: 'substituted',
          explanation,
        });
        substitutedCount++;
      }
    } else if (targetChar && !spokenChar) {
      // Caractère omis
      breakdown.push({
        targetChar,
        status: 'omitted',
        explanation: 'Syllabe escamotée ou inaudible',
      });
      omittedCount++;
    } else if (!targetChar && spokenChar) {
      // Caractère parasite ajouté
      breakdown.push({
        targetChar: '',
        spokenChar,
        status: 'extra',
        explanation: `Syllabe parasite '${spokenChar}'`,
      });
    }
  }

  // Calcul du score rigoureux (Pas de complaisance : chaque erreur pénalise justement le score)
  const maxPossible = cleanTarget.length * 2;
  const earned = (exactMatches * 2) - (substitutedCount * 1.5) - (omittedCount * 2);
  const rawPercentage = Math.round((earned / maxPossible) * 100);
  const accuracyScore = Math.max(0, Math.min(100, rawPercentage));

  // Diagnostic IA
  let status: 'mastered' | 'good' | 'hesitant' | 'poor';
  let summaryTitle = '';
  let aiDiagnosis = '';
  let actionableTip = '';

  const isPassed = accuracyScore >= 80 && omittedCount <= 1;

  if (accuracyScore >= 90) {
    status = 'mastered';
    summaryTitle = "太棒了 ! Prononciation et tons impeccables";
    aiDiagnosis = "L'alignement phonétique est parfait. Tes sons rétroflexes, voyelles et hauteurs de tons sont authentiques.";
    actionableTip = "Continue sur ce rythme ! Ta diction est parfaitement intelligible pour un locuteur natif.";
  } else if (accuracyScore >= 75) {
    status = 'good';
    summaryTitle = "Très bonne diction, quelques nuances à verrouiller";
    aiDiagnosis = `Tu as correctement placé ${exactMatches}/${cleanTarget.length} caractères. ${
      substitutedCount > 0 ? `Attention aux confusions sur : ${breakdown.filter(b => b.status === 'substituted').map(b => b.targetChar).join(', ')}.` : ''
    }`;
    actionableTip = phoneticAlerts[0] || "Réécoute la phrase au ralenti 0.5x et accentue la hauteur des tons rouges avant de retester.";
  } else if (accuracyScore >= 50) {
    status = 'hesitant';
    summaryTitle = "Phrase comprise mais plusieurs tons décalés";
    aiDiagnosis = `La reconnaissance a eu du mal sur ${substitutedCount + omittedCount} syllabes. Lorsque les tons sont approximatifs, le sens de la phrase se déforme.`;
    actionableTip = phoneticAlerts[0] || "Fais une pause, utilise le mode 'Miroir : Natif ➔ Toi' pour comparer la mélodie, puis répète distinctement.";
  } else {
    status = 'poor';
    summaryTitle = "Énonciation trop éloignée du modèle";
    aiDiagnosis = "La transcription obtenue (« " + cleanSpoken + " ») diverge fortement de la phrase cible (« " + cleanTarget + " »).";
    actionableTip = "Passe en lecture 0.5x (ultra-lente), écoute 2 fois la phrase pour bien imprimer les hauteurs, puis réessaie sans te précipiter.";
  }

  return {
    targetText: cleanTarget,
    spokenText: cleanSpoken,
    accuracyScore,
    status,
    summaryTitle,
    aiDiagnosis,
    actionableTip,
    characterBreakdown: breakdown,
    isPassed,
  };
};

