import Link from 'next/link';
import LoginForm from '../../../components/auth/LoginForm';
import '../../auth.css';

export const metadata = {
  title: 'Login · PawTrack',
  description: 'Sign in to your PawTrack account',
};

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon">🐾</span>
          <span className="auth-logo-text">PawTrack</span>
        </div>
        <p className="auth-subtitle">Welcome back! Sign in to continue.</p>

        {/* Login Form */}
        <LoginForm />

        {/* Footer link */}
        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
