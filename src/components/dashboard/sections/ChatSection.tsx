import { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, Phone, Loader2, Pause, BookOpen, Wrench, Package } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { VoiceCallDialog } from '../voice/VoiceCallDialog';
import { selectUserId } from '@/store/userSlice';
import { fetchHelpers, selectHelpers, selectDefaultHelper } from '@/store/helperSlice';
import { fetchMessages, sendMessage, selectMessagesForHelper, selectMessagesLoading } from '@/store/messagesSlice';
import { supabase } from '@/lib/supabase';
import { VoiceRecordingDialog } from '../voice/VoiceRecordingDialog';
import { UserProfile } from '@/pages/Dashboard';
import { HelperSwitcher } from './ChatSection/HelperSwitcher';
import { MessageList } from './ChatSection/MessageList';
import { MessageInput } from './ChatSection/MessageInput';
import { ChatActions } from './ChatSection/ChatActions';

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

export const ChatSection = ({ userProfile }: ChatSectionProps) => {
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
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = useSelector((state: any) =>
    activeHelper ? selectMessagesForHelper(state, activeHelper.id) : []
  );

  const allMessages = [
    ...currentMessages,
    ...optimisticMessages.filter(msg => msg.helper_id === activeHelper?.id)
  ];
  const avatarUrl = useSelector((state: any) => state.user.profile?.avatar_url);

  // Fetch messages when activeHelper changes
  useEffect(() => {
    if (activeHelper && userId) {
      dispatch(fetchMessages({ helperId: activeHelper.id, userId }) as any);
    }
  }, [activeHelper, userId, dispatch]);

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
        is_audio: false,
        audio_url: null,
        created_at: new Date().toISOString(),
      };

      setOptimisticMessages((prev) => [...prev, userMessageData]);
      setMessage('');
      setHelperTyping(true);

      try {

        const { data: { aiMessage }, error } = await supabase.functions.invoke(
          "create-text-message", {
          body: { helper: activeHelper, user_id: userId, userMessageData: userMessageData, currentMessages: currentMessages }
        });
        
        // 5. Add AI response to chat
        const aiMessageData = {
          helper_id: activeHelper.id,
          user_id: userId,
          message: aiMessage,
          sender: "helper",
          is_audio: false,
          audio_url: null,
          created_at: new Date().toISOString(),
        };
        setOptimisticMessages((prev) => [
          ...prev.filter((msg) => msg.id !== tempId),
          userMessageData,
          aiMessageData,
        ]);
        setHelperTyping(false);

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        setHelperTyping(false);
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

  // Auto-select default helper when available
  useEffect(() => {
    if (defaultHelper && (!activeHelper || activeHelper.id !== defaultHelper.id)) {
      console.log('Auto-selecting default helper:', defaultHelper.name);
      setActiveHelper(defaultHelper);
    }
  }, [defaultHelper, activeHelper, setActiveHelper]);

  // Microphone check and open dialog
  const handleMicClick = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsVoiceDialogOpen(true);
    } catch (err) {
      alert('Please connect your microphone.');
    }
  }, []);

  // Handle sending the audio blob
  const handleSendRecording = async (audioBlob: Blob) => {
    console.log("111111111", audioBlob);
    if (!activeHelper || !userId) return;
    setIsVoiceDialogOpen(false);
    setHelperTyping(true);

    // 1. Optimistically add audio message (pending, no audio_url yet)
    const tempId = `audio-temp-${Date.now()}`;
    const optimisticAudioMsg = {
      id: tempId,
      helper_id: activeHelper.id,
      user_id: userId,
      message: '',
      is_audio: true,
      audio_url: '', // will be set after upload
      sender: 'user',
      created_at: new Date().toISOString(),
      pending: true,
      transcribedText: '',
    };
    setOptimisticMessages((prev) => [...prev, optimisticAudioMsg]);

    try {
      // 2. Upload audio to Supabase Storage
      const fileName = `audio_${userId}_${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio_messages')
        .upload(fileName, audioBlob, { contentType: 'audio/webm' });
      if (uploadError) throw uploadError;

      // 3. Get public URL for audio
      const { data: publicUrlData } = supabase
        .storage
        .from('audio_messages')
        .getPublicUrl(fileName);
      const audioUrl = publicUrlData.publicUrl;

      // 4. Update optimistic message with audio_url so play button works immediately
      setOptimisticMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, audio_url: audioUrl } : msg
        )
      );
      
      const { data : { transcribedText, aiMessage }, error } = await supabase.functions.invoke("create-audio-message", { 
        body: {
          helper: activeHelper, 
          user_id: userId, 
          is_audio: true, 
          audio_url: audioUrl, 
          sender: "user",
          fileName: fileName
        } 
      });

      // 11. Update optimistic message: remove pending, set transcribedText
      setOptimisticMessages((prev) =>
        prev
          .filter((msg) => msg.id !== tempId)
          .concat([
            {
              ...optimisticAudioMsg,
              id: tempId,
              audio_url: audioUrl,
              pending: false,
              transcribedText,
            },
            {
              id: `ai-${Date.now()}`,
              helper_id: activeHelper.id,
              user_id: userId,
              message: aiMessage,
              sender: 'helper',
              is_audio: false,
              audio_url: null,
              created_at: new Date().toISOString(),
            },
          ])
      );
      setHelperTyping(false);
    } catch (error) {
      setHelperTyping(false);
      setOptimisticMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      console.error('Error handling audio message:', error);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
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
          Start Voice Call
        </Button>
      </div>

      {/* Helper Switcher */}
      <HelperSwitcher
        helpers={helpers}
        activeHelper={activeHelper}
        onSwitch={handleHelperSwitch}
        selectingHelperId={selectingHelperId}
        helperIcons={helperIcons}
      />

      {/* Message List */}
      <MessageList
        allMessages={allMessages}
        helperTyping={helperTyping}
        activeHelper={activeHelper}
        userProfile={userProfile}
        avatarUrl={avatarUrl}
        messagesEndRef={messagesEndRef}
        helperIcons={helperIcons}
      />

      {/* Message Input */}
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={handleSendMessage}
        onMicClick={handleMicClick}
        activeHelper={activeHelper}
      />

      {/* Chat Actions */}
      <ChatActions />

      {/* Voice dialogs */}
      <VoiceCallDialog
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
      />
      {isVoiceDialogOpen && (
        <VoiceRecordingDialog
          isOpen={isVoiceDialogOpen}
          onSendRecording={handleSendRecording} // <-- FIXED PROP NAME
          onClose={() => setIsVoiceDialogOpen(false)}
        />
      )}
    </div>
  );
};
