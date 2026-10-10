// User ki timezone ke hisaab se local date aur time (minutes since midnight)
export function localNow(timeZone, now = new Date()) {
  let parts;
  try {
    parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(now);
  } catch {
    return localNow('UTC', now);
  }
  const g = (t) => parts.find((p) => p.type === t).value;
  return {
    date: `${g('year')}-${g('month')}-${g('day')}`,
    minutes: (Number(g('hour')) % 24) * 60 + Number(g('minute')),
  };
}

export const SLOT_MINUTES = { morning: 8 * 60, afternoon: 13 * 60, after_work: 18 * 60, evening: 21 * 60 };

export function slotMinutes(pref) {
  if (SLOT_MINUTES[pref] != null) return SLOT_MINUTES[pref];
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(pref));
  return m ? Number(m[1]) * 60 + Number(m[2]) : SLOT_MINUTES.morning;
}

export function shiftDate(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}