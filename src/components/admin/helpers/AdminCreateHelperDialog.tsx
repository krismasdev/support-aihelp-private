import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AdminHelperQuiz } from './AdminHelperQuiz';
import { supabase } from '@/lib/supabase';
import type { TonePreference } from '@/contexts/AppContext';

interface AdminCreateHelperDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const defaultHelperTypes = [
  'Spiritual Guide',
  'Relationship Coach', 
  'Mental Wellness Helper',
  'Career Coach',
  'Friend & Advisor',
  'Health Consultant'
];

export const AdminCreateHelperDialog = ({ open, onClose, onSave }: AdminCreateHelperDialogProps) => {
  const [step, setStep] = useState<'basic' | 'quiz'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    isDefault: true
  });

  const handleBasicSubmit = () => {
    if (formData.name && formData.type) {
      setStep('quiz');
    }
  };

  const handleQuizComplete = async (preferences: {
    tone: TonePreference;
    interactionStyle: string;
    focus: string;
  }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('default_helpers')
        .insert({
          name: formData.name,
          type: formData.type,
          description: formData.description,
          tone: preferences.tone,
          interaction_style: preferences.interactionStyle,
          focus: preferences.focus,
          is_default: formData.isDefault
        });

      if (error) {
        console.error('Error creating helper:', error);
      } else {
        onSave();
      }
    } catch (error) {
      console.error('Error creating helper:', error);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('basic');
    setFormData({ name: '', type: '', description: '', isDefault: true });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'basic' ? 'Create New Default Helper' : 'Configure Helper'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'basic' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Helper Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter a name for the helper"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Helper Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select helper type" />
                </SelectTrigger>
                <SelectContent>
                  {defaultHelperTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.type === 'custom' && (
              <div>
                <Label htmlFor="customType">Custom Type Name</Label>
                <Input
                  id="customType"
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Enter custom helper type"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this helper will help with"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
              />
              <Label htmlFor="isDefault">Set as default helper</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleBasicSubmit} disabled={!formData.name || !formData.type}>
                Next: Configure
              </Button>
            </div>
          </div>
        ) : (
          <AdminHelperQuiz
            helperType={formData.type}
            onComplete={handleQuizComplete}
            onCancel={() => setStep('basic')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};