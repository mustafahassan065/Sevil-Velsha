import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { AuthCard, Button, Input, Notice } from '../components/ui';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirm) return setError('The two passwords do not match.');
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <AuthCard
        title="Link not valid"
        footer={
          <Link to="/forgot-password" className="font-semibold text-[#1E4D6B] underline">
            Request a new link
          </Link>
        }
      >
        <Notice type="error">This reset link is missing or incomplete.</Notice>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password">
      {done ? (
        <div className="space-y-4">
          <Notice type="success">Your password has been updated. You can log in now.</Notice>
          <Button as={Link} to="/login" className="w-full">
            Go to log in
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="New password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            hint="At least 8 characters."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirm new password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Notice type="error">{error}</Notice>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Saving…' : 'Update password'}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}