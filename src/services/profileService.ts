import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';

interface ProfileRow {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export const profileService = {
  getProfile: async (userId: string): Promise<ProfileRow | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },
};
