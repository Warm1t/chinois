import React, { useState, useEffect, useRef } from 'react';
import { 
  CHAT_SCENARIOS, 
  ChatScenario, 
  ChatMessage, 
  generateBotResponse, 
  ChatKeyWord 
} from '../utils/conversationBotEngine';
import { 
  playChineseAudio, 
  stopChineseAudio, 
  isSpeechRecognitionSupported 
} from '../utils/speechUtils';
import { analyzePronunciationWithAi, AiPronunciationFeedback } from '../utils/aiPronunciationCoach';
import { VoiceSelector } from './VoiceSelector';
import { saveWordToLocalAnki, isWordInLocalAnki } from '../utils/ankiConnect';
import { 
  Mic, 
  Square, 
  Volume2, 
  Snail, 
  Send, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  BookmarkCheck, 
  Bot, 
  Gauge, 
  CheckCircle2, 
  Zap, 
  CornerDownLeft, 
  Award,
  Layers,
  MessageSquare
} from 'lucide-react';

interface ConversationChatBotProps {
  onWordAddedToAnki?: () => void;
}

export const ConversationChatBot: React.FC<ConversationChatBotProps> = ({
  onWordAddedToAnki,
}) => {
  // Scénario actif
  const [activeScenarioId, setActiveScenarioId] = useState<string>('restaurant');
  const activeScenario = CHAT_SCENARIOS.find(s => s.id === activeScenarioId) || CHAT_SCENARIOS[0];

  // Historique des messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Saisie textuelle & reconnaissance vocale
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Audio & vitesse Putonghua
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // Visibilité Pinyin & Traductions globales
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});

  // Toast Anki
  const [ankiToast, setAnkiToast] = useState<string | null>(null);
  const [, setLocalAnkiVersion] = useState<number>(0);

  // Refs pour le micro & SpeechRecognition
  const isSupported = isSpeechRecognitionSupported();
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const isStartingRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll vers le bas lors de nouveaux messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveTranscript]);

  // Initialisation du scénario avec le message d'accueil de l'IA
  useEffect(() => {
    const initMsg: ChatMessage = {
      id: `bot-init-${activeScenario.id}-${Date.now()}`,
      sender: 'bot',
      hanzi: activeScenario.initialBotMessage.hanzi,
      pinyin: activeScenario.initialBotMessage.pinyin,
      french: activeScenario.initialBotMessage.french,
      tip: activeScenario.initialBotMessage.tip,
      keyWords: activeScenario.initialBotMessage.keyWords,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initMsg]);
    setRevealedTranslations({});
    setInputText('');
    cleanupRecording();
    stopChineseAudio();
  }, [activeScenarioId]);

  // Synchronisation des ajouts Anki
  useEffect(() => {
    const handleAnkiChange = () => {
      setLocalAnkiVersion(v => v + 1);
    };
    window.addEventListener('fluent_anki_words_changed', handleAnkiChange);
    return () => window.removeEventListener('fluent_anki_words_changed', handleAnkiChange);
  }, []);

  // Nettoyage micro
  const cleanupRecording = () => {
    isRecordingRef.current = false;
    isStartingRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      cleanupRecording();
      stopChineseAudio();
    };
  }, []);

  // Lecture audio Putonghua
  const handlePlayAudio = async (msgId: string, text: string) => {
    if (playingMessageId === msgId) {
      stopChineseAudio();
      setPlayingMessageId(null);
      return;
    }
    stopChineseAudio();
    setPlayingMessageId(msgId);
    await playChineseAudio(text, playbackSpeed);
    setPlayingMessageId(null);
  };

  // Basculer la visibilité de la traduction d'un message spécifique
  const toggleMessageTranslation = (msgId: string) => {
    setRevealedTranslations(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Enregistrer un mot clé dans Anki
  const handleSaveWordToAnki = (kw: ChatKeyWord) => {
    const res = saveWordToLocalAnki({
      hanzi: kw.hanzi,
      pinyin: kw.pinyin,
      translation: kw.translation,
      deckName: 'Fluent',
      source: 'fluent_to_anki',
    });
    setAnkiToast(res.isNew ? `✨ "${kw.hanzi}" ajouté à ton paquet Anki "Fluent" (${res.totalCount} cartes) !` : `✓ "${kw.hanzi}" est déjà dans ton Anki !`);
    if (onWordAddedToAnki) onWordAddedToAnki();
    setTimeout(() => setAnkiToast(null), 3000);
  };

  // Lancement de l'enregistrement micro avec protection anti-crash
  const startRecording = () => {
    if (!isSupported) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Essaie sur Google Chrome, Edge ou Safari !");
      return;
    }

    if (isStartingRef.current || isRecordingRef.current) return;
    isStartingRef.current = true;

    try {
      cleanupRecording();
      stopChineseAudio();
      setLiveTranscript('');

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const text = (final || interim).trim();
        if (text) {
          setLiveTranscript(text);
          setInputText(text);
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          stopAndSendSpokenMessage();
        }, 2500);
      };

      recognition.onerror = () => cleanupRecording();
      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            cleanupRecording();
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      isRecordingRef.current = true;
      setIsRecording(true);
    } catch (err) {
      console.warn("Erreur démarrage reconnaissance:", err);
      cleanupRecording();
    } finally {
      isStartingRef.current = false;
    }
  };

  // Terminer l'enregistrement vocal et envoyer
  const stopAndSendSpokenMessage = () => {
    const spoken = liveTranscript.trim() || inputText.trim();
    cleanupRecording();
    setLiveTranscript('');
    if (spoken) {
      sendMessage(spoken);
    }
  };

  const toggleRecording = () => {
    if (isRecordingRef.current || isRecording) {
      stopAndSendSpokenMessage();
    } else {
      startRecording();
    }
  };

  // Envoi d'un message utilisateur et génération de la réponse IA
  const sendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text) return;

    cleanupRecording();
    stopChineseAudio();

    // 1. Message de l'utilisateur
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      hanzi: text,
      pinyin: '',
      french: '',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLiveTranscript('');

    // 2. Réflexion IA et réponse instantanée Putonghua
    setTimeout(() => {
      const botReply = generateBotResponse(activeScenarioId, text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        hanzi: botReply.hanzi,
        pinyin: botReply.pinyin,
        french: botReply.french,
        tip: botReply.tip,
        keyWords: botReply.keyWords,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);

      // Lecture automatique fluide de la réponse
      handlePlayAudio(botMsg.id, botMsg.hanzi);
    }, 450);
  };

  // Dernier message de l'IA pour afficher les réponses rapides suggérées
  const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot');
  const activeQuickReplies = lastBotMessage
    ? (generateBotResponse(activeScenarioId, lastBotMessage.hanzi)?.quickReplies || activeScenario.initialBotMessage.quickReplies)
    : activeScenario.initialBotMessage.quickReplies;

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fadeIn pb-12">
      
      {/* Toast Notification Anki */}
      {ankiToast && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-400 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{ankiToast}</span>
        </div>
      )}

      {/* 1. EN-TÊTE DU PARTENAIRE IA */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-purple-100 text-purple-800 border border-purple-200">
                <Bot className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-800">
                Partenaire de Conversation IA • Pratique Immersive
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif leading-tight">
              Dialogue Spontané & Écoute Native
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Parle ou écris à l'IA en mandarin. Les traductions françaises sont cachées pour stimuler ta réflexion directe.
            </p>
          </div>

          <button
            onClick={() => {
              const initMsg: ChatMessage = {
                id: `bot-init-${activeScenario.id}-${Date.now()}`,
                sender: 'bot',
                hanzi: activeScenario.initialBotMessage.hanzi,
                pinyin: activeScenario.initialBotMessage.pinyin,
                french: activeScenario.initialBotMessage.french,
                tip: activeScenario.initialBotMessage.tip,
                keyWords: activeScenario.initialBotMessage.keyWords,
                createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setMessages([initMsg]);
              setRevealedTranslations({});
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 transition-colors shrink-0 self-start sm:self-auto"
            title="Réinitialiser la conversation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Recommencer</span>
          </button>
        </div>

        {/* 2. SÉLECTION DES SCÉNARIOS CONCRETS */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Choisis ta situation d'immersion :
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CHAT_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioId(sc.id)}
                className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  activeScenarioId === sc.id
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 hover:bg-white text-stone-800 border-stone-200'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="text-base">{sc.icon}</span>
                  <span className="font-bold text-xs truncate">{sc.title}</span>
                </div>
                <span className={`text-[10px] mt-1 truncate ${activeScenarioId === sc.id ? 'text-amber-300' : 'text-stone-400'}`}>
                  {sc.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. CONTRÔLES AUDIO : VOIX & VITESSE (0.5x, 0.85x, 1.0x) */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-stone-500 font-bold text-[11px] uppercase tracking-wider">
              Voix :
            </span>
            <VoiceSelector compact />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-stone-500 font-bold text-[11px] uppercase tracking-wider flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-stone-400" />
              <span>Vitesse :</span>
            </span>

            <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200">
              <button
                onClick={() => setPlaybackSpeed(0.5)}
                className={`px-2 py-1 rounded-lg font-bold transition-all text-xs flex items-center space-x-1 ${
                  playbackSpeed === 0.5 ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Vitesse ultra-lente pour décomposer chaque son"
              >
                <Snail className="w-3 h-3 text-stone-900" />
                <span>0.5x</span>
              </button>
              <button
                onClick={() => setPlaybackSpeed(0.85)}
                className={`px-2 py-1 rounded-lg font-bold transition-all text-xs ${
                  playbackSpeed === 0.85 ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Vitesse d'apprentissage confortable ralentie"
              >
                <span>0.85x (Base)</span>
              </button>
              <button
                onClick={() => setPlaybackSpeed(1.0)}
                className={`px-2 py-1 rounded-lg font-bold transition-all text-xs flex items-center space-x-1 ${
                  playbackSpeed === 1.0 ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Vitesse normale fluide d'un natif"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>1.0x</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4. FLUX DES MESSAGES DU CHAT */}
      <div className="bg-stone-100/60 rounded-3xl p-4 sm:p-6 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] min-h-[380px] max-h-[550px] overflow-y-auto space-y-4">
        
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          const isRevealed = !!revealedTranslations[msg.id];
          const isPlaying = playingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} space-y-1.5 animate-fadeIn`}
            >
              {/* Entête du message */}
              <div className="flex items-center space-x-2 px-1">
                <span className="text-[10px] font-bold text-stone-400">
                  {isBot ? activeScenario.role : 'Toi'} • {msg.createdAt}
                </span>
              </div>

              {/* Bulle de message */}
              <div
                className={`max-w-2xl rounded-3xl p-4 sm:p-5 border-2 space-y-3 shadow-xs ${
                  isBot
                    ? 'bg-white border-stone-900 text-stone-900'
                    : 'bg-stone-900 border-stone-900 text-white self-end'
                }`}
              >
                {/* Pinyin si activé */}
                {isBot && showPinyin && msg.pinyin && (
                  <p className="text-xs font-mono text-stone-500 tracking-wide">
                    {msg.pinyin}
                  </p>
                )}

                {/* Caractères Chinois Calligraphiques */}
                <p className={`font-serif text-lg sm:text-xl font-black chinese-text leading-relaxed ${
                  isBot ? 'text-stone-950' : 'text-amber-300'
                }`}>
                  {msg.hanzi}
                </p>

                {/* Traduction Française (Masquée par défaut avec bouton révéler) */}
                {isBot && msg.french && (
                  <div className="pt-1 border-t border-stone-100">
                    {isRevealed ? (
                      <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 animate-fadeIn">
                        <p className="text-xs text-stone-700 italic">
                          « {msg.french} »
                        </p>
                        <button
                          onClick={() => toggleMessageTranslation(msg.id)}
                          className="text-[10px] font-bold text-stone-400 hover:text-stone-700 shrink-0"
                        >
                          Masquer
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleMessageTranslation(msg.id)}
                        className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-stone-500 hover:text-[#c23b22] transition-colors"
                        title="Révéler la traduction en français si besoin"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-400" />
                        <span>👁️ Révéler la traduction française</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Conseil du locuteur natif */}
                {isBot && msg.tip && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{msg.tip}</span>
                  </div>
                )}

                {/* Mots-clés avec 1-clic Anki */}
                {isBot && msg.keyWords && msg.keyWords.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Vocabulaire utile à retenir :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.keyWords.map((kw: ChatKeyWord, kwIdx: number) => {
                        const inAnki = isWordInLocalAnki(kw.hanzi);
                        return (
                          <div
                            key={kwIdx}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                          >
                            <span className="font-bold font-serif chinese-text">{kw.hanzi}</span>
                            <span className="text-[10px] text-stone-500 font-mono">({kw.pinyin})</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-[10px] text-stone-600">{kw.translation}</span>
                            <button
                              onClick={() => handleSaveWordToAnki(kw)}
                              className={`ml-1 p-0.5 rounded transition-colors ${
                                inAnki ? 'text-emerald-600' : 'text-stone-400 hover:text-emerald-700'
                              }`}
                              title={inAnki ? 'Dans ton Anki' : 'Ajouter à Anki'}
                            >
                              <BookmarkCheck className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Barre d'outils audio du bot */}
                {isBot && (
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handlePlayAudio(msg.id, msg.hanzi)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-amber-400 text-stone-950 shadow-2xs font-black'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-stone-700" />
                      <span>{isPlaying ? 'En cours...' : `Écouter (${playbackSpeed}x)`}</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Message en direct pendant dictée vocale */}
        {isRecording && liveTranscript && (
          <div className="flex flex-col items-end space-y-1 animate-pulse">
            <span className="text-[10px] text-stone-400 font-bold">Transcription en cours...</span>
            <div className="p-3.5 rounded-2xl bg-amber-100 border-2 border-amber-400 text-stone-900 font-serif text-base">
              {liveTranscript}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. RÉPONSES RAPIDES SUGGÉRÉES (POUR NE JAMAIS RESTER BLOQUÉ) */}
      {activeQuickReplies && activeQuickReplies.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-stone-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Idées de réponses pour continuer le dialogue :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeQuickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const chineseOnly = reply.replace(/\(.*?\)/g, '').trim();
                  sendMessage(chineseOnly);
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-950 text-xs font-medium border border-stone-200 hover:border-amber-400 shadow-2xs transition-all text-left"
              >
                <span>{reply}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. ZONE DE SAISIE & MICROPHONE INTERACTIF */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] space-y-3">
        <div className="flex items-center space-x-2">
          
          {/* Bouton Microphone */}
          <div className="relative shrink-0">
            {isRecording && (
              <>
                <span className="absolute inset-0 rounded-2xl bg-[#c23b22] animate-ping opacity-30" />
                <span className="absolute -inset-1 rounded-2xl border-2 border-[#c23b22] animate-pulse opacity-50" />
              </>
            )}

            <button
              onClick={toggleRecording}
              className={`relative z-10 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all border-2 border-stone-900 shadow-xs active:scale-95 ${
                isRecording
                  ? 'bg-[#c23b22] text-white scale-105'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
              title={isRecording ? 'Terminer et envoyer' : 'Parler au micro en mandarin'}
            >
              {isRecording ? <Square className="w-5 h-5 fill-white" /> : <Mic className="w-5 h-5 text-[#c23b22]" />}
            </button>
          </div>

          {/* Champ texte */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            placeholder="Parle au micro ou écris ta réponse en chinois..."
            className="flex-1 px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm font-serif text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 shadow-inner"
          />

          {/* Bouton Envoyer */}
          <button
            onClick={() => sendMessage()}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white flex items-center justify-center border-2 border-stone-900 transition-all shrink-0 active:scale-95 disabled:cursor-not-allowed shadow-xs"
            title="Envoyer la réponse"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Info d'aide sous la saisie */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
          <span>
            💡 Clique sur le micro pour parler en mandarin • L'IA comprend et répond en temps réel
          </span>
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className="text-stone-500 hover:text-stone-800 font-bold underline"
          >
            {showPinyin ? 'Masquer Pinyin' : 'Afficher Pinyin'}
          </button>
        </div>
      </div>

    </div>
  );
};
