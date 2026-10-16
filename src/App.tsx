import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { VoiceCoachLab } from './components/VoiceCoachLab';
import { ConversationChatBot } from './components/ConversationChatBot';
import { CurriculumOverview } from './components/CurriculumOverview';
import { DailyAnchorModal } from './components/DailyAnchorModal';
import { CalendarReminderModal } from './components/CalendarReminderModal';
import { AnkiLinkModal } from './components/AnkiLinkModal';
import { ProfileSyncModal } from './components/ProfileSyncModal';
import { AuthModal } from './components/AuthModal';
import { AnkiWord } from './types/fluent';
import { StoryReaderView } from './components/StoryReaderView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CURRICULUM_MODULES, NUANCE_CARDS } from './data/curriculumData';
import { getAnchoringRecords, getCardsDueForReview } from './utils/anchoringUtils';
import { 
  UserProfileBackup, 
  createProfileBackup, 
  clearActiveProfileFromStorage, 
  loadUserScopedBackup, 
  saveUserScopedBackup,
  applyProfileBackupToStorage,
  ACTIVE_AUTH_UID_KEY 
} from './utils/profileSyncUtils';
import { pushProfileToCloud, pullProfileFromCloud, isAutoSyncEnabled, getAuthUser, triggerAutoSyncToCloud } from './utils/cloudSyncUtils';
import { supabase } from './utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import { getAppTheme, applyThemeToDocument } from './utils/themeUtils';
import { AppleSyncModal } from './components/AppleSyncModal';
import { PinnedWordsAnkiModal } from './components/PinnedWordsAnkiModal';
import { EverydayPhrase } from './data/everydayPhrasesData';
import { getTodayDailyHanzi } from './data/dailyHanziData';
import { getTodayDailyStory } from './data/storiesData';
import { Sparkles } from 'lucide-react';

// Nettoyer immédiatement l'ancienne pollution 'warm1t' si aucun compte n'est actif
try {
  const activeUid = localStorage.getItem(ACTIVE_AUTH_UID_KEY);
  const migrated = localStorage.getItem('fluent_auth_isolation_v2');
  if (!activeUid && !migrated) {
    clearActiveProfileFromStorage();
    localStorage.setItem('fluent_auth_isolation_v2', 'true');
  }
} catch {}

export const App: React.FC = () => {
  // Par défaut : l'Accueil Guidé pour une prise en main instantanée sans fatigue décisionnelle !
  const [activeView, setActiveView] = useState<'home' | 'stories' | 'lab' | 'chat' | 'curriculum'>('home');
  const [selectedCardId, setSelectedCardId] = useState<string>(NUANCE_CARDS[0].id);

  // État Authentification Supabase Multi-Appareils
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [completedExercises, setCompletedExercises] = useState<string[]>(() => {
    if (!localStorage.getItem(ACTIVE_AUTH_UID_KEY)) return [];
    const saved = localStorage.getItem('fluent_completed_exercises');
    return saved ? JSON.parse(saved) : [];
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    if (!localStorage.getItem(ACTIVE_AUTH_UID_KEY)) return 0;
    const saved = localStorage.getItem('fluent_streak_days');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [syncedAnkiWords, setSyncedAnkiWords] = useState<AnkiWord[]>(() => {
    if (!localStorage.getItem(ACTIVE_AUTH_UID_KEY)) return [];
    const saved = localStorage.getItem('fluent_anki_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAnkiModalOpen, setIsAnkiModalOpen] = useState(false);
  const [isPinnedWordsModalOpen, setIsPinnedWordsModalOpen] = useState(false);
  const [customPracticePhrase, setCustomPracticePhrase] = useState<EverydayPhrase | null>(null);
  const [isDailyAnchorModalOpen, setIsDailyAnchorModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isProfileSyncModalOpen, setIsProfileSyncModalOpen] = useState(false);
  const [isAppleSyncModalOpen, setIsAppleSyncModalOpen] = useState(false);
  const [hanziOffsetDays, setHanziOffsetDays] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Enregistrements d'ancrage cognitif (SRS)
  const [anchoringRecords, setAnchoringRecords] = useState(() => {
    if (!localStorage.getItem(ACTIVE_AUTH_UID_KEY)) return {};
    return getAnchoringRecords();
  });

  const refreshAnchoring = () => {
    setAnchoringRecords(getAnchoringRecords());
  };

  const resetDisconnectedState = () => {
    clearActiveProfileFromStorage();
    setCompletedExercises([]);
    setStreakDays(0);
    setSyncedAnkiWords([]);
    setAnchoringRecords({});
  };

  const handleProfileRestored = (backup: UserProfileBackup, silent = false) => {
    setCompletedExercises(backup.completedExercises || []);
    setStreakDays(backup.streakDays || 0);
    setSyncedAnkiWords(backup.syncedAnkiWords || []);
    setAnchoringRecords(backup.anchoringRecords || {});
    if (!silent) {
      setToastMessage("🎉 Profil et progression restaurés avec succès sur cet appareil !");
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  useEffect(() => {
    localStorage.setItem('fluent_completed_exercises', JSON.stringify(completedExercises));
  }, [completedExercises]);

  useEffect(() => {
    localStorage.setItem('fluent_streak_days', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('fluent_anki_words', JSON.stringify(syncedAnkiWords));
  }, [syncedAnkiWords]);

  // Synchronisation en direct avec les événements d'ajout/suppression de mots Anki et de profil
  useEffect(() => {
    const handleWordsChanged = (e: any) => {
      if (e?.detail?.words) {
        setSyncedAnkiWords(e.detail.words);
      } else {
        try {
          const raw = localStorage.getItem('fluent_anki_words');
          setSyncedAnkiWords(raw ? JSON.parse(raw) : []);
        } catch {}
      }
    };
    const handleProfileUpdated = (e: any) => {
      if (e?.detail) {
        const b = e.detail as UserProfileBackup;
        setCompletedExercises(b.completedExercises || []);
        setStreakDays(b.streakDays || 0);
        setSyncedAnkiWords(b.syncedAnkiWords || []);
        setAnchoringRecords(b.anchoringRecords || {});
      }
    };
    window.addEventListener('fluent_anki_words_changed', handleWordsChanged);
    window.addEventListener('fluent_profile_updated', handleProfileUpdated);
    return () => {
      window.removeEventListener('fluent_anki_words_changed', handleWordsChanged);
      window.removeEventListener('fluent_profile_updated', handleProfileUpdated);
    };
  }, []);

  // Initialisation du thème et coordination stricte Authentification <-> Données sauvegardées
  useEffect(() => {
    applyThemeToDocument(getAppTheme());

    // 1. Vérifier si un compte est réellement connecté au démarrage
    getAuthUser().then(async (user) => {
      setCurrentUser(user);

      if (!user) {
        // Aucun compte connecté : sauvegarder l'éventuel ancien compte puis vider l'affichage actif
        const prevUid = localStorage.getItem(ACTIVE_AUTH_UID_KEY);
        if (prevUid) {
          saveUserScopedBackup(prevUid);
        }
        resetDisconnectedState();
        return;
      }

      // Utilisateur connecté : activer son espace et restaurer ses données locales + Cloud
      localStorage.setItem(ACTIVE_AUTH_UID_KEY, user.id);
      const localScoped = loadUserScopedBackup(user.id);
      if (localScoped) {
        applyProfileBackupToStorage(localScoped);
        handleProfileRestored(localScoped, true);
      }

      if (isAutoSyncEnabled()) {
        try {
          const res = await pullProfileFromCloud(user.id);
          if (res.success && res.data) {
            handleProfileRestored(res.data, true);
          }
        } catch (e) {
          console.warn('Auto-pull Cloud au démarrage :', e);
        }
      }
    });

    // 2. Écouter les connexions / déconnexions en temps réel
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);

      if (event === 'SIGNED_OUT' || !user) {
        resetDisconnectedState();
        return;
      }

      if (user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        localStorage.setItem(ACTIVE_AUTH_UID_KEY, user.id);
        const scoped = loadUserScopedBackup(user.id);
        if (scoped) {
          applyProfileBackupToStorage(scoped);
          handleProfileRestored(scoped, true);
        }
        try {
          const res = await pullProfileFromCloud(user.id);
          if (res.success && res.data) {
            handleProfileRestored(res.data, true);
            setToastMessage(`☁️ Connecté (${user.email}) : progression restaurée !`);
            setTimeout(() => setToastMessage(null), 3500);
          }
        } catch (e) {
          console.warn('Erreur pull cloud sur connexion :', e);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleExerciseCompleted = (cardId: string) => {
    let updatedExercises = completedExercises;
    if (!completedExercises.includes(cardId)) {
      updatedExercises = [...completedExercises, cardId];
      setCompletedExercises(updatedExercises);
      setToastMessage("🎉 太棒了 ! Nuance validée à l'oral (> 80%) et ancrée !");
      setTimeout(() => setToastMessage(null), 4000);
    }
    refreshAnchoring();
    triggerAutoSyncToCloud();
  };

  const handleStartGuidedAction = (cardId: string, actionType: 'card' | 'anchor') => {
    if (actionType === 'anchor') {
      setIsDailyAnchorModalOpen(true);
    } else {
      setSelectedCardId(cardId);
      setActiveView('curriculum');
    }
  };

  const dueCards = getCardsDueForReview(NUANCE_CARDS);
  const anchoredCount = Object.values(anchoringRecords).filter(r => r.stage === 'ancre').length;

  // Calcul dynamique du Hanzi et de l'Histoire du Jour (avec navigation entre jours)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + hanziOffsetDays);
  const todayHanzi = getTodayDailyHanzi(targetDate);
  const todayStory = getTodayDailyStory(targetDate);

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
        onOpenPinnedWordsModal={() => setIsPinnedWordsModalOpen(true)}
        onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
        onOpenProfileSyncModal={() => setIsProfileSyncModalOpen(true)}
        onOpenAppleSyncModal={() => setIsAppleSyncModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div key={activeView} className="animate-tab-switch space-y-8">
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
              onOpenPinnedWordsModal={() => setIsPinnedWordsModalOpen(true)}
              onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
              onSelectCard={(cardId) => {
                setSelectedCardId(cardId);
                setActiveView('curriculum');
              }}
            />
          )}

          {/* VUE HISTOIRES : LECTEUR IMMERSIF AVEC ANCRAGE ANKI */}
          {activeView === 'stories' && (
            <StoryReaderView
              syncedAnkiWords={syncedAnkiWords}
              onOpenAnkiModal={() => setIsAnkiModalOpen(true)}
              onOpenAppleSyncModal={() => setIsAppleSyncModalOpen(true)}
              onIncrementStreak={() => {
                setStreakDays(prev => prev + 1);
                triggerAutoSyncToCloud();
              }}
            />
          )}

          {/* VUE 2 : LABO VOCAL (Phrases courantes du quotidien & Auto-écoute) */}
          {activeView === 'lab' && (
            <VoiceCoachLab
              customPracticePhrase={customPracticePhrase}
              onClearCustomPhrase={() => setCustomPracticePhrase(null)}
              onPracticeCompleted={(phraseId, score) => {
                if (score >= 80) {
                  setToastMessage(`🎉 太棒了 ! Phrase validée à l'oral (${score}%) !`);
                  setTimeout(() => setToastMessage(null), 3500);
                }
                triggerAutoSyncToCloud();
              }}
            />
          )}

          {/* VUE 3 : PARTENAIRE IA DE CONVERSATION (Dialogue spontané & oral) */}
          {activeView === 'chat' && (
            <ConversationChatBot
              onWordAddedToAnki={() => {
                setToastMessage("✨ Mot enregistré dans ton Anki local et prêt à être révisé !");
                setTimeout(() => setToastMessage(null), 3000);
              }}
            />
          )}

          {/* VUE 4 : LES MODULES D'ÉLOCUTION & LEÇONS STRUCTURÉES */}
          {activeView === 'curriculum' && (
            <ErrorBoundary
              fallbackTitle="Impossible de charger le module d'élocution"
              onReset={() => {
                setSelectedCardId(NUANCE_CARDS[0].id);
                setActiveView('curriculum');
              }}
            >
              <CurriculumOverview
                modules={CURRICULUM_MODULES}
                cards={NUANCE_CARDS}
                anchoringRecords={anchoringRecords}
                currentCardId={selectedCardId}
                onSelectCard={(cardId) => setSelectedCardId(cardId)}
                syncedAnkiWords={syncedAnkiWords}
                onExerciseCompleted={handleExerciseCompleted}
                onOpenAnchorSession={() => setIsDailyAnchorModalOpen(true)}
              />
            </ErrorBoundary>
          )}
        </div>

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
            setActiveView('curriculum');
          }}
        />
      )}

      {/* Anki Sync Modal */}
      {isAnkiModalOpen && (
        <AnkiLinkModal
          onClose={() => setIsAnkiModalOpen(false)}
          syncedWords={syncedAnkiWords}
          onOpenPinnedWordsModal={() => setIsPinnedWordsModalOpen(true)}
          onWordsUpdated={(words) => {
            setSyncedAnkiWords(words);

            // Auto-sync immédiat vers Supabase Cloud dès qu'Anki est mis à jour
            if (isAutoSyncEnabled()) {
              const backup = createProfileBackup(
                completedExercises,
                streakDays,
                words,
                getAnchoringRecords()
              );
              pushProfileToCloud(backup)
                .then(() => {
                  setToastMessage(`☁️ ${words.length} cartes Anki synchronisées sur le Cloud !`);
                  setTimeout(() => setToastMessage(null), 3500);
                })
                .catch((e) => console.warn('Auto-sync Supabase Anki:', e));
            }
          }}
        />
      )}

      {/* Modal Mes Mots Épinglés & Export Anki & Phrases Proposées */}
      <PinnedWordsAnkiModal
        isOpen={isPinnedWordsModalOpen}
        onClose={() => setIsPinnedWordsModalOpen(false)}
        words={syncedAnkiWords}
        onWordsUpdated={(words) => setSyncedAnkiWords(words)}
        onPracticePhrase={(phrase) => {
          setCustomPracticePhrase(phrase);
          setActiveView('lab');
          setToastMessage(`🎙️ Phrase chargée au Labo Vocal : « ${phrase.hanzi} »`);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />

      {/* Profile Sync & Progression Backup Modal */}
      <ProfileSyncModal
        isOpen={isProfileSyncModalOpen}
        onClose={() => setIsProfileSyncModalOpen(false)}
        completedExercises={completedExercises}
        streakDays={streakDays}
        syncedAnkiWords={syncedAnkiWords}
        anchoringRecords={anchoringRecords}
        onProfileRestored={handleProfileRestored}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Supabase Multi-Device Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={async (user) => {
          setCurrentUser(user);
          localStorage.setItem(ACTIVE_AUTH_UID_KEY, user.id);
          const localScoped = loadUserScopedBackup(user.id);
          if (localScoped) {
            applyProfileBackupToStorage(localScoped);
            handleProfileRestored(localScoped, true);
          }
          try {
            const res = await pullProfileFromCloud(user.id);
            if (res.success && res.data) {
              handleProfileRestored(res.data);
            }
          } catch (e) {
            console.warn('Erreur pull cloud :', e);
          }
        }}
        onSignOutSuccess={() => {
          setCurrentUser(null);
          resetDisconnectedState();
          setToastMessage("🔒 Déconnecté — affichage remis à zéro (vos données restent liées à votre compte).");
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* Apple iPhone Sync Modal (Daily Hanzi & Widget iOS) */}
      <AppleSyncModal
        isOpen={isAppleSyncModalOpen}
        onClose={() => setIsAppleSyncModalOpen(false)}
        todayHanzi={todayHanzi}
        todayStory={todayStory}
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
        <p>Fluent — Programme d'Expression Mandarin • Mode Encre 📜 & Mode Sombre 🌙 • Cockpit Guidé 100% Gratuit & Local</p>
      </footer>

    </div>
  );
};

export default App;
