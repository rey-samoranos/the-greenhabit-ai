import React, { useState, useEffect } from "react";
import { supabase } from '../supabase';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have a valid reset session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("Invalid or expired reset link. Please request a new one.");
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] rounded-2xl w-full max-w-md p-8 shadow-2xl border border-green-500/30">
        <div className="flex justify-center mb-4">
          <img 
            src="/glogo.png" 
            alt="GreenHabit Logo"
            className="w-16 h-16 rounded-full shadow-lg object-cover"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-white font-spartan mb-2">
          Reset Password
        </h2>
        <p className="text-green-300 text-center mb-6 font-fredoka">
          Enter your new password below.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-4">
            <p className="text-green-200 text-sm text-center">
              ✓ Password reset successfully! Redirecting to login...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-green-200 mb-2 font-fredoka">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-green-900/30 border border-green-500/30 rounded-lg text-white placeholder-green-300/50 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/50 transition"
              placeholder="Enter new password"
              required
            />
            <p className="text-green-400/60 text-xs mt-1">Password must be at least 6 characters</p>
          </div>

          <div>
            <label className="block text-green-200 mb-2 font-fredoka">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-green-900/30 border border-green-500/30 rounded-lg text-white placeholder-green-300/50 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/50 transition"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white font-semibold rounded-lg hover:from-[#1B5E20] hover:to-[#2E7D32] transition shadow-md font-spartan disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-[#81C784] hover:text-white transition font-fredoka">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;