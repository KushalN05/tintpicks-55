import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/components/onboarding/OnboardingSteps';

export const useOnboarding = () => {
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsNewUser(null);
        return;
      }

      // Check if user has completed onboarding
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profileData);
      // Use the canonical `onboarding_completed` flag now that it exists in types.ts
      setIsNewUser(!profileData?.onboarding_completed);
    } catch (error) {
      console.error('Error checking user status:', error);
      setIsNewUser(true); // Default to new user if there's an error
    }
  };

  const saveOnboardingData = async (data: OnboardingData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      // Upsert profile with all type-safe columns
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: data.name,
          email: user.email ?? '',
          onboarding_completed: true,
        });

      if (profileError) throw profileError;

      // Send welcome email
      await sendWelcomeEmail(user.email!, data.name);

      setIsNewUser(false);
      return true;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      return false;
    }
  };

  const sendWelcomeEmail = async (email: string, name: string) => {
    try {
      // Call Supabase Edge Function for sending email
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: { email, name }
      });

      if (error) {
        console.error('Error sending welcome email:', error);
      }
    } catch (error) {
      console.error('Error calling email function:', error);
    }
  };

  return {
    isNewUser,
    userProfile,
    saveOnboardingData,
    checkUserStatus
  };
};