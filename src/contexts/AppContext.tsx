import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { images } from '../assets/images';

export type HelperType = 'Friend' | 'Mentor' | 'Coach' | 'Therapist';
export type TonePreference = 'Gentle' | 'Direct' | 'Encouraging';

export interface Helper {
  calendar_id: string;
  calendar_url: string;
  name: string;
  type: string;
  description: string;
  avatar: string;  
  minutes: number;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  helperType: HelperType;
  tonePreference: TonePreference;
  setHelperType: (type: HelperType) => void;
  setTonePreference: (tone: TonePreference) => void;
  getAIPersonality: () => string;
  helpers: Helper[];
  activeHelper: Helper | null;
  setActiveHelper: (helper: Helper) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helperType, setHelperType] = useState<HelperType>('Mentor');
  const [tonePreference, setTonePreference] = useState<TonePreference>('Gentle');
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [activeHelper, setActiveHelperState] = useState<Helper | null>(null);

  // Fetch staff data from Supabase on component mount
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-staff-list');
        console.log(data);
        if (error) {
          console.error('Error fetching staff:', error);
          toast({ title: 'Failed to load staff data', variant: 'destructive' });
          // Fallback to default helpers if API fails
          setHelpers(defaultHelpers);
          setActiveHelperState(defaultHelpers[0]);
          return;
        }

        if (data?.staff && data.staff.length > 0) {
          setHelpers(data.staff);
          setActiveHelperState(data.staff[0]);
        } else {
          // Fallback to default helpers if no staff data
          setHelpers(defaultHelpers);
          setActiveHelperState(defaultHelpers[0]);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast({ title: 'Failed to load staff data', variant: 'destructive' });
        // Fallback to default helpers
        setHelpers(defaultHelpers);
        setActiveHelperState(defaultHelpers[0]);
      }
    };

    fetchStaffData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const setActiveHelper = (helper: Helper) => {
    console.log('AppContext: Setting active helper to:', helper.name);
    setActiveHelperState(helper);
  };

  const getAIPersonality = () => {
    if (!activeHelper) return '';
    
    const helperBehaviors = {
      'Coaching': 'Provide coaching guidance with empathy and understanding',
      'Therapy': 'Support mental health with gentle, non-judgmental care',
      'Mentoring': 'Guide personal development with practical insights'
    };

    const behavior = helperBehaviors[activeHelper.type as keyof typeof helperBehaviors] || `Act as a ${activeHelper.type} helper`;
    
    return `You are ${activeHelper.name}, a ${activeHelper.type} professional. ${behavior} Always begin responses with empathetic anchors like "It sounds like you're feeling..." or "I can hear that this has been tough for you..." Maintain consistency throughout the session.`;
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        helperType,
        tonePreference,
        setHelperType,
        setTonePreference,
        getAIPersonality,
        helpers,
        activeHelper,
        setActiveHelper
      }}
    >
      {children}
    </AppContext.Provider>
  );
};