import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, track } from '../lib/api';
import { Button, Card, Notice } from './ui';

// Premium kharidne ka card. Dashboard me bhi chalta hai aur landing page (/ocean-reset) par bhi lag sakta hai.
// Landing par: import UpgradeCard from '../components/UpgradeCard';  ...  <UpgradeCard />
export default function UpgradeCard({ className = '' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  async function buy(interval) {
    track('checkout_started');
    if (!user) return navigate('/signup');
    setBusy(interval);
    setError('');
    try {
      const { url } = await api.post('/billing/checkout', { interval });
      window.location.href = url; // Stripe Checkout
    } catch (err) {
      setError(err.message);
      setBusy('');
    }
  }

  async function manage() {
    setBusy('portal');
    setError('');
    try {
      const { url } = await api.post('/billing/portal');
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setBusy('');
    }
  }

  if (user?.plan === 'premium') {
    return (
      <Card className={className}>
        <h2 className="font-serif text-2xl text-[#16324A]">You are Premium</h2>
        <p className="mt-2 text-sm text-[#6E7B82]">The full ritual library and guided audio are unlocked for you.</p>
        <div className="mt-4">
          <Notice type="error">{error}</Notice>
        </div>
        <Button variant="outline" onClick={manage} disabled={busy === 'portal'} className="mt-4">
          {busy === 'portal' ? 'Opening…' : 'Manage subscription'}
        </Button>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <h2 className="font-serif text-2xl text-[#16324A]">Go deeper with Premium</h2>
      <p className="mt-2 text-sm text-[#6E7B82]">
        Unlock the full ritual library, guided audio and a daily reset chosen for you.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#D9D2C3] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6E7B82]">Monthly</p>
          <p className="mt-1 font-serif text-3xl text-[#16324A]">$9.99</p>
          <Button onClick={() => buy('monthly')} disabled={!!busy} className="mt-3 w-full">
            {busy === 'monthly' ? 'Please wait…' : 'Choose monthly'}
          </Button>
        </div>
        <div className="rounded-xl border-2 border-[#1E4D6B] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1E4D6B]">Yearly · best value</p>
          <p className="mt-1 font-serif text-3xl text-[#16324A]">$79</p>
          <Button onClick={() => buy('yearly')} disabled={!!busy} className="mt-3 w-full">
            {busy === 'yearly' ? 'Please wait…' : 'Choose yearly'}
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Notice type="error">{error}</Notice>
      </div>
    </Card>
  );
}