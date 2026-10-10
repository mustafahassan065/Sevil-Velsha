import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Button, Card, Checkbox, Input, Notice, Select, Spinner, Textarea } from '../../components/ui';

function QuestionForm({ initial, onSaved, onCancel }) {
  const [question, setQuestion] = useState(initial?.question || '');
  const [optionsText, setOptionsText] = useState((initial?.options || ['', '']).join('\n'));
  const [correctIndex, setCorrectIndex] = useState(initial?.correctIndex ?? 0);
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const options = optionsText.split('\n').map((o) => o.trim()).filter(Boolean);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = { question, options, correctIndex: Number(correctIndex), sortOrder: Number(sortOrder), isActive };
    try {
      if (initial?.id) await api.put(`/admin/cert-questions/${initial.id}`, body);
      else await api.post('/admin/cert-questions', body);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <h2 className="font-serif text-2xl text-[#16324A]">{initial?.id ? 'Edit question' : 'New question'}</h2>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <Textarea label="Question" required rows={2} maxLength={500} value={question} onChange={(e) => setQuestion(e.target.value)} />
        <Textarea
          label="Options"
          rows={5}
          hint="One option per line (2 to 6)."
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Correct answer" value={correctIndex} onChange={(e) => setCorrectIndex(e.target.value)}>
            {options.map((o, i) => (
              <option key={i} value={i}>
                {i + 1}. {o}
              </option>
            ))}
          </Select>
          <Input label="Sort order" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        </div>
        <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} label="Active (included in the quiz)" />
        <Notice type="error">{error}</Notice>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save question'}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function AdminCertificate() {
  const [questions, setQuestions] = useState(null);
  const [certs, setCerts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [q, c] = await Promise.all([api.get('/admin/cert-questions'), api.get('/admin/certificates')]);
      setQuestions(q.questions);
      setCerts(c.certificates);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(q) {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.del(`/admin/cert-questions/${q.id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (editing) {
    return (
      <QuestionForm
        initial={editing.id ? editing : null}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[#16324A]">Certificate quiz</h1>
        <Button onClick={() => setEditing({})}>Add question</Button>
      </div>
      <Notice type="error">{error}</Notice>

      {!questions ? (
        <Spinner />
      ) : questions.length === 0 ? (
        <Card>
          <p className="text-sm text-[#6E7B82]">No questions yet. Users cannot take the certification until you add some.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={q.id} className="!p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div>
                  <p className="font-semibold text-[#16324A]">
                    {i + 1}. {q.question} {!q.isActive && <span className="text-xs text-red-700">(hidden)</span>}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-[#6E7B82]">
                    {q.options.map((o, idx) => (
                      <li key={idx} className={idx === q.correctIndex ? 'font-semibold text-[#2E7D5B]' : ''}>
                        {idx === q.correctIndex ? '✓ ' : '• '}
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="!px-4 !py-2" onClick={() => setEditing(q)}>
                    Edit
                  </Button>
                  <Button variant="ghost" className="!px-4 !py-2 !text-red-700" onClick={() => remove(q)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="mb-3 font-serif text-2xl text-[#16324A]">Issued certificates</h2>
        <Card className="overflow-x-auto !p-0">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E7DFCF] text-xs uppercase tracking-wider text-[#6E7B82]">
                {['Code', 'Name', 'Email', 'Score', 'Issued'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[#6E7B82]">
                    None yet.
                  </td>
                </tr>
              )}
              {certs.map((c) => (
                <tr key={c.code} className="border-b border-[#F1EADB] last:border-0">
                  <td className="px-4 py-2.5">{c.code}</td>
                  <td className="px-4 py-2.5">{c.name}</td>
                  <td className="px-4 py-2.5">{c.email}</td>
                  <td className="px-4 py-2.5">{c.scorePercent}%</td>
                  <td className="px-4 py-2.5">{String(c.issuedAt).slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}