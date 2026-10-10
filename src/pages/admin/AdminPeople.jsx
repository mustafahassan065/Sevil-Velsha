import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Card, Notice, Spinner } from '../../components/ui';

const TABS = {
  users: {
    label: 'Users',
    path: '/admin/users',
    key: 'users',
    cols: [
      ['email', 'Email'],
      ['name', 'Name'],
      ['plan', 'Plan'],
      ['role', 'Role'],
      ['emailVerified', 'Verified'],
      ['createdAt', 'Joined'],
    ],
  },
  leads: {
    label: 'Leads',
    path: '/admin/leads',
    key: 'leads',
    cols: [
      ['email', 'Email'],
      ['name', 'Name'],
      ['result', 'Quiz result'],
      ['marketingConsent', 'Consent'],
      ['unsubscribed', 'Unsubscribed'],
      ['createdAt', 'Date'],
    ],
  },
  emails: {
    label: 'Email log',
    path: '/admin/emails',
    key: 'emails',
    cols: [
      ['toEmail', 'To'],
      ['template', 'Template'],
      ['subject', 'Subject'],
      ['status', 'Status'],
      ['createdAt', 'Date'],
    ],
  },
};

const show = (v) => (v === 1 || v === true ? 'Yes' : v === 0 || v === false ? 'No' : v ?? '');

export default function AdminPeople() {
  const [tab, setTab] = useState('users');
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const t = TABS[tab];

  useEffect(() => {
    setRows(null);
    setError('');
    api
      .get(t.path)
      .then((d) => setRows(d[t.key]))
      .catch((e) => setError(e.message));
  }, [t]);

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-3xl text-[#16324A]">Users &amp; emails</h1>
      <div className="flex gap-2">
        {Object.entries(TABS).map(([id, x]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] ${
              tab === id ? 'bg-[#1E4D6B] text-white' : 'bg-[#FFFDF9] text-[#1E4D6B]'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <Notice type="error">{error}</Notice>
      {!rows && !error ? (
        <Spinner />
      ) : (
        rows && (
          <Card className="overflow-x-auto !p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E7DFCF] text-xs uppercase tracking-wider text-[#6E7B82]">
                  {t.cols.map(([, label]) => (
                    <th key={label} className="px-4 py-3 font-semibold">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={t.cols.length} className="px-4 py-6 text-center text-[#6E7B82]">
                      Nothing here yet.
                    </td>
                  </tr>
                )}
                {rows.map((r, i) => (
                  <tr key={r.id ?? i} className="border-b border-[#F1EADB] last:border-0">
                    {t.cols.map(([k]) => (
                      <td key={k} className="max-w-[260px] truncate px-4 py-2.5 text-[#16324A]">
                        {show(r[k])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )
      )}
    </div>
  );
}