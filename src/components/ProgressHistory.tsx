import React, { useState, useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { FaRecycle, FaTint, FaBolt, FaGlobeAmericas } from 'react-icons/fa';
import { BiSolidLeaf } from 'react-icons/bi';
import { createPortal } from "react-dom";
import { getUserHabitPlans, updateHabitPlan, deleteHabitPlan } from '../supabase';

interface ProgressHistoryProps {
  onBack: () => void;
  onLogout: () => void;
}

interface SavedPlan {
  id: string;
  goal: string;
  goalTitle: string;
  startDate: string;
  completedDays: number;
  totalDays: number;
  habits: string[];
  completedHabits: boolean[];
  created_at?: string;
}

const ProgressHistory: React.FC<ProgressHistoryProps> = ({ onBack, onLogout }) => {
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompleted, setEditingCompleted] = useState<boolean[]>([]);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SavedPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved plans from Supabase on component mount
  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const plans = await getUserHabitPlans();
        // Convert database format to component format
        const formattedPlans = plans.map((plan: any) => ({
          id: plan.id,
          goal: plan.goal,
          goalTitle: plan.goal_title,
          startDate: new Date(plan.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          completedDays: plan.completed_days,
          totalDays: 7,
          habits: plan.habits,
          completedHabits: plan.completed_habits,
          created_at: plan.created_at
        }));
        setSavedPlans(formattedPlans);
      } catch (error) {
        console.error("Failed to load plans:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const getGoalIcon = (goal: string) => {
    switch(goal) {
      case "plastic": return <FaRecycle className="text-3xl text-cyan-200" />;
      case "water": return <FaTint className="text-3xl text-sky-200" />;
      case "energy": return <FaBolt className="text-3xl text-yellow-200" />;
      case "carbon": return <FaGlobeAmericas className="text-3xl text-emerald-200" />;
      default: return <BiSolidLeaf className="text-3xl text-green-300" />;
    }
  };

  const getGoalColor = (goal: string) => {
    switch(goal) {
      case "plastic": return "from-cyan-500 to-blue-500";
      case "water": return "from-sky-400 to-blue-600";
      case "energy": return "from-yellow-500 to-orange-500";
      case "carbon": return "from-emerald-500 to-green-600";
      default: return "from-[#2E7D32] to-[#4CAF50]";
    }
  };

  const calculateImpact = (plan: SavedPlan) => {
    const completedCount = plan.completedHabits.filter(c => c).length;
    if (plan.goal === "plastic") {
      const itemsSaved = completedCount * 2;
      return `~${itemsSaved} plastic items saved from ocean`;
    }
    if (plan.goal === "water") {
      const gallonsSaved = completedCount * 5;
      return `~${gallonsSaved} gallons of water conserved`;
    }
    if (plan.goal === "energy") {
      const kwhSaved = completedCount * 3;
      return `~${kwhSaved} kWh of energy saved`;
    }
    if (plan.goal === "carbon") {
      const co2Saved = completedCount * 2.5;
      return `~${co2Saved.toFixed(1)} kg CO2 emissions avoided`;
    }
    return "Positive environmental impact";
  };

  const toggleEditHabit = (index: number) => {
    const newCompleted = [...editingCompleted];
    newCompleted[index] = !newCompleted[index];
    setEditingCompleted(newCompleted);
  };

  const saveEditedProgress = async () => {
    if (selectedPlan) {
      try {
        const updatedPlan = {
          completed_habits: [...editingCompleted],
          completed_days: editingCompleted.filter(c => c).length
        };
        
        await updateHabitPlan(selectedPlan.id, updatedPlan);
        
        // Update local state
        const updatedPlans = savedPlans.map(plan => 
          plan.id === selectedPlan.id ? {
            ...plan,
            completedHabits: [...editingCompleted],
            completedDays: editingCompleted.filter(c => c).length
          } : plan
        );
        
        setSavedPlans(updatedPlans);
        setSelectedPlan({
          ...selectedPlan,
          completedHabits: [...editingCompleted],
          completedDays: editingCompleted.filter(c => c).length
        });
        setIsEditing(false);
        setShowSaveConfirmModal(true);
        
        setTimeout(() => {
          setShowSaveConfirmModal(false);
        }, 2000);
        
      } catch (error) {
        console.error("Save failed:", error);
        alert("Failed to save changes. Please try again.");
      }
    }
  };

  // Save Confirmation Modal Component
  const SaveConfirmModal = () => {
    if (!showSaveConfirmModal) return null;
    
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
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-white font-spartan mb-3">Progress Saved!</h3>
            <p className="text-green-200 text-base mb-6 font-fredoka">
              Your habit progress has been updated successfully.
            </p>
            
            <button
              onClick={() => setShowSaveConfirmModal(false)}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white font-semibold rounded-xl hover:from-[#1B5E20] hover:to-[#2E7D32] transition font-spartan shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Clear History Confirmation Modal Component
  const ClearConfirmModal = () => {
    if (!showClearConfirmModal) return null;
    
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
            
            <h3 className="text-2xl font-bold text-white font-spartan mb-3">Clear All History?</h3>
            <p className="text-red-200 text-base mb-6 font-fredoka">
              Are you sure you want to clear all your progress history?<br />
              <span className="text-red-300/80">This action cannot be undone!</span>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={confirmClearHistory}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition font-spartan shadow-lg"
              >
                Yes, Clear All
              </button>
              <button
                onClick={cancelClearHistory}
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

  // Delete Plan Confirmation Modal Component
  const DeleteConfirmModal = () => {
    if (!showDeleteConfirmModal) return null;
    
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-white font-spartan mb-3">Delete Challenge?</h3>
            <p className="text-red-200 text-base mb-4 font-fredoka">
              Are you sure you want to delete "{planToDelete?.goalTitle}" challenge?
            </p>
            <p className="text-red-300/80 text-sm mb-6 font-fredoka">
              This action cannot be undone!
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={confirmDeletePlan}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition font-spartan shadow-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDeletePlan}
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

  const totalCompleted = savedPlans.reduce((sum, plan) => sum + plan.completedDays, 0);
  const totalHabits = savedPlans.reduce((sum, plan) => sum + plan.totalDays, 0);
  const overallProgress = totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;
  const completedPlans = savedPlans.filter(p => p.completedDays === p.totalDays).length;

  const handleClearHistoryClick = () => {
    setShowClearConfirmModal(true);
  };

  const confirmClearHistory = async () => {
    try {
      for (const plan of savedPlans) {
        await deleteHabitPlan(plan.id);
      }
      setSavedPlans([]);
      setShowClearConfirmModal(false);
    } catch (error) {
      console.error("Failed to clear history:", error);
      alert("Failed to clear history. Please try again.");
    }
  };

  const cancelClearHistory = () => {
    setShowClearConfirmModal(false);
  };

  // Individual plan deletion handlers
  const handleDeletePlanClick = (plan: SavedPlan) => {
    setPlanToDelete(plan);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeletePlan = async () => {
    if (planToDelete) {
      try {
        await deleteHabitPlan(planToDelete.id);
        setSavedPlans(savedPlans.filter(p => p.id !== planToDelete.id));
        setShowDeleteConfirmModal(false);
        setPlanToDelete(null);
      } catch (error) {
        console.error("Failed to delete plan:", error);
        alert("Failed to delete plan. Please try again.");
      }
    }
  };

  const cancelDeletePlan = () => {
    setShowDeleteConfirmModal(false);
    setPlanToDelete(null);
  };

  const handleEditPlan = (plan: SavedPlan) => {
    setSelectedPlan(plan);
    setEditingCompleted([...plan.completedHabits]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedPlan(null);
  };

  const viewPlanDetails = (plan: SavedPlan) => {
    setSelectedPlan(plan);
    setIsEditing(false);
  };

  const backToList = () => {
    setSelectedPlan(null);
    setIsEditing(false);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-5xl mb-4">🌿</div>
          <h2 className="text-white text-2xl font-spartan">Loading your progress...</h2>
        </div>
      </div>
    );
  }

  // Detailed Plan View (Read-only or Edit Mode)
  if (selectedPlan) {
    const completedCount = isEditing ? editingCompleted.filter(c => c).length : selectedPlan.completedHabits.filter(c => c).length;
    const successRate = Math.round((completedCount / selectedPlan.totalDays) * 100);
    
    return (
      <>
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
                onClick={backToList}
                className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition font-spartan"
              >
                Back to History
              </button>
              <ProfileDropdown onLogout={onLogout} />
            </div>
          </nav>

          <main className="max-w-4xl mx-auto px-6 py-12">
            <div className={`bg-gradient-to-br ${getGoalColor(selectedPlan.goal)} rounded-2xl p-8 shadow-2xl border border-white/20`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {getGoalIcon(selectedPlan.goal)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white font-spartan">
                      {selectedPlan.goalTitle} Challenge
                    </h1>
                    <p className="text-white/80 font-fredoka">Started {selectedPlan.startDate}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleEditPlan(selectedPlan)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition font-spartan flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Edit Progress
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-white">{completedCount}/{selectedPlan.totalDays}</div>
                  <div className="text-white/70 text-sm font-fredoka">Days Completed</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-white">{successRate}%</div>
                  <div className="text-white/70 text-sm font-fredoka">Success Rate</div>
                </div>
              </div>

              {/* Habit List */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white font-spartan mb-4">Daily Habits</h3>
                <div className="space-y-3">
                  {selectedPlan.habits.map((habit, idx) => {
                    const isCompleted = isEditing ? editingCompleted[idx] : selectedPlan.completedHabits[idx];
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                          isCompleted
                            ? "bg-white/20 backdrop-blur-sm border border-white/30"
                            : "bg-black/20 backdrop-blur-sm border border-white/20"
                        } ${isEditing ? "cursor-pointer hover:bg-white/10" : ""}`}
                        onClick={() => isEditing && toggleEditHabit(idx)}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? "bg-white border-white" 
                            : "border-white/60"
                        }`}>
                          {isCompleted && <span className="text-green-600 text-xs font-bold">✓</span>}
                        </div>
                        <span className={`flex-1 font-fredoka transition-all duration-300 ${
                          isCompleted ? "text-white/60 line-through" : "text-white"
                        }`}>
                          {habit}
                        </span>
                        <span className="text-white/50 text-sm font-fredoka">Day {idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Impact Section */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white font-spartan mb-2 flex items-center gap-2">
                  <span>🌍</span> Your Impact
                </h3>
                <p className="text-white/80 font-fredoka">{calculateImpact(selectedPlan)}</p>
                {completedCount === selectedPlan.totalDays && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-yellow-400 text-xl">🏆</span>
                    <span className="text-green-100 font-semibold font-fredoka">Challenge Completed!</span>
                  </div>
                )}
              </div>

              {/* Edit Mode Buttons */}
              {isEditing && (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={saveEditedProgress}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition font-spartan flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-6 py-3 bg-red-600/50 text-white font-semibold rounded-xl hover:bg-red-700/50 transition font-spartan"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
        
        {/* Save Confirmation Modal */}
        <SaveConfirmModal />
      </>
    );
  }

  // Main Progress History View
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
            onClick={onBack}
            className="px-6 py-2.5 bg-transparent border border-green-400 text-white font-semibold rounded-lg hover:bg-green-800/30 transition font-spartan"
          >
            Back to Dashboard
          </button>
          {savedPlans.length > 0 && (
            <button 
              onClick={handleClearHistoryClick}
              className="px-6 py-2.5 bg-transparent border border-red-400 text-red-400 font-semibold rounded-lg hover:bg-red-500/10 transition font-spartan"
            >
              Clear All
            </button>
          )}
          <ProfileDropdown onLogout={onLogout} />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Summary */}
        {savedPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-800/40 to-green-900/30 rounded-2xl p-6 text-center border border-green-500/30">
              <div className="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white">{overallProgress}%</div>
              <div className="text-green-300 text-sm font-fredoka">Overall Progress</div>
            </div>
            <div className="bg-gradient-to-br from-green-800/40 to-green-900/30 rounded-2xl p-6 text-center border border-green-500/30">
              <div className="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white">{totalCompleted}</div>
              <div className="text-green-300 text-sm font-fredoka">Total Habits Completed</div>
            </div>
            <div className="bg-gradient-to-br from-green-800/40 to-green-900/30 rounded-2xl p-6 text-center border border-green-500/30">
              <div className="flex justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white">{completedPlans}</div>
              <div className="text-green-300 text-sm font-fredoka">Completed Challenges</div>
            </div>
          </div>
        )}

        {/* History Timeline */}
        {savedPlans.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-white font-spartan mb-6 flex items-center gap-2">
              Your Timeline
            </h2>
            
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-500/30"></div>
              
              <div className="space-y-6">
                {[...savedPlans].reverse().map((plan) => {
                  const progress = Math.round((plan.completedDays / plan.totalDays) * 100);
                  const isCompleted = plan.completedDays === plan.totalDays;
                  
                  return (
                    <div key={plan.id} className="relative flex gap-4">
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted 
                          ? "bg-gradient-to-br from-yellow-500 to-orange-500" 
                          : "bg-gradient-to-br from-[#2E7D32] to-[#4CAF50]"
                      }`}>
                        <span className="text-xl">
                          {isCompleted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                            </svg>
                          ) : (
                            getGoalIcon(plan.goal)
                          )}
                        </span>
                      </div>
                      
                      <div 
                        className="flex-1 bg-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 hover:bg-green-800/30 transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 cursor-pointer" onClick={() => viewPlanDetails(plan)}>
                            <h3 className="text-xl font-bold text-white font-spartan">{plan.goalTitle}</h3>
                            <p className="text-green-300 text-sm font-fredoka">Started {plan.startDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold font-fredoka ${
                              isCompleted 
                                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50" 
                                : "bg-green-500/20 text-green-300"
                            }`}>
                              {isCompleted ? "Completed! 🎉" : `${progress}% Done`}
                            </div>
                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlanClick(plan);
                              }}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                              title="Delete this challenge"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-3 cursor-pointer" onClick={() => viewPlanDetails(plan)}>
                          <div className="flex justify-between text-sm text-green-300 mb-1 font-fredoka">
                            <span>Progress</span>
                            <span>{plan.completedDays}/{plan.totalDays} days</span>
                          </div>
                          <div className="w-full bg-green-900/50 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <p className="text-green-200 text-sm font-fredoka cursor-pointer" onClick={() => viewPlanDetails(plan)}>
                          {calculateImpact(plan)}
                        </p>
                        
                        <button 
                          onClick={() => viewPlanDetails(plan)}
                          className="mt-3 text-[#81C784] text-sm hover:text-white transition font-fredoka"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motivational Message */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-green-800/30 rounded-2xl p-6 border border-green-500/20">
                <p className="text-green-100 font-fredoka">
                  Every small habit adds up to big change. Keep going!
                </p>
                <p className="text-green-300 text-sm mt-2 font-fredoka">
                  Total estimated CO2 saved: ~{(totalCompleted * 2.5).toFixed(1)} kg
                </p>
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="flex justify-center mb-4 animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-[#81C784]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white font-spartan mb-2">No Challenges Yet</h3>
            <p className="text-green-300 font-fredoka">Start your first eco challenge to see your progress here!</p>
            <button 
              onClick={onBack}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white font-semibold rounded-lg hover:from-[#1B5E20] hover:to-[#2E7D32] transition font-spartan"
            >
              Start a Challenge
            </button>
          </div>
        )}
      </main>
      
      {/* Modals */}
      <ClearConfirmModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default ProgressHistory;