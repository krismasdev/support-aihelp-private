import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, Loader2, Pause, BookOpen, Wrench, Package } from 'lucide-react';

interface ChatSectionMessagesProps {
  allMessages: any[];
  isInitialLoad: boolean;
  messagesLoading: boolean;
  helperTyping: boolean;
  activeHelper: any;
  userProfile: any;
  avatarUrl: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  message: string;
  setMessage: (msg: string) => void;
  handleSendMessage: () => void;
  handleMicClick: () => void;
  helperIcons: Record<string, string>;
}

export const ChatSectionMessages = ({
  allMessages,
  isInitialLoad,
  messagesLoading,
  helperTyping,
  activeHelper,
  userProfile,
  avatarUrl,
  messagesEndRef,
  message,
  setMessage,
  handleSendMessage,
  handleMicClick,
  helperIcons
}: ChatSectionMessagesProps) => {
  return (
    <>
      <Card className="h-80 flex-1">
        <CardContent className="p-0 h-full flex flex-col">
          <div className='overflow-y-auto flex-1 p-4 bg-gradient-to-b from-white to-indigo-50 rounded-t-lg'>
            <div className="space-y-3 m-4">
              {(isInitialLoad && messagesLoading) ? (
                <div className="text-center text-gray-500 mt-8">
                  <Loader2 className="animate-spin mx-auto mb-2" />
                  <p>Loading messages...</p>
                </div>
              ) : (
                <>
                  {allMessages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${msg.optimistic ? 'opacity-70' : ''}`}
                    >
                      {msg.sender !== 'user' && (
                        <Avatar className="w-8 h-8">
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
                        <Avatar className="w-8 h-8 ml-3">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={userProfile.name || 'User'} />
                          ) : (
                            <AvatarFallback className="bg-indigo-600 text-white text-sm">
                              {userProfile.name?.[0] || 'U'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {helperTyping && (
                    <div className="flex items-end justify-start">
                      <Avatar className="w-8 h-8">
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
              <Button variant="outline" size="icon" onClick={handleMicClick}>
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
    </>
  );
};