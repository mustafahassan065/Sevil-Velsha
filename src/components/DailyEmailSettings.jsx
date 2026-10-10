import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Button, Card, Checkbox, Notice, Select } from './ui';

const SLOTS = [
  ['morning', 'Morning (8:00 AM)'],
  ['afternoon', 'Afternoon (1:00 PM)'],
  ['after_work', 'After work (6:00 PM)'],
  ['evening', 'Evening (9:00 PM)'],
];

export default function DailyEmailSettings() {
  const { user, setUser } = useAuth();
  const [optIn, setOptIn] = useState(!!user.dailyEmailOptIn);
  const [time, setTime] = useState(user.preferredTime);
  const [tz, setTz] = useState(user.timezone);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const zones = (() => {
    try {
      const list = Intl.supportedValuesOf('timeZone');
      return list.includes(tz) ? list : [tz, ...list];
    } catch {
      return [tz];
    }
  })();

  async function save() {
    setBusy(true);
    setMsg({ type: '', text: '' });
    try {
      const { user: u } = await api.patch('/auth/me', { dailyEmailOptIn: optIn, preferredTime: time, timezone: tz });
      setUser(u);
      setMsg({ type: 'success', text: 'Saved.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <h2 className="font-serif text-2xl text-[#16324A]">Daily ritual email</h2>
      <p className="mt-2 text-sm text-[#6E7B82]">One short email a day with your ritual, at the time you choose.</p>
      <div className="mt-5 space-y-4">
        <Checkbox checked={optIn} onChange={(e) => setOptIn(e.target.checked)} label="Send me my daily ritual by email" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Time of day" value={SLOTS.some(([v]) => v === time) ? time : 'morning'} onChange={(e) => setTime(e.target.value)} disabled={!optIn}>
            {SLOTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select label="Your timezone" value={tz} onChange={(e) => setTz(e.target.value)} disabled={!optIn}>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </Select>
        </div>
        {msg.text && <Notice type={msg.type}>{msg.text}</Notice>}
        <Button onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </Card>
  );
}