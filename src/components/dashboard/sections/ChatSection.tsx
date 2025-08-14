import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Mic, Pause, BookOpen, Phone, Wrench, Package, Loader2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { VoiceCallDialog } from '../voice/VoiceCallDialog';
import { selectUserId } from '@/store/userSlice';
import { fetchHelpers, selectHelpers, selectDefaultHelper } from '@/store/helperSlice';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  name: string;
  age: number;
  location: string;
  goals: string[];
  challenges: string[];
}

interface ChatSectionProps {
  userProfile: UserProfile;
}

interface Message {
  id: number;
  sender: 'user' | 'helper';
  content: string;
  time: string;
  helperId: string;
}

const empathicAnchors = [
  "It sounds like you're feeling",
  "I can hear that this has been tough for you",
  "That makes a lot of sense. Thanks for sharing that",
  "I'm here with you through this",
  "It seems like this has been weighing on you"
];

const helperIcons: Record<string, string> = {
  'Spiritual Guide': '🙏',
  'Relationship Coach': '💕',
  'Mental Wellness Helper': '🧠',
  'Career Coach': '💼',
  'Friend & Advisor': '👥',
  'Health Consultant': '🏥'
};

const helperResponses = {
  'Spiritual Guide': [
    "Let's take a moment to breathe together and find your center.",
    "What does your inner wisdom tell you about this situation?",
    "Sometimes the universe presents challenges to help us grow.",
    "Have you tried meditation or mindfulness practices for this?"
  ],
  'Relationship Coach': [
    "Communication is key in any relationship. How have you expressed this?",
    "What patterns do you notice in your relationships?",
    "It's important to set healthy boundaries. How does that feel?",
    "Love starts with self-compassion. How are you treating yourself?"
  ],
  'Mental Wellness Helper': [
    "Your feelings are completely valid. Thank you for sharing.",
    "What coping strategies have helped you in the past?",
    "It's okay to not be okay. You're taking the right steps.",
    "How has your sleep and self-care been lately?"
  ],
  'Career Coach': [
    "Let's break this down into actionable steps you can take.",
    "What skills do you want to develop to reach your goals?",
    "Every challenge is an opportunity for professional growth.",
    "What would success look like for you in this situation?"
  ],
  'Friend & Advisor': [
    "I'm here for you, no matter what. What's really going on?",
    "You know I've got your back. What do you need right now?",
    "That sounds really tough. Want to talk through it?",
    "You're stronger than you think. I believe in you."
  ],
  'Health Consultant': [
    "Your physical and mental health are interconnected. How are you feeling?",
    "What does your daily routine look like right now?",
    "Small, consistent changes can make a big difference.",
    "Have you considered how stress might be affecting your body?"
  ]
};

export const ChatSection = ({ userProfile }: ChatSectionProps) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const helpers = useSelector(selectHelpers);
  const defaultHelper = useSelector(selectDefaultHelper);

  const { activeHelper, setActiveHelper } = useAppContext();

  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [selectingHelperId, setSelectingHelperId] = useState<string | null>(null);

  // Sync context activeHelper with Redux defaultHelper after helpers are loaded
  useEffect(() => {
    if (defaultHelper && (!activeHelper || activeHelper.id !== defaultHelper.id)) {
      setActiveHelper(defaultHelper);
    }
  }, [defaultHelper, activeHelper, setActiveHelper]);

  useEffect(() => {
    if (!isInitialized && helpers.length > 0) {
      const initialMessages: Record<string, Message[]> = {};
      helpers.forEach(helper => {
        initialMessages[helper.id] = [{
          id: Date.now() + Math.random(),
          sender: 'helper',
          content: `Hi ${userProfile.name}! I'm ${helper.name}, your ${helper.type}. How can I support you today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          helperId: helper.id
        }];
      });
      setAllMessages(initialMessages);
      setIsInitialized(true);
    }
  }, [helpers, userProfile.name, isInitialized]);

  const currentMessages = activeHelper ? (allMessages[activeHelper.id] || []) : [];

  const generateHelperResponse = (userMessage: string, helper: any) => {
    const anchor = empathicAnchors[Math.floor(Math.random() * empathicAnchors.length)];
    const responses = helperResponses[helper.type as keyof typeof helperResponses] || [
      "I'm here to help you work through this."
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    return `${anchor}... ${response}`;
  };

  const sendMessage = () => {
    if (message.trim() && activeHelper) {
      const newMessage: Message = {
        id: Date.now(),
        sender: 'user',
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        helperId: activeHelper.id
      };
      
      setAllMessages(prev => ({
        ...prev,
        [activeHelper.id]: [...(prev[activeHelper.id] || []), newMessage]
      }));
      
      const userMsg = message;
      setMessage('');
      
      setTimeout(() => {
        const helperResponse: Message = {
          id: Date.now() + 1,
          sender: 'helper',
          content: generateHelperResponse(userMsg, activeHelper),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          helperId: activeHelper.id
        };
        
        setAllMessages(prev => ({
          ...prev,
          [activeHelper.id]: [...(prev[activeHelper.id] || []), helperResponse]
        }));
      }, 1000);
    }
  };

  const handleHelperSwitch = async (helper: any) => {
    if (!userId || selectingHelperId) return;
    setSelectingHelperId(helper.id);
    
    try {
      await supabase.functions.invoke('set-default-helper', {
        body: {
          helper_id: helper.id,
          user_id: userId
        }
      });
      setActiveHelper(helper);
    } catch (error) {
      console.error('Error setting default helper:', error);
    } finally {
      setSelectingHelperId(null);
    }

    if (!allMessages[helper.id]) {
      setAllMessages(prev => ({
        ...prev,
        [helper.id]: [{
          id: Date.now() + Math.random(),
          sender: 'helper',
          content: `Hi ${userProfile.name}! I'm ${helper.name}, your ${helper.type}. How can I support you today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          helperId: helper.id
        }]
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-indigo-900 mb-2">
            Hi {userProfile.name}, how are you feeling today?
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">Talking to:</p>
            {activeHelper && (
              <>
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <span>{helperIcons[activeHelper.type] || '🤖'}</span>
                  {activeHelper.name}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">{activeHelper.tone}</Badge>
              </>
            )}
          </div>
        </div>
        <Button 
          onClick={() => setIsVoiceCallOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <Phone size={16} />
          Start Voice Call ($1/min)
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium text-indigo-900">Quick Switch Helper:</h3>
            <Badge variant="secondary" className="text-xs">
              {helpers.length} available
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {helpers.map((helper) => (
              <Button
                key={helper.id}
                onClick={() => handleHelperSwitch(helper)}
                disabled={!!selectingHelperId}
                className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 flex items-center gap-1 transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
              >
                <span>
                  {selectingHelperId === helper.id ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    helperIcons[helper.type] || '🤖'
                  )}
                </span>
                <span>{helper.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="h-80">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`flex items-start gap-3 max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                     {msg.sender === 'helper' && activeHelper && (
                       <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                         {helperIcons[activeHelper.type] || '🤖'}
                       </div>
                     )}
                     {msg.sender === 'user' && (
                       <Avatar className="w-8 h-8">
                         <AvatarFallback className="bg-blue-100 text-blue-900 text-sm">
                           {userProfile.name.charAt(0).toUpperCase()}
                         </AvatarFallback>
                       </Avatar>
                     )}
                     <div className={`rounded-lg p-3 ${
                       msg.sender === 'user' 
                         ? 'bg-indigo-600 text-white' 
                         : 'bg-gray-100 text-gray-900'
                     }`}>
                       <p className="text-sm">{msg.content}</p>
                       <p className={`text-xs mt-1 ${
                         msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                       }`}>{msg.time}</p>
                     </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Type your message to ${activeHelper?.name || 'your helper'}...`}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="icon" disabled={!message.trim()}>
                <Send size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Mic size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
          <Pause size={16} />
          <div className="text-left">
            <p className="font-medium">Pause & Reflect</p>
            <p className="text-xs text-gray-500">Take a moment</p>
          </div>
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
          <BookOpen size={16} />
          <div className="text-left">
            <p className="font-medium">Save to Journal</p>
            <p className="text-xs text-gray-500">Keep this conversation</p>
          </div>
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
          <Wrench size={16} />
          <div className="text-left">
            <p className="font-medium">Use a Tool</p>
            <p className="text-xs text-gray-500">Quick exercises</p>
          </div>
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
          <Package size={16} />
          <div className="text-left">
            <p className="font-medium">Life Resources</p>
            <p className="text-xs text-gray-500">Helpful content</p>
          </div>
        </Button>
      </div>

      <VoiceCallDialog 
        isOpen={isVoiceCallOpen} 
        onClose={() => setIsVoiceCallOpen(false)} 
      />
    </div>
  );
};