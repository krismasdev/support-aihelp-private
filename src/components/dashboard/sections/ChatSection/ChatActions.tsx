import { Button } from '@/components/ui/button';
import { Pause, BookOpen, Wrench, Package } from 'lucide-react';

export function ChatActions() {
  return (
    <div className="grid md:grid-cols-4 gap-4 mt-6">
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
  );
}