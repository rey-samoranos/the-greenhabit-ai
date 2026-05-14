import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Make sure .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to get user's habit plans
export const getUserHabitPlans = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");
  
  const { data, error } = await supabase
    .from('habit_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Helper function to save a habit plan
export const saveHabitPlan = async (plan: {
  goal: string;
  goal_title: string;
  habits: string[];
  completed_habits: boolean[];
  completed_days: number;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");
  
  const { data, error } = await supabase
    .from('habit_plans')
    .insert([{
      user_id: user.id,
      goal: plan.goal,
      goal_title: plan.goal_title,
      habits: plan.habits,
      completed_habits: plan.completed_habits,
      completed_days: plan.completed_days
    }])
    .select();
  
  if (error) throw error;
  return data;
};

// Helper function to update a habit plan
export const updateHabitPlan = async (id: string, updates: {
  completed_habits?: boolean[];
  completed_days?: number;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");
  
  const { data, error } = await supabase
    .from('habit_plans')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select();
  
  if (error) throw error;
  return data;
};

// Helper function to delete a habit plan
export const deleteHabitPlan = async (id: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");
  
  const { error } = await supabase
    .from('habit_plans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  
  if (error) throw error;
  return true;
};

// Helper function to get a single habit plan by ID
export const getHabitPlanById = async (id: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");
  
  const { data, error } = await supabase
    .from('habit_plans')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  
  if (error) throw error;
  return data;
};

// Helper function to get user's statistics
export const getUserStats = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");
  
  // Get total completed habits
  const { data: plans, error } = await supabase
    .from('habit_plans')
    .select('completed_days, completed_habits')
    .eq('user_id', user.id);
  
  if (error) throw error;
  
  const totalCompleted = plans.reduce((sum, plan) => sum + (plan.completed_days || 0), 0);
  const completedChallenges = plans.filter(plan => plan.completed_days === 7).length;
  
  // Calculate total CO2 saved
  let totalCO2 = 0;
  plans.forEach(plan => {
    // This would need to know the goal type - you may want to store goal in the plan
    // For now, using average calculation
    totalCO2 += (plan.completed_days || 0) * 2.5;
  });
  
  return {
    totalCompletedHabits: totalCompleted,
    completedChallenges: completedChallenges,
    totalCO2Saved: totalCO2.toFixed(1),
    totalPlans: plans.length
  };
};