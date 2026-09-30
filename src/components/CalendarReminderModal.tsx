import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Bell, 
  X, 
  Check, 
  Clock, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Send,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CalendarReminderModalProps {
  onClose: () => void;
}

export const CalendarReminderModal: React.FC<CalendarReminderModalProps> = ({ onClose }) => {
  const [reminderTime, setReminderTime] = useState<string>(() => {
    return localStorage.getItem('fluent_reminder_time') || '09:00';
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('fluent_webhook_url') || '';
  });

  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('fluent_reminder_time', reminderTime);
  }, [reminderTime]);

  useEffect(() => {
    localStorage.setItem('fluent_webhook_url', webhookUrl);
  }, [webhookUrl]);

  // Demande d'autorisation pour les notifications navigateur
  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      alert("Votre navigateur ne supporte pas les notifications système.");
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        new Notification("🇨🇳 Fluent — Rappel Activé !", {
          body: `Super ! Tu recevras ton rappel quotidien d'étude à ${reminderTime}.`,
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Tester la notification immédiatement
  const handleTestNotification = () => {
    if (notificationPermission !== 'granted') {
      handleRequestNotification();
      return;
    }

    new Notification("🎯 Fluent : Ta mission chinoise du jour t'attend !", {
      body: "3 minutes d'ancrage cognitif et pratique vocale pour consolider tes réflexes HSK 3-4.",
      icon: '/favicon.ico',
    });
    setTestStatus("Notification de test envoyée sur ton écran !");
    setTimeout(() => setTestStatus(null), 3000);
  };

  // 1. Ouvrir Google Calendar avec événement récurrent pré-rempli
  const handleOpenGoogleCalendar = () => {
    const [hours, minutes] = reminderTime.split(':');
    const startHour = hours.padStart(2, '0');
    const endHour = String(Math.min(23, parseInt(hours, 10) + 1)).padStart(2, '0');

    // Date de demain au format YYYYMMDD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0].replace(/-/g, '');

    const startDateTime = `${dateStr}T${startHour}${minutes}00`;
    const endDateTime = `${dateStr}T${endHour}${minutes}00`;

    const title = encodeURIComponent("Fluent — Session Quotidienne Chinois (HSK 3-4)");
    const details = encodeURIComponent(
      "15 minutes d'ancrage cognitif et de pratique vocale avec tolérance aux pauses.\n\nLien de l'application locale : http://localhost:5173"
    );
    const location = encodeURIComponent("Fluent App (http://localhost:5173)");
    const rrule = encodeURIComponent("RRULE:FREQ=DAILY");

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}&recur=${rrule}`;
    window.open(gcalUrl, '_blank');
  };

  // 2. Télécharger le fichier universel .ics (Apple Calendar, Outlook, etc.)
  const handleDownloadICS = () => {
    const [hours, minutes] = reminderTime.split(':');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Fluent//Mandarin Learning Coach//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:fluent-mandarin-${Date.now()}@fluent.local`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;TZID=Europe/Paris:20261001T${hours}${minutes}00`,
      `DTEND;TZID=Europe/Paris:20261001T${hours}${minutes}00`,
      'RRULE:FREQ=DAILY',
      'SUMMARY:🇨🇳 Fluent — 15 min de Chinois HSK 3-4',
      'DESCRIPTION:Session quotidienne de révision espacée et pratique vocale sur http://localhost:5173',
      'LOCATION:http://localhost:5173',
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT5M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Rappel Fluent : C est l heure de ta session de mandarin !',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'fluent-chinois-rappel-quotidien.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // 3. Tester Webhook (Discord / Slack / n8n)
  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      alert("Veuillez entrer une URL de Webhook valide (Discord, Slack, n8n ou webhook MCP).");
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🇨🇳 **Fluent — Rappel Quotidien HSK 3-4**\nTa mission du jour t'attend ! 15 minutes d'ancrage et de pratique vocale sur http://localhost:5173`,
          username: "Fluent Mandarin Coach",
        }),
      });
      setTestStatus("✅ Message de rappel envoyé sur ton webhook !");
      setTimeout(() => setTestStatus(null), 3500);
    } catch (e: any) {
      alert("Erreur lors de l'envoi vers le webhook : " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fcfaf7] border-2 border-stone-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[6px_6px_0px_#1c1917] relative space-y-6">
        
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête Pop BD / Manhua */}
        <div className="flex items-center space-x-3 border-b-2 border-stone-200 pb-4">
          <div className="p-3 rounded-2xl bg-[#c23b22] text-white shadow-[2px_2px_0px_#1c1917] border border-stone-900">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              Régularité & Ancrage
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight">
              Calendrier & Rappels d'Étude
            </h2>
          </div>
        </div>

        {/* Sélection de l'heure idéale */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-2xs">
          <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
            ⏰ Ton créneau d'étude quotidien préféré :
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="p-2.5 rounded-xl border-2 border-stone-800 font-mono text-base font-bold bg-[#fbf9f5] focus:outline-none focus:ring-2 focus:ring-[#c23b22]"
            />
            <span className="text-xs text-stone-500 font-medium">
              (15 minutes par jour suffisent pour ancrer les nuances durablement)
            </span>
          </div>
        </div>

        {/* OPTION 1 : Synchronisation Calendrier (Google, Apple, Outlook) */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>1. Synchroniser avec ton Calendrier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Google Calendar 1-Clic */}
            <button
              onClick={handleOpenGoogleCalendar}
              className="p-4 rounded-2xl border-2 border-stone-900 bg-white hover:bg-stone-50 transition-all flex flex-col items-start justify-between shadow-[3px_3px_0px_#1c1917] hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 text-left group"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-bold text-xs text-stone-900 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1.5 text-blue-600" /> Google Calendar
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900" />
              </div>
              <p className="text-[11px] text-stone-500">
                Ouvre Google Calendar avec l'événement récurrent quotidien pré-rempli à {reminderTime}.
              </p>
            </button>

            {/* Fichier .ICS Universel (Apple Calendar / iPhone / Outlook) */}
            <button
              onClick={handleDownloadICS}
              className="p-4 rounded-2xl border-2 border-stone-900 bg-white hover:bg-stone-50 transition-all flex flex-col items-start justify-between shadow-[3px_3px_0px_#1c1917] hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 text-left group"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-bold text-xs text-stone-900 flex items-center">
                  <Download className="w-4 h-4 mr-1.5 text-[#c23b22]" /> Fichier .ICS (Apple/Outlook)
                </span>
                <Smartphone className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900" />
              </div>
              <p className="text-[11px] text-stone-500">
                Télécharge le calendrier universel pour l'importer en 1 double-clic sur Mac, iPhone ou Windows.
              </p>
            </button>

          </div>

          {savedSuccess && (
            <p className="text-xs text-emerald-800 font-bold flex items-center animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
              Fichier .ics téléchargé avec succès ! Ouvre-le pour l'ajouter à ton calendrier.
            </p>
          )}
        </div>

        {/* OPTION 2 : Notifications Navigateur */}
        <div className="space-y-3 pt-2 border-t border-stone-200">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Bell className="w-4 h-4 text-rose-600" />
            <span>2. Notification Directe sur ton Ordinateur</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <p className="text-xs font-bold text-stone-900">
                Rappel système sur ton bureau
              </p>
              <p className="text-[11px] text-stone-500">
                Statut actuel : {notificationPermission === 'granted' ? '✅ Activé' : 'Non activé'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {notificationPermission !== 'granted' ? (
                <button
                  onClick={handleRequestNotification}
                  className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Activer les alertes
                </button>
              ) : (
                <button
                  onClick={handleTestNotification}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors"
                >
                  Tester maintenant 🔔
                </button>
              )}
            </div>
          </div>
        </div>

        {/* OPTION 3 : Webhook Avancé (Discord / Slack / n8n / MCP) */}
        <div className="space-y-2 pt-2 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center">
              <Send className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              <span>3. Webhook Quotidien (Slack, Discord, n8n, MCP)</span>
            </label>
            <span className="text-[10px] text-stone-400 font-mono">Optionnel</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="url"
              placeholder="https://discord.com/api/webhooks/... ou Slack webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-stone-300 font-mono text-xs bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            <button
              onClick={handleTestWebhook}
              disabled={!webhookUrl}
              className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs shrink-0"
            >
              Tester
            </button>
          </div>
        </div>

        {testStatus && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-semibold flex items-center animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
            <span>{testStatus}</span>
          </div>
        )}

        {/* Pied de modal */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all shadow-md"
          >
            Fermer et retourner au programme
          </button>
        </div>

      </div>
    </div>
  );
};
