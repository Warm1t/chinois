import React, { useEffect, useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  RotateCw, 
  User, 
  Info,
  ChevronDown,
  Check
} from 'lucide-react';
import { 
  VoiceGenderPreference, 
  VoiceBankSummary, 
  getVoiceGenderPreference, 
  setVoiceGenderPreference, 
  getChineseVoicesBank,
  playChineseAudio 
} from '../utils/speechUtils';

interface VoiceSelectorProps {
  compact?: boolean;
  className?: string;
  onVoiceChanged?: (pref: VoiceGenderPreference) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  compact = false,
  className = '',
  onVoiceChanged
}) => {
  const [preference, setPreference] = useState<VoiceGenderPreference>(getVoiceGenderPreference());
  const [bankInfo, setBankInfo] = useState<VoiceBankSummary | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const refreshVoices = async () => {
    const summary = await getChineseVoicesBank();
    setBankInfo(summary);
    setPreference(summary.preference);
  };

  useEffect(() => {
    refreshVoices();

    const handleVoiceChanged = (e: any) => {
      const newPref = e.detail as VoiceGenderPreference;
      setPreference(newPref);
      if (onVoiceChanged) onVoiceChanged(newPref);
    };

    window.addEventListener('fluent_voice_gender_changed', handleVoiceChanged);
    return () => {
      window.removeEventListener('fluent_voice_gender_changed', handleVoiceChanged);
    };
  }, []);

  const handleSelectPreference = (pref: VoiceGenderPreference) => {
    setPreference(pref);
    setVoiceGenderPreference(pref);
    if (onVoiceChanged) onVoiceChanged(pref);
  };

  const handleTestVoice = async (gender?: 'female' | 'male') => {
    if (isTesting) return;
    setIsTesting(true);
    const testSample = gender === 'male' 
      ? '你好！我是中文男声。多听不同声音，中文更地道。' 
      : '你好！我是中文女声。标准普通话，助你练好听力。';
    await playChineseAudio(testSample, 1.0, gender);
    setIsTesting(false);
  };

  // Libellé de l'option active
  const getActiveLabel = () => {
    if (preference === 'alternate') return '🔄 Voix Alternée (👨/👩)';
    if (preference === 'female') return '👩 Voix Féminine';
    return '👨 Voix Masculine';
  };

  if (compact) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200 text-[11px] font-bold">
          <button
            onClick={() => handleSelectPreference('alternate')}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-all ${
              preference === 'alternate'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Alterne automatiquement voix masculine et féminine pour habituer l'oreille"
          >
            <RotateCw className="w-3 h-3 text-amber-400" />
            <span>Alterné</span>
          </button>

          <button
            onClick={() => handleSelectPreference('female')}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-all ${
              preference === 'female'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Voix féminine claire et brillante"
          >
            <span>👩</span>
            <span className="hidden sm:inline">Femme</span>
          </button>

          <button
            onClick={() => handleSelectPreference('male')}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-all ${
              preference === 'male'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Voix masculine profonde et résonante"
          >
            <span>👨</span>
            <span className="hidden sm:inline">Homme</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Bouton déclencheur badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-2xs"
        title="Configurer la banque de voix chinoises (Homme / Femme / Alternance)"
      >
        <Volume2 className="w-3.5 h-3.5 text-[#c23b22]" />
        <span>{getActiveLabel()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menu déroulant de configuration vocale */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-300 rounded-2xl shadow-xl p-4 z-50 space-y-3 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-stone-900 text-xs font-serif">
                  Banque Vocale Chinoise
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono border border-emerald-200">
                {bankInfo?.isNeuralAvailable ? 'Voix Neurales HD' : 'Synthèse Studio'}
              </span>
            </div>

            <p className="text-[11px] text-stone-500 leading-snug">
              Habitue ton cerveau aux variations de tessiture et de hauteurs de son entre locuteurs masculins et féminins :
            </p>

            {/* Options de sélection */}
            <div className="space-y-1.5 text-xs font-medium">
              
              {/* Option 1 : Alternance automatique (Recommandé) */}
              <div
                onClick={() => handleSelectPreference('alternate')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
                  preference === 'alternate'
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <RotateCw className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Alternance Homme / Femme</span>
                    {preference === 'alternate' && <Check className="w-3.5 h-3.5 text-amber-700" />}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Recommandé : alterne à chaque phrase pour entraîner l'oreille aux 2 registres vocaux.
                  </p>
                </div>
              </div>

              {/* Option 2 : Voix Féminine */}
              <div
                onClick={() => handleSelectPreference('female')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
                  preference === 'female'
                    ? 'bg-rose-50/80 border-rose-300 text-rose-950 shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-base shrink-0 mt-0.5">👩</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Voix Féminine</span>
                    {preference === 'female' && <Check className="w-3.5 h-3.5 text-rose-700" />}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {bankInfo?.bestFemaleName || 'Standard clair & articulé'}
                  </p>
                </div>
              </div>

              {/* Option 3 : Voix Masculine */}
              <div
                onClick={() => handleSelectPreference('male')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
                  preference === 'male'
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-base shrink-0 mt-0.5">👨</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Voix Masculine</span>
                    {preference === 'male' && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {bankInfo?.bestMaleName || 'Timbre profond & résonant'}
                  </p>
                </div>
              </div>

            </div>

            {/* Test rapide des voix */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-400 font-medium">Tester :</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTestVoice('female')}
                  disabled={isTesting}
                  className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors disabled:opacity-50"
                >
                  Tester Femme 👩
                </button>
                <button
                  onClick={() => handleTestVoice('male')}
                  disabled={isTesting}
                  className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors disabled:opacity-50"
                >
                  Tester Homme 👨
                </button>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
