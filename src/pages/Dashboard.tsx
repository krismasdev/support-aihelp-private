import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { IntakeForm } from '@/components/dashboard/IntakeForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { setProfile } from '@/store/userSlice';
export type DashboardSection = 'home' | 'helper' | 'insights' | 'tools' | 'resources' | 'settings';

export interface UserProfile {
  name: string;
  age: number;
  pronouns: number; // 1 = They/Them, 2 = She/Her, 3 = He/Him
  password: string;
  struggles: string[];
  helperType: string;
  preferredTone: string;
  hasCompletedIntake: boolean;
  avatar_url: string | null; // Avatar URL
}

type AuthState = 'login' | 'onboarding' | 'dashboard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('login');
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');
  const [isDemo, setIsDemo] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: 0,
    pronouns: 1, // Default to They/Them
    password: '',
    struggles: [],
    helperType: '',
    preferredTone: '',
    hasCompletedIntake: false,
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      // Check if user has completed profile
      checkUserProfile();
    } else if (!loading) {
      setAuthState('login');
    }
  }, [user, loading]);

  const checkUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        setAuthState('onboarding');
        return;
      }

      if (data) {
        // User has profile, go to dashboard
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
        
        // Also save to Redux store
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
        
        setAuthState('dashboard');
      } else {
        // No profile, need onboarding
        setAuthState('onboarding');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setAuthState('onboarding');
    }
  };

  const handleLogin = (isNewUser: boolean, isDemoMode: boolean = false) => {
    setIsDemo(isDemoMode);
    
    if (isDemoMode) {
      // Demo users can skip or go through onboarding
      setAuthState('onboarding');
    }
    // For real users, useEffect will handle the flow based on auth state
  };

  const handleIntakeComplete = async (profile: UserProfile) => {
    if (user && !isDemo) {
      // Save profile to database
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            name: profile.name,
            age: profile.age,
            pronouns: profile.pronouns,
            struggles: profile.struggles,
            helper_type: profile.helperType,
            preferred_tone: profile.preferredTone,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving profile:', error);
        }
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
    
    setUserProfile({ ...profile, hasCompletedIntake: true });
    
    // Also save to Redux store
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
    
    setAuthState('dashboard');
  };

  const handleSkipOnboarding = () => {
    // Set default profile when skipping onboarding
    setUserProfile({
      name: user?.email?.split('@')[0] || 'User',
      age: 0,
      pronouns: 1, // They/Them
      password: '',
      struggles: ['General support'],
      helperType: 'friend',
      preferredTone: 'gentle',
      hasCompletedIntake: true,
      avatar_url: null
    });
    setAuthState('dashboard');
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

  if (!user && authState === 'login') {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (authState === 'onboarding') {
    return (
      <IntakeForm 
        onComplete={handleIntakeComplete} 
        onSkip={handleSkipOnboarding}
        isDemo={isDemo}
      />
    );
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