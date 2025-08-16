import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IntakeForm } from '@/components/dashboard/IntakeForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { setProfile } from '@/store/userSlice';

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

type AuthState = 'login' | 'onboarding';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('login');

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
    if (user) {
      checkUserProfile();
    }
  }, [user]);

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
        // User has profile, redirect to dashboard
        navigate('/dashboard');
      } else {
        // No profile, need onboarding
        setAuthState('onboarding');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setAuthState('onboarding');
    }
  };

  const handleLogin = (isNewUser: boolean) => {
    // useEffect will handle the flow based on auth state
  };

  const handleIntakeComplete = async (profile: UserProfile) => {
    if (user) {
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
    
    navigate('/dashboard');
  };

  const handleSkipOnboarding = () => {
    const defaultProfile = {
      name: user?.email?.split('@')[0] || 'User',
      age: 0,
      pronouns: 1,
      password: '',
      struggles: ['General support'],
      helperType: 'friend',
      preferredTone: 'gentle',
      hasCompletedIntake: true,
      avatar_url: null
    };
    
    dispatch(setProfile({
      id: user?.id || null,
      name: defaultProfile.name,
      email: user?.email || '',
      age: defaultProfile.age,
      avatar_url: defaultProfile.avatar_url,
      helper_type: defaultProfile.helperType,
      preferred_tone: defaultProfile.preferredTone,
      pronouns: defaultProfile.pronouns.toString(),
    }));
    
    navigate('/dashboard');
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
      />
    );
  }

  return null;
};

export default Auth;