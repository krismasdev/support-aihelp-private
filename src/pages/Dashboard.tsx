import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { setProfile } from '@/store/userSlice';

export type DashboardSection = 'home' | 'helper' | 'insights' | 'tools' | 'resources' | 'settings';

export interface UserProfile {
  name: string;
  age: number;
  pronouns: number;
  password: string;
  struggles: string[];
  helperType: string;
  preferredTone: string;
  hasCompletedIntake: boolean;
  avatar_url: string | null;
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: 0,
    pronouns: 1,
    password: '',
    struggles: [],
    helperType: '',
    preferredTone: '',
    hasCompletedIntake: false,
    avatar_url: ''
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      checkUserProfile();
    }
  }, [user, loading, navigate]);

  const checkUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        navigate('/auth');
        return;
      }

      if (data) {
        const profile = {
          name: data.name || 'User',
          age: data.age || 0,
          pronouns: data.pronouns || 1,
          password: '',
          struggles: data.struggles || ['General support'],
          helperType: data.helper_type || 'friend',
          preferredTone: data.preferred_tone || 'gentle',
          hasCompletedIntake: true,
          avatar_url: data.avatar_url || ''
        };
        
        setUserProfile(profile);
        
        dispatch(setProfile({
          id: user?.id || null,
          name: profile.name,
          email: user?.email || '',
          age: profile.age,
          avatar_url: profile.avatar_url,
          helper_type: profile.helperType,
          preferred_tone: profile.preferredTone,
          pronouns: profile.pronouns.toString(),
        }));
      } else {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to /auth in useEffect
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <DashboardSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <DashboardContent 
        activeSection={activeSection} 
        userProfile={userProfile}
      />
    </div>
  );
};

export default Dashboard;