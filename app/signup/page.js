"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong during signup.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="parallax-bg"></div>
      <div className="modal-box" style={{ maxWidth: "400px", width: "100%", margin: "20px" }}>
        <span className="emoji-big" style={{ display: "block", textAlign: "center", marginBottom: "15px" }}>🐾</span>
        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>Create your PawTrack Account</h2>
        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
          Start saving and syncing your pet metrics securely.
        </p>

        {error && (
          <div className="doc-alert" style={{ background: "rgba(220, 53, 69, 0.1)", borderColor: "#dc3545", color: "#dc3545", marginBottom: "15px", padding: "10px", borderRadius: "8px", fontSize: "0.85rem" }}>
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="doc-alert" style={{ background: "rgba(40, 167, 69, 0.1)", borderColor: "#28a745", color: "#28a745", marginBottom: "15px", padding: "10px", borderRadius: "8px", fontSize: "0.85rem" }}>
            <span>🎉</span>
            <div>Registration successful! Redirecting to login...</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-block btn-lg paw-corner paw-corner-br"
            disabled={loading || success}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
          >
            {loading ? "Signing up..." : "🐾 Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" className="text-accent" style={{ fontWeight: "700", textDecoration: "none" }}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
