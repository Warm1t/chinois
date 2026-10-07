import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Download, 
  Check, 
  ExternalLink, 
  Copy, 
  Share2, 
  Zap, 
  Bell, 
  CheckCircle2,
  Apple
} from 'lucide-react';
import { DailyHanzi } from '../types/fluent';
import { generateAppleCalendarIcsForHanzi } from '../data/dailyHanziData';

interface AppleSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayHanzi: DailyHanzi;
}

export const AppleSyncModal: React.FC<AppleSyncModalProps> = ({
  isOpen,
  onClose,
  todayHanzi
}) => {
  const [calendarMode, setCalendarMode] = useState<'timed' | 'all_day'>('timed');
  const [reminderTime, setReminderTime] = useState<string>('08:30');
  const [copiedShortcut, setCopiedShortcut] = useState(false);
  const [downloadedIcs, setDownloadedIcs] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'shortcut' | 'homescreen'>('calendar');

  if (!isOpen) return null;

  // Télécharger le fichier .ics multi-jours directement compatible Apple Calendar / iOS
  const handleDownloadAppleCalendar = () => {
    const icsContent = generateAppleCalendarIcsForHanzi(todayHanzi, reminderTime, {
      daysCount: 60,
      mode: calendarMode,
    });
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'fluent-hanzi-du-jour-60jours.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 4000);
  };

  // Copier le texte de la formule pour Raccourcis Apple
  const shortcutAutomationText = `Hanzi du Jour : ${todayHanzi.character} (${todayHanzi.pinyin}) — ${todayHanzi.meaning}\nClé : ${todayHanzi.radical} (${todayHanzi.radicalMeaning})\nMots : ${todayHanzi.compoundWords.map(w => w.hanzi).join(', ')}`;

  const handleCopyShortcutText = () => {
    navigator.clipboard.writeText(shortcutAutomationText);
    setCopiedShortcut(true);
    setTimeout(() => setCopiedShortcut(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fcfaf7] dark:bg-[#161311] border-2 border-stone-900 dark:border-stone-700 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-[6px_6px_0px_#1c1917] dark:shadow-[6px_6px_0px_#000000] relative space-y-5">
        
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête avec logo Apple */}
        <div className="flex items-center space-x-3 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 dark:bg-stone-800 text-white flex items-center justify-center shadow-sm shrink-0">
            <Smartphone className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 font-serif">
                Connecter à ton iPhone & Écosystème Apple
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Affiche le caractère et son pinyin sur ton widget, avec explications complètes au clic.
            </p>
          </div>
        </div>

        {/* Onglets de configuration Apple */}
        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl text-xs font-bold border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Calendrier Apple</span>
          </button>

          <button
            onClick={() => setActiveTab('shortcut')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'shortcut'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Raccourcis iOS</span>
          </button>

          <button
            onClick={() => setActiveTab('homescreen')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'homescreen'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Écran d'Accueil (App)</span>
          </button>
        </div>

        {/* CONTENU ONGLET 1 : CALENDRIER APPLE & WIDGET LOCK SCREEN */}
        {activeTab === 'calendar' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Bannière explicative 60 jours */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-blue-900 dark:text-blue-100">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>60 Jours Inclus • Affichage Minimaliste sur le Widget</span>
              </div>
              <p className="leading-relaxed">
                Le widget affichera uniquement <strong>le caractère et son pinyin</strong> (ex: <code>悟 (wù)</code>). En touchant le widget sur ton iPhone, l'événement s'ouvrira avec tous les détails (sens, clé, mnémonique, mots composés).
              </p>
            </div>

            {/* Choix du mode d'affichage pour le Widget iOS */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                Format d'affichage pour l'iPhone :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCalendarMode('timed')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    calendarMode === 'timed'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-950 dark:text-blue-100 font-bold shadow-2xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>⏰ Créneau Horaire (Recommandé)</span>
                    {calendarMode === 'timed' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[11px] font-normal text-stone-500 dark:text-stone-400 leading-snug">
                    Affiche <strong>悟 (wù)</strong> sur ton widget sans être masqué par l'option "Jour entier". Détails au clic.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCalendarMode('all_day')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    calendarMode === 'all_day'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-950 dark:text-amber-100 font-bold shadow-2xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>🌟 Mode Toute la Journée</span>
                    {calendarMode === 'all_day' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <p className="text-[11px] font-normal text-stone-500 dark:text-stone-400 leading-snug">
                    Pour ceux qui activent "Afficher les événements toute la journée" sur leur widget.
                  </p>
                </button>
              </div>
            </div>

            {/* Heure de notification souhaitée */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1.5">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Heure du rappel quotidien :</span>
              </span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono font-bold text-stone-900 dark:text-stone-100 text-sm focus:outline-none"
              />
            </div>

            {/* Bouton d'action .ics */}
            <button
              onClick={handleDownloadAppleCalendar}
              className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:-translate-y-0.5"
            >
              {downloadedIcs ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Calendrier de 60 Jours Téléchargé ! Ouvre-le sur ton iPhone</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-blue-300" />
                  <span>Télécharger les 60 Jours pour mon iPhone (.ics)</span>
                </>
              )}
            </button>

            {/* Guide pas-à-pas pour le Widget et les Notifications iOS */}
            <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-300 space-y-2">
              <p className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                📲 Comment l'installer sur ton iPhone pour voir le widget :
              </p>
              <div className="space-y-1.5 pl-1 leading-relaxed">
                <p>
                  <strong>1. Ajouter au calendrier :</strong> Télécharge le fichier depuis Safari sur ton iPhone (ou envoie-le par AirDrop / Mail) ➔ Touche le fichier ➔ Choisis <em>« Tout ajouter »</em>.
                </p>
                <p>
                  <strong>2. Activer le Widget :</strong> Sur l'écran d'accueil de ton iPhone, fais un appui long sur le fond ➔ Touche le <strong>« + »</strong> en haut à gauche ➔ Cherche <strong>« Calendrier »</strong> et choisis la taille de widget souhaitée.
                </p>
                <p>
                  <strong>3. Écran Verrouillé (Lock Screen) :</strong> Fais un appui long sur ton écran verrouillé ➔ <em>« Personnaliser »</em> ➔ Ajoute le widget Calendrier sous l'heure pour voir le caractère dès que tu prends ton téléphone !
                </p>
                <p className="text-amber-800 dark:text-amber-300 font-medium">
                  🔔 <em>Note alertes :</em> Vérifie dans <code>Réglages iPhone &gt; Notifications &gt; Calendrier</code> que les alertes sont bien autorisées.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 2 : RACCOURCIS IOS (APPLE SHORTCUTS) */}
        {activeTab === 'shortcut' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-amber-900 dark:text-amber-100">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Automatisation iOS chaque matin (Application Raccourcis)</span>
              </div>
              <p className="leading-relaxed">
                Grâce à l'application native <strong>Raccourcis (Shortcuts)</strong> installée sur ton iPhone, tu peux créer une automatisation qui t'affiche une notification avec le caractère du jour à l'heure exacte de ton réveil.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
              <span className="font-bold text-stone-800 dark:text-stone-200 block">
                Contenu de la notification généré pour aujourd'hui :
              </span>
              <pre className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-[11px] whitespace-pre-wrap leading-relaxed border border-stone-200 dark:border-stone-700">
                {shortcutAutomationText}
              </pre>
              <button
                onClick={handleCopyShortcutText}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-[11px] transition-colors"
              >
                {copiedShortcut ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShortcut ? "Copié dans le presse-papier !" : "Copier le texte du Raccourci"}</span>
              </button>
            </div>

            <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1 pl-1">
              <p className="font-semibold">💡 Créer l'automatisation en 30 secondes :</p>
              <p>1. Ouvre l'app <strong>Raccourcis</strong> sur ton iPhone ➔ onglet <strong>Automatisation</strong>.</p>
              <p>2. Choisis <strong>« Heure de la journée »</strong> (ex: 08:00) ➔ <strong>Afficher la notification</strong>.</p>
              <p>3. Colle le texte ou ouvre le lien de l'app Fluent !</p>
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 3 : ÉCRAN D'ACCUEIL IPHONE (WEB APP NATIVE) */}
        {activeTab === 'homescreen' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-900 dark:text-emerald-100">
                <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Transformer Fluent en App iPhone Native sans App Store</span>
              </div>
              <p className="leading-relaxed">
                iOS permet d'installer ce site comme une véritable application iPhone autonome (PWA), avec icône calligraphique, mode plein écran sans barre Safari, et vitesse maximale.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-stone-900 dark:text-stone-100">Ouvre le site dans Safari :</strong>
                  <p className="text-stone-500 dark:text-stone-400 mt-0.5 font-mono text-[11px]">
                    https://warm1t.github.io/chinois/ (ou ton adresse Wi-Fi locale)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-stone-900 dark:text-stone-100">Appuie sur l'icône Partager :</strong>
                  <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                    Le carré avec la flèche vers le haut au centre de la barre d'outils Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#c23b22] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-stone-900 dark:text-stone-100">Choisis « Sur l'écran d'accueil » :</strong>
                  <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                    L'icône rouge au sceau <strong>语</strong> s'installe sur ton iPhone. Tu peux désormais l'ouvrir en 1 tap comme n'importe quelle app iOS !
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pied de page modal */}
        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-400 text-[11px]">
            Compatible iOS 14, 15, 16, 17, 18+ & iPadOS / macOS
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
