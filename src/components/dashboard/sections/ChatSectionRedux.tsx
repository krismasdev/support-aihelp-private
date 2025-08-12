import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Mic, Phone, Loader2, Pause, BookOpen, Wrench, Package } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { VoiceCallDialog } from '../voice/VoiceCallDialog';
import { selectUserId } from '@/store/userSlice';
import { fetchHelpers, selectHelpers, selectDefaultHelper } from '@/store/helperSlice';
import { fetchMessages, sendMessage, selectMessagesForHelper, selectMessagesLoading } from '@/store/messagesSlice';
import { supabase } from '@/lib/supabase';

interface ChatSectionProps {
  userProfile: UserProfile;
}

const helperIcons: Record<string, string> = {
  'Spiritual Guide': '🙏',
  'Relationship Coach': '💕',
  'Mental Wellness Helper': '🧠',
  'Career Coach': '💼',
  'Friend & Advisor': '👥',
  'Health Consultant': '🏥'
};

export const ChatSectionRedux = ({ userProfile }: ChatSectionProps) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const helpers = useSelector(selectHelpers);
  const defaultHelper = useSelector(selectDefaultHelper);
  const messagesLoading = useSelector(selectMessagesLoading);

  const { activeHelper, setActiveHelper } = useAppContext();

  const [message, setMessage] = useState('');
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [selectingHelperId, setSelectingHelperId] = useState<string | null>(null);
  const [helperTyping, setHelperTyping] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = useSelector((state: any) =>
    activeHelper ? selectMessagesForHelper(state, activeHelper.id) : []
  );

  const allMessages = [...currentMessages, ...optimisticMessages];

  const buildSystemPrompt = (helper: any) => {
    return `You are ${helper.name}, a ${helper.type}. 
Description: ${helper.description}
Tone: ${helper.tone}
Interaction Style: ${helper.interactionStyle}
Focus: ${helper.focus}`;
  };
  // Sync context activeHelper with Redux defaultHelper
  useEffect(() => {
    if (defaultHelper && (!activeHelper || activeHelper.id !== defaultHelper.id)) {
      setActiveHelper(defaultHelper);
    }
  }, [defaultHelper, activeHelper, setActiveHelper]);

  // Fetch messages when activeHelper changes
  useEffect(() => {
    if (activeHelper && userId) {
      dispatch(fetchMessages({ helperId: activeHelper.id, userId }) as any);
    }
  }, [activeHelper, userId, dispatch]);

  const OPENAI_API_KEY = '1111'; // Move to env in production

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, optimisticMessages, helperTyping]);

  const handleSendMessage = async () => {
    if (message.trim() && activeHelper && userId) {
      const tempId = `temp-${Date.now()}`;
      const userMessageData = {
        id: tempId,
        helper_id: activeHelper.id,
        user_id: userId,
        message: message.trim(),
        sender: 'user',
        created_at: new Date().toISOString(),
        optimistic: true,
      };

      // 1. Optimistically add user message to chat
      setOptimisticMessages((prev) => [...prev, userMessageData]);
      setMessage('');
      setHelperTyping(true);

      try {
        // 2. Save user message via edge function
        const { error } = await supabase.functions.invoke('create-message', {
          body: {
            helper_id: activeHelper.id,
            user_id: userId,
            message: userMessageData.message,
            sender: 'user'
          }
        });

        // Do NOT remove optimistic message here!

        // 3. Prepare messages for OpenAI
        const chatHistory = [
          {
            role: 'system',
            content: buildSystemPrompt(activeHelper),
          },
          ...currentMessages.map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.message,
          })),
          { role: 'user', content: userMessageData.message }
        ];

        // 4. Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: chatHistory,
            max_tokens: 3000,
          }),
        });

        const data = await response.json();
        const assistantReply = data.choices?.[0]?.message?.content?.trim();

        if (assistantReply) {
          // 5. Save assistant message via edge function
          await supabase.functions.invoke('create-message', {
            body: {
              helper_id: activeHelper.id,
              user_id: userId,
              message: assistantReply,
              sender: 'helper'
            }
          });
        }

        setHelperTyping(false);
        // Now refresh messages, which will replace the optimistic message with the real one
        dispatch(fetchMessages({ helperId: activeHelper.id, userId }) as any);

        // Remove optimistic message after real messages are fetched
        setOptimisticMessages([]);

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        setHelperTyping(false);
        // Remove optimistic message if error
        setOptimisticMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        console.error('Error sending message:', error);
      }
    }
  };

  const handleHelperSwitch = async (helper: any) => {
    if (!userId) return;
    setSelectingHelperId(helper.id);
    try {
      await supabase.functions.invoke('set-default-helper', {
        body: {
          helper_id: helper.id,
          user_id: userId
        }
      });
      setActiveHelper(helper);
      dispatch(fetchHelpers(userId) as any);
    } catch (error) {
      console.error('Error setting default helper:', error);
    } finally {
      setSelectingHelperId(null);
    }
  };

  // Detect initial load
  useEffect(() => {
    if (!messagesLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [messagesLoading, isInitialLoad]);

  return (
    <div className="space-y-6 h-full flex flex-col">
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
            <div className="flex gap-2 flex-wrap">
              {helpers.map((helper) => (
                <Button
                  key={helper.id}
                  size="sm"
                  variant={activeHelper?.id === helper.id ? "default" : "outline"}
                  onClick={() => handleHelperSwitch(helper)}
                  disabled={!!selectingHelperId}
                  className={`flex items-center gap-1 h-9 text-sm px-3 w-fit py-1 transition-all ${activeHelper?.id === helper.id
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md border-2 border-indigo-600'
                    : 'hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300'
                    }`}
                >
                  <span className="text-md">
                    {selectingHelperId === helper.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      helperIcons[helper.type] || '🤖'
                    )}
                  </span>
                  <span className="text-md font-medium text-center leading-tight">{helper.name}</span>
                  {/* <span className="text-xs opacity-75">{helper.tone}</span> */}
                </Button>
              ))}
            </div>
        </CardContent>
      </Card>

      <Card className="h-80 flex-1">
        <CardContent className="p-0 h-full flex flex-col">
          <div className='overflow-y-auto flex-1 bg-gradient-to-b from-white to-indigo-50 rounded-t-lg'>
            <div className="space-y-3 m-4">
              {(isInitialLoad && messagesLoading) ? (
                <div className="text-center text-gray-500 mt-8">
                  <Loader2 className="animate-spin mx-auto mb-2" />
                  <p>Loading messages...</p>
                </div>
              ) : (
                <>
                  {activeHelper && userProfile && (
                    <div className="flex items-end justify-start opacity-90">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback className="bg-indigo-100 text-indigo-900 text-sm">
                          {helperIcons[activeHelper.type] || '🤖'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-indigo-100 text-indigo-900 border border-indigo-200 shadow">
                        <div className="text-xs font-semibold mb-1">
                          {activeHelper.name}
                        </div>
                        <p className="text-sm">
                          Hi {userProfile.name}! I'm {activeHelper.name}, your {activeHelper.type}. How can I support you today?
                        </p>
                      </div>
                    </div>
                  )}
                  {allMessages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${msg.optimistic ? 'opacity-70' : ''}`}
                    >
                      {msg.sender !== 'user' && (
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarFallback className="bg-indigo-100 text-indigo-900 text-sm">
                            {activeHelper ? (helperIcons[activeHelper.type] || '🤖') : '🤖'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`
                        max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow
                        ${msg.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 border border-indigo-100 rounded-bl-none'}
                        group
                      `}
                        title={new Date(msg.created_at).toLocaleString()}
                      >
                        {msg.sender !== 'user' && activeHelper && (
                          <div className="text-xs font-semibold text-indigo-700 mb-1">
                            {activeHelper.name} <span className="opacity-60">({activeHelper.type})</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <span className="block text-[10px] mt-1 opacity-60 text-right">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {msg.sender === 'user' && (
                        <Avatar className="w-8 h-8 ml-2">
                          <AvatarFallback className="bg-indigo-600 text-white text-sm">
                            {userProfile.name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {helperTyping && (
                    <div className="flex items-end justify-start">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback className="bg-indigo-100 text-indigo-900 text-sm">
                          {activeHelper ? (helperIcons[activeHelper.type] || '🤖') : '🤖'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-white border border-indigo-100 shadow">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-indigo-700">
                            {activeHelper?.name || 'Helper'}
                          </span>
                          <span className="text-xs opacity-60">is typing</span>
                          <span className="flex gap-1">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-150">.</span>
                            <span className="animate-bounce delay-300">.</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>
          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Type your message to ${activeHelper?.name || 'your helper'}...`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleSendMessage} size="icon" disabled={!message.trim()}>
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