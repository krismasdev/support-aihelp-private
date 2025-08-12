import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MessageCircle, Loader2 } from 'lucide-react';
import type { Helper } from '@/contexts/AppContext';

interface HelperCardProps {
  helper: Helper;
  isActive: boolean;
  isSelecting?: boolean;
  onSelect: (helper: Helper) => void;
  onEdit: (helper: Helper) => void;
  onDelete: (helperId: string) => void;
}

export const HelperCard = ({ helper, isActive, isSelecting = false, onSelect, onEdit, onDelete }: HelperCardProps) => {
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

  return (
    <Card className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-indigo-100 text-2xl">
                {getHelperIcon(helper.type)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{helper.name}</h3>
              <p className="text-sm text-gray-600">{helper.type}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(helper)}>
              <Edit size={14} />
            </Button>
            {!helper.isDefault && (
              <Button size="sm" variant="ghost" onClick={() => onDelete(helper.id)}>
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-purple-100 text-purple-900">
            {helper.tone}
          </Badge>
          {isActive && (
            <Badge className="bg-green-100 text-green-900">
              Active
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{helper.description}</p>
        
        <Button 
          size="sm" 
          className="w-full" 
          variant={isActive ? 'secondary' : 'default'}
          onClick={() => onSelect(helper)}
          disabled={isSelecting}
        >
          {isSelecting ? (
            <>
              <Loader2 size={14} className="mr-2 animate-spin" />
              Selecting...
            </>
          ) : (
            <>
              <MessageCircle size={14} className="mr-2" />
              {isActive ? 'Currently Active' : 'Select Helper'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};