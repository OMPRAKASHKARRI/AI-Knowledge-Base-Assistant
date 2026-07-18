import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start building your knowledge base">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-signal-error bg-signal-error/5 border border-signal-error/20 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          autoComplete="new-password"
        />
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-ink-400 text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-ledger-500 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
