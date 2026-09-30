import React, { useState, useEffect } from 'react';
import { MaayotStory, StoryWordToken, AnkiWord } from '../types/fluent';
import { BUILT_IN_STORIES, generateStoryFromAnkiWords } from '../data/storiesData';
import { 
  playChineseAudio, 
  playChineseStoryAudio, 
  stopChineseAudio, 
  playNativeWordAudio, 
  evaluatePronunciation, 
  isSpeechRecognitionSupported 
} from '../utils/speechUtils';
import { VoiceSelector } from './VoiceSelector';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Languages, 
  Mic, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  Clock, 
  Flame, 
  Layers, 
  Wand2, 
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
  Send
} from 'lucide-react';

interface StoryReaderViewProps {
  syncedAnkiWords: AnkiWord[];
  onOpenAnkiModal: () => void;
  onIncrementStreak?: () => void;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({
  syncedAnkiWords,
  onOpenAnkiModal,
  onIncrementStreak,
}) => {
  const [stories, setStories] = useState<MaayotStory[]>(BUILT_IN_STORIES);
  const [selectedStoryId, setSelectedStoryId] = useState<string>(BUILT_IN_STORIES[0].id);

  // Préférences du lecteur (Style Maayot)
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeSpeakerGender, setActiveSpeakerGender] = useState<'female' | 'male' | null>(null);

  // Mot actif sélectionné pour la pop-up de dictionnaire
  const [selectedWord, setSelectedWord] = useState<StoryWordToken | null>(null);

  // État du Quiz
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizExplanations, setShowQuizExplanations] = useState<boolean>(false);

  // État du Défi Oral / Écrit
  const [writtenResponse, setWrittenResponse] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechEvaluation, setSpeechEvaluation] = useState<any | null>(null);

  // Histoires terminées (sauvegardées en local)
  const [completedStoryIds, setCompletedStoryIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('fluent_completed_stories');
    return saved ? JSON.parse(saved) : [];
  });

  const activeStory = stories.find(s => s.id === selectedStoryId) || stories[0];

  useEffect(() => {
    // Réinitialiser les états lors du changement d'histoire
    setSelectedAnswers({});
    setShowQuizExplanations(false);
    setSelectedWord(null);
    setWrittenResponse('');
    setSpeechEvaluation(null);
    stopChineseAudio();
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);
  }, [selectedStoryId]);

  // Nettoyage au démontage du composant
  useEffect(() => {
    return () => {
      stopChineseAudio();
    };
  }, []);

  // Lecture audio complète avec alternance intelligente des voix Homme / Femme
  const handlePlayFullAudio = async () => {
    if (isPlayingAudio) {
      stopChineseAudio();
      setIsPlayingAudio(false);
      setActiveSpeakerGender(null);
      return;
    }

    setIsPlayingAudio(true);
    await playChineseStoryAudio(
      activeStory.audioText, 
      playbackSpeed, 
      (_idx, _text, gender) => {
        setActiveSpeakerGender(gender);
      }
    );
    setIsPlayingAudio(false);
    setActiveSpeakerGender(null);
  };

  // Prononcer un mot précis au clic (avec audio studio dictionnaire haute définition)
  const handlePronounceWord = (wordHanzi: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playNativeWordAudio(wordHanzi, 0.85);
  };

  // Valider une réponse au Quiz
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  // Marquer l'histoire comme lue
  const handleMarkAsCompleted = () => {
    if (!completedStoryIds.includes(activeStory.id)) {
      const updated = [...completedStoryIds, activeStory.id];
      setCompletedStoryIds(updated);
      localStorage.setItem('fluent_completed_stories', JSON.stringify(updated));
      if (onIncrementStreak) onIncrementStreak();
    }
  };

  // Générer une histoire personnalisée à partir des cartes Anki de l'utilisateur
  const handleGenerateAnkiStory = () => {
    if (syncedAnkiWords.length === 0) {
      onOpenAnkiModal();
      return;
    }

    // Mélanger aléatoirement 4 cartes Anki
    const shuffled = [...syncedAnkiWords].sort(() => 0.5 - Math.random());
    const newStory = generateStoryFromAnkiWords(shuffled);

    setStories(prev => [newStory, ...prev]);
    setSelectedStoryId(newStory.id);
  };

  // Enregistrement micro pour le défi d'expression
  const handleToggleVoiceRecording = () => {
    if (!isSpeechRecognitionSupported()) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Essaie sur Google Chrome ou Edge !");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setWrittenResponse(spokenText);
      setIsRecording(false);

      // Évaluer si la phrase contient l'un des mots suggérés
      const targetList = activeStory.discussionPrompt.suggestedWords || [];
      const evaluation = evaluatePronunciation(spokenText, spokenText);
      setSpeechEvaluation({
        ...evaluation,
        usedSuggestedWords: targetList.filter(w => spokenText.includes(w.replace(/\s*\(.*\)/, ''))),
      });
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Vérifier si un mot dans le dictionnaire fait partie des cartes Anki de l'utilisateur
  const isWordInUserAnki = (hanzi: string) => {
    return syncedAnkiWords.some(w => w.hanzi.includes(hanzi) || hanzi.includes(w.hanzi));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. SÉLECTEUR D'HISTOIRES & CARROUSEL HAUT */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border-2 border-stone-900 rounded-3xl shadow-[4px_4px_0px_#1c1917]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Lectures Immersives HSK 3-4 (Concept Maayot)
            </span>
            <span className="text-xs font-bold text-stone-500">
              {completedStoryIds.length} histoires lues
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
            Histoires Quotidiennes & Ancrage
          </h2>
          <p className="text-xs text-stone-600">
            Une histoire par jour pour contextualiser tes mots Anki, avec lecture audio native, dictionnaire au clic et quiz.
          </p>
        </div>

        {/* Bouton Générer avec mes mots Anki */}
        <button
          onClick={handleGenerateAnkiStory}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-md border-2 border-stone-900 transition-all flex items-center justify-center space-x-2 shrink-0 hover:-translate-y-0.5"
        >
          <Wand2 className="w-4 h-4" />
          <span>Créer une Histoire avec mes Mots Anki</span>
        </button>
      </div>

      {/* Onglets de sélection des histoires */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {stories.map(story => {
          const isSelected = story.id === selectedStoryId;
          const isCompleted = completedStoryIds.includes(story.id);

          return (
            <button
              key={story.id}
              onClick={() => setSelectedStoryId(story.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center space-x-2 ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              {isCompleted ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="font-serif font-black">{story.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200/50 text-stone-700 font-mono">
                {story.level}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. LE LECTEUR IMMERSIF MAAYOT */}
      <div className="bg-[#fcfaf7] border-2 border-stone-900 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#1c1917] space-y-6 relative">
        
        {/* En-tête de l'histoire */}
        <div className="border-b-2 border-stone-200 pb-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-[#c23b22] border border-rose-300">
                {activeStory.level}
              </span>
              <span className="text-xs font-bold text-stone-500">
                • {activeStory.category} • ~{activeStory.readTime} ({activeStory.wordCount} caractères)
              </span>
            </div>

            {completedStoryIds.includes(activeStory.id) && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Histoire lue & validée</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
            {activeStory.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-mono">
            {activeStory.titlePinyin}
          </p>
          <p className="text-xs sm:text-sm text-stone-700 italic">
            « {activeStory.titleTranslation} »
          </p>
        </div>

        {/* 3. BARRE D'OUTILS DE LECTURE MAAYOT (PINYIN, TRADUCTION, AUDIO, VITESSE) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-stone-200 rounded-2xl">
          
          {/* Toggles Pinyin & Traduction */}
          <div className="flex items-center space-x-2 text-xs font-bold">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all ${
                showPinyin
                  ? 'bg-amber-100/80 border-amber-300 text-amber-950 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {showPinyin ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
              <span>Pinyin</span>
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all ${
                showTranslation
                  ? 'bg-blue-100/80 border-blue-300 text-blue-950 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-blue-700" />
              <span>Traduction Française</span>
            </button>
          </div>

          {/* Contrôles Audio : Voix, Vitesse et Lecture */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Indicateur de locuteur actif en alternance */}
            {isPlayingAudio && activeSpeakerGender && (
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border animate-pulse ${
                activeSpeakerGender === 'female'
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-blue-50 text-blue-800 border-blue-300'
              }`}>
                <span>{activeSpeakerGender === 'female' ? '👩 Voix Féminine' : '👨 Voix Masculine'}</span>
              </span>
            )}

            {/* Sélecteur de voix Homme / Femme / Alterné */}
            <VoiceSelector compact />

            {/* Sélecteur de vitesse */}
            <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200 text-[11px] font-bold">
              {[0.75, 1.0, 1.2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    playbackSpeed === speed
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Bouton de lecture audio */}
            <button
              onClick={handlePlayFullAudio}
              className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 border transition-all ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Écouter l'Histoire</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* 4. TEXTE DE L'HISTOIRE AVEC MOTS CLIQUABLES (DICTIONNAIRE INSTANTANÉ) */}
        <div className="space-y-6 text-stone-900 leading-relaxed font-serif text-lg sm:text-xl py-2">
          {activeStory.paragraphs.map((paragraph, pIdx) => (
            <div key={pIdx} className="space-y-4">
              {paragraph.sentences.map((sentence, sIdx) => (
                <div key={sIdx} className="space-y-1.5 p-3 rounded-2xl transition-colors hover:bg-amber-50/40">
                  
                  {/* Ligne des caractères cliquables avec ou sans pinyin */}
                  <div className="flex flex-wrap items-end gap-x-1.5 gap-y-3">
                    {sentence.words.map((word, wIdx) => {
                      const isSelected = selectedWord?.hanzi === word.hanzi;
                      const inAnki = isWordInUserAnki(word.hanzi);

                      return (
                        <span
                          key={wIdx}
                          onClick={() => setSelectedWord(word)}
                          className={`group inline-flex flex-col items-center cursor-pointer rounded-lg px-1 py-0.5 transition-all select-none ${
                            isSelected
                              ? 'bg-amber-300/80 text-stone-950 font-bold ring-2 ring-stone-900'
                              : word.isTarget
                              ? 'bg-amber-100/90 hover:bg-amber-200 border-b-2 border-amber-500 font-bold text-stone-900'
                              : inAnki
                              ? 'bg-rose-50 hover:bg-rose-100 border-b-2 border-[#c23b22] text-stone-900'
                              : 'hover:bg-stone-200/70 text-stone-900'
                          }`}
                        >
                          {showPinyin && word.pinyin && (
                            <span className="text-[11px] font-sans text-stone-500 font-normal tracking-normal leading-none mb-1 group-hover:text-stone-900">
                              {word.pinyin}
                            </span>
                          )}
                          <span className="chinese-text font-bold text-xl sm:text-2xl leading-none">
                            {word.hanzi}
                          </span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Traduction française de la phrase (si activée) */}
                  {showTranslation && sentence.translation && (
                    <p className="text-xs sm:text-sm font-sans text-stone-500 italic pl-1 border-l-2 border-amber-300">
                      {sentence.translation}
                    </p>
                  )}

                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 5. POP-UP DICTIONNAIRE AU CLIC SUR UN MOT (STYLE MAAYOT ONE-CLICK) */}
        {selectedWord && (
          <div className="p-4 rounded-2xl bg-white border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-3.5">
              <button
                onClick={(e) => handlePronounceWord(selectedWord.hanzi, e)}
                className="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 flex items-center justify-center transition-colors shrink-0"
                title="Écouter la prononciation"
              >
                <Volume2 className="w-5 h-5 text-amber-800" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black text-stone-900 font-serif">
                    {selectedWord.hanzi}
                  </span>
                  <span className="text-sm font-bold font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                    {selectedWord.pinyin}
                  </span>
                  {isWordInUserAnki(selectedWord.hanzi) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-[#c23b22] border border-rose-300 flex items-center space-x-0.5">
                      <Sparkles className="w-3 h-3 mr-0.5" />
                      <span>Dans ton Anki</span>
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-stone-700 mt-0.5">
                  {selectedWord.translation}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedWord(null)}
              className="text-stone-400 hover:text-stone-800 text-xs font-bold underline self-end sm:self-center"
            >
              Fermer
            </button>
          </div>
        )}

        {/* 6. VOCABULAIRE CIBLE DE L'HISTOIRE */}
        <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            Vocabulaire clé à ancrer dans cette histoire :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {activeStory.targetWords.map((word, idx) => (
              <div
                key={idx}
                onClick={() => playNativeWordAudio(word.hanzi, 0.9)}
                className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 cursor-pointer flex items-center justify-between text-xs transition-all shadow-2xs group"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-base font-serif text-stone-900 group-hover:text-[#c23b22]">
                      {word.hanzi}
                    </span>
                    <span className="text-stone-500 font-mono text-[11px]">
                      {word.pinyin}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 truncate max-w-[140px]">
                    {word.translation}
                  </p>
                </div>
                <Volume2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#c23b22] shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 7. QUIZ DE COMPRÉHENSION MAAYOT */}
        {activeStory.quiz && activeStory.quiz.length > 0 && (
          <div className="p-5 rounded-2xl bg-white border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-400 text-stone-950 font-bold">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm sm:text-base text-stone-900 font-serif">
                  Quiz de Compréhension
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-bold">
                {Object.keys(selectedAnswers).length}/{activeStory.quiz.length} répondu
              </span>
            </div>

            <div className="space-y-4">
              {activeStory.quiz.map((q, qIdx) => {
                const userAnswer = selectedAnswers[qIdx];
                const hasAnswered = userAnswer !== undefined;

                return (
                  <div key={qIdx} className="space-y-2.5 text-xs">
                    <p className="font-bold text-stone-900 text-sm">
                      {qIdx + 1}. {q.question}
                    </p>
                    {q.questionPinyin && (
                      <p className="text-[11px] text-stone-500 font-mono -mt-1">
                        {q.questionPinyin}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAnswer === optIdx;
                        const isCorrect = optIdx === q.correctIndex;

                        let style = 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100';
                        if (hasAnswered) {
                          if (isCorrect) {
                            style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                          } else if (isChosen) {
                            style = 'bg-rose-100 border-rose-400 text-rose-950';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(qIdx, optIdx)}
                            className={`p-3 rounded-xl border text-left transition-all ${style}`}
                          >
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <p className="p-2.5 rounded-xl bg-stone-100 text-[11px] text-stone-700 border border-stone-200">
                        💡 <strong>Explication :</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. DÉFI D'EXPRESSION ORALE / ÉCRITE (PROMPT MAAYOT) */}
        {activeStory.discussionPrompt && (
          <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="font-black text-sm text-stone-900 font-serif">
                À toi de parler ! (Défi d'expression)
              </h3>
            </div>

            <p className="text-xs font-bold text-stone-800">
              {activeStory.discussionPrompt.question}
            </p>
            {activeStory.discussionPrompt.questionTranslation && (
              <p className="text-[11px] text-stone-600 italic">
                « {activeStory.discussionPrompt.questionTranslation} »
              </p>
            )}

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={writtenResponse}
                onChange={(e) => setWrittenResponse(e.target.value)}
                placeholder="Écris ou parle au micro en chinois..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-serif focus:outline-none focus:ring-2 focus:ring-[#c23b22]"
              />

              <button
                onClick={handleToggleVoiceRecording}
                className={`p-2.5 rounded-xl border-2 border-stone-900 font-bold transition-all shadow-xs shrink-0 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white hover:bg-stone-100 text-stone-900'
                }`}
                title="Parler au micro"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {speechEvaluation && (
              <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-emerald-800">
                  🎉 Expression captée : {speechEvaluation.spokenText}
                </span>
                <p className="text-[11px] text-stone-600">
                  Score de prononciation : <strong>{speechEvaluation.accuracyScore}%</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 9. BOUTON FINAL : VALIDER L'HISTOIRE (+1 JOUR DE STREAK) */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-stone-500 font-medium">
            Termine la lecture pour marquer ton jour de pratique.
          </span>

          <button
            onClick={handleMarkAsCompleted}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs shadow-md border-2 border-stone-900 transition-all flex items-center justify-center space-x-2 ${
              completedStoryIds.includes(activeStory.id)
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {completedStoryIds.includes(activeStory.id)
                ? 'Histoire validée (Pratique du jour enregistrée)'
                : 'Marquer l\'histoire comme lue (+1j Streak)'}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
