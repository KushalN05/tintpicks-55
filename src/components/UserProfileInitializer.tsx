import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SavedColor } from '@/hooks/useHomePage';

interface UserProfileInitializerProps {
  onColorsLoaded: (colors: SavedColor[]) => void;
}

const UserProfileInitializer = ({ onColorsLoaded }: UserProfileInitializerProps) => {
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const initializeUserProfile = async () => {
      if (!session) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to check user profile.",
          variant: "destructive",
        });
        return;
      }

      // If profile doesn't exist (no data returned), create one.
      // Note: the DB trigger handle_new_user() should have done this already,
      // but this is a belt-and-suspenders fallback for existing users.
      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: session.user.id,
            display_name: session.user.email?.split('@')[0] || `User${Math.floor(Math.random() * 1000)}`,
            email: session.user.email ?? '',
            onboarding_completed: false,
          }]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast({
            title: "Error",
            description: "Failed to initialize user profile.",
            variant: "destructive",
          });
          return;
        }
      }

      // Fetch saved colors — include `id` so callers can perform per-row deletes.
      const { data: colors, error: colorsError } = await supabase
        .from('saved_colors')
        .select('id, hex_code')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (colorsError) {
        toast({
          title: "Error",
          description: "Failed to load your saved colors.",
          variant: "destructive",
        });
      } else {
        onColorsLoaded(colors.map(color => ({ id: color.id, hex: color.hex_code })));
      }
    };

    initializeUserProfile();
  }, [session, toast, onColorsLoaded]);

  return null;
};

export default UserProfileInitializer;