import React, { useState, useEffect } from 'react';
import { AnkiWord } from '../types/fluent';
import { 
  checkAnkiConnection, 
  getDeckStats,
  fetchWordsFromDecks, 
  parseAnkiTextExport 
} from '../utils/ankiConnect';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Layers, 
  ExternalLink,
  HelpCircle,
  Upload,
  Check,
  Zap,
  Search,
  Trash2
} from 'lucide-react';

interface AnkiLinkModalProps {
  onClose: () => void;
  syncedWords: AnkiWord[];
  onWordsUpdated: (words: AnkiWord[]) => void;
}

export const AnkiLinkModal: React.FC<AnkiLinkModalProps> = ({
  onClose,
  syncedWords,
  onWordsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'import' | 'browse'>('direct');
  const [isAnkiConnected, setIsAnkiConnected] = useState<boolean | null>(null);
  const [deckStats, setDeckStats] = useState<{ name: string; count: number }[]>([]);
  const [selectedDecks, setSelectedDecks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mergeWithExisting, setMergeWithExisting] = useState<boolean>(true);

  // Vérifier la connexion AnkiConnect à l'ouverture
  useEffect(() => {
    handleCheckConnection();
  }, []);

  const handleCheckConnection = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const connected = await checkAnkiConnection();
      setIsAnkiConnected(connected);
      if (connected) {
        const stats = await getDeckStats();
        setDeckStats(stats);
        // Par défaut : tous les paquets sont cochés pour synchroniser en 1 clic
        setSelectedDecks(stats.map(s => s.name));
        setStatusMessage({ text: `Connecté à Anki ! ${stats.length} paquets détectés.`, type: 'success' });
      } else {
        setStatusMessage({ 
          text: "Anki n'est pas détecté en local (ou l'addon gratuit AnkiConnect n'est pas activé). Tu peux aussi utiliser l'onglet 'Import Texte' ci-dessus !", 
          type: 'info' 
        });
      }
    } catch (e: any) {
      setIsAnkiConnected(false);
      setStatusMessage({ text: "Impossible de joindre AnkiConnect.", type: 'info' });
    } finally {
      setIsLoading(false);
    }
  };

  // Basculer la sélection d'un paquet
  const toggleDeckSelection = (deckName: string) => {
    setSelectedDecks(prev => 
      prev.includes(deckName) 
        ? prev.filter(d => d !== deckName) 
        : [...prev, deckName]
    );
  };

  // Sélectionner tous les paquets
  const handleSelectAllDecks = () => {
    setSelectedDecks(deckStats.map(s => s.name));
  };

  // Désélectionner tous les paquets
  const handleDeselectAllDecks = () => {
    setSelectedDecks([]);
  };

  // Synchroniser les paquets sélectionnés (ou tous)
  const handleSyncDecks = async (decksToSync: string[]) => {
    if (decksToSync.length === 0) {
      setStatusMessage({ text: "Sélectionne au moins un paquet à synchroniser.", type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ text: `Synchronisation de ${decksToSync.length} paquet(s) en cours...`, type: 'info' });

    try {
      const newWords = await fetchWordsFromDecks(decksToSync);

      if (newWords.length === 0) {
        setStatusMessage({ text: "Aucun mot contenant des caractères chinois trouvé dans ces paquets.", type: 'error' });
      } else {
        let finalWords = newWords;

        if (mergeWithExisting && syncedWords.length > 0) {
          // Fusionner en évitant les doublons
          const seen = new Set<string>();
          finalWords = [];
          
          for (const w of [...syncedWords, ...newWords]) {
            if (!seen.has(w.hanzi)) {
              seen.add(w.hanzi);
              finalWords.push(w);
            }
          }
        }

        onWordsUpdated(finalWords);
        setStatusMessage({ 
          text: `🎉 ${newWords.length} cartes synchronisées depuis ${decksToSync.length} paquet(s) ! Total dans Fluent : ${finalWords.length} mots.`, 
          type: 'success' 
        });
        setActiveTab('browse');
      }
    } catch (e: any) {
      setStatusMessage({ text: `Erreur lors de la synchronisation : ${e.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Importer du texte brut
  const handleImportText = () => {
    if (!importText.trim()) {
      setStatusMessage({ text: "Colle au moins une ligne de vocabulaire Anki.", type: 'error' });
      return;
    }

    const words = parseAnkiTextExport(importText);
    if (words.length === 0) {
      setStatusMessage({ text: "Aucun caractère chinois détecté dans le texte collé.", type: 'error' });
    } else {
      let finalWords = words;
      if (mergeWithExisting) {
        const seen = new Set<string>();
        finalWords = [];
        for (const w of [...syncedWords, ...words]) {
          if (!seen.has(w.hanzi)) {
            seen.add(w.hanzi);
            finalWords.push(w);
          }
        }
      }
      onWordsUpdated(finalWords);
      setStatusMessage({ text: `🎉 ${words.length} mots importés avec succès ! Total : ${finalWords.length} mots.`, type: 'success' });
      setImportText('');
      setActiveTab('browse');
    }
  };

  // Vider le vocabulaire lié
  const handleClearSyncedWords = () => {
    if (confirm("Es-tu sûr de vouloir vider le vocabulaire Anki synchronisé ?")) {
      onWordsUpdated([]);
      setStatusMessage({ text: "Vocabulaire Anki réinitialisé.", type: 'info' });
    }
  };

  // Filtrer les mots affichés dans le navigateur de vocabulaire
  const filteredWords = syncedWords.filter(w => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      w.hanzi.includes(q) ||
      (w.pinyin && w.pinyin.toLowerCase().includes(q)) ||
      (w.translation && w.translation.toLowerCase().includes(q)) ||
      (w.deckName && w.deckName.toLowerCase().includes(q))
    );
  });

  const totalCardsInAnki = deckStats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fcfaf7] border-2 border-stone-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-[6px_6px_0px_#1c1917] relative space-y-6">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center space-x-3.5 border-b-2 border-stone-200 pb-4">
          <div className="p-3 rounded-2xl bg-amber-500 text-stone-950 font-bold border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Liaison Anki & Synchronisation
              </span>
              {syncedWords.length > 0 && (
                <span className="text-xs font-bold text-emerald-800 flex items-center">
                  <Check className="w-3 h-3 mr-0.5" /> {syncedWords.length} mots liés
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight mt-0.5">
              Lier mon Répertoire de Cartes Anki
            </h2>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'direct'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>1. Connexion Directe Multi-Paquets</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'import'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>2. Import Texte / Fichier</span>
          </button>

          {syncedWords.length > 0 && (
            <button
              onClick={() => setActiveTab('browse')}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'browse'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Voir le Vocabulaire ({syncedWords.length})</span>
            </button>
          )}
        </div>

        {/* Message de statut */}
        {statusMessage && (
          <div className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center space-x-2 animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* CONTENU DE L'ONGLET 1 : SYNCHRONISATION MULTI-PAQUETS */}
        {activeTab === 'direct' && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Statut AnkiConnect */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-stone-200">
              <div className="flex items-center space-x-2 text-xs font-semibold">
                <span className={`w-3 h-3 rounded-full ${isAnkiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-stone-800">
                  {isAnkiConnected 
                    ? `AnkiConnect en ligne (${deckStats.length} paquets détectés • ~${totalCardsInAnki} cartes)` 
                    : "AnkiConnect non détecté"}
                </span>
              </div>

              <button
                onClick={handleCheckConnection}
                disabled={isLoading}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>

            {isAnkiConnected ? (
              <div className="space-y-4">
                
                {/* ⚡ LE GROS BOUTON 1-CLIC : TOUT SYNCHRONISER D'UN COUP ! */}
                <div className="p-5 rounded-2xl bg-stone-900 text-white border-2 border-stone-900 shadow-[4px_4px_0px_#c23b22] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                        Synchronisation Globale Rapide
                      </span>
                      <h3 className="text-base sm:text-lg font-black font-serif text-white">
                        Synchroniser tous mes paquets Anki en 1 clic
                      </h3>
                      <p className="text-xs text-stone-300 mt-0.5">
                        Importe l'ensemble de tes {deckStats.length} paquets (~{totalCardsInAnki} cartes) avec déduplication automatique.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSyncDecks(deckStats.map(s => s.name))}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm border border-stone-900 shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4 fill-stone-950" />
                    <span>⚡ TOUT SYNCHRONISER MAINTENANT ({deckStats.length} PAQUETS)</span>
                  </button>
                </div>

                {/* SÉLECTION PERSONNALISÉE PAR PAQUET */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Ou choisis les paquets à synchroniser :
                    </span>
                    <div className="space-x-2 text-[11px]">
                      <button
                        onClick={handleSelectAllDecks}
                        className="text-stone-600 hover:text-stone-900 font-bold underline"
                      >
                        Tout cocher
                      </button>
                      <span>•</span>
                      <button
                        onClick={handleDeselectAllDecks}
                        className="text-stone-600 hover:text-stone-900 font-bold underline"
                      >
                        Tout décocher
                      </button>
                    </div>
                  </div>

                  {/* Grille des paquets avec cases à cocher */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {deckStats.map((deck) => {
                      const isChecked = selectedDecks.includes(deck.name);
                      return (
                        <div
                          key={deck.name}
                          onClick={() => toggleDeckSelection(deck.name)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs select-none ${
                            isChecked
                              ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded border-stone-300 text-[#c23b22] focus:ring-0"
                            />
                            <span className="truncate">{deck.name}</span>
                          </div>
                          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded-md border border-stone-200 text-stone-500 shrink-0">
                            {deck.count} cartes
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bouton synchroniser la sélection */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
                    <label className="flex items-center space-x-2 text-xs text-stone-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={mergeWithExisting}
                        onChange={(e) => setMergeWithExisting(e.target.checked)}
                        className="rounded border-stone-300 text-[#c23b22]"
                      />
                      <span>Fusionner avec le vocabulaire déjà lié</span>
                    </label>

                    <button
                      onClick={() => handleSyncDecks(selectedDecks)}
                      disabled={isLoading || selectedDecks.length === 0}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Synchroniser la sélection ({selectedDecks.length})</span>
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              /* Instructions si Anki n'est pas encore lancé */
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600 leading-relaxed">
                <p className="font-bold text-stone-800">
                  Pour connecter ton Anki en direct :
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Ouvre ton logiciel <strong>Anki</strong> sur ton ordinateur.</li>
                  <li>Assure-toi que le greffon gratuit <strong>AnkiConnect</strong> est bien actif (Code : <code>2055492159</code>).</li>
                  <li>Clique sur le bouton <strong>« Actualiser »</strong> ci-dessus !</li>
                </ol>
              </div>
            )}

          </div>
        )}

        {/* CONTENU DE L'ONGLET 2 : IMPORT TEXTE BRUT */}
        {activeTab === 'import' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-800">
                Colle tes cartes Anki exportées (Texte, TSV, CSV) :
              </label>
              <p className="text-stone-500">
                Format attendu : <code>Hanzi [Tabulation ou ;] Pinyin [Tabulation ou ;] Traduction</code>
              </p>
            </div>

            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="我要努力工作&#9;wǒ yào nǔlì gōngzuò&#9;Je vais persévérer au travail&#10;客厅&#9;kètīng&#9;Salon"
              className="w-full p-3 rounded-2xl border-2 border-stone-300 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#c23b22]"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs text-stone-600">
                <input
                  type="checkbox"
                  checked={mergeWithExisting}
                  onChange={(e) => setMergeWithExisting(e.target.checked)}
                  className="rounded border-stone-300 text-[#c23b22]"
                />
                <span>Conserver les cartes déjà liées</span>
              </label>

              <button
                onClick={handleImportText}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all"
              >
                Importer ces cartes
              </button>
            </div>
          </div>
        )}

        {/* CONTENU DE L'ONGLET 3 : EXPLORATEUR DE VOCABULAIRE SYNCHRONISÉ */}
        {activeTab === 'browse' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Barre de recherche et actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Rechercher par Hanzi, pinyin ou français..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <button
                onClick={handleClearSyncedWords}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-stone-200 transition-colors"
                title="Vider le vocabulaire lié"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Liste des cartes synchronisées */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredWords.length === 0 ? (
                <p className="text-center py-6 text-xs text-stone-400">
                  Aucun mot ne correspond à ta recherche.
                </p>
              ) : (
                filteredWords.map((word) => (
                  <div
                    key={word.id}
                    className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold chinese-text text-stone-900 font-serif">
                          {word.hanzi}
                        </span>
                        {word.pinyin && (
                          <span className="text-stone-500 font-mono text-[11px]">
                            {word.pinyin}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-600 text-[11px]">
                        {word.translation}
                      </p>
                    </div>

                    {word.deckName && (
                      <span className="font-mono text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200 shrink-0">
                        {word.deckName}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Pied de boîte de dialogue */}
        <div className="pt-2 text-center border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all"
          >
            Fermer et retourner à mes leçons
          </button>
        </div>

      </div>
    </div>
  );
};
