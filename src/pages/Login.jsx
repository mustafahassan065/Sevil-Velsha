import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { AuthCard, Button, Input, Notice } from '../components/ui';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [needsVerify, setNeedsVerify] = useState(false);
  const [resent, setResent] = useState(false);

  const from = location.state?.from || '/dashboard';
  if (user) return <Navigate to={from} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNeedsVerify(false);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code === 'EMAIL_NOT_VERIFIED') setNeedsVerify(true);
      else setError(err.message);
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

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue your Ocean Reset."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-semibold text-[#1E4D6B] underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {params.get('error') === 'invalid_link' && (
          <Notice type="error">That link is invalid or has expired. Please request a new one.</Notice>
        )}
        <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Notice type="error">{error}</Notice>
        {needsVerify && (
          <Notice type="info">
            Please verify your email first. We sent you a link when you signed up.{' '}
            {resent ? (
              <strong>A new link is on its way.</strong>
            ) : (
              <button type="button" onClick={resend} className="font-semibold underline">
                Send it again
              </button>
            )}
          </Notice>
        )}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Logging in…' : 'Log in'}
        </Button>
        <p className="text-center text-sm">
          <Link to="/forgot-password" className="text-[#1E4D6B] underline">
            Forgot your password?
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}