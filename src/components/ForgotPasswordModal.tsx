import React, { useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from '../supabase';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSwitchToLogin 
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `https://the-greenhabit-ai.vercel.app/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleBackToLogin = () => {
    onClose();
    onSwitchToLogin();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div
        className="bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] rounded-2xl w-full max-w-md p-8 shadow-2xl border border-green-500/30 mx-4 transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-green-400 hover:text-white text-2xl transition transform hover:scale-110 w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-800/50"
          >
            ✕
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src="/glogo.png" 
            alt="GreenHabit Logo"
            className="w-16 h-16 rounded-full shadow-lg object-cover"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white font-spartan mb-2">
          Forgot Password?
        </h2>
        <p className="text-green-300 text-center mb-6 font-fredoka">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4 animate-shake">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-4">
            <p className="text-green-200 text-sm text-center">
              ✓ Password reset link sent! Check your email.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-green-200 mb-2 font-fredoka">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-green-900/30 border border-green-500/30 rounded-lg text-white placeholder-green-300/50 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/50 transition"
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white font-semibold rounded-lg hover:from-[#1B5E20] hover:to-[#2E7D32] transition shadow-md font-spartan disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-green-200 font-fredoka">
            Remember your password?{" "}
            <button
              onClick={handleBackToLogin}
              className="text-[#81C784] font-semibold hover:text-white transition underline decoration-green-500/50"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ForgotPasswordModal;