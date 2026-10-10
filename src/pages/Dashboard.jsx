import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Badge, Button, Card, Logo, Notice, Page, Spinner } from '../components/ui';
import RitualCard from '../components/RitualCard';
import UpgradeCard from '../components/UpgradeCard';
import DailyEmailSettings from '../components/DailyEmailSettings';

export default function Dashboard() {
  const { user, logout, refresh } = useAuth();
  const [params] = useSearchParams();
  const [data, setData] = useState(null);
  const [rituals, setRituals] = useState([]);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [d, r] = await Promise.all([api.get('/dashboard'), api.get('/rituals')]);
      setData(d);
      setRituals(r.rituals);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Stripe se wapas aane par plan update hone me kuch second lag sakte hain (webhook)
  useEffect(() => {
    if (!params.get('upgraded')) return undefined;
    let tries = 0;
    const timer = setInterval(async () => {
      tries += 1;
      const u = await refresh();
      if (u?.plan === 'premium' || tries >= 8) {
        clearInterval(timer);
        load();
      }
    }, 2500);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function complete(ritualId) {
    setCompleting(true);
    try {
      await api.post('/dashboard/complete', { ritualId });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCompleting(false);
    }
  }

  const today = data?.today;

  return (
    <Page>
      <header className="border-b border-[#E7DFCF] bg-[#FFFDF9]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Logo />
          <nav className="flex items-center gap-2 sm:gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm font-semibold text-[#1E4D6B] underline">
                Admin
              </Link>
            )}
            <Button variant="ghost" onClick={logout} className="!px-3 !py-2">
              Log out
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:py-10">
        {params.get('verified') && <Notice type="success">Your email is verified. Welcome!</Notice>}
        {params.get('upgraded') && (
          <Notice type="success">
            {user.plan === 'premium' ? 'Welcome to Premium!' : 'Thank you! We are activating your Premium access…'}
          </Notice>
        )}
        <Notice type="error">{error}</Notice>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl text-[#16324A] sm:text-4xl">
            Hello{user.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <Badge tone={user.plan === 'premium' ? 'gold' : 'soft'}>{user.plan === 'premium' ? 'Premium' : 'Free'}</Badge>
        </div>

        {!data ? (
          <Spinner />
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6E7B82]">Your ritual for today</p>
                {today ? (
                  <RitualCard ritual={today.ritual} large>
                    {today.reason && <p className="mt-4 text-sm italic text-[#16324A]">{today.reason}</p>}
                    <div className="mt-5">
                      {today.completed ? (
                        <Notice type="success">Done for today. Nicely done.</Notice>
                      ) : (
                        <Button onClick={() => complete(today.ritual.id)} disabled={completing}>
                          {completing ? 'Saving…' : 'Mark as done'}
                        </Button>
                      )}
                    </div>
                  </RitualCard>
                ) : (
                  <Card>
                    <p className="text-sm text-[#6E7B82]">No rituals are available yet. Please check back soon.</p>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Card>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6E7B82]">Streak</p>
                  <p className="mt-1 font-serif text-4xl text-[#16324A]">
                    {data.streak} <span className="text-lg text-[#6E7B82]">day{data.streak === 1 ? '' : 's'}</span>
                  </p>
                </Card>
                <Card>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6E7B82]">Rituals completed</p>
                  <p className="mt-1 font-serif text-4xl text-[#16324A]">{data.totalCompleted}</p>
                </Card>
                <Card>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6E7B82]">Certification</p>
                  <p className="mt-1 text-sm text-[#6E7B82]">Take the quiz and earn your Seagloré certificate.</p>
                  <Button as={Link} to="/certificate" variant="outline" className="mt-3">
                    Open
                  </Button>
                </Card>
              </div>
            </div>

            <UpgradeCard />

            <section>
              <h2 className="mb-4 font-serif text-2xl text-[#16324A]">Ritual library</h2>
              {rituals.length === 0 ? (
                <Card>
                  <p className="text-sm text-[#6E7B82]">Rituals will appear here soon.</p>
                </Card>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rituals.map((r) => (
                    <RitualCard key={r.id} ritual={r}>
                      {!r.locked && (
                        <Button variant="outline" onClick={() => complete(r.id)} disabled={completing} className="mt-4 !px-4 !py-2">
                          Mark as done
                        </Button>
                      )}
                    </RitualCard>
                  ))}
                </div>
              )}
            </section>

            {data.recent.length > 0 && (
              <Card>
                <h2 className="font-serif text-2xl text-[#16324A]">Recent</h2>
                <ul className="mt-3 divide-y divide-[#E7DFCF] text-sm">
                  {data.recent.map((r, i) => (
                    <li key={`${r.ritualId}-${r.date}-${i}`} className="flex justify-between py-2">
                      <span>{r.title}</span>
                      <span className="text-[#6E7B82]">{r.date}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <DailyEmailSettings />
          </>
        )}
      </main>
    </Page>
  );
}