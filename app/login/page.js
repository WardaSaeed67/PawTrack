"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error || "Invalid credentials");
      } else {
        localStorage.removeItem("pawtrack_data");
        router.push("/");
        router.refresh();
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
        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>Welcome Back to PawTrack!</h2>
        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
          Log in to sync and track your pet's schedule.
        </p>

        {error && (
          <div className="doc-alert" style={{ background: "rgba(220, 53, 69, 0.1)", borderColor: "#dc3545", color: "#dc3545", marginBottom: "15px", padding: "10px", borderRadius: "8px", fontSize: "0.85rem" }}>
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
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
            disabled={loading}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
          >
            {loading ? "Logging in..." : "🐾 Log In"}
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <Link href="/signup" className="text-accent" style={{ fontWeight: "700", textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
