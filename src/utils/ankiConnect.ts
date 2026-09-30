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

