import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminHelperQuiz } from './AdminHelperQuiz';
import { ArrowLeft } from 'lucide-react';

interface DefaultHelper {
  id: number;
  name: string;
  type: string;
  description: string;
  tone: string;
  interaction_style: string;
  focus: string;
  is_default: boolean;
}

interface AdminEditHelperDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  helper: DefaultHelper | null;
}

export const AdminEditHelperDialog = ({ open, onClose, onSave, helper }: AdminEditHelperDialogProps) => {
  const [step, setStep] = useState<'basic' | 'quiz'>('basic');
  const [formData, setFormData] = useState({
    name: helper?.name || '',
    type: helper?.type || '',
    description: helper?.description || '',
  });

  const handleBasicInfoSave = () => {
    setStep('quiz');
  };

  const handleBack = () => {
    if (step === 'quiz') {
      setStep('basic');
    } else {
      onClose();
    }
  };

  const helperTypes = [
    'Spiritual Guide',
    'Relationship Coach', 
    'Mental Wellness Helper',
    'Career Coach',
    'Friend & Advisor',
    'Health Consultant'
  ];

  if (!helper) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step === 'quiz' && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft size={16} />
              </Button>
            )}
            <DialogTitle>
              {step === 'basic' ? 'Edit Helper - Basic Info' : 'Edit Helper - Configure Preferences'}
            </DialogTitle>
          </div>
        </DialogHeader>

        {step === 'basic' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Helper Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter helper name"
              />
            </div>

            <div>
              <Label htmlFor="type">Helper Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select helper type" />
                </SelectTrigger>
                <SelectContent>
                  {helperTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this helper does"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleBasicInfoSave}>Next: Configure Preferences</Button>
            </div>
          </div>
        ) : (
          <AdminHelperQuiz
            editingHelper={{
              ...helper,
              ...formData
            }}
            helperType={formData.type}
            onComplete={onSave}
            onCancel={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};