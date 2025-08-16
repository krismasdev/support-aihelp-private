import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Mic } from 'lucide-react';

export function MessageInput({
  message,
  setMessage,
  onSend,
  onMicClick,
  activeHelper,
}: {
  message: string;
  setMessage: (msg: string) => void;
  onSend: () => void;
  onMicClick: () => void;
  activeHelper: any;
}) {
  return (
    <div className="border-t p-4 bg-white rounded-b-lg flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Type your message to ${activeHelper?.name || 'your helper'}...`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSend();
        }}
        className="flex-1"
        autoFocus
      />
      <Button onClick={onSend} size="icon" disabled={!message.trim()}>
        <Send size={16} />
      </Button>
      <Button variant="outline" size="icon" onClick={onMicClick}>
        <Mic size={16} />
      </Button>
    </div>
  );
}