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
  Apple,
  BookOpen,
  Layers,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { DailyHanzi, MaayotStory } from '../types/fluent';
import { generateAppleCalendarIcsForHanzi } from '../data/dailyHanziData';
import { generateAppleCalendarIcsForStories, getTodayDailyStory } from '../data/storiesData';
import { generateAppleCalendarIcsCombined } from '../utils/calendarExport';

interface AppleSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayHanzi: DailyHanzi;
  todayStory?: MaayotStory;
}

export const AppleSyncModal: React.FC<AppleSyncModalProps> = ({
  isOpen,
  onClose,
  todayHanzi,
  todayStory
}) => {
  const currentStory = todayStory || getTodayDailyStory();

  const [packType, setPackType] = useState<'combo' | 'hanzi' | 'story'>('combo');
  const [calendarMode, setCalendarMode] = useState<'timed' | 'all_day'>('timed');
  const [daysCount, setDaysCount] = useState<number>(14);
  const [morningTime, setMorningTime] = useState<string>('08:30');
  const [eveningTime, setEveningTime] = useState<string>('19:30');
  const [copiedShortcut, setCopiedShortcut] = useState(false);
  const [downloadedIcs, setDownloadedIcs] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'shortcut' | 'homescreen'>('calendar');
  const [showTwoWidgetsFaq, setShowTwoWidgetsFaq] = useState(false);
  const [showDeleteHelp, setShowDeleteHelp] = useState(true);

  if (!isOpen) return null;

  // Télécharger le fichier .ics multi-jours sélectionné
  const handleDownloadAppleCalendar = () => {
    let icsContent = '';
    let fileName = '';

    if (packType === 'combo') {
      icsContent = generateAppleCalendarIcsCombined({
        morningTime,
        eveningTime,
        daysCount,
        mode: calendarMode,
      });
      fileName = `fluent-combo-hanzi-histoires-${daysCount}jours.ics`;
    } else if (packType === 'hanzi') {
      icsContent = generateAppleCalendarIcsForHanzi(todayHanzi, morningTime, {
        daysCount,
        mode: calendarMode,
      });
      fileName = `fluent-hanzi-du-jour-${daysCount}jours.ics`;
    } else {
      icsContent = generateAppleCalendarIcsForStories(eveningTime, {
        daysCount,
        mode: calendarMode,
      });
      fileName = `fluent-histoire-du-jour-${daysCount}jours.ics`;
    }

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 4000);
  };

  // Copier le texte de la formule pour Raccourcis Apple
  const shortcutAutomationText = packType === 'story'
    ? `Histoire du Jour : ${currentStory.title} (${currentStory.titlePinyin})\nTraduction : ${currentStory.titleTranslation}\nNiveau : ${currentStory.level}\nMots cibles : ${currentStory.targetWords.map(w => w.hanzi).join(', ')}`
    : `Hanzi du Jour : ${todayHanzi.character} (${todayHanzi.pinyin}) — ${todayHanzi.meaning}\nClé : ${todayHanzi.radical} (${todayHanzi.radicalMeaning})\nMots : ${todayHanzi.compoundWords.map(w => w.hanzi).join(', ')}`;

  const handleCopyShortcutText = () => {
    navigator.clipboard.writeText(shortcutAutomationText);
    setCopiedShortcut(true);
    setTimeout(() => setCopiedShortcut(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fcfaf7] dark:bg-[#161311] border-2 border-stone-900 dark:border-stone-700 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-[6px_6px_0px_#1c1917] dark:shadow-[6px_6px_0px_#000000] relative space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête avec logo Apple */}
        <div className="flex items-center space-x-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="w-11 h-11 rounded-2xl bg-stone-900 dark:bg-stone-800 text-white flex items-center justify-center shadow-sm shrink-0">
            <Smartphone className="w-5 h-5 text-amber-300" />
          </div>
          <div className="pr-8">
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 font-serif leading-tight">
              Widgets iPhone & Calendrier Apple
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Affiche le Hanzi et l'Histoire du jour directement sur ton écran d'accueil avec titre épuré.
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

        {/* CONTENU ONGLET 1 : CALENDRIER APPLE & WIDGET */}
        {activeTab === 'calendar' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Choix du Pack à Exporter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                1. Choisis ce que tu souhaites synchroniser :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                
                {/* Option Combo */}
                <button
                  type="button"
                  onClick={() => setPackType('combo')}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    packType === 'combo'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-950 dark:text-amber-100 font-bold shadow-2xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                    Recommandé
                  </span>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>⚡ Combo Matin & Soir</span>
                  </div>
                  <p className="text-[10px] font-normal text-stone-500 dark:text-stone-400 leading-snug">
                    Hanzi à {morningTime} + Histoire à {eveningTime} dans 1 seul calendrier !
                  </p>
                </button>

                {/* Option Hanzi Seul */}
                <button
                  type="button"
                  onClick={() => setPackType('hanzi')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    packType === 'hanzi'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-950 dark:text-blue-100 font-bold shadow-2xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-sm">🏮</span>
                    <span>Hanzi du Jour Seul</span>
                  </div>
                  <p className="text-[10px] font-normal text-stone-500 dark:text-stone-400 leading-snug">
                    60 jours de caractères uniques le matin.
                  </p>
                </button>

                {/* Option Histoire Seule */}
                <button
                  type="button"
                  onClick={() => setPackType('story')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    packType === 'story'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-100 font-bold shadow-2xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Histoire du Jour</span>
                  </div>
                  <p className="text-[10px] font-normal text-stone-500 dark:text-stone-400 leading-snug">
                    60 jours d'histoires complètes le soir.
                  </p>
                </button>
              </div>
            </div>

            {/* GUIDE DE NETTOYAGE & SUPPRESSION MASSE */}
            <div className="rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-800 overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setShowDeleteHelp(!showDeleteHelp)}
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-rose-950 dark:text-rose-200"
              >
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>🧹 Événements emmêlés ? Comment TOUT supprimer en 1 clic</span>
                </div>
                {showDeleteHelp ? <ChevronUp className="w-4 h-4 text-rose-500" /> : <ChevronDown className="w-4 h-4 text-rose-500" />}
              </button>

              {showDeleteHelp && (
                <div className="p-3.5 pt-0 space-y-2.5 text-[11px] text-rose-950 dark:text-rose-200 border-t border-rose-200/60 dark:border-rose-800/60 mt-1 leading-relaxed">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 space-y-1">
                    <strong className="text-rose-700 dark:text-rose-300 block">
                      ⚡ Option 1 (Si c'est dans un calendrier séparé) :
                    </strong>
                    <p>
                      Dans Calendrier sur iPhone ➔ touche <strong>« Calendriers »</strong> en bas au centre ➔ touche le <strong>(i)</strong> à côté du calendrier ➔ tout en bas : <strong>« Supprimer le calendrier »</strong>. Tous les événements sont effacés d'un seul coup !
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 space-y-1">
                    <strong className="text-stone-900 dark:text-stone-100 block">
                      🔍 Option 2 (Si c'est mélangé dans ton calendrier perso) :
                    </strong>
                    <p>
                      • <strong>Sur Mac</strong> : Ouvre Calendrier ➔ Recherche <code>Fluent</code> (en haut à droite) ➔ clique dans la liste ➔ <code>Cmd + A</code> (Tout sélectionner) ➔ Touche <code>Supprimer</code>.<br />
                      • <strong>Sur iPhone</strong> : Ouvre Calendrier ➔ Touche la <strong>loupe 🔍</strong> ➔ Tape <code>Fluent</code> ➔ Les événements s'affichent en liste continue au lieu d'être dispersés sur 60 jours.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-1">
                    <strong className="text-amber-800 dark:text-amber-300 block">
                      🛡️ Règle d'or pour le prochain import :
                    </strong>
                    <p>
                      Dans l'app Calendrier iPhone : touche <strong>« Calendriers »</strong> ➔ <strong>« Ajouter un calendrier »</strong> ➔ nomme-le <strong>« Chinois »</strong> (en rouge).<br />
                      Quand tu ouvriras le nouveau fichier <code>.ics</code>, choisis d'ajouter dans le calendrier <strong>« Chinois »</strong>. Ainsi, pour changer l'heure à l'avenir, tu pourras supprimer ce calendrier en 1 clic sans toucher à ton agenda personnel !
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Heures de rappel configurables avec raccourcis rapides */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                2. Choisis tes heures de rappel précises :
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(packType === 'combo' || packType === 'hanzi') && (
                  <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1.5">
                        <Bell className="w-3.5 h-3.5 text-amber-500" />
                        <span>🌅 Hanzi (Matin) :</span>
                      </span>
                      <input
                        type="time"
                        value={morningTime}
                        onChange={(e) => setMorningTime(e.target.value)}
                        className="px-2 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono font-bold text-stone-900 dark:text-stone-100 text-xs focus:outline-none"
                      />
                    </div>
                    {/* Raccourcis matin */}
                    <div className="flex flex-wrap items-center gap-1">
                      {['07:00', '07:30', '08:00', '08:30', '09:00'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setMorningTime(time)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                            morningTime === time
                              ? 'bg-amber-500 text-white'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(packType === 'combo' || packType === 'story') && (
                  <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>🌙 Histoire (Soir) :</span>
                      </span>
                      <input
                        type="time"
                        value={eveningTime}
                        onChange={(e) => setEveningTime(e.target.value)}
                        className="px-2 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono font-bold text-stone-900 dark:text-stone-100 text-xs focus:outline-none"
                      />
                    </div>
                    {/* Raccourcis soir */}
                    <div className="flex flex-wrap items-center gap-1">
                      {['18:30', '19:00', '19:30', '20:00', '21:00'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setEveningTime(time)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                            eveningTime === time
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Durée de synchronisation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>3. Durée de l'agenda généré :</span>
                <span className="text-[10px] text-stone-400 font-normal">
                  (7 ou 14 jours idéal pour tester sans encombrer)
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {[
                  { count: 7, label: '7 jours', sub: 'Test rapide' },
                  { count: 14, label: '14 jours', sub: '2 semaines' },
                  { count: 30, label: '30 jours', sub: '1 mois' },
                  { count: 60, label: '60 jours', sub: 'Pack complet' },
                ].map((item) => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setDaysCount(item.count)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      daysCount === item.count
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold border-stone-900 shadow-xs'
                        : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-bold text-xs">{item.label}</span>
                    <span className="text-[9px] opacity-75 font-sans">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode d'affichage pour les Widgets iOS */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                4. Mode pour ton widget iOS :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCalendarMode('timed')}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    calendarMode === 'timed'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-950 dark:text-blue-100 font-bold shadow-2xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>⏰ Créneau Horaire (Recommandé)</span>
                    {calendarMode === 'timed' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[10px] font-normal text-stone-500 dark:text-stone-400 leading-snug">
                    Visible sur le widget à l'heure programmée. Détails complets au toucher.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCalendarMode('all_day')}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    calendarMode === 'all_day'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-950 dark:text-amber-100 font-bold shadow-2xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>🌟 Mode Toute la Journée</span>
                    {calendarMode === 'all_day' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <p className="text-[10px] font-normal text-stone-500 dark:text-stone-400 leading-snug">
                    Pour ceux qui activent "Afficher les événements toute la journée" sur leur widget.
                  </p>
                </button>
              </div>
            </div>

            {/* Aperçu Visuel Live du Widget iPhone */}
            <div className="p-3.5 rounded-2xl bg-stone-900 text-white space-y-2 border border-stone-700">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-300">
                <span className="flex items-center space-x-1.5">
                  <Apple className="w-3.5 h-3.5 text-stone-300" />
                  <span>Aperçu sur ton Widget iPhone :</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  ✓ Titre épuré (chinois + pinyin)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(packType === 'combo' || packType === 'hanzi') && (
                  <div className="p-2.5 rounded-xl bg-stone-800/90 border border-stone-700 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono">
                      <span>🌅 Matin ({morningTime})</span>
                      <span>Fluent</span>
                    </div>
                    <div className="text-base font-black text-white font-serif tracking-wide">
                      {todayHanzi.character} <span className="text-xs font-mono font-normal text-amber-300">({todayHanzi.pinyin})</span>
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">
                      Au toucher : {todayHanzi.meaning}
                    </div>
                  </div>
                )}

                {(packType === 'combo' || packType === 'story') && (
                  <div className="p-2.5 rounded-xl bg-stone-800/90 border border-stone-700 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                      <span>🌙 Soir ({eveningTime})</span>
                      <span>Fluent</span>
                    </div>
                    <div className="text-xs font-black text-white font-serif line-clamp-1">
                      {currentStory.title}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-300 truncate">
                      ({currentStory.titlePinyin})
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton d'action .ics */}
            <button
              onClick={handleDownloadAppleCalendar}
              className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:-translate-y-0.5 border-2 border-stone-900 dark:border-stone-700"
            >
              {downloadedIcs ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pack de {daysCount} Jours Téléchargé ! Ouvre-le sur ton iPhone</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>
                    {packType === 'combo' && `Télécharger le Pack Combo (${daysCount} Jours)`}
                    {packType === 'hanzi' && `Télécharger les ${daysCount} Jours de Hanzi (.ics)`}
                    {packType === 'story' && `Télécharger les ${daysCount} Jours d'Histoires (.ics)`}
                  </span>
                </>
              )}
            </button>

            {/* FAQ SPÉCIALE : PEUT-ON METTRE 2 WIDGETS SUR IPHONE ? */}
            <div className="rounded-2xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowTwoWidgetsFaq(!showTwoWidgetsFaq)}
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-stone-900 dark:text-stone-100"
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>💡 Est-il possible d'avoir 2 widgets sur mon iPhone ?</span>
                </div>
                {showTwoWidgetsFaq ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>

              {showTwoWidgetsFaq && (
                <div className="p-3.5 pt-0 space-y-2.5 text-[11px] text-stone-600 dark:text-stone-300 border-t border-stone-200/60 dark:border-stone-700/60 mt-1">
                  <p className="font-semibold text-stone-800 dark:text-stone-200">
                    Oui, absolument ! Voici les 3 meilleures méthodes selon tes préférences :
                  </p>

                  <div className="space-y-2 pl-1 leading-relaxed">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <strong className="text-stone-900 dark:text-stone-100">1. Deux widgets côte-à-côte :</strong>
                      <p className="mt-0.5">
                        Ajoute 2 petits widgets Calendrier sur ton écran d'accueil. Fais un appui long sur l'un d'eux ➔ <em>« Modifier le widget »</em> ➔ tu peux filtrer quel calendrier afficher pour avoir Hanzi à gauche et Histoire à droite.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <strong className="text-stone-900 dark:text-stone-100">2. La Pile Intelligente (Smart Stack) :</strong>
                      <p className="mt-0.5">
                        Ajoute deux widgets carrés, puis glisse le second par-dessus le premier. Ils se superposent en une pile : fais simplement défiler de haut en bas pour alterner entre ton caractère et ton histoire !
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <strong className="text-amber-800 dark:text-amber-300">3. Le Combo 2-en-1 automatique (Le plus simple) :</strong>
                      <p className="mt-0.5">
                        Avec le <strong>Pack Combo</strong>, un seul widget suffit ! Il affichera ton Hanzi le matin (08:30), puis basculera automatiquement sur ton Histoire dès la fin de journée (19:30).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide pas-à-pas installation */}
            <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-950 dark:text-amber-200 space-y-1">
              <strong className="block font-bold">📲 Comment l'installer en 10 secondes :</strong>
              <p>1. Télécharge le fichier <code>.ics</code> depuis Safari sur ton iPhone ➔ Touche-le ➔ Choisis <em>« Tout ajouter »</em>.</p>
              <p>2. Maintiens le fond de ton écran d'accueil ➔ Touche <strong>« + »</strong> en haut à gauche ➔ Ajoute le widget <strong>Calendrier</strong>.</p>
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
                Grâce à l'application native <strong>Raccourcis (Shortcuts)</strong> installée sur ton iPhone, tu peux créer une automatisation qui t'affiche une notification avec le contenu du jour à l'heure exacte de ton réveil.
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
