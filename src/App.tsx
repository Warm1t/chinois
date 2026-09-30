import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { VoiceCoachLab } from './components/VoiceCoachLab';
import { CurriculumOverview } from './components/CurriculumOverview';
import { DailyAnchorModal } from './components/DailyAnchorModal';
import { CalendarReminderModal } from './components/CalendarReminderModal';
import { AnkiLinkModal } from './components/AnkiLinkModal';
import { ProfileSyncModal } from './components/ProfileSyncModal';
import { AnkiWord } from './types/fluent';
import { StoryReaderView } from './components/StoryReaderView';
import { CURRICULUM_MODULES, NUANCE_CARDS } from './data/curriculumData';
import { getAnchoringRecords, getCardsDueForReview } from './utils/anchoringUtils';
import { UserProfileBackup } from './utils/profileSyncUtils';
import { getAppTheme, applyThemeToDocument } from './utils/themeUtils';
import { AppleSyncModal } from './components/AppleSyncModal';
import { getTodayDailyHanzi } from './data/dailyHanziData';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Par défaut : l'Accueil Guidé pour une prise en main instantanée sans fatigue décisionnelle !
  const [activeView, setActiveView] = useState<'home' | 'stories' | 'lab' | 'curriculum'>('home');
  const [selectedCardId, setSelectedCardId] = useState<string>(NUANCE_CARDS[0].id);

  const [completedExercises, setCompletedExercises] = useState<string[]>(() => {
    const saved = localStorage.getItem('fluent_completed_exercises');
    return saved ? JSON.parse(saved) : [];
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('fluent_streak_days');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [syncedAnkiWords, setSyncedAnkiWords] = useState<AnkiWord[]>(() => {
    const saved = localStorage.getItem('fluent_anki_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAnkiModalOpen, setIsAnkiModalOpen] = useState(false);
  const [isDailyAnchorModalOpen, setIsDailyAnchorModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isProfileSyncModalOpen, setIsProfileSyncModalOpen] = useState(false);
  const [isAppleSyncModalOpen, setIsAppleSyncModalOpen] = useState(false);
  const [hanziOffsetDays, setHanziOffsetDays] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Enregistrements d'ancrage cognitif (SRS)
  const [anchoringRecords, setAnchoringRecords] = useState(() => getAnchoringRecords());

  const refreshAnchoring = () => {
    setAnchoringRecords(getAnchoringRecords());
  };

  const handleProfileRestored = (backup: UserProfileBackup) => {
    setCompletedExercises(backup.completedExercises);
    setStreakDays(backup.streakDays);
    setSyncedAnkiWords(backup.syncedAnkiWords);
    setAnchoringRecords(backup.anchoringRecords);
    setToastMessage("🎉 Profil et progression restaurés avec succès sur cet appareil !");
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    localStorage.setItem('fluent_completed_exercises', JSON.stringify(completedExercises));
  }, [completedExercises]);

  useEffect(() => {
    localStorage.setItem('fluent_anki_words', JSON.stringify(syncedAnkiWords));
  }, [syncedAnkiWords]);

  // Initialisation du thème au premier chargement (Mode Encre ou Mode Sombre)
  useEffect(() => {
    applyThemeToDocument(getAppTheme());
  }, []);

  const handleExerciseCompleted = (cardId: string) => {
    if (!completedExercises.includes(cardId)) {
      const updated = [...completedExercises, cardId];
      setCompletedExercises(updated);
      setToastMessage("🎉 太棒了 ! Nuance validée à l'oral (> 80%) et ancrée !");
      setTimeout(() => setToastMessage(null), 4000);
    }
    refreshAnchoring();
  };

  const handleSelectCardFromCurriculum = (cardId: string) => {
    setSelectedCardId(cardId);
    setActiveView('lab');
  };

  const handleStartGuidedAction = (cardId: string, actionType: 'card' | 'anchor') => {
    if (actionType === 'anchor') {
      setIsDailyAnchorModalOpen(true);
    } else {
      setSelectedCardId(cardId);
      setActiveView('lab');
    }
  };

  const dueCards = getCardsDueForReview(NUANCE_CARDS);
  const anchoredCount = Object.values(anchoringRecords).filter(r => r.stage === 'ancre').length;

  // Calcul dynamique du Hanzi du Jour (avec navigation entre jours)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + hanziOffsetDays);
  const todayHanzi = getTodayDailyHanzi(targetDate);

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0e0d0c] text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-[#c23b22] selection:text-white transition-colors duration-200">
      
      {/* Header Encre & Papier avec Navigation Rapide */}
      <Header
        currentView={activeView}
        onNavigate={(view) => setActiveView(view)}
        currentStreak={streakDays}
        completedExercisesCount={anchoredCount}
        syncedAnkiWordsCount={syncedAnkiWords.length}
        onOpenAnkiModal={() => setIsAnkiModalOpen(true)}
        onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
        onOpenProfileSyncModal={() => setIsProfileSyncModalOpen(true)}
        onOpenAppleSyncModal={() => setIsAppleSyncModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* VUE 1 : ACCUEIL GUIDÉ (Cockpit automatique du jour) */}
        {activeView === 'home' && (
          <HomeDashboard
            modules={CURRICULUM_MODULES}
            cards={NUANCE_CARDS}
            anchoringRecords={anchoringRecords}
            syncedAnkiWords={syncedAnkiWords}
            streakDays={streakDays}
            dueCards={dueCards}
            todayHanzi={todayHanzi}
            onOpenAppleSyncModal={() => setIsAppleSyncModalOpen(true)}
            onSelectPreviousHanzi={() => setHanziOffsetDays(prev => prev - 1)}
            onSelectNextHanzi={() => setHanziOffsetDays(prev => prev + 1)}
            onStartGuidedAction={handleStartGuidedAction}
            onNavigateToView={(view) => setActiveView(view)}
            onOpenAnkiModal={() => setIsAnkiModalOpen(true)}
            onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
            onSelectCard={(cardId) => {
              setSelectedCardId(cardId);
              setActiveView('lab');
            }}
          />
        )}

        {/* VUE HISTOIRES : LECTEUR IMMERSIF (STYLE MAAYOT AVEC ANCRAGE ANKI) */}
        {activeView === 'stories' && (
          <StoryReaderView
            syncedAnkiWords={syncedAnkiWords}
            onOpenAnkiModal={() => setIsAnkiModalOpen(true)}
            onIncrementStreak={() => setStreakDays(prev => prev + 1)}
          />
        )}

        {/* VUE 2 : LABO VOCAL & FICHE ACTIVE */}
        {activeView === 'lab' && (
          <VoiceCoachLab
            onExerciseCompleted={handleExerciseCompleted}
            syncedAnkiWords={syncedAnkiWords}
            selectedCardId={selectedCardId}
            onOpenCurriculum={() => setActiveView('curriculum')}
            onOpenAnchorSession={() => setIsDailyAnchorModalOpen(true)}
          />
        )}

        {/* VUE 3 : TRAME PÉDAGOGIQUE GLOBALE (5 Modules & 18 Fiches) */}
        {activeView === 'curriculum' && (
          <CurriculumOverview
            modules={CURRICULUM_MODULES}
            cards={NUANCE_CARDS}
            anchoringRecords={anchoringRecords}
            currentCardId={selectedCardId}
            onSelectCard={handleSelectCardFromCurriculum}
          />
        )}

      </main>

      {/* Modal de Connexion Calendrier & Rappels */}
      {isCalendarModalOpen && (
        <CalendarReminderModal
          onClose={() => setIsCalendarModalOpen(false)}
        />
      )}

      {/* Modal d'Ancrage Quotidien (Répétition Espacée) */}
      {isDailyAnchorModalOpen && (
        <DailyAnchorModal
          dueCards={dueCards.length > 0 ? dueCards : NUANCE_CARDS.slice(0, 3)}
          onClose={() => setIsDailyAnchorModalOpen(false)}
          onRefreshRecords={refreshAnchoring}
          onSelectCardForDeepPractice={(cardId) => {
            setSelectedCardId(cardId);
            setActiveView('lab');
          }}
        />
      )}

      {/* Anki Sync Modal */}
      {isAnkiModalOpen && (
        <AnkiLinkModal
          onClose={() => setIsAnkiModalOpen(false)}
          syncedWords={syncedAnkiWords}
          onWordsUpdated={(words) => {
            setSyncedAnkiWords(words);
          }}
        />
      )}

      {/* Profile Sync & Progression Backup Modal */}
      <ProfileSyncModal
        isOpen={isProfileSyncModalOpen}
        onClose={() => setIsProfileSyncModalOpen(false)}
        completedExercises={completedExercises}
        streakDays={streakDays}
        syncedAnkiWords={syncedAnkiWords}
        anchoringRecords={anchoringRecords}
        onProfileRestored={handleProfileRestored}
      />

      {/* Apple iPhone Sync Modal (Daily Hanzi & Widget iOS) */}
      <AppleSyncModal
        isOpen={isAppleSyncModalOpen}
        onClose={() => setIsAppleSyncModalOpen(false)}
        todayHanzi={todayHanzi}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className="bg-stone-900 border border-stone-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800/80 py-6 text-center text-xs text-stone-400 dark:text-stone-500 transition-colors duration-200">
        <p>Fluent — Programme d'Expression Mandarin HSK 3-4 • Mode Encre 📜 & Mode Sombre 🌙 • Cockpit Guidé 100% Gratuit & Local</p>
      </footer>

    </div>
  );
};

export default App;
