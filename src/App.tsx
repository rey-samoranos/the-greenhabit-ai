import React, { useState, useEffect } from "react";
import WelcomePage from "./components/WelcomePage";
import GoalSelectionPage from "./components/GoalSelectionPage";
import HabitPlanner from "./components/HabitPlanner";
import ProgressHistory from "./components/ProgressHistory";
import { supabase } from "./supabase";

function App() {
  const [currentPage, setCurrentPage] = useState<"welcome" | "goal" | "planner" | "progress">("welcome");
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // If user is authenticated, redirect to goal page
      if (session) {
        setCurrentPage("goal");
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setCurrentPage("goal");
      } else {
        setCurrentPage("welcome");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("goal");
  };

  const handleSignUpSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("goal");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentPage("welcome");
  };

  const handleGoalSelected = (goal: string) => {
    setSelectedGoal(goal);
    setCurrentPage("planner");
  };

  const handleBackToGoals = () => {
    setCurrentPage("goal");
  };

  const handleViewProgress = () => {
    setCurrentPage("progress");
  };

  const handleBackFromProgress = () => {
    setCurrentPage("goal");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("goal");
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2F1F] to-[#1B5E20] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-5xl mb-4">🌿</div>
          <h2 className="text-white text-2xl font-spartan">Loading...</h2>
        </div>
      </div>
    );
  }

  // Show Goal Selection Page (after login)
  if (currentPage === "goal") {
    return (
      <GoalSelectionPage 
        onSelectGoal={handleGoalSelected} 
        onViewProgress={handleViewProgress}
        onLogout={handleLogout}
      />
    );
  }

  // Show Habit Planner Page
  if (currentPage === "planner") {
    return (
      <HabitPlanner 
        goal={selectedGoal} 
        onBack={handleBackToGoals} 
        onViewProgress={handleViewProgress}
        onLogout={handleLogout}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  // Show Progress History Page
  if (currentPage === "progress") {
    return (
      <ProgressHistory 
        onBack={handleBackFromProgress}
        onLogout={handleLogout}
      />
    );
  }

  // Show Welcome Page (default / not logged in)
  return (
    <WelcomePage 
      onLoginSuccess={handleLoginSuccess}
      onSignUpSuccess={handleSignUpSuccess}
    />
  );
}

export default App;