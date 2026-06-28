'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * LoginForm — Client Component
 * Handles email/password login with validation, loading states, and error display.
 */
export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  }

  // Client-side validation
  function validate() {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    // Client-side validate
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || { general: 'Login failed.' });
        setLoading(false);
        return;
      }

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {errors.general && (
        <div className="auth-general-error">{errors.general}</div>
      )}
      {success && (
        <div className="auth-success">{success}</div>
      )}

      {/* Email */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className={`auth-input ${errors.email ? 'error' : ''}`}
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          disabled={loading}
        />
        {errors.email && <span className="auth-error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className={`auth-input ${errors.password ? 'error' : ''}`}
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          disabled={loading}
        />
        {errors.password && <span className="auth-error">{errors.password}</span>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="auth-btn auth-btn-primary"
        disabled={loading}
      >
        {loading ? (
          <span className="auth-btn-loading">
            <span className="auth-spinner"></span>
            Signing in...
          </span>
        ) : (
          '🐾 Sign In'
        )}
      </button>
    </form>
  );
}
