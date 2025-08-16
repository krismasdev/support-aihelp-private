import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import { AudioMessage } from './AudioMessage';

export function MessageList({
  allMessages,
  helperTyping,
  activeHelper,
  userProfile,
  avatarUrl,
  messagesEndRef,
  helperIcons,
}: {
  allMessages: any[];
  helperTyping: boolean;
  activeHelper: any;
  userProfile: any;
  avatarUrl: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  helperIcons: Record<string, string>;
}) {
  return (
    <div className="space-y-3 flex-1 overflow-auto rounded-t-lg bg-white mt-6 p-4">
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
            {msg.is_audio && msg.audio_url ? (
              <AudioMessage
                audioUrl={msg.audio_url}
                pending={msg.pending}
              />
            ) : (
              <div className={`prose prose-indigo text-sm max-w-none ${msg.sender === 'user' ? 'text-white' : ''}`}>
                <ReactMarkdown>
                  {msg.message}
                </ReactMarkdown>
              </div>
            )}
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
    </div>
  );
}