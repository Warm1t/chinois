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
import { VoiceSelector } from './VoiceSelector';
import { saveWordToLocalAnki, isWordInLocalAnki } from '../utils/ankiConnect';
import { 
  Mic, 
  Square, 
  Volume2, 
  Send, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  BookmarkCheck, 
  Layers, 
  Play, 
  Pause,
  X,
  ChevronDown
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

  // Drawer / Tiroir de sélection d'interlocuteur
  const [isScenarioDrawerOpen, setIsScenarioDrawerOpen] = useState<boolean>(false);

  // Historique des messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Indicateur "En train d'écrire..."
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Saisie textuelle & reconnaissance vocale
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Audio & vitesse Putonghua
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // Visibilité Pinyin & Traductions
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

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, liveTranscript]);

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
    setIsTyping(false);
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
        }, 3000);
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
    setIsTyping(true);

    // 2. Délai réaliste de frappe de l'interlocuteur (550ms)
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
      setIsTyping(false);

      // Lecture automatique fluide de la réponse Putonghua
      handlePlayAudio(botMsg.id, botMsg.hanzi);
    }, 550);
  };

  const handleResetConversation = () => {
    cleanupRecording();
    stopChineseAudio();
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
    setLiveTranscript('');
    setIsTyping(false);
  };

  // Dernier message du bot pour proposer les réponses rapides
  const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot');
  const activeQuickReplies = lastBotMessage
    ? (generateBotResponse(activeScenarioId, lastBotMessage.hanzi)?.quickReplies || activeScenario.initialBotMessage.quickReplies)
    : activeScenario.initialBotMessage.quickReplies;

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn pb-12">
      
      {/* Toast Notification Anki */}
      {ankiToast && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-400 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{ankiToast}</span>
        </div>
      )}

      {/* CADRE PRINCIPAL TYPE APPLICATION DE MESSAGERIE (WeChat / WhatsApp / Telegram) */}
      <div className="bg-white rounded-3xl border-2 border-stone-900 shadow-[6px_6px_0px_#1c1917] overflow-hidden flex flex-col h-[780px]">
        
        {/* 1. APP BAR / HEADER DE CONTACT */}
        <div className="bg-stone-900 text-white px-4 sm:px-6 py-3.5 border-b-2 border-stone-900 flex items-center justify-between gap-3 shrink-0">
          
          {/* Contact Profile (Avatar + Name + Online Status) */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-stone-800 to-stone-700 border-2 border-stone-600 flex items-center justify-center text-xl shadow-inner">
                {activeScenario.icon}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-stone-900 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-black text-sm sm:text-base text-white truncate">
                  {activeScenario.title}
                </h3>
                <span className="text-[10px] font-mono bg-stone-800 text-amber-300 px-2 py-0.5 rounded-full border border-stone-700 hidden sm:inline-block">
                  {activeScenario.role.split('(')[0].trim()}
                </span>
              </div>

              <p className="text-[11px] text-stone-400 truncate flex items-center space-x-1.5">
                {isTyping ? (
                  <span className="text-amber-300 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping inline-block" />
                    <span>est en train d'écrire...</span>
                  </span>
                ) : isRecording ? (
                  <span className="text-rose-400 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
                    <span>t'écoute parler en mandarin...</span>
                  </span>
                ) : (
                  <span>🟢 En ligne • Dialogue en temps réel</span>
                )}
              </p>
            </div>
          </div>

          {/* Header Actions (Drawer Switcher, Voice Speed, Pinyin Toggle, Reset) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Bouton pour changer d'interlocuteur / scénario */}
            <button
              onClick={() => setIsScenarioDrawerOpen(!isScenarioDrawerOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                isScenarioDrawerOpen 
                  ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-2xs font-black' 
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
              }`}
              title="Changer d'interlocuteur ou de situation de dialogue"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Changer d'interlocuteur</span>
              <span className="sm:hidden">Contacts</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isScenarioDrawerOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Toggle Pinyin */}
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showPinyin
                  ? 'bg-stone-800 text-amber-300 border-stone-700 font-black'
                  : 'bg-stone-800 text-stone-400 border-stone-700 opacity-70'
              }`}
              title={showPinyin ? "Masquer le Pinyin" : "Afficher le Pinyin"}
            >
              <span>拼</span>
            </button>

            {/* Vitesse Audio */}
            <div className="hidden md:flex items-center bg-stone-800 rounded-xl p-0.5 border border-stone-700 text-[11px] font-bold">
              <button
                onClick={() => setPlaybackSpeed(0.5)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  playbackSpeed === 0.5 ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
                }`}
                title="Vitesse ultra-lente 0.5x"
              >
                0.5x
              </button>
              <button
                onClick={() => setPlaybackSpeed(0.85)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  playbackSpeed === 0.85 ? 'bg-white text-stone-900 font-black' : 'text-stone-400 hover:text-white'
                }`}
                title="Vitesse ralentie confortable 0.85x"
              >
                0.85x
              </button>
              <button
                onClick={() => setPlaybackSpeed(1.0)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  playbackSpeed === 1.0 ? 'bg-white text-stone-900 font-black' : 'text-stone-400 hover:text-white'
                }`}
                title="Vitesse normale 1.0x"
              >
                1.0x
              </button>
            </div>

            {/* Recommencer */}
            <button
              onClick={handleResetConversation}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold border border-stone-700 transition-colors"
              title="Réinitialiser la conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* MENU DÉROULANT DES CONTACTS / SCÉNARIOS */}
        {isScenarioDrawerOpen && (
          <div className="bg-stone-900/95 backdrop-blur-md border-b-2 border-stone-950 p-3 sm:p-4 text-white animate-slideDown shrink-0 z-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                Choisis ton interlocuteur :
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-stone-400">Voix :</span>
                <VoiceSelector compact />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {CHAT_SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setActiveScenarioId(sc.id);
                    setIsScenarioDrawerOpen(false);
                  }}
                  className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    activeScenarioId === sc.id
                      ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-md font-bold'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{sc.icon}</span>
                    <span className="text-xs truncate font-bold">{sc.title}</span>
                  </div>
                  <span className={`text-[10px] mt-1 truncate ${activeScenarioId === sc.id ? 'text-stone-900 font-black' : 'text-stone-400'}`}>
                    {sc.role.split('(')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. FEED DE DISCUSSION (MESSAGES) */}
        <div className="flex-1 bg-[#f4f6f8] p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Date Pill Divider */}
          <div className="flex items-center justify-center my-1">
            <span className="text-[10px] font-mono font-bold text-stone-400 bg-white/90 border border-stone-200 px-3 py-1 rounded-full shadow-2xs">
              Aujourd'hui • Dialogue en mandarin naturel
            </span>
          </div>

          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            const isRevealed = !!revealedTranslations[msg.id];
            const isPlaying = playingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 animate-fadeIn ${
                  isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Avatar à gauche pour l'interlocuteur Bot */}
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center text-sm shrink-0 border border-stone-700 shadow-xs mb-1">
                    {activeScenario.icon}
                  </div>
                )}

                {/* Bulle de Message Asymétrique */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 space-y-3 transition-all ${
                    isBot
                      ? 'bg-white rounded-bl-xs border border-stone-200 text-stone-900 shadow-xs'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-xs shadow-sm self-end'
                  }`}
                >
                  {/* Header de bulle : Role & Pinyin */}
                  {isBot && showPinyin && msg.pinyin && (
                    <p className="text-xs font-mono text-stone-500 tracking-wide">
                      {msg.pinyin}
                    </p>
                  )}

                  {/* Texte Chinois Principal */}
                  <p className={`font-serif text-lg sm:text-xl font-bold chinese-text leading-relaxed ${
                    isBot ? 'text-stone-950' : 'text-white'
                  }`}>
                    {msg.hanzi}
                  </p>

                  {/* Lecteur Audio Vocal style WhatsApp/WeChat pour le bot */}
                  {isBot && (
                    <div className="pt-1">
                      <button
                        onClick={() => handlePlayAudio(msg.id, msg.hanzi)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                          isPlaying
                            ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-xs font-black'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="p-1.5 rounded-xl bg-stone-900 text-amber-300">
                            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-amber-300" /> : <Play className="w-3.5 h-3.5 fill-amber-300" />}
                          </span>
                          <span>{isPlaying ? 'Écoute en cours...' : 'Message vocal'}</span>
                        </div>

                        {/* Vagues sonores décoratives animées */}
                        <div className="flex items-center space-x-1 px-2">
                          <span className={`w-1 rounded-full ${isPlaying ? 'h-4 bg-stone-900 animate-pulse' : 'h-2 bg-stone-300'}`} />
                          <span className={`w-1 rounded-full ${isPlaying ? 'h-6 bg-stone-900 animate-bounce' : 'h-3 bg-stone-300'}`} />
                          <span className={`w-1 rounded-full ${isPlaying ? 'h-3 bg-stone-900 animate-pulse' : 'h-2 bg-stone-300'}`} />
                          <span className={`w-1 rounded-full ${isPlaying ? 'h-5 bg-stone-900 animate-bounce' : 'h-4 bg-stone-300'}`} />
                          <span className={`w-1 rounded-full ${isPlaying ? 'h-2 bg-stone-900 animate-pulse' : 'h-1.5 bg-stone-300'}`} />
                        </div>

                        <span className="text-[10px] font-mono text-stone-500">
                          {playbackSpeed}x
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Traduction Française Révélable */}
                  {isBot && msg.french && (
                    <div className="pt-1 border-t border-stone-100">
                      {isRevealed ? (
                        <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 animate-fadeIn">
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

                  {/* Conseil de communication natif */}
                  {isBot && msg.tip && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{msg.tip}</span>
                    </div>
                  )}

                  {/* Vocabulaire à retenir + Anki */}
                  {isBot && msg.keyWords && msg.keyWords.length > 0 && (
                    <div className="pt-1.5 border-t border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Vocabulaire clé :
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

                  {/* Heure du message + Indicateur de lecture */}
                  <div className={`text-[10px] flex items-center justify-end space-x-1 pt-0.5 ${
                    isBot ? 'text-stone-400' : 'text-emerald-200'
                  }`}>
                    <span>{msg.createdAt}</span>
                    {!isBot && <span>✓✓</span>}
                  </div>

                </div>
              </div>
            );
          })}

          {/* Bulle d'indication "En train d'écrire..." */}
          {isTyping && (
            <div className="flex items-end gap-2.5 animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center text-sm shrink-0 border border-stone-700 shadow-xs mb-1">
                {activeScenario.icon}
              </div>
              <div className="bg-white rounded-3xl rounded-bl-xs border border-stone-200 p-3.5 shadow-xs flex items-center space-x-2 text-stone-500 text-xs font-medium">
                <span className="flex space-x-1">
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="text-[11px] text-stone-400">
                  {activeScenario.role.split('(')[0]} prépare sa réponse...
                </span>
              </div>
            </div>
          )}

          {/* Transcription vocale en direct de l'utilisateur */}
          {isRecording && liveTranscript && (
            <div className="flex justify-end animate-pulse">
              <div className="bg-emerald-100/90 border-2 border-emerald-400 text-emerald-950 rounded-2xl rounded-br-xs p-3 text-sm font-serif max-w-[80%] shadow-xs">
                <span className="text-[10px] text-emerald-700 font-bold block uppercase">🎙️ En direct :</span>
                <span>{liveTranscript}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. SUGGESTIONS RAPIDES (AU-DESSUS DE LA BARRE DE SAISIE) */}
        {activeQuickReplies && activeQuickReplies.length > 0 && (
          <div className="bg-white border-t border-stone-200/80 px-4 py-2 shrink-0 overflow-x-auto scrollbar-none flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 whitespace-nowrap flex items-center space-x-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Suggestions :</span>
            </span>
            <div className="flex items-center space-x-1.5 shrink-0">
              {activeQuickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const chineseOnly = reply.replace(/\(.*?\)/g, '').trim();
                    sendMessage(chineseOnly);
                  }}
                  className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 hover:text-emerald-900 text-xs border border-stone-200 transition-all whitespace-nowrap shadow-2xs font-medium"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. BARRE D'ENVOI & MICROPHONE (DOCK DE CHAT) */}
        <div className="bg-white border-t-2 border-stone-900 p-3 sm:p-4 shrink-0">
          
          {/* Si l'utilisateur est en train d'enregistrer */}
          {isRecording ? (
            <div className="flex items-center justify-between gap-3 p-2 bg-rose-50 border-2 border-[#c23b22] rounded-2xl animate-pulse">
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-[#c23b22] animate-ping" />
                <span className="text-xs font-bold text-[#c23b22]">
                  Écoute en cours... Parle en mandarin distinctement
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={cleanupRecording}
                  className="px-3 py-1.5 rounded-xl bg-white text-stone-600 hover:text-stone-900 border border-stone-300 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  onClick={stopAndSendSpokenMessage}
                  className="px-3.5 py-1.5 rounded-xl bg-[#c23b22] text-white text-xs font-black shadow-xs"
                >
                  Envoyer
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              
              {/* Bouton Micro */}
              <button
                onClick={startRecording}
                className="w-11 h-11 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center border-2 border-stone-900 transition-all shrink-0 active:scale-95 shadow-2xs"
                title="Appuyer pour parler en chinois au micro"
              >
                <Mic className="w-5 h-5 text-[#c23b22]" />
              </button>

              {/* Champ de saisie texte */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                placeholder="Écris un message en chinois... (Entrée pour envoyer)"
                className="flex-1 px-4 py-2.5 bg-stone-100 rounded-2xl border border-stone-200 text-sm font-serif text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />

              {/* Bouton Envoyer */}
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim()}
                className="w-11 h-11 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white flex items-center justify-center border-2 border-stone-900 transition-all shrink-0 active:scale-95 shadow-2xs"
                title="Envoyer le message"
              >
                <Send className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
