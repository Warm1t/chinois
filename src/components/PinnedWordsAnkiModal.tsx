import React, { useState, useEffect } from 'react';
import { AnkiWord } from '../types/fluent';
import { EverydayPhrase } from '../data/everydayPhrasesData';
import { 
  exportWordsToAnkiTextFile, 
  copyWordsToClipboardForAnki, 
  deleteWordFromLocalAnki, 
  clearAllLocalAnkiWords, 
  saveWordToLocalAnki,
  exportWordsToJson,
  checkAnkiConnection,
  syncWordDirectlyToAnkiDesktop,
  syncAllFluentWordsToAnkiDesktop
} from '../utils/ankiConnect';
import { 
  generateSentencesForWord, 
  generateSentencesForAllPinnedWords, 
  PinnedWordSentenceOption 
} from '../utils/pinnedSentenceGenerator';
import { playChineseAudio, stopChineseAudio } from '../utils/speechUtils';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Trash2, 
  Volume2, 
  Mic, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Plus, 
  Layers, 
  FileText, 
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Zap,
  FolderDown,
  FolderUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface PinnedWordsAnkiModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: AnkiWord[];
  onWordsUpdated?: (words: AnkiWord[]) => void;
  onPracticePhrase?: (phrase: EverydayPhrase) => void;
}

export const PinnedWordsAnkiModal: React.FC<PinnedWordsAnkiModalProps> = ({
  isOpen,
  onClose,
  words,
  onWordsUpdated,
  onPracticePhrase,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'sentences'>('list');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'fluent' | 'imported'>('fluent');
  const [searchQuery, setSearchQuery] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportFormat, setExportFormat] = useState<'basic' | 'tsv'>('basic');
  const [selectedWordFilter, setSelectedWordFilter] = useState<string>('all');
  
  // Masquer / afficher la traduction française des phrases proposées (masquée par défaut)
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});

  // Audio en cours
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Synchronisation directe vers Anki Desktop
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Ajout manuel d'un mot
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHanzi, setNewHanzi] = useState('');
  const [newPinyin, setNewPinyin] = useState('');
  const [newTranslation, setNewTranslation] = useState('');

  if (!isOpen) return null;

  // Séparation nette des mots selon leur provenance
  const isFluentWord = (w: AnkiWord) => 
    w.source === 'fluent_to_anki' || w.deckName === 'Fluent' || (!w.source && w.id.startsWith('local-anki'));

  const isImportedWord = (w: AnkiWord) => 
    w.source === 'imported_from_anki' || (!isFluentWord(w) && w.deckName !== 'Fluent');

  const fluentWords = words.filter(isFluentWord);
  const importedWords = words.filter(isImportedWord);

  // Sélection de la liste selon le filtre de source
  const sourceFilteredWords = 
    sourceFilter === 'fluent' 
      ? fluentWords 
      : sourceFilter === 'imported' 
      ? importedWords 
      : words;

  // Filtrage par recherche
  const filteredWords = sourceFilteredWords.filter(w => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      w.hanzi.includes(q) ||
      (w.pinyin && w.pinyin.toLowerCase().includes(q)) ||
      (w.translation && w.translation.toLowerCase().includes(q))
    );
  });

  // Phrases générées
  const allGeneratedSentences = generateSentencesForAllPinnedWords(sourceFilteredWords);
  const filteredSentences = allGeneratedSentences.filter(s => {
    if (selectedWordFilter !== 'all' && s.wordHanzi !== selectedWordFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.phrase.hanzi.includes(q) ||
      s.phrase.pinyin.toLowerCase().includes(q) ||
      s.phrase.french.toLowerCase().includes(q) ||
      s.wordHanzi.includes(q)
    );
  });

  // Copier au format Anki
  const handleCopyClipboard = async () => {
    const listToCopy = sourceFilter === 'fluent' ? fluentWords : sourceFilteredWords;
    const ok = await copyWordsToClipboardForAnki(listToCopy, exportFormat);
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  // Exporter en fichier .txt Anki
  const handleExportFile = () => {
    const listToExport = sourceFilter === 'fluent' ? fluentWords : sourceFilteredWords;
    exportWordsToAnkiTextFile(listToExport, exportFormat);
  };

  // Synchronisation directe de tous les mots Fluent vers Anki Desktop
  const handleDirectDesktopSync = async () => {
    setIsSyncing(true);
    setSyncStatusMessage(null);
    try {
      const isOnline = await checkAnkiConnection();
      if (!isOnline) {
        setSyncStatusMessage({
          text: "Anki Desktop n'est pas détecté. Lance Anki sur ton PC (avec l'extension AnkiConnect), ou utilise le bouton 'Télécharger fichier .txt' !",
          type: 'info'
        });
        setIsSyncing(false);
        return;
      }

      const res = await syncAllFluentWordsToAnkiDesktop();
      if (res.success > 0) {
        setSyncStatusMessage({
          text: `🎉 ${res.success} mot(s) injecté(s) directement dans ton paquet "Fluent" sur Anki Desktop !`,
          type: 'success'
        });
      } else if (res.failed > 0) {
        setSyncStatusMessage({
          text: `Erreur lors de l'ajout des cartes dans Anki Desktop (${res.failed} échecs).`,
          type: 'error'
        });
      } else {
        setSyncStatusMessage({
          text: `Tous tes mots Fluent sont déjà synchronisés dans ton paquet Anki "Fluent" !`,
          type: 'success'
        });
      }
    } catch (err: any) {
      setSyncStatusMessage({
        text: "Impossible de joindre AnkiConnect : " + (err?.message || ''),
        type: 'error'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Synchronisation d'un mot unique
  const handleSyncSingleWord = async (word: AnkiWord) => {
    setSyncStatusMessage(null);
    const ok = await syncWordDirectlyToAnkiDesktop(word);
    if (ok) {
      setSyncStatusMessage({
        text: `✓ "${word.hanzi}" transféré avec succès dans ton Anki Desktop (paquet Fluent) !`,
        type: 'success'
      });
    } else {
      setSyncStatusMessage({
        text: `Impossible de transférer "${word.hanzi}". Vérifie qu'Anki tourne sur ton PC.`,
        type: 'error'
      });
    }
  };

  // Supprimer un mot
  const handleDeleteWord = (wordId: string) => {
    if (window.confirm("Supprimer ce mot de ta liste de révision ?")) {
      deleteWordFromLocalAnki(wordId);
    }
  };

  // Vider tout
  const handleClearAll = () => {
    if (window.confirm("Es-tu certain de vouloir effacer tous tes mots épinglés ?")) {
      clearAllLocalAnkiWords();
    }
  };

  // Ajouter un mot manuellement
  const handleAddManualWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHanzi.trim()) return;
    saveWordToLocalAnki({
      hanzi: newHanzi.trim(),
      pinyin: newPinyin.trim(),
      translation: newTranslation.trim(),
      deckName: 'Fluent',
      source: 'fluent_to_anki',
    });
    setNewHanzi('');
    setNewPinyin('');
    setNewTranslation('');
    setShowAddForm(false);
  };

  // Écoute audio
  const handlePlayAudio = async (text: string, id: string) => {
    if (playingId === id) {
      stopChineseAudio();
      setPlayingId(null);
      return;
    }
    stopChineseAudio();
    setPlayingId(id);
    try {
      await playChineseAudio(text, 0.85);
    } finally {
      setPlayingId(null);
    }
  };

  // Basculer la visibilité de la traduction
  const toggleTranslation = (sentenceId: string) => {
    setRevealedTranslations(prev => ({
      ...prev,
      [sentenceId]: !prev[sentenceId]
    }));
  };

  // Lancer la pratique d'une phrase au labo vocal
  const handleStartPractice = (phrase: EverydayPhrase) => {
    if (onPracticePhrase) {
      onPracticePhrase(phrase);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-[#181513] w-full max-w-4xl max-h-[92vh] rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-[8px_8px_0px_#1c1917] dark:shadow-[8px_8px_0px_#000000] flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* EN-TÊTE MODAL */}
        <div className="p-4 sm:p-6 border-b-2 border-stone-100 dark:border-stone-800 flex items-center justify-between bg-[#fbf9f5] dark:bg-[#1f1b18]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c23b22] text-white flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_#1c1917] border border-stone-900 shrink-0">
              📌
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black font-serif text-stone-900 dark:text-stone-100">
                  Mes Mots Épinglés & Export Anki
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                  {words.length} mot{words.length > 1 ? 's' : ''} au total
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Distinction entre les mots créés dans Fluent (paquet <strong>"Fluent"</strong>) et ceux importés depuis ton Anki
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ONGLETS PRINCIPAUX DE NAVIGATION */}
        <div className="flex items-center px-4 sm:px-6 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-[#181513] text-xs font-bold space-x-2 pt-3">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'list'
                ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <FileText className="w-4 h-4 text-[#c23b22]" />
            <span>1. Liste & Export Anki ({words.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sentences')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'sentences'
                ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>2. Phrases Proposées sur mes Mots ({allGeneratedSentences.length})</span>
          </button>
        </div>

        {/* CONTENU ONGLET 1 : LISTE & EXPORT ANKI */}
        {activeTab === 'list' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* MESSAGE DE STATUT SYNCHRO ANKI */}
            {syncStatusMessage && (
              <div className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn ${
                syncStatusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : syncStatusMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                <div className="flex items-center space-x-2">
                  {syncStatusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : syncStatusMessage.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{syncStatusMessage.text}</span>
                </div>
                <button 
                  onClick={() => setSyncStatusMessage(null)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* BANDEAU D'ACTIONS D'EXPORTATION RAPIDE VERS ANKI */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white border-2 border-stone-900 shadow-[4px_4px_0px_#c23b22] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                    Exportation & Synchronisation Anki
                  </span>
                  <h3 className="text-base font-bold font-serif text-white">
                    Transférer vers le paquet "Fluent" ou Exporter
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Tous tes mots enregistrés dans l'application sont assignés au paquet <strong>Fluent</strong> pour ne pas se mélanger à tes autres paquets Anki.
                  </p>
                </div>

                {/* Sélecteur de format de colonnes */}
                <div className="flex items-center space-x-1.5 bg-stone-800/90 p-1 rounded-xl border border-stone-700 text-[11px] self-start sm:self-auto shrink-0">
                  <span className="text-stone-400 px-1 text-[10px]">Format :</span>
                  <button
                    onClick={() => setExportFormat('basic')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      exportFormat === 'basic'
                        ? 'bg-amber-400 text-stone-950 shadow-2xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                    title="2 champs HTML : Recto (Hanzi+Pinyin) / Verso (Traduction+Exemple)"
                  >
                    Standard Basic (2 champs)
                  </button>
                  <button
                    onClick={() => setExportFormat('tsv')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      exportFormat === 'tsv'
                        ? 'bg-amber-400 text-stone-950 shadow-2xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                    title="4 colonnes brutes : Hanzi \t Pinyin \t Traduction \t Exemple"
                  >
                    4 Colonnes TSV
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* 1. Transférer directement dans Anki Desktop si ouvert */}
                <button
                  onClick={handleDirectDesktopSync}
                  disabled={isSyncing || fluentWords.length === 0}
                  className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50 text-stone-950 font-black text-xs border border-stone-900 shadow-sm transition-all flex items-center justify-center space-x-2"
                  title="Ajoute directement les mots au paquet 'Fluent' dans Anki Desktop"
                >
                  <Zap className={`w-4 h-4 fill-stone-950 ${isSyncing ? 'animate-bounce' : ''}`} />
                  <span>{isSyncing ? 'Envoi vers Anki...' : '⚡ Vers Anki Desktop (Paquet Fluent)'}</span>
                </button>

                {/* 2. Télécharger fichier texte pour Anki */}
                <button
                  onClick={handleExportFile}
                  disabled={words.length === 0}
                  className="py-2.5 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 font-black text-xs border border-stone-900 shadow-sm transition-all flex items-center justify-center space-x-2"
                  title="Télécharger un fichier texte importable dans Anki"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger fichier Anki (.txt)</span>
                </button>

                {/* 3. Copier dans le presse-papier */}
                <button
                  onClick={handleCopyClipboard}
                  disabled={words.length === 0}
                  className={`py-2.5 px-3.5 rounded-xl font-bold text-xs border border-stone-700 transition-all flex items-center justify-center space-x-2 ${
                    copySuccess
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                      : 'bg-stone-700/80 hover:bg-stone-700 text-white disabled:opacity-50'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copié dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier pour Anki (1-Clic)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* FILTRE DE PROVENANCE : DISTINCTION NETTE DEMANDÉE PAR L'UTILISATEUR */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <span className="text-stone-400 uppercase text-[10px] tracking-wider pr-1">Afficher :</span>
                
                {/* 1. Mots créés dans Fluent (à transférer dans le paquet Fluent) */}
                <button
                  onClick={() => setSourceFilter('fluent')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                    sourceFilter === 'fluent'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <FolderUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>📦 Paquet Fluent (vers Anki) ({fluentWords.length})</span>
                </button>

                {/* 2. Mots importés depuis Anki */}
                <button
                  onClick={() => setSourceFilter('imported')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                    sourceFilter === 'imported'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <FolderDown className="w-3.5 h-3.5 text-blue-500" />
                  <span>🔄 Importés d'Anki ({importedWords.length})</span>
                </button>

                {/* 3. Tous les mots */}
                <button
                  onClick={() => setSourceFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                    sourceFilter === 'all'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <span>🌟 Tous ({words.length})</span>
                </button>
              </div>

              {/* Bouton Sauvegarder JSON */}
              {words.length > 0 && (
                <button
                  onClick={() => exportWordsToJson(words)}
                  className="text-stone-500 hover:text-stone-800 text-[11px] font-bold flex items-center space-x-1"
                  title="Sauvegarder tout le vocabulaire en fichier JSON de sauvegarde"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Sauvegarde JSON</span>
                </button>
              )}
            </div>

            {/* BARRE DE RECHERCHE & ACTIONS DE LISTE */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par Hanzi, Pinyin ou Français..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 shadow-2xs"
                />
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-stone-200 dark:border-stone-700"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c23b22]" />
                  <span>Ajouter au paquet Fluent</span>
                </button>

                {words.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-stone-200 dark:border-stone-700 transition-colors"
                    title="Vider la liste"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* FORMULAIRE D'AJOUT MANUEL DANS LE PAQUET FLUENT */}
            {showAddForm && (
              <form onSubmit={handleAddManualWord} className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 space-y-3 animate-fadeIn">
                <span className="text-xs font-bold text-amber-950 dark:text-amber-300 block">
                  Ajouter un mot au paquet "Fluent" (prêt pour Anki) :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Hanzi (ex: 明白)"
                    value={newHanzi}
                    onChange={(e) => setNewHanzi(e.target.value)}
                    className="p-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
                  />
                  <input
                    type="text"
                    placeholder="Pinyin (ex: míngbai)"
                    value={newPinyin}
                    onChange={(e) => setNewPinyin(e.target.value)}
                    className="p-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Traduction (ex: comprendre)"
                    value={newTranslation}
                    onChange={(e) => setNewTranslation(e.target.value)}
                    className="p-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-stone-600 hover:bg-stone-200 dark:text-stone-400"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold shadow-xs"
                  >
                    Enregistrer dans le paquet Fluent
                  </button>
                </div>
              </form>
            )}

            {/* LISTE DES MOTS ÉPINGLÉS AVEC BADGES DISTINCTS */}
            {filteredWords.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-900/50 border-2 border-dashed border-stone-200 dark:border-stone-800 space-y-2">
                <span className="text-3xl block">📌</span>
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  {sourceFilter === 'fluent'
                    ? "Aucun mot dans le paquet 'Fluent' pour le moment"
                    : sourceFilter === 'imported'
                    ? "Aucun mot importé d'Anki pour le moment"
                    : "Aucun mot ne correspond à ta recherche"}
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  {sourceFilter === 'fluent'
                    ? "Quand tu cliques sur un mot dans une histoire, au Labo Vocal ou dans le Chat, clique sur « Ajouter à Anki » pour le placer dans ton paquet Fluent !"
                    : "Importe tes paquets existants via le menu « AnkiConnect » pour les voir ici."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredWords.map((word) => {
                  const sentencesCount = generateSentencesForWord(word).length;
                  const isFromFluent = isFluentWord(word);

                  return (
                    <div
                      key={word.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-stone-400 transition-all flex items-center justify-between gap-3 group shadow-2xs"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        {/* Bouton écoute audio du mot */}
                        <button
                          onClick={() => handlePlayAudio(word.hanzi, word.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                            playingId === word.id
                              ? 'bg-amber-400 text-stone-950 scale-105'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                          }`}
                          title="Écouter la prononciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-base sm:text-lg font-black font-serif chinese-text text-stone-900 dark:text-stone-100">
                              {word.hanzi}
                            </span>
                            {word.pinyin && (
                              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                                {word.pinyin}
                              </span>
                            )}

                            {/* Badge de provenance distinctif */}
                            {isFromFluent ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center space-x-1">
                                <span>📦 Paquet Fluent</span>
                                {word.syncedToAnkiDesktop ? (
                                  <span className="text-emerald-700 font-bold ml-1" title="Présent dans Anki Desktop">✓</span>
                                ) : (
                                  <span className="text-stone-400 font-normal ml-0.5" title="À transférer">⏳</span>
                                )}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center space-x-1">
                                <span>🔄 Anki : {word.deckName || 'Importé'}</span>
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-stone-700 dark:text-stone-300 truncate font-medium mt-0.5">
                            {word.translation || 'Sans traduction'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {/* Bouton de transfert unitaire si c'est un mot Fluent pas encore envoyé à Anki Desktop */}
                        {isFromFluent && !word.syncedToAnkiDesktop && (
                          <button
                            onClick={() => handleSyncSingleWord(word)}
                            className="px-2 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center space-x-1 transition-all"
                            title="Envoyer immédiatement ce mot dans le paquet 'Fluent' sur Anki Desktop"
                          >
                            <Zap className="w-3 h-3 text-emerald-600" />
                            <span className="hidden sm:inline">Transférer</span>
                          </button>
                        )}

                        {/* Bouton pour voir les phrases générées pour ce mot */}
                        <button
                          onClick={() => {
                            setSelectedWordFilter(word.hanzi);
                            setActiveTab('sentences');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-[11px] font-bold flex items-center space-x-1 transition-all"
                          title="Voir les phrases d'entraînement pour ce mot"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{sentencesCount} phrase{sentencesCount > 1 ? 's' : ''}</span>
                        </button>

                        {/* Supprimer de la liste */}
                        <button
                          onClick={() => handleDeleteWord(word.id)}
                          className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Supprimer ce mot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* CONTENU ONGLET 2 : PHRASES PROPOSÉES SUR MES MOTS */}
        {activeTab === 'sentences' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* Guide & filtre par mot */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Phrases Contextuelles Générées pour tes Mots</span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Chaque phrase réutilise un de tes mots épinglés dans un contexte naturel et spontané.
                  </p>
                </div>

                {/* Filtre par mot épinglé */}
                {sourceFilteredWords.length > 0 && (
                  <select
                    value={selectedWordFilter}
                    onChange={(e) => setSelectedWordFilter(e.target.value)}
                    className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200"
                  >
                    <option value="all">🌟 Tous les mots ({sourceFilteredWords.length})</option>
                    {sourceFilteredWords.map(w => (
                      <option key={w.id} value={w.hanzi}>
                        {w.hanzi} ({w.translation || w.pinyin})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* LISTE DES PHRASES PROPOSÉES */}
            {filteredSentences.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-900/50 border-2 border-dashed border-stone-200 dark:border-stone-800 space-y-2">
                <span className="text-3xl block">💡</span>
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Aucune phrase à afficher
                </h4>
                <p className="text-xs text-stone-500">
                  {words.length === 0 
                    ? "Épingle d'abord quelques mots dans l'application pour générer des phrases d'entraînement personnalisées !" 
                    : "Aucune phrase ne correspond au filtre sélectionné."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSentences.map((item) => {
                  const isRevealed = revealedTranslations[item.id] || false;
                  const isAudioActive = playingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/80 border-2 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all space-y-3 shadow-xs"
                    >
                      {/* En-tête : Badge mot cible + Situation */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#c23b22]/10 text-[#c23b22] border border-[#c23b22]/30 flex items-center space-x-1">
                            <span>Mot cible :</span>
                            <strong className="chinese-text font-serif text-sm">{item.wordHanzi}</strong>
                            {item.wordTranslation && <span className="opacity-75 font-normal">({item.wordTranslation})</span>}
                          </span>

                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {item.phrase.categoryIcon} {item.phrase.situation}
                          </span>
                        </div>

                        <span className="text-[10px] uppercase font-bold text-stone-400">
                          {item.phrase.difficulty}
                        </span>
                      </div>

                      {/* Phrase en Hanzi & Pinyin */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-base sm:text-lg font-bold font-serif chinese-text text-stone-900 dark:text-stone-100 leading-relaxed">
                            {item.phrase.hanzi}
                          </p>

                          {/* Bouton Écouter Audio */}
                          <button
                            onClick={() => handlePlayAudio(item.phrase.hanzi, item.id)}
                            className={`p-2 rounded-xl transition-all shrink-0 ${
                              isAudioActive
                                ? 'bg-amber-400 text-stone-950 scale-105'
                                : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300'
                            }`}
                            title="Écouter la phrase en chinois à vitesse confortable"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm font-mono text-stone-500 dark:text-stone-400">
                          {item.phrase.pinyin}
                        </p>
                      </div>

                      {/* Traduction Française (Masquée par défaut selon la demande de l'utilisateur) */}
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleTranslation(item.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 flex items-center space-x-1.5 transition-colors shrink-0"
                            title={isRevealed ? "Masquer la traduction" : "Afficher la traduction française"}
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                                <span>Masquer français</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-stone-500" />
                                <span>Afficher français</span>
                              </>
                            )}
                          </button>

                          {isRevealed ? (
                            <span className="text-xs text-stone-800 dark:text-stone-200 font-medium animate-fadeIn">
                              {item.phrase.french}
                            </span>
                          ) : (
                            <span className="text-xs text-stone-400 dark:text-stone-500 italic select-none">
                              Traduction masquée pour stimuler la réflexion
                            </span>
                          )}
                        </div>

                        {/* Bouton d'action directe : Pratiquer au Labo Vocal */}
                        <button
                          onClick={() => handleStartPractice(item.phrase)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-bold transition-all flex items-center space-x-1.5 self-end sm:self-auto shrink-0 shadow-xs"
                          title="S'entraîner à prononcer cette phrase au Labo Vocal avec l'IA"
                        >
                          <Mic className="w-3.5 h-3.5 text-rose-400 dark:text-[#c23b22]" />
                          <span>🎙️ Pratiquer au Labo Vocal</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* PIED DE MODAL */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-[#fbf9f5] dark:bg-[#1f1b18] flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {fluentWords.length} mot{fluentWords.length > 1 ? 's' : ''} dans le paquet Fluent • {importedWords.length} mot{importedWords.length > 1 ? 's' : ''} importé{importedWords.length > 1 ? 's' : ''} d'Anki
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 font-bold text-xs shadow-xs transition-all"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
