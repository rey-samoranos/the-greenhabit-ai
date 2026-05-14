import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase, getCurrentUser } from "../supabase";

interface ProfileDropdownProps {
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current user from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showConfirmLogout || showProfileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmLogout, showProfileModal]);

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowConfirmLogout(true);
  };

  const handleConfirmLogout = async () => {
    setShowConfirmLogout(false);
    await supabase.auth.signOut();
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowConfirmLogout(false);
  };

  const handleViewProfile = () => {
    setIsOpen(false);
    setShowProfileModal(true);
  };

  // Get user's display name from Supabase metadata
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "Green User";
  };

  const getUserEmail = () => {
    return user?.email || "user@greenhabit.com";
  };

  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Get saved challenges count from localStorage (can be replaced with Supabase query)
  const getChallengesCount = () => {
    const existing = localStorage.getItem('greenhabit_plans');
    if (existing) {
      return JSON.parse(existing).length;
    }
    return 0;
  };

  // Get total completed habits
  const getTotalCompletedHabits = () => {
    const existing = localStorage.getItem('greenhabit_plans');
    if (existing) {
      const plans = JSON.parse(existing);
      let total = 0;
      plans.forEach((plan: any) => {
        total += plan.completedDays || 0;
      });
      return total;
    }
    return 0;
  };

  // Get member since date from user metadata
  const getMemberSince = () => {
    if (user?.created_at) {
      return new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Logout Confirmation Modal
  const LogoutModal = () => {
    if (!showConfirmLogout) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
        }}
      >
        <div 
          className="bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-red-500/30 mx-4 animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white font-spartan mb-3">Logout Confirmation</h3>
            <p className="text-green-200 text-base mb-6 font-fredoka">
              Are you sure you want to logout?<br />
              Your progress will be saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition font-spartan shadow-lg"
              >
                Yes, Logout
              </button>
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-3 bg-green-800/50 text-white font-semibold rounded-xl hover:bg-green-700/50 transition font-spartan border border-green-500/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Profile Modal
  const ProfileModal = () => {
    if (!showProfileModal) return null;
    
    const challengesCount = getChallengesCount();
    const totalHabits = getTotalCompletedHabits();
    
    return createPortal(
      <div 
        className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
        }}
      >
        <div 
          className="bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-green-500/30 mx-4 animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            {/* Close button */}
            <div className="flex justify-end -mt-2 -mr-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-green-400 hover:text-white text-2xl transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-800/50"
              >
                ✕
              </button>
            </div>

            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl text-white font-bold">
                {getUserInitial()}
              </span>
            </div>
            
            {/* User Details */}
            <h3 className="text-2xl font-bold text-white font-spartan mb-2">{getUserName()}</h3>
            <p className="text-green-300 text-sm font-fredoka mb-4">{getUserEmail()}</p>
            
            {/* Divider */}
            <div className="border-t border-green-500/30 my-4"></div>
            
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-800/30 rounded-xl p-2">
                <div className="text-xl font-bold text-white">7</div>
                <div className="text-green-300 text-xs font-fredoka">Days/Goal</div>
              </div>
              <div className="bg-green-800/30 rounded-xl p-2">
                <div className="text-xl font-bold text-white">{challengesCount}</div>
                <div className="text-green-300 text-xs font-fredoka">Challenges</div>
              </div>
              <div className="bg-green-800/30 rounded-xl p-2">
                <div className="text-xl font-bold text-white">{totalHabits}</div>
                <div className="text-green-300 text-xs font-fredoka">Habits</div>
              </div>
            </div>

            {/* Member Since */}
            <p className="text-green-400/60 text-xs font-fredoka mb-4">
              Member since: {getMemberSince()}
            </p>
            
            {/* Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white font-semibold rounded-xl hover:from-[#1B5E20] hover:to-[#2E7D32] transition font-spartan"
            >
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  if (loading) {
    return (
      <div className="w-8 h-8 bg-green-800/30 rounded-full animate-pulse"></div>
    );
  }

  return (
    <>
      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-green-800/30 hover:bg-green-700/50 rounded-lg transition border border-green-500/30"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {getUserInitial()}
            </span>
          </div>
          <span className="text-white text-sm font-fredoka hidden md:inline">{getUserName().split(' ')[0]}</span>
          <svg 
            className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] rounded-xl shadow-lg border border-green-500/30 overflow-hidden z-50 animate-slideUp">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-green-500/30 bg-green-800/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#4CAF50] rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {getUserInitial()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold font-spartan text-sm">{getUserName()}</p>
                  <p className="text-green-300 text-xs font-fredoka">{getUserEmail()}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button 
                onClick={handleViewProfile}
                className="w-full px-4 py-2 text-left text-green-200 hover:bg-green-800/30 transition flex items-center gap-3 font-fredoka"
              >
                <span>My Profile</span>
              </button>
              <hr className="my-2 border-green-500/30" />
              <button 
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition flex items-center gap-3 font-fredoka"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LogoutModal />
      <ProfileModal />
    </>
  );
};

export default ProfileDropdown;