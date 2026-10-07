import { getTodayDailyHanzi } from '../data/dailyHanziData';
import { getTodayDailyStory, formatStoryCalendarDescription } from '../data/storiesData';

export interface ComboCalendarOptions {
  morningTime?: string; // default '08:30'
  eveningTime?: string; // default '19:30'
  daysCount?: number;   // default 60
  mode?: 'all_day' | 'timed'; // default 'timed'
}

/**
 * Générer le fichier de calendrier Apple universel (.ics) COMBO.
 * Contient à la fois le Caractère du Jour le matin et l'Histoire du Jour le soir
 * pour les 60 prochains jours !
 * Titres épurés : Caractères + Pinyin uniquement pour un affichage parfait sur les widgets iOS.
 */
export const generateAppleCalendarIcsCombined = (options: ComboCalendarOptions = {}): string => {
  const daysCount = options.daysCount ?? 60;
  const mode = options.mode ?? 'timed';
  const morningTime = options.morningTime ?? '08:30';
  const eveningTime = options.eveningTime ?? '19:30';

  const [mHours, mMinutes] = morningTime.split(':');
  const [eHours, eMinutes] = eveningTime.split(':');

  const now = new Date();
  const nowStr = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const batchUid = Math.random().toString(36).substring(2, 7);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fluent//Daily Hanzi & Stories Dual Widget Series//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Fluent',
    'X-WR-TIMEZONE:Europe/Paris'
  ];

  for (let i = 0; i < daysCount; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i + 1);

    const yearStr = String(targetDate.getFullYear());
    const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(targetDate.getDate()).padStart(2, '0');
    const dateYmd = `${yearStr}${monthStr}${dayStr}`;

    const nextYearStr = String(nextDate.getFullYear());
    const nextMonthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
    const nextDayStr = String(nextDate.getDate()).padStart(2, '0');
    const nextDateYmd = `${nextYearStr}${nextMonthStr}${nextDayStr}`;

    // ==========================================
    // 1. ÉVÉNEMENT DU MATIN : CARACTÈRE DU JOUR
    // ==========================================
    const hanziForDay = getTodayDailyHanzi(targetDate);
    const compoundSummary = hanziForDay.compoundWords.map(w => `${w.hanzi} (${w.translation})`).join(', ');

    const hanziDescription = [
      `🏮 Caractère du Jour : ${hanziForDay.character} (${hanziForDay.pinyin})`,
      `📖 Signification : ${hanziForDay.meaning}`,
      `🪓 Clé : ${hanziForDay.radical} (${hanziForDay.radicalMeaning}) • ${hanziForDay.strokeCount} traits • Niveau ${hanziForDay.level}`,
      `💡 Mnémonique : ${hanziForDay.mnemonic}`,
      `🧩 Mots composés : ${compoundSummary}`,
      `🎯 Exemple : ${hanziForDay.exampleSentence.chinese} (${hanziForDay.exampleSentence.translation})`,
      ``,
      `🔗 Ouvre Fluent sur ton iPhone : https://warm1t.github.io/chinois/`
    ].join('\\n');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:fluent-combo-hanzi-${dateYmd}-${batchUid}@fluent.apple`);
    lines.push(`DTSTAMP:${nowStr}`);
    lines.push('CATEGORIES:Fluent');

    if (mode === 'all_day') {
      lines.push(`DTSTART;VALUE=DATE:${dateYmd}`);
      lines.push(`DTEND;VALUE=DATE:${nextDateYmd}`);
      lines.push('TRANSP:TRANSPARENT');
      lines.push(`SUMMARY:${hanziForDay.character} (${hanziForDay.pinyin})`);
      lines.push(`DESCRIPTION:${hanziDescription}`);
      lines.push('LOCATION:Fluent (https://warm1t.github.io/chinois/)');
      lines.push('STATUS:CONFIRMED');

      lines.push('BEGIN:VALARM');
      lines.push(`TRIGGER:PT${mHours}H${mMinutes}M`);
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:🏮 ${hanziForDay.character} (${hanziForDay.pinyin}) — ${hanziForDay.meaning}`);
      lines.push('END:VALARM');
    } else {
      // Le mot du matin reste actif sur le widget jusqu'au soir (ne disparaît pas au bout d'une heure !)
      lines.push(`DTSTART:${dateYmd}T${mHours}${mMinutes}00`);
      lines.push(`DTEND:${dateYmd}T${eHours}${eMinutes}00`);
      lines.push(`SUMMARY:${hanziForDay.character} (${hanziForDay.pinyin})`);
      lines.push(`DESCRIPTION:${hanziDescription}`);
      lines.push('LOCATION:Fluent (https://warm1t.github.io/chinois/)');
      lines.push('STATUS:CONFIRMED');

      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-PT0M');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:🏮 ${hanziForDay.character} (${hanziForDay.pinyin}) — ${hanziForDay.meaning}`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');

    // ==========================================
    // 2. ÉVÉNEMENT DU SOIR : HISTOIRE DU JOUR
    // ==========================================
    const storyForDay = getTodayDailyStory(targetDate);
    const storyDescription = formatStoryCalendarDescription(storyForDay);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:fluent-combo-story-${dateYmd}-${batchUid}@fluent.apple`);
    lines.push(`DTSTAMP:${nowStr}`);
    lines.push('CATEGORIES:Fluent');

    if (mode === 'all_day') {
      lines.push(`DTSTART;VALUE=DATE:${dateYmd}`);
      lines.push(`DTEND;VALUE=DATE:${nextDateYmd}`);
      lines.push('TRANSP:TRANSPARENT');
      lines.push(`SUMMARY:${storyForDay.title} (${storyForDay.titlePinyin})`);
      lines.push(`DESCRIPTION:${storyDescription}`);
      lines.push('LOCATION:Fluent (https://warm1t.github.io/chinois/)');
      lines.push('STATUS:CONFIRMED');

      lines.push('BEGIN:VALARM');
      lines.push(`TRIGGER:PT${eHours}H${eMinutes}M`);
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:📚 ${storyForDay.title} (${storyForDay.titlePinyin})`);
      lines.push('END:VALARM');
    } else {
      // L'histoire du soir prend le relais sur le widget jusqu'à la fin de soirée
      lines.push(`DTSTART:${dateYmd}T${eHours}${eMinutes}00`);
      lines.push(`DTEND:${dateYmd}T235900`);
      lines.push(`SUMMARY:${storyForDay.title} (${storyForDay.titlePinyin})`);
      lines.push(`DESCRIPTION:${storyDescription}`);
      lines.push('LOCATION:Fluent (https://warm1t.github.io/chinois/)');
      lines.push('STATUS:CONFIRMED');

      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-PT0M');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:📚 ${storyForDay.title} (${storyForDay.titlePinyin})`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
};
