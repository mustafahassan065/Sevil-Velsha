import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Card, Notice, Select, Spinner } from '../../components/ui';

function Stat({ label, value }) {
  return (
    <Card className="!p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6E7B82]">{label}</p>
      <p className="mt-1 font-serif text-3xl text-[#16324A]">{value}</p>
    </Card>
  );
}

function MiniTable({ title, rows, cols }) {
  return (
    <Card className="!p-5">
      <h3 className="font-serif text-lg text-[#16324A]">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-[#6E7B82]">No data yet.</p>
      ) : (
        <table className="mt-3 w-full text-sm">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-[#E7DFCF]">
                {cols.map((c) => (
                  <td key={c} className={`py-1.5 ${c === cols[0] ? 'text-[#16324A]' : 'text-right text-[#6E7B82]'}`}>
                    {r[c]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

export default function AdminOverview() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null);
    api
      .get(`/admin/analytics?days=${days}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [days]);

  if (error) return <Notice type="error">{error}</Notice>;
  if (!data) return <Spinner />;
  const t = data.totals;
  const r = data.inRange;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-[#16324A]">Overview</h1>
        <div className="w-40">
          <Select value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Users" value={t.users} />
        <Stat label="Premium" value={t.premiumUsers} />
        <Stat label="Leads" value={t.leads} />
        <Stat label="Est. monthly revenue" value={`$${data.estimatedMonthlyRevenueUsd}`} />
        <Stat label="Verified users" value={t.verifiedUsers} />
        <Stat label="Leads who signed up" value={t.leadsConverted} />
        <Stat label="Ritual completions" value={t.ritualCompletions} />
        <Stat label="Certificates" value={t.certificates} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MiniTable title="New users" rows={r.newUsers} cols={['date', 'n']} />
        <MiniTable title="New leads" rows={r.newLeads} cols={['date', 'n']} />
        <MiniTable title="Ritual completions" rows={r.completions} cols={['date', 'n']} />
        <MiniTable title="Site events" rows={r.events} cols={['name', 'n']} />
        <MiniTable title="Emails by status" rows={r.emailsByStatus} cols={['status', 'n']} />
        <MiniTable title="Email events (Resend)" rows={r.emailEvents} cols={['type', 'n']} />
        <MiniTable title="Top rituals" rows={r.topRituals} cols={['title', 'completions']} />
      </div>
    </div>
  );
}