import React, { useState, useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { FaRecycle, FaTint, FaBolt, FaGlobeAmericas } from 'react-icons/fa';
import { BiSolidLeaf } from 'react-icons/bi';
import { generateHabitPlan } from '../groq';
import { saveHabitPlan } from '../supabase';

interface HabitPlannerProps {
  goal: string;
  onBack: () => void;
  onViewProgress: () => void;
  onLogout: () => void;
  onBackToDashboard?: () => void;
}

const HabitPlanner: React.FC<HabitPlannerProps> = ({ 
  goal, 
  onBack, 
  onViewProgress, 
  onLogout,
  onBackToDashboard 
}) => {
  const [loading, setLoading] = useState(false);
  const [habits, setHabits] = useState<string[] | null>(null);
  const [completedDays, setCompletedDays] = useState<boolean[]>(Array(7).fill(false));
  const [hasSaved, setHasSaved] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const getGoalTitle = () => {
    switch(goal) {
      case "plastic": return "Reduce Plastic";
      case "water": return "Save Water";
      case "energy": return "Lower Energy";
      case "carbon": return "Cut Carbon";
      default: return "Eco Habit";
    }
  };

  const getGoalIcon = () => {
    switch(goal) {
      case "plastic": return <FaRecycle className="text-6xl text-cyan-100" />;
      case "water": return <FaTint className="text-6xl text-sky-100" />;
      case "energy": return <FaBolt className="text-6xl text-yellow-100" />;
      case "carbon": return <FaGlobeAmericas className="text-6xl text-emerald-100" />;
      default: return <BiSolidLeaf className="text-6xl text-green-300" />;
    }
  };

  const getGoalColor = () => {
    switch(goal) {
      case "plastic": return "from-cyan-500 to-blue-500";
      case "water": return "from-sky-400 to-blue-600";
      case "energy": return "from-yellow-500 to-orange-500";
      case "carbon": return "from-emerald-500 to-green-600";
      default: return "from-[#2E7D32] to-[#4CAF50]";
    }
  };

  const completedCount = completedDays.filter(c => c).length;
  const streak = completedDays[0] ? Math.min(completedDays.filter((c, i) => i === 0 || (c && completedDays[i-1])).length, 7) : 0;

  // Save current progress to database
  const saveCurrentProgress = async () => {
    if (!habits) return;
    
    setSaving(true);
    try {
      await saveHabitPlan({
        goal: goal,
        goal_title: getGoalTitle(),
        habits: habits,
        completed_habits: [...completedDays],
        completed_days: completedCount
      });
      
      setHasSaved(true);
      setShowSaveConfirm(true);
      
      setTimeout(() => {
        setShowSaveConfirm(false);
      }, 2000);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Save and navigate to history
  const saveAndGoToHistory = async () => {
    if (!habits) return;
    
    setSaving(true);
    try {
      await saveHabitPlan({
        goal: goal,
        goal_title: getGoalTitle(),
        habits: habits,
        completed_habits: [...completedDays],
        completed_days: completedCount
      });
      
      setHasSaved(true);
      onViewProgress();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveCompletedPlan = async () => {
    if (completedCount === 7 && !hasSaved && habits) {
      await saveCurrentProgress();
    }
  };

  // Generate AI plan
  const generatePlan = async () => {
    setLoading(true);
    try {
      const goalTitle = getGoalTitle();
      const habitsArray = await generateHabitPlan(goalTitle);
      if (habitsArray && habitsArray.length === 7) {
        setHabits(habitsArray);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("AI generation failed:", error);
      const habitsArray = await generateHabitPlan(getGoalTitle());
      setHabits(habitsArray);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (index: number) => {
    const newCompleted = [...completedDays];
    newCompleted[index] = !newCompleted[index];
    setCompletedDays(newCompleted);
  };

  useEffect(() => {
    if (completedCount === 7 && !hasSaved && habits) {
      saveCompletedPlan();
    }
  }, [completedCount, hasSaved, habits]);

  const handleGeneratePlan = () => {
    setHabits(null);
    setCompletedDays(Array(7).fill(false));
    setHasSaved(false);
    generatePlan();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">
            {getGoalIcon()}
          </div>
          <h2 className="text-white text-2xl font-spartan">AI is creating your personalized plan...</h2>
          <p className="text-green-300 mt-2 font-fredoka">This will just take a moment</p>
        </div>
      </div>
    );
  }

  // Generate Plan Page
  if (!habits && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20]">
        <nav className="flex justify-between items-center px-8 py-5 bg-[#0A2F1F]/80 backdrop-blur-sm border-b border-green-800/50">
          <div className="flex items-center gap-3">
            <img 
              src="/glogo.png" 
              alt="GreenHabit Logo"
              className="w-10 h-10 rounded-lg shadow-lg object-cover"
            />
            <span className="text-2xl font-bold font-spartan">
              <span className="text-white">Green</span>
              <span className="text-[#66BB6A]">Habit</span>
            </span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onViewProgress}
              className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition font-spartan"
            >
              My Progress
            </button>
            <button 
              onClick={onBackToDashboard}
              className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition font-spartan"
            >
              Back to Dashboard
            </button>
            <ProfileDropdown onLogout={onLogout} />
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className={`bg-gradient-to-br ${getGoalColor()} rounded-2xl p-12 shadow-2xl border border-white/20`}>
            <div className="flex justify-center mb-6">
              <div className="text-6xl drop-shadow-lg">
                {getGoalIcon()}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white font-spartan mb-4">
              Generate Your AI Plan
            </h1>
            <p className="text-white/90 text-lg mb-8 font-fredoka">
              Goal: <span className="font-bold text-white">{getGoalTitle()}</span>
            </p>
            <p className="text-white/80 mb-8 font-fredoka">
              Our AI will create a personalized 7-day action plan tailored to help you
              build sustainable habits that actually stick.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGeneratePlan}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition shadow-md text-lg font-spartan border border-white/30"
              >
                Generate My AI Plan
              </button>
              <button
                onClick={onBackToDashboard}
                className="px-8 py-3 bg-transparent border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition shadow-md text-lg font-spartan"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Habit Planner Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20]">
      <nav className="flex justify-between items-center px-8 py-5 bg-[#0A2F1F]/80 backdrop-blur-sm border-b border-green-800/50">
        <div className="flex items-center gap-3">
          <img 
            src="/glogo.png" 
            alt="GreenHabit Logo"
            className="w-10 h-10 rounded-lg shadow-lg object-cover"
          />
          <span className="text-2xl font-bold font-spartan">
            <span className="text-white">Green</span>
            <span className="text-[#66BB6A]">Habit</span>
          </span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onViewProgress}
            className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition font-spartan"
          >
            My Progress
          </button>
          <button 
            onClick={onBack}
            className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition font-spartan"
          >
            New Goal
          </button>
          <button 
            onClick={onBackToDashboard}
            className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition font-spartan"
          >
            Back to Dashboard
          </button>
          <ProfileDropdown onLogout={onLogout} />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className={`bg-gradient-to-br ${getGoalColor()} rounded-2xl p-8 shadow-2xl border border-white/20`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-8 h-8 text-white"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white font-spartan">
              Your 7-Day {getGoalTitle()} Plan
            </h1>
            <p className="text-white/80 mt-2 font-fredoka">
              Check off each habit as you complete it. You've got this! 
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex justify-center mb-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-8 h-8 text-white"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white">{completedCount}/7</div>
              <div className="text-white/70 text-sm font-fredoka">Habits Completed</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex justify-center mb-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-8 h-8 text-white"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-white/70 text-sm font-fredoka">Day Streak</div>
            </div>
          </div>

          {/* Habit List */}
          <div className="space-y-3 mb-8">
            {habits?.map((habit, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.01] ${
                  completedDays[index]
                    ? "bg-white/20 backdrop-blur-sm border border-white/30"
                    : "bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-white/10"
                }`}
                onClick={() => toggleDay(index)}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  completedDays[index] 
                    ? "bg-white border-white" 
                    : "border-white/60 hover:border-white"
                }`}>
                  {completedDays[index] && <span className="text-green-600 text-xs font-bold">✓</span>}
                </div>
                <span className={`flex-1 font-fredoka transition-all duration-300 ${
                  completedDays[index] ? "text-white/60 line-through" : "text-white"
                }`}>
                  {habit}
                </span>
                <span className="text-white/50 text-sm font-fredoka">Day {index + 1}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-white/70 mb-2 font-fredoka">
              <span>Overall Progress</span>
              <span>{Math.round((completedCount / 7) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Save Confirmation Toast */}
          {showSaveConfirm && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slideUp z-50">
              ✓ Progress saved successfully!
            </div>
          )}

          {/* Save Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={saveCurrentProgress}
              disabled={saving}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition shadow-md font-spartan border border-white/30 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              )}
              {saving ? "Saving..." : "Save My Progress"}
            </button>
            <button
              onClick={saveAndGoToHistory}
              disabled={saving}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition shadow-md font-spartan border border-white/30 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              Save & View Progress
            </button>
          </div>

          {/* Completion Message */}
          {completedCount === 7 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center animate-slideUp">
              <span className="text-4xl block mb-2">🏆</span>
              <h3 className="text-white font-bold text-xl font-spartan">Congratulations!</h3>
              <p className="text-white/80 mt-2 font-fredoka">
                You completed all 7 habits! You're making a real difference for our planet.
              </p>
              <p className="text-white/60 text-sm mt-1 font-fredoka">
                This achievement has been saved to your progress history.
              </p>
              <div className="flex gap-3 justify-center mt-4">
                <button
                  onClick={onViewProgress}
                  className="px-6 py-2 bg-white/30 rounded-lg text-white font-semibold hover:bg-white/40 transition font-spartan"
                >
                  View My Progress
                </button>
                <button
                  onClick={onBack}
                  className="px-6 py-2 bg-white/20 rounded-lg text-white font-semibold hover:bg-white/30 transition font-spartan"
                >
                  Start a New Goal
                </button>
              </div>
            </div>
          )}

          {/* Motivational Tip */}
          {completedCount > 0 && completedCount < 7 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <p className="text-white/80 text-sm font-fredoka">
                {completedCount === 1 ? "Great start! Every habit counts." :
                   completedCount === 2 ? "You're building momentum! Keep going." :
                   completedCount === 3 ? "Halfway there? You're doing amazing!" :
                   completedCount === 4 ? "Over halfway! You've got this!" :
                   completedCount === 5 ? "Almost there! The finish line is near!" :
                   "So close! One more push!"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HabitPlanner;