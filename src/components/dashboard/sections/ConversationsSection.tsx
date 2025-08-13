import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Mic, Pause, BookOpen, Phone, Settings } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

export const ConversationsSection = () => {
  const { activeHelper, helpers, setActiveHelper } = useAppContext();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const getHelperIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Spiritual Guide': '🙏',
      'Relationship Coach': '💕',
      'Mental Wellness Helper': '🧠',
      'Career Coach': '💼',
      'Friend & Advisor': '👥',
      'Health Consultant': '🏥'
    };
    return icons[type] || '🤖';
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user' as const,
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-indigo-900 mb-2">Conversations</h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">Talking to:</p>
            {activeHelper && (
              <>
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <span>{getHelperIcon(activeHelper.type)}</span>
                  {activeHelper.name}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">{activeHelper.tone}</Badge>
              </>
            )}
          </div>
        </div>
        <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Phone size={16} />
          Start Voice Call ($1/min)
        </Button>
      </div>

      {helpers.length > 1 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-medium text-indigo-900">Switch Helper:</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              {helpers.map((helper) => (
                <Button
                  key={helper.id}
                  size="sm"
                  variant={activeHelper?.id === helper.id ? "default" : "outline"}
                  onClick={() => setActiveHelper(helper)}
                  className={`flex items-center gap-1 ${activeHelper?.id === helper.id ? 'bg-indigo-600' : ''}`}
                >
                  <span>{getHelperIcon(helper.type)}</span>
                  {helper.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="h-96">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-xs lg:max-w-md`}>
                  {msg.sender === 'helper' && activeHelper && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-indigo-100 text-indigo-900 text-sm">
                        {getHelperIcon(activeHelper.type)}
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
              </div>
            ))}
          </div>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="icon">
                <Send size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Mic size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
          <Pause size={16} />
          <div className="text-left">
            <p className="font-medium">Pause & Reflect</p>
            <p className="text-xs text-gray-500">Take a moment</p>
          </div>
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
          <Mic size={16} />
          <div className="text-left">
            <p className="font-medium">Upgrade to Voice</p>
            <p className="text-xs text-gray-500">$1/minute</p>
          </div>
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
          <BookOpen size={16} />
          <div className="text-left">
            <p className="font-medium">Save to Journal</p>
            <p className="text-xs text-gray-500">Keep this conversation</p>
          </div>
        </Button>
      </div>
    </div>
  );
};