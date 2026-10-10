import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, track } from '../lib/api';
import { Button, Card, Checkbox, Input, Logo, Notice, Page } from '../components/ui';

// ====== YAHAN QUIZ KA CONTENT EDIT KARO (abhi placeholder hai) ======
// Har option ka `tag` result decide karta hai: sab se zyada chuna gaya tag user ka result banta hai.
// Admin me ritual ki "category" bhi inhi tags jaisi rakho (jaise "Calm", "Focus", "Rest"),
// taake daily recommendation quiz result se match kar sake.
const QUESTIONS = [
  {
    q: 'How do you feel right now?',
    options: [
      { label: 'Tense and rushed', tag: 'Calm' },
      { label: 'Scattered, hard to focus', tag: 'Focus' },
      { label: 'Tired and drained', tag: 'Rest' },
    ],
  },
  {
    q: 'What would help you most today?',
    options: [
      { label: 'Slow my breathing', tag: 'Calm' },
      { label: 'Clear my mind', tag: 'Focus' },
      { label: 'Recharge my energy', tag: 'Rest' },
    ],
  },
  {
    q: 'How much time do you have?',
    options: [
      { label: 'About 3 minutes', tag: 'Calm' },
      { label: 'About 10 minutes', tag: 'Focus' },
      { label: 'As long as it takes', tag: 'Rest' },
    ],
  },
];
// =====================================================================

function topTag(picked) {
  const counts = {};
  picked.forEach((tag) => (counts[tag] = (counts[tag] || 0) + 1));
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState([]); // option index per question
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    track('quiz_started');
  }, []);

  const finished = step >= QUESTIONS.length;
  const tags = picked.map((idx, i) => QUESTIONS[i].options[idx].tag);
  const result = topTag(tags);

  function choose(idx) {
    setPicked((p) => [...p, idx]);
    setStep((s) => s + 1);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/quiz/submit', {
        name,
        email,
        answers: picked,
        result,
        marketingConsent: consent,
      });
      track('quiz_completed');
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page className="px-4 py-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <Logo />
        </div>

        {done ? (
          <Card>
            <h1 className="font-serif text-3xl text-[#16324A]">Your result: {result}</h1>
            <p className="mt-3 text-sm text-[#6E7B82]">
              We sent your result to {email}. Create your free account to start your first 3-minute Ocean Reset.
            </p>
            <Button as={Link} to={`/signup?email=${encodeURIComponent(email)}`} className="mt-5">
              Create my account
            </Button>
          </Card>
        ) : !finished ? (
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6E7B82]">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <h1 className="mt-2 font-serif text-2xl text-[#16324A] sm:text-3xl">{QUESTIONS[step].q}</h1>
            <div className="mt-5 space-y-3">
              {QUESTIONS[step].options.map((o, idx) => (
                <button
                  key={o.label}
                  onClick={() => choose(idx)}
                  className="w-full rounded-xl border border-[#D9D2C3] bg-white px-4 py-3 text-left text-sm text-[#16324A] transition hover:border-[#1E4D6B] hover:bg-[#E9F1F6]"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <h1 className="font-serif text-2xl text-[#16324A] sm:text-3xl">Where should we send your result?</h1>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <Input label="First name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Checkbox
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                label="Send me the 7-day Ocean Reset emails. You can unsubscribe at any time."
              />
              <Notice type="error">{error}</Notice>
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? 'Sending…' : 'Show my result'}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </Page>
  );
}