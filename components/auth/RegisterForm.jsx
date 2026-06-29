'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * RegisterForm — Client Component
 * Handles user registration with validation, password strength indicator,
 * loading states, and error display.
 */
export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  }

  // Password strength calculator
  function getPasswordStrength(pw) {
    if (!pw) return { level: 0, label: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', cls: 'weak' };
    if (score <= 2) return { level: 2, label: 'Medium', cls: 'medium' };
    return { level: 3, label: 'Strong', cls: 'strong' };
  }

  // Client-side validation
  function validate() {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email.';
    }
    if (!formData.password || formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errs.password = 'Must contain uppercase, lowercase, and a number.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || { general: 'Registration failed.' });
        setLoading(false);
        return;
      }

      setSuccess('Account created! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
      setLoading(false);
    }
  }

  const strength = getPasswordStrength(formData.password);

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {errors.general && (
        <div className="auth-general-error">{errors.general}</div>
      )}
      {success && (
        <div className="auth-success">{success}</div>
      )}

      {/* Full Name */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="register-name">Full Name</label>
        <input
          id="register-name"
          className={`auth-input ${errors.name ? 'error' : ''}`}
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          autoComplete="off"
          disabled={loading}
        />
        {errors.name && <span className="auth-error">{errors.name}</span>}
      </div>

      {/* Email */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="register-email">Email</label>
        <input
          id="register-email"
          className={`auth-input ${errors.email ? 'error' : ''}`}
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
          disabled={loading}
        />
        {errors.email && <span className="auth-error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="register-password">Password</label>
        <input
          id="register-password"
          className={`auth-input ${errors.password ? 'error' : ''}`}
          type="password"
          name="password"
          placeholder="Min. 8 characters"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
          disabled={loading}
        />
        {/* Password strength indicator */}
        {formData.password && (
          <>
            <div className="auth-password-strength">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`auth-strength-bar ${i <= strength.level ? strength.cls : ''}`}
                />
              ))}
            </div>
            <span className={`auth-strength-text ${strength.cls}`}>{strength.label}</span>
          </>
        )}
        {errors.password && <span className="auth-error">{errors.password}</span>}
      </div>

      {/* Confirm Password */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="register-confirm">Confirm Password</label>
        <input
          id="register-confirm"
          className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="off"
          disabled={loading}
        />
        {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
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
            Creating account...
          </span>
        ) : (
          '🐾 Create Account'
        )}
      </button>
    </form>
  );
}
