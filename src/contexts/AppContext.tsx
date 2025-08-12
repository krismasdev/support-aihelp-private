import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export type HelperType = 'Friend' | 'Mentor' | 'Coach' | 'Therapist';
export type TonePreference = 'Gentle' | 'Direct' | 'Encouraging';

export interface Helper {
  id: string;
  name: string;
  type: string;
  description: string;
  tone: TonePreference;
  interactionStyle: string;
  focus: string;
  isDefault: boolean;
  createdAt: Date;
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
  addHelper: (helper: Omit<Helper, 'id' | 'createdAt' | 'isDefault'>) => void;
  updateHelper: (id: string, updates: Partial<Helper>) => void;
  deleteHelper: (id: string) => void;
}

const defaultHelpers: Helper[] = [
  {
    id: '1',
    name: 'Spiritual Guide',
    type: 'Spiritual Guide',
    description: 'Provides spiritual guidance and mindfulness support',
    tone: 'Gentle',
    interactionStyle: 'meditative',
    focus: 'mindfulness',
    isDefault: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Relationship Coach',
    type: 'Relationship Coach',
    description: 'Helps with relationship advice and communication',
    tone: 'Encouraging',
    interactionStyle: 'supportive',
    focus: 'guidance',
    isDefault: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Mental Wellness Helper',
    type: 'Mental Wellness Helper',
    description: 'Supports mental health and emotional wellbeing',
    tone: 'Gentle',
    interactionStyle: 'supportive',
    focus: 'listening',
    isDefault: true,
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Career Coach',
    type: 'Career Coach',
    description: 'Provides career guidance and professional development',
    tone: 'Direct',
    interactionStyle: 'practical',
    focus: 'guidance',
    isDefault: true,
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'Friend & Advisor',
    type: 'Friend & Advisor',
    description: 'Casual conversation and friendly advice',
    tone: 'Encouraging',
    interactionStyle: 'conversational',
    focus: 'listening',
    isDefault: true,
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'Health Consultant',
    type: 'Health Consultant',
    description: 'Wellness and health-related guidance',
    tone: 'Direct',
    interactionStyle: 'practical',
    focus: 'guidance',
    isDefault: true,
    createdAt: new Date()
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helperType, setHelperType] = useState<HelperType>('Mentor');
  const [tonePreference, setTonePreference] = useState<TonePreference>('Gentle');
  const [helpers, setHelpers] = useState<Helper[]>(defaultHelpers);
  const [activeHelper, setActiveHelperState] = useState<Helper | null>(defaultHelpers[0]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const setActiveHelper = (helper: Helper) => {
    console.log('AppContext: Setting active helper to:', helper.name, helper.id);
    setActiveHelperState(helper);
  };

  const addHelper = async (helperData: Omit<Helper, 'id' | 'createdAt' | 'isDefault'>) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Please log in to create a helper', variant: 'destructive' });
        return;
      }

      // Call the create-helper edge function
      const { data, error } = await supabase.functions.invoke('create-helper', {
        body: {
          name: helperData.name,
          type: helperData.type,
          description: helperData.description,
          tone: helperData.tone,
          interactionStyle: helperData.interactionStyle,
          focus: helperData.focus,
          userId: user.id
        }
      });

      if (error) {
        console.error('Error creating helper:', error);
        toast({ title: 'Failed to create helper', variant: 'destructive' });
        return;
      }

      if (data?.success && data?.helper) {
        // Convert the database response to our Helper format
        const newHelper: Helper = {
          id: data.helper.id,
          name: data.helper.name,
          type: data.helper.type,
          description: data.helper.description || '',
          tone: data.helper.tone as TonePreference,
          interactionStyle: data.helper.interaction_style,
          focus: data.helper.focus,
          isDefault: data.helper.is_default || false,
          createdAt: new Date(data.helper.created_at)
        };

        setHelpers(prev => [...prev, newHelper]);
        toast({ title: 'Helper created successfully!' });
      } else {
        toast({ title: 'Failed to create helper', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error creating helper:', error);
      toast({ title: 'Failed to create helper', variant: 'destructive' });
    }
  };

  const updateHelper = (id: string, updates: Partial<Helper>) => {
    setHelpers(prev => prev.map(helper => 
      helper.id === id ? { ...helper, ...updates } : helper
    ));
    if (activeHelper?.id === id) {
      setActiveHelperState(prev => prev ? { ...prev, ...updates } : null);
    }
    toast({ title: 'Helper updated successfully!' });
  };

  const deleteHelper = (id: string) => {
    const helper = helpers.find(h => h.id === id);
    if (helper?.isDefault) {
      toast({ title: 'Cannot delete default helpers', variant: 'destructive' });
      return;
    }
    setHelpers(prev => prev.filter(helper => helper.id !== id));
    if (activeHelper?.id === id) {
      setActiveHelperState(helpers[0]);
    }
    toast({ title: 'Helper deleted successfully!' });
  };

  const getAIPersonality = () => {
    if (!activeHelper) return '';
    
    const helperBehaviors = {
      'Spiritual Guide': 'Provide spiritual guidance with wisdom and compassion',
      'Relationship Coach': 'Offer relationship advice with empathy and understanding',
      'Mental Wellness Helper': 'Support mental health with gentle, non-judgmental care',
      'Career Coach': 'Guide professional development with practical insights',
      'Friend & Advisor': 'Be a supportive friend offering casual advice',
      'Health Consultant': 'Provide wellness guidance with health-focused insights'
    };

    const toneStyles = {
      Gentle: 'Use soft phrasing. Avoid abrupt or overly direct suggestions.',
      Direct: 'Be clear, respectful, and concise. Get to the point without sounding harsh.',
      Encouraging: 'Use positive, uplifting language and affirm the user\'s efforts.'
    };

    const behavior = helperBehaviors[activeHelper.type as keyof typeof helperBehaviors] || `Act as a ${activeHelper.type} helper`;
    
    return `You are ${activeHelper.name}, a ${activeHelper.type}. ${behavior} Your interaction style is ${activeHelper.interactionStyle} and you focus on ${activeHelper.focus}. Tone: ${activeHelper.tone} - ${toneStyles[activeHelper.tone]} Always begin responses with empathetic anchors like "It sounds like you're feeling..." or "I can hear that this has been tough for you..." Maintain consistency throughout the session.`;
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
        setActiveHelper,
        addHelper,
        updateHelper,
        deleteHelper
      }}
    >
      {children}
    </AppContext.Provider>
  );
};