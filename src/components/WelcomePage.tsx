import React, { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";


interface WelcomePageProps {
  onLoginSuccess: () => void;
  onSignUpSuccess: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLoginSuccess, onSignUpSuccess }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20]">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-[#0A2F1F]/80 backdrop-blur-sm border-b border-green-800/50">
        <div className="flex items-center gap-3">
          <img 
              src="/glogo.png" 
              alt="GreenHabit Logo"
              className="w-12 h-12 rounded-lg shadow-lg object-cover"
            />
          <span className="text-2xl font-bold font-spartan">
            <span className="text-white">Green</span>
            <span className="text-[#66BB6A]">Habit</span>
          </span>
        </div>

        <div className="flex gap-4 font-spartan">
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition"
          >
            Log In
          </button>
          <button 
            onClick={() => setIsSignUpModalOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white font-semibold rounded-lg hover:from-[#1B5E20] hover:to-[#2E7D32] transition shadow-md"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-[70px] font-bold text-white leading-tight font-spartan">
              Build Sustainable Habits with
              <span className="text-[#81C784] block mt-2">AI-Powered Green Plans</span>
            </h1>
            <p className="text-green-100 text-xl md:text-2xl lg:text-[28px] mt-6 leading-relaxed font-fredoka">
              Choose a goal. Get a personalized weekly action plan.
              Track your progress. Save the planet.
            </p>
            <button 
              onClick={() => setIsSignUpModalOpen(true)}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white font-semibold rounded-xl hover:from-[#1B5E20] hover:to-[#2E7D32] transition shadow-md text-lg font-spartan"
            >
              Get Started
            </button>
          </div>
         {/* RIGHT SIDE - Overlapping Images */}
        <div className="flex-1 flex justify-center relative min-h-[400px]">
        {/* Forest Image - Back Left */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-0 transition-all duration-300 hover:scale-110 hover:-translate-x-6 hover:z-20">          
          <img 
            src="/forest.jpg" 
            alt="Forest background"
            className="w-56 h-auto rounded-xl opacity-90 shadow-lg transition-all duration-300 hover:opacity-100 hover:shadow-2xl"            
            style={{ borderRadius: '12px' }}
          />
        </div>
            {/* Water Drop Image - Back Right */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-0 transition-all duration-300 hover:scale-110 hover:translate-x-6 hover:z-20">              
            <img 
                src="/water.jpg" 
                alt="Water drop background"
                className="w-48 h-auto rounded-xl opacity-90 shadow-lg transition-all duration-300 hover:opacity-100 hover:shadow-2xl"                
                style={{ borderRadius: '12px' }}
              />
            </div>

            {/* Leaf Image - Front Center (on top of both) */}
            <div className="relative z-10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:z-30">              
              <img 
                src="/leaf.jpg" 
                alt="Green leaf - main illustration"
                className="w-64 h-auto rounded-xl shadow-2xl transition-all duration-300 hover:opacity-100 hover:shadow-2xl"                
                style={{ borderRadius: '16px' }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-green-900/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-500/30 hover:bg-green-800/30 transition transform hover:scale-[1.02] group">
              <div className="w-14 h-14 bg-[#2E7D32]/30 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#2E7D32]/50 transition">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-7 h-7 text-[#81C784] group-hover:text-white transition"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mt-4 font-spartan">Choose Your Goal</h3>
              <p className="text-green-200/80 mt-2 text-sm font-fredoka">Reduce plastic, save water, lower energy, or cut carbon</p>
            </div>
          <div className="bg-green-900/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-500/30 hover:bg-green-800/30 transition transform hover:scale-[1.02] group">
            <div className="w-14 h-14 bg-[#2E7D32]/30 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#2E7D32]/50 transition">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-7 h-7 text-[#81C784] group-hover:text-white transition"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" 
                  />
                </svg>
              </div>
            <h3 className="text-xl font-semibold text-green-100 mt-4 font-spartan">AI-Powered Plan</h3>
            <p className="text-green-200/80 mt-2 text-sm">Personalized 7-day habit checklist just for you</p>
          </div>
          <div className="bg-green-900/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-500/30 hover:bg-green-800/30 transition transform hover:scale-[1.02] group">
            <div className="w-14 h-14 bg-[#2E7D32]/30 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#2E7D32]/50 transition">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-7 h-7 text-[#81C784] group-hover:text-white transition"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-100 mt-4 font-spartan">Track Progress</h3>
            <p className="text-green-200/80 mt-2 text-sm">See streaks, impact stats, and celebrate wins</p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onLoginSuccess={onLoginSuccess}
      />
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onSignUpSuccess={onSignUpSuccess}
      />
    </div>
  );
};

export default WelcomePage;