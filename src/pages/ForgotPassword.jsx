import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { AuthCard, Button, Input, Notice } from '../components/ui';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a link to choose a new one."
      footer={
        <Link to="/login" className="font-semibold text-[#1E4D6B] underline">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <Notice type="success">If an account exists for {email}, a reset link is on its way. It is valid for 1 hour.</Notice>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Notice type="error">{error}</Notice>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}