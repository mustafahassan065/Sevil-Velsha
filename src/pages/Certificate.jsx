import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, API_BASE } from '../lib/api';
import { Button, Card, Input, Logo, Notice, Page, Spinner } from '../components/ui';

function CertificateResult({ certificate }) {
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2E7D5B]">Certified</p>
      <h2 className="mt-1 font-serif text-3xl text-[#16324A]">{certificate.name}</h2>
      <p className="mt-2 text-sm text-[#6E7B82]">
        Issued {certificate.issuedAt} · Certificate ID {certificate.code}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {/* Same-origin cookie ki wajah se direct link se PDF download ho jati hai */}
        <Button as="a" href={`${API_BASE}/certificate/pdf`}>
          Download PDF
        </Button>
        <Button as="a" variant="outline" href={certificate.verifyUrl} target="_blank" rel="noreferrer">
          Public verification page
        </Button>
      </div>
    </Card>
  );
}

export default function Certificate() {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState(user.name || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [failed, setFailed] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [q, m] = await Promise.all([api.get('/certificate/quiz'), api.get('/certificate/mine')]);
        setQuiz(q);
        setCertificate(m.certificate);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (Object.keys(answers).length < quiz.questions.length) return setError('Please answer every question.');
    setBusy(true);
    setError('');
    setFailed(null);
    try {
      const res = await api.post('/certificate/submit', { answers, name });
      if (res.passed) setCertificate(res.certificate);
      else {
        setFailed(res);
        setAnswers({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      <header className="border-b border-[#E7DFCF] bg-[#FFFDF9]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Logo />
          <Link to="/dashboard" className="text-sm font-semibold text-[#1E4D6B] underline">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-10">
        <h1 className="font-serif text-3xl text-[#16324A] sm:text-4xl">Seagloré certification</h1>
        <Notice type="error">{error}</Notice>

        {!quiz && !error && <Spinner />}

        {certificate && <CertificateResult certificate={certificate} />}

        {quiz && !certificate && quiz.questions.length === 0 && (
          <Card>
            <p className="text-sm text-[#6E7B82]">The certification quiz is not available yet. Please check back soon.</p>
          </Card>
        )}

        {quiz && !certificate && quiz.questions.length > 0 && (
          <form onSubmit={submit} className="space-y-5">
            <p className="text-sm text-[#6E7B82]">
              Answer all {quiz.questions.length} questions. You need {quiz.passPercent}% or more to pass. You can try again if you
              do not pass.
            </p>
            {failed && (
              <Notice type="error">
                You scored {failed.percent}% ({failed.correct} of {failed.total}). You need {failed.passPercent}% to pass. Please
                try again.
              </Notice>
            )}
            {quiz.questions.map((q, i) => (
              <Card key={q.id}>
                <p className="font-medium text-[#16324A]">
                  {i + 1}. {q.question}
                </p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                        answers[q.id] === idx ? 'border-[#1E4D6B] bg-[#E9F1F6]' : 'border-[#D9D2C3] bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        className="accent-[#1E4D6B]"
                        checked={answers[q.id] === idx}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </Card>
            ))}
            <Card>
              <Input
                label="Name on your certificate"
                required
                maxLength={80}
                hint="Letters A–Z with accents work best on the PDF."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button type="submit" disabled={busy} className="mt-5">
                {busy ? 'Checking…' : 'Submit answers'}
              </Button>
            </Card>
          </form>
        )}
      </main>
    </Page>
  );
}