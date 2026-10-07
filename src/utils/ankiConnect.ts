import { AnkiWord } from '../types/fluent';

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
export const exportWordsToAnkiTextFile = (words: AnkiWord[]) => {
  if (words.length === 0) return;
  const lines = words.map(w => `${w.hanzi}\t${w.pinyin || ''}\t${w.translation || ''}`);
  const content = `#separator:tab\n#html:false\n#tags column:4\n` + lines.join('\n');
  const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fluent-cartes-anki-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 10. Enregistrer un mot ou une phrase directement dans la collection Anki locale
export const saveWordToLocalAnki = (wordData: {
  hanzi: string;
  pinyin?: string;
  translation?: string;
  deckName?: string;
}): { success: boolean; isNew: boolean; word: AnkiWord; totalCount: number } => {
  const cleanHanzi = wordData.hanzi.trim();
  if (!cleanHanzi) {
    return { success: false, isNew: false, word: null as any, totalCount: 0 };
  }

  let words: AnkiWord[] = [];
  try {
    const raw = localStorage.getItem('fluent_anki_words');
    words = raw ? JSON.parse(raw) : [];
  } catch {
    words = [];
  }

  const existingIndex = words.findIndex(w => w.hanzi === cleanHanzi);
  if (existingIndex >= 0) {
    return { success: true, isNew: false, word: words[existingIndex], totalCount: words.length };
  }

  const newWord: AnkiWord = {
    id: `local-anki-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    hanzi: cleanHanzi,
    pinyin: (wordData.pinyin || '').trim(),
    translation: (wordData.translation || '').trim(),
    deckName: wordData.deckName || 'Mes Mots Favoris',
    addedAt: new Date().toISOString(),
  };

  words.unshift(newWord);

  try {
    localStorage.setItem('fluent_anki_words', JSON.stringify(words));
    window.dispatchEvent(new CustomEvent('fluent_anki_words_changed', { detail: { words, newWord } }));
  } catch (e) {
    console.warn("Erreur sauvegarde locale Anki :", e);
  }

  // Tentative en arrière-plan d'injection automatique dans Anki Desktop si l'application tourne
  try {
    invokeAnkiConnect('addNote', {
      note: {
        deckName: newWord.deckName,
        modelName: 'Basic',
        fields: {
          Front: `${newWord.hanzi}${newWord.pinyin ? `<br><small style="color:gray">${newWord.pinyin}</small>` : ''}`,
          Back: newWord.translation || ''
        },
        tags: ['fluent-chinese']
      }
    }).catch(() => {});
  } catch {}

  return { success: true, isNew: true, word: newWord, totalCount: words.length };
};

// 11. Vérifier si un terme ou une phrase est déjà dans Anki
export const isWordInLocalAnki = (hanzi: string): boolean => {
  if (!hanzi) return false;
  try {
    const raw = localStorage.getItem('fluent_anki_words');
    const words: AnkiWord[] = raw ? JSON.parse(raw) : [];
    return words.some(w => w.hanzi === hanzi || w.hanzi.includes(hanzi) || hanzi.includes(w.hanzi));
  } catch {
    return false;
  }
};

