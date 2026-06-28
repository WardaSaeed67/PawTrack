import Link from 'next/link';
import RegisterForm from '../../../components/auth/RegisterForm';
import '../../auth.css';

export const metadata = {
  title: 'Register · PawTrack',
  description: 'Create your PawTrack account',
};

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon">🐾</span>
          <span className="auth-logo-text">PawTrack</span>
        </div>
        <p className="auth-subtitle">Create your account to get started.</p>

        {/* Register Form */}
        <RegisterForm />

        {/* Footer link */}
        <div className="auth-footer">
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
