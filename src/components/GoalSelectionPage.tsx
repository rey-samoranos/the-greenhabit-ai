import React, { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { FaRecycle, FaTint, FaBolt, FaGlobeAmericas } from 'react-icons/fa';
import { BiSolidLeaf } from 'react-icons/bi';

interface GoalSelectionPageProps {
  onSelectGoal: (goal: string) => void;
  onViewProgress?: () => void;
  onLogout: () => void;
}

const GoalSelectionPage: React.FC<GoalSelectionPageProps> = ({ 
  onSelectGoal, 
  onViewProgress, 
  onLogout 
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
  {
    id: "plastic",
    title: "Reduce Plastic",
    icon: <FaRecycle className="text-5xl text-cyan-200" />,
    description: "Cut down on single-use plastics, bags, and packaging",
    impact: "Save marine life and reduce waste",
    color: "from-blue-500 to-cyan-500",
    iconColor: "text-cyan-100",
  },
  {
    id: "water",
    title: "Save Water",
    icon: <FaTint className="text-5xl text-sky-200" />,
    description: "Reduce water waste in daily activities",
    impact: "Conserve Earth's most precious resource",
    color: "from-blue-600 to-sky-400",
    iconColor: "text-sky-100",
  },
  {
    id: "energy",
    title: "Lower Energy",
    icon: <FaBolt className="text-5xl text-yellow-200" />,
    description: "Reduce electricity and carbon footprint",
    impact: "Lower emissions and save on bills",
    color: "from-yellow-500 to-orange-500",
    iconColor: "text-yellow-100",
  },
  {
    id: "carbon",
    title: "Cut Carbon",
    icon: <FaGlobeAmericas className="text-5xl text-emerald-200" />,
    description: "Reduce your overall carbon footprint",
    impact: "Fight climate change effectively",
    color: "from-green-600 to-emerald-500",
    iconColor: "text-emerald-100",
  },
];

  const handleContinue = () => {
    if (selectedGoal) {
      onSelectGoal(selectedGoal);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20]">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-[#0A2F1F]/80 backdrop-blur-sm border-b border-green-800/50">
        {/* Logo */}
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

        {/* Right side buttons */}
        <div className="flex gap-3">
          {onViewProgress && (
            <button 
              onClick={onViewProgress}
              className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition font-spartan"
            >
              
              My Progress
            </button>
          )}
          <ProfileDropdown onLogout={onLogout} 
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#2E7D32]/30 rounded-full flex items-center justify-center mx-auto  hover:bg-green-800/30 transition transform hover:scale-[1.02] group">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-12 h-12 text-[#81C784] group-hover:text-white transition"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" 
                  />
                </svg>
              </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-spartan mb-4">
            Choose Your Eco Goal
          </h1>
          <p className="text-green-200 text-lg font-fredoka max-w-2xl mx-auto">
            Select one goal to focus on. GreenHabit's AI will create a personalized
            7-day action plan just for you.
          </p>
        </div>

        {/* Goal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              className={`text-left transition-all duration-300 transform ${
                selectedGoal === goal.id
                  ? "scale-[1.02]"
                  : "hover:scale-[1.01] hover:shadow-xl"
              }`}
            >
            <div className={`bg-gradient-to-br ${goal.color} rounded-2xl p-6 shadow-lg transition-all duration-300 ${
              selectedGoal === goal.id
                ? "ring-2 ring-[#4CAF50] ring-offset-2 ring-offset-[#0A2F1F]"
                : ""
            }`}>
              <div className="flex items-start gap-4">
                <div className="text-5xl transition-transform duration-300 group-hover:scale-105">
                  {goal.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white font-spartan mb-2">
                    {goal.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-3">{goal.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/20 rounded-full px-3 py-1 text-white flex items-center gap-1">
                      <BiSolidLeaf className="text-xs" />
                      {goal.impact}
                    </span>
                  </div>
                </div>
                {/* Check Icon - Smooth animation */}
                <div className={`transition-all duration-300 transform ${
                  selectedGoal === goal.id 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-75"
                }`}>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg 
                      className="w-5 h-5 text-green-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedGoal}
            className={`px-12 py-4 rounded-xl font-bold text-lg font-spartan transition-all transform ${
              selectedGoal
                ? "bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white hover:scale-[1.05] shadow-lg cursor-pointer"
                : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedGoal ? "Generate My AI Plan" : "Select a Goal First"}
          </button>
        </div>

        {/* Motivational Quote */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-green-800/30 rounded-2xl p-6 max-w-2xl border border-green-500/20">
            <p className="text-green-100 italic font-fredoka text-lg">
              "The greatest threat to our planet is the belief that someone else will save it."
            </p>
            <p className="text-green-300 mt-2 text-sm">— Robert Swan</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GoalSelectionPage;