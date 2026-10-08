import { AnkiWord } from '../types/fluent';
import { triggerAutoSyncToCloud } from './cloudSyncUtils';
import { lookupPinyinForText } from './chinesePhonetics';

export const DEFAULT_ANKI_URL = 'http://127.0.0.1:8765';

export const getAnkiConnectUrl = (): string => {
  return localStorage.getItem('fluent_anki_server_url') || DEFAULT_ANKI_URL;
};

export const setAnkiConnectUrl = (url: string) => {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  localStorage.setItem('fluent_anki_server_url', cleanUrl);
};

// 1. Appel RPC vers AnkiConnect (Tente d'abord le proxy Vite /anki-api pour contourner CORS, puis direct)
export const invokeAnkiConnect = async (action: string, params: Record<string, any> = {}): Promise<any> => {
  const payload = JSON.stringify({ action, version: 6, params });
  const directUrl = getAnkiConnectUrl();

  try {
    const res = await fetch('/anki-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    if (res.ok) {
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.result;
    }
  } catch (err) {
    // Si le proxy échoue ou qu'on est sur GitHub Pages (404), on tente en direct
  }

  const directRes = await fetch(directUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  });

  if (!directRes.ok) {
    throw new Error(`AnkiConnect HTTP error: ${directRes.status}`);
  }

  const data = await directRes.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
};

// 2. Tester si Anki tourne actuellement sur la machine
export const checkAnkiConnection = async (): Promise<boolean> => {
  try {
    const version = await invokeAnkiConnect('version');
    return typeof version === 'number';
  } catch (e) {
    return false;
  }
};

// 3. Récupérer les noms de tous les decks Anki de l'utilisateur
export const getAnkiDeckNames = async (): Promise<string[]> => {
  return await invokeAnkiConnect('deckNames');
};

// Nettoyer les champs de carte Anki (retirer HTML, &nbsp;, etc.)
const cleanField = (s: string) => {
  return (s || '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
};

// 4. Récupérer les statistiques de cartes pour chaque paquet
export const getDeckStats = async (): Promise<{ name: string; count: number }[]> => {
  const deckNames = await getAnkiDeckNames();
  const stats: { name: string; count: number }[] = [];

  for (const name of deckNames) {
    try {
      const noteIds = await invokeAnkiConnect('findNotes', { query: `deck:"${name}"` });
      stats.push({ name, count: noteIds?.length || 0 });
    } catch {
      stats.push({ name, count: 0 });
    }
  }

  return stats;
};

// 5. Importer les cartes d'un seul paquet
export const fetchWordsFromDeck = async (deckName: string): Promise<AnkiWord[]> => {
  return await fetchWordsFromDecks([deckName]);
};

// 6. SYNCHRONISATION MULTI-PAQUETS (Tous les paquets ou sélection groupée)
export const fetchWordsFromDecks = async (deckNames: string[]): Promise<AnkiWord[]> => {
  const allWords: AnkiWord[] = [];

  for (const deckName of deckNames) {
    try {
      const noteIds = await invokeAnkiConnect('findNotes', { query: `deck:"${deckName}"` });
      if (!noteIds || noteIds.length === 0) continue;

      const notes = await invokeAnkiConnect('notesInfo', { notes: noteIds });

      notes.forEach((note: any) => {
        const fields = note.fields;
        let hanzi = '';
        let pinyin = '';
        let translation = '';

        // Détection automatique intelligente : Recto/Verso français et Front/Back
        for (const [key, val] of Object.entries(fields)) {
          const fieldVal = cleanField((val as any).value || '');
          const lowerKey = key.toLowerCase();

          if (lowerKey.includes('pinyin')) {
            pinyin = fieldVal;
          } else if (/[\u4e00-\u9fa5]/.test(fieldVal)) {
            // Contient des caractères chinois -> c'est le Hanzi !
            hanzi = fieldVal;
          } else if (fieldVal.length > 0) {
            // Texte sans hanzi (ex: traduction française)
            translation = fieldVal;
          }
        }

        if (hanzi) {
          allWords.push({
            id: `anki-${note.noteId}`,
            hanzi,
            pinyin,
            translation,
            deckName,
            source: 'imported_from_anki',
            syncedToAnkiDesktop: true,
            addedAt: new Date().toISOString(),
          });
        }
      });
    } catch (err) {
      console.warn(`Erreur lors de la récupération du deck ${deckName}:`, err);
    }
  }

  // Déduplication intelligente par caractère chinois (si un mot est présent dans 2 paquets)
  const seenHanzi = new Set<string>();
  const uniqueWords: AnkiWord[] = [];

  for (const word of allWords) {
    if (!seenHanzi.has(word.hanzi)) {
      seenHanzi.add(word.hanzi);
      uniqueWords.push(word);
    }
  }

  return uniqueWords;
};

// 7. Analyseur d'exportation de fichier texte/CSV ou JSON Anki (Glisser-Déposer ou Copier-Coller)
export const parseAnkiTextExport = (rawText: string, deckName: string = 'Export Anki'): AnkiWord[] => {
  const trimmedText = rawText.trim();

  // Détection si c'est un export JSON Fluent
  if (trimmedText.startsWith('[') && trimmedText.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmedText);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item: any) => item && item.hanzi && /[\u4e00-\u9fa5]/.test(item.hanzi))
          .map((item: any, idx: number) => ({
            id: item.id || `json-${Date.now()}-${idx}`,
            hanzi: item.hanzi.trim(),
            pinyin: item.pinyin?.trim() || '',
            translation: item.translation?.trim() || '',
            deckName: item.deckName || deckName,
            source: item.source || 'imported_from_anki',
            syncedToAnkiDesktop: item.syncedToAnkiDesktop ?? false,
            addedAt: item.addedAt || new Date().toISOString(),
          }));
      }
    } catch {
      // Si ce n'est pas un JSON valide, continuer en format texte standard
    }
  }

  const lines = rawText.split('\n');
  const words: AnkiWord[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    // Découpage par tabulation (export Anki standard) ou point-virgule
    const parts = trimmed.includes('\t') ? trimmed.split('\t') : trimmed.split(';');

    const hanzi = parts[0]?.trim();
    const pinyin = parts[1]?.trim() || '';
    const translation = parts[2]?.trim() || parts[1]?.trim() || '';

    // Vérifier si la chaîne contient au moins un caractère chinois
    if (hanzi && /[\u4e00-\u9fa5]/.test(hanzi)) {
      words.push({
        id: `import-${Date.now()}-${idx}`,
        hanzi,
        pinyin,
        translation,
        deckName,
        source: 'imported_from_anki',
        syncedToAnkiDesktop: false,
        addedAt: new Date().toISOString(),
      });
    }
  });

  return words;
};

// 8. Exporter tous les mots au format JSON (Sauvegarde universelle pour mobile, tablette ou autre PC)
export const exportWordsToJson = (words: AnkiWord[]) => {
  const jsonString = JSON.stringify(words, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fluent-vocabulaire-anki-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 9. Exporter directement au format fichier texte compatible Anki (.txt tab-separated)
// Structure stricte à 3 champs :
// Champ 1 : Mot en chinois (Hanzi)
// Champ 2 : Pinyin (au milieu !)
// Champ 3 : Français (Traduction française + phrase d'exemple)
export const exportWordsToAnkiTextFile = (words: AnkiWord[], format: '3fields' | 'tsv' | 'basic' = '3fields') => {
  if (words.length === 0) return;

  let content = '';
  if (format === '3fields' || format === 'basic') {
    // Format standard à 3 champs stricts
    const lines = words.map(w => {
      const field1_hanzi = w.hanzi.trim();
      const field2_pinyin = (w.pinyin || lookupPinyinForText(w.hanzi) || '').trim();
      const exampleHtml = w.exampleSentence 
        ? `<div style="margin-top:8px;padding-top:6px;border-top:1px dashed #cbd5e1;font-size:0.88em;color:#0284c7"><b>Exemple :</b> ${w.exampleSentence}${w.examplePinyin ? `<br><small style="color:#64748b">${w.examplePinyin}</small>` : ''}${w.exampleTranslation ? `<br><i style="color:#334155">${w.exampleTranslation}</i>` : ''}</div>`
        : '';
      const field3_french = `${(w.translation || '').trim()}${exampleHtml}`;

      // Séparation par tabulation : Champ 1 (Chinois) \t Champ 2 (Pinyin) \t Champ 3 (Français)
      return `${field1_hanzi}\t${field2_pinyin}\t${field3_french}`;
    });
    content = `#separator:tab\n#html:true\n#tags:fluent-chinese\n#columns:Chinois\tPinyin\tFrançais\n` + lines.join('\n');
  } else {
    // Format 4 colonnes TSV brut
    const lines = words.map(w => {
      const field1_hanzi = w.hanzi.trim();
      const field2_pinyin = (w.pinyin || lookupPinyinForText(w.hanzi) || '').trim();
      const field3_french = (w.translation || '').trim();
      const field4_example = w.exampleSentence ? `${w.exampleSentence}${w.exampleTranslation ? ` (${w.exampleTranslation})` : ''}` : '';
      return `${field1_hanzi}\t${field2_pinyin}\t${field3_french}\t${field4_example}\tfluent-chinese`;
    });
    content = `#separator:tab\n#html:false\n#columns:Chinois\tPinyin\tFrançais\tExemple\ttags\n` + lines.join('\n');
  }

  const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fluent-cartes-anki-3champs-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 10. Copier la liste dans le presse-papier au format Anki (1-clic pour coller dans Anki)
// Structure : Champ 1: Chinois \t Champ 2: Pinyin \t Champ 3: Français
export const copyWordsToClipboardForAnki = async (words: AnkiWord[], format: '3fields' | 'tsv' | 'basic' = '3fields'): Promise<boolean> => {
  if (words.length === 0) return false;
  try {
    let content = '';
    if (format === '3fields' || format === 'basic') {
      const lines = words.map(w => {
        const field1_hanzi = w.hanzi.trim();
        const field2_pinyin = (w.pinyin || lookupPinyinForText(w.hanzi) || '').trim();
        const exampleHtml = w.exampleSentence 
          ? `<div style="margin-top:6px;font-size:0.9em;color:#0284c7">Exemple : ${w.exampleSentence} (${w.exampleTranslation || ''})</div>`
          : '';
        const field3_french = `${(w.translation || '').trim()}${exampleHtml}`;
        // Champ 1: Chinois \t Champ 2: Pinyin \t Champ 3: Français
        return `${field1_hanzi}\t${field2_pinyin}\t${field3_french}`;
      });
      content = `#separator:tab\n#html:true\n#tags:fluent-chinese\n#columns:Chinois\tPinyin\tFrançais\n` + lines.join('\n');
    } else {
      const lines = words.map(w => {
        const field1_hanzi = w.hanzi.trim();
        const field2_pinyin = (w.pinyin || lookupPinyinForText(w.hanzi) || '').trim();
        const field3_french = (w.translation || '').trim();
        const field4_example = w.exampleSentence || '';
        return `${field1_hanzi}\t${field2_pinyin}\t${field3_french}\t${field4_example}`;
      });
      content = lines.join('\n');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(content);
      return true;
    }
    return false;
  } catch (err) {
    console.warn("Erreur copie presse-papier Anki :", err);
    return false;
  }
};

// 11. Récupérer tous les mots de l'Anki local
export const getLocalAnkiWords = (): AnkiWord[] => {
  try {
    const raw = localStorage.getItem('fluent_anki_words');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// 12. Supprimer un mot spécifique de l'Anki local
export const deleteWordFromLocalAnki = (wordIdOrHanzi: string): boolean => {
  try {
    const words = getLocalAnkiWords();
    const filtered = words.filter(w => w.id !== wordIdOrHanzi && w.hanzi !== wordIdOrHanzi);
    localStorage.setItem('fluent_anki_words', JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words: filtered } }));
    triggerAutoSyncToCloud();
    return true;
  } catch (e) {
    console.warn("Erreur suppression mot Anki :", e);
    return false;
  }
};

// 13. Mettre à jour un mot (ex: ajout d'une phrase d'exemple)
export const updateWordInLocalAnki = (updated: AnkiWord): boolean => {
  try {
    const words = getLocalAnkiWords();
    const idx = words.findIndex(w => w.id === updated.id || w.hanzi === updated.hanzi);
    if (idx >= 0) {
      words[idx] = { ...words[idx], ...updated };
      localStorage.setItem('fluent_anki_words', JSON.stringify(words));
      window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words } }));
      triggerAutoSyncToCloud();
      return true;
    }
    return false;
  } catch (e) {
    console.warn("Erreur mise à jour mot Anki :", e);
    return false;
  }
};

// 14. Vider tous les mots de l'Anki local
export const clearAllLocalAnkiWords = (): void => {
  try {
    localStorage.removeItem('fluent_anki_words');
    window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words: [] } }));
    triggerAutoSyncToCloud();
  } catch (e) {
    console.warn("Erreur nettoyage Anki :", e);
  }
};

// 15. Garantir l'existence d'un modèle Anki à 3 champs stricts :
// Champ 1: Chinois (Hanzi)
// Champ 2: Pinyin (au milieu !)
// Champ 3: Français (Traduction française)
export const ensureFluentModelExists = async (): Promise<string> => {
  const modelName = 'Fluent-Chinois-3Champs';
  try {
    const existingModels = await invokeAnkiConnect('modelNames');
    if (existingModels && existingModels.includes(modelName)) {
      return modelName;
    }

    await invokeAnkiConnect('createModel', {
      modelName,
      inOrderFields: ['Chinois', 'Pinyin', 'Français'],
      css: `
        .card { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 20px; text-align: center; color: #1e293b; background-color: #ffffff; padding: 24px; }
        .chinese { font-size: 42px; font-weight: 900; color: #0f172a; margin-bottom: 12px; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; }
        .pinyin { font-size: 22px; color: #d97706; font-weight: 700; margin-bottom: 14px; font-family: ui-monospace, SFMono-Regular, monospace; }
        .french { font-size: 20px; color: #334155; font-weight: 500; }
        .example-box { margin-top: 18px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 15px; color: #0284c7; text-align: left; }
        .example-cn { font-weight: bold; font-size: 16px; color: #0369a1; }
        .example-py { color: #64748b; font-size: 13px; }
        .example-fr { color: #475569; font-style: italic; }
      `,
      cardTemplates: [
        {
          Name: "Reconnaissance (Chinois -> Pinyin + Français)",
          Front: "<div class=\"chinese\">{{Chinois}}</div>",
          Back: "<div class=\"chinese\">{{Chinois}}</div><hr id=\"answer\"><div class=\"pinyin\">{{Pinyin}}</div><div class=\"french\">{{Français}}</div>"
        }
      ]
    });
    return modelName;
  } catch (e) {
    return 'Basic';
  }
};

// Construit le payload d'une note Anki à 3 champs : Champ 1 Chinois, Champ 2 Pinyin (au milieu), Champ 3 Français
const buildAnkiNotePayload = (targetDeck: string, word: AnkiWord, modelName: string) => {
  const pinyin = (word.pinyin || lookupPinyinForText(word.hanzi) || '').trim();
  const exampleHtml = word.exampleSentence 
    ? `<div class="example-box" style="margin-top:14px;padding-top:10px;border-top:1px dashed #cbd5e1;font-size:14px;color:#0284c7"><b style="color:#0369a1">Exemple :</b> ${word.exampleSentence}${word.examplePinyin ? `<br><small style="color:#64748b">${word.examplePinyin}</small>` : ''}${word.exampleTranslation ? `<br><i style="color:#475569">${word.exampleTranslation}</i>` : ''}</div>`
    : '';

  if (modelName === 'Fluent-Chinois-3Champs') {
    return {
      deckName: targetDeck,
      modelName,
      fields: {
        'Chinois': word.hanzi.trim(),
        'Pinyin': pinyin,
        'Français': `${(word.translation || '').trim()}${exampleHtml}`
      },
      tags: ['fluent-chinese']
    };
  }

  // Fallback 'Basic' : Présentation en 3 sections avec Pinyin bien mis en valeur au milieu
  return {
    deckName: targetDeck,
    modelName: 'Basic',
    fields: {
      Front: word.hanzi.trim(),
      Back: `<div style="color:#d97706;font-size:1.15em;font-weight:bold;margin-bottom:8px;font-family:monospace">${pinyin}</div><div style="font-size:1.05em;color:#1e293b">${(word.translation || '').trim()}</div>${exampleHtml}`
    },
    tags: ['fluent-chinese']
  };
};

// 16. Enregistrer un mot ou une phrase directement dans la collection Anki locale
export const saveWordToLocalAnki = (wordData: {
  hanzi: string;
  pinyin?: string;
  translation?: string;
  deckName?: string;
  exampleSentence?: string;
  examplePinyin?: string;
  exampleTranslation?: string;
  source?: 'imported_from_anki' | 'fluent_to_anki';
}): { success: boolean; isNew: boolean; word: AnkiWord; totalCount: number; directAnkiSynced?: boolean } => {
  const cleanHanzi = wordData.hanzi.trim();
  if (!cleanHanzi) {
    return { success: false, isNew: false, word: null as any, totalCount: 0 };
  }

  // S'assurer que le Champ 2 (Pinyin au milieu) est toujours renseigné
  const resolvedPinyin = (wordData.pinyin || '').trim() || lookupPinyinForText(cleanHanzi);

  let words: AnkiWord[] = getLocalAnkiWords();

  const existingIndex = words.findIndex(w => w.hanzi === cleanHanzi);
  if (existingIndex >= 0) {
    let changed = false;
    if (!words[existingIndex].pinyin && resolvedPinyin) {
      words[existingIndex].pinyin = resolvedPinyin;
      changed = true;
    }
    if (wordData.exampleSentence && !words[existingIndex].exampleSentence) {
      words[existingIndex].exampleSentence = wordData.exampleSentence;
      words[existingIndex].examplePinyin = wordData.examplePinyin;
      words[existingIndex].exampleTranslation = wordData.exampleTranslation;
      changed = true;
    }
    if (changed) {
      try {
        localStorage.setItem('fluent_anki_words', JSON.stringify(words));
        window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words, newWord: words[existingIndex] } }));
        triggerAutoSyncToCloud();
      } catch {}
    }
    return { success: true, isNew: false, word: words[existingIndex], totalCount: words.length };
  }

  const targetDeck = wordData.deckName || 'Fluent';
  const targetSource = wordData.source || 'fluent_to_anki';

  // Carte Anki : Champ 1 (Chinois), Champ 2 (Pinyin au milieu), Champ 3 (Français)
  const newWord: AnkiWord = {
    id: `local-anki-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    hanzi: cleanHanzi,
    pinyin: resolvedPinyin,
    translation: (wordData.translation || '').trim(),
    deckName: targetDeck,
    source: targetSource,
    syncedToAnkiDesktop: false,
    addedAt: new Date().toISOString(),
    exampleSentence: wordData.exampleSentence,
    examplePinyin: wordData.examplePinyin,
    exampleTranslation: wordData.exampleTranslation,
  };

  words.unshift(newWord);

  try {
    localStorage.setItem('fluent_anki_words', JSON.stringify(words));
    window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words, newWord } }));
    triggerAutoSyncToCloud();
  } catch (e) {
    console.warn("Erreur sauvegarde locale Anki :", e);
  }

  // Tentative en arrière-plan d'injection directe dans Anki Desktop dans le paquet "Fluent" à 3 champs
  invokeAnkiConnect('createDeck', { deck: targetDeck })
    .then(async () => {
      const modelName = await ensureFluentModelExists();
      const notePayload = buildAnkiNotePayload(targetDeck, newWord, modelName);
      return invokeAnkiConnect('addNote', { note: notePayload });
    })
    .then((noteId) => {
      if (noteId) {
        newWord.syncedToAnkiDesktop = true;
        const currentWords = getLocalAnkiWords();
        const idx = currentWords.findIndex(w => w.id === newWord.id);
        if (idx >= 0) {
          currentWords[idx].syncedToAnkiDesktop = true;
          localStorage.setItem('fluent_anki_words', JSON.stringify(currentWords));
          window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words: currentWords } }));
          triggerAutoSyncToCloud();
        }
      }
    })
    .catch((err) => {
      console.warn("Anki Desktop direct note add not available:", err);
    });

  return { success: true, isNew: true, word: newWord, totalCount: words.length };
};

// 17. Synchroniser un mot précis en direct dans Anki Desktop
export const syncWordDirectlyToAnkiDesktop = async (word: AnkiWord): Promise<boolean> => {
  const targetDeck = word.deckName || 'Fluent';
  try {
    await invokeAnkiConnect('createDeck', { deck: targetDeck });
    const modelName = await ensureFluentModelExists();
    const notePayload = buildAnkiNotePayload(targetDeck, word, modelName);
    await invokeAnkiConnect('addNote', { note: notePayload });

    // Mettre à jour l'état local
    const words = getLocalAnkiWords();
    const idx = words.findIndex(w => w.id === word.id || w.hanzi === word.hanzi);
    if (idx >= 0) {
      words[idx].syncedToAnkiDesktop = true;
      localStorage.setItem('fluent_anki_words', JSON.stringify(words));
      window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words } }));
    }

    return true;
  } catch (err) {
    console.warn("Échec d'envoi dans Anki Desktop :", err);
    return false;
  }
};

// 18. Synchroniser tous les mots Fluent vers Anki Desktop (Paquet "Fluent")
export const syncAllFluentWordsToAnkiDesktop = async (): Promise<{ success: number; failed: number }> => {
  const words = getLocalAnkiWords();
  const fluentWords = words.filter(w => (w.source === 'fluent_to_anki' || w.deckName === 'Fluent' || !w.source));
  
  if (fluentWords.length === 0) return { success: 0, failed: 0 };

  try {
    await invokeAnkiConnect('createDeck', { deck: 'Fluent' });
  } catch (e) {
    return { success: 0, failed: fluentWords.length };
  }

  const modelName = await ensureFluentModelExists();
  let successCount = 0;
  let failedCount = 0;
  const updatedWords = [...words];

  for (const word of fluentWords) {
    try {
      const notePayload = buildAnkiNotePayload('Fluent', word, modelName);
      const noteId = await invokeAnkiConnect('addNote', { note: notePayload });

      if (noteId) {
        successCount++;
        const idx = updatedWords.findIndex(w => w.id === word.id);
        if (idx >= 0) {
          updatedWords[idx].syncedToAnkiDesktop = true;
          updatedWords[idx].deckName = 'Fluent';
          updatedWords[idx].source = 'fluent_to_anki';
        }
      }
    } catch {
      failedCount++;
    }
  }

  if (successCount > 0) {
    localStorage.setItem('fluent_anki_words', JSON.stringify(updatedWords));
    window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words: updatedWords } }));
    triggerAutoSyncToCloud();
  }

  return { success: successCount, failed: failedCount };
};

// 18. Vérifier si un terme ou une phrase est déjà dans Anki
export const isWordInLocalAnki = (hanzi: string): boolean => {
  if (!hanzi) return false;
  try {
    const words = getLocalAnkiWords();
    return words.some(w => w.hanzi === hanzi || w.hanzi.includes(hanzi) || hanzi.includes(w.hanzi));
  } catch {
    return false;
  }
};

