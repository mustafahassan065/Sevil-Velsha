import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { AuthCard, Button, Checkbox, Input, Notice } from '../components/ui';

export default function Signup() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [resent, setResent] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/signup', {
        name,
        email,
        password,
        marketingConsent: marketing,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    try {
      await api.post('/auth/resend-verification', { email });
      setResent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (done) {
    return (
      <AuthCard title="Check your email" subtitle={`We sent a verification link to ${email}. Tap it to activate your account.`}>
        <div className="space-y-4 text-sm text-[#6E7B82]">
          <p>The link is valid for 24 hours. If you do not see it, check your spam folder.</p>
          <Notice type="error">{error}</Notice>
          {resent ? (
            <Notice type="success">A new link is on its way.</Notice>
          ) : (
            <Button variant="outline" onClick={resend} className="w-full">
              Send the link again
            </Button>
          )}
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your free 3-minute Ocean Reset."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#1E4D6B] underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Name" required maxLength={80} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          label="Password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint="At least 8 characters."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Checkbox
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          label="Send me ocean-inspired tips and offers by email. You can unsubscribe at any time."
        />
        <Notice type="error">{error}</Notice>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Creating…' : 'Create account'}
        </Button>
      </form>
    </AuthCard>
  );
}