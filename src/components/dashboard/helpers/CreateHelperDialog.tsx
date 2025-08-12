import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelperQuiz } from './HelperQuiz';
import { selectUserId } from '@/store/userSlice';
import { fetchHelpers, addHelper } from '@/store/helperSlice';
import { supabase } from '@/lib/supabase';
import type { TonePreference } from '@/contexts/AppContext';

interface CreateHelperDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (helper: {
    name: string;
    type: string;
    description: string;
    tone: TonePreference;
    interactionStyle: string;
    focus: string;
  }) => void;
}

const defaultHelperTypes = [
  'Spiritual Guide',
  'Relationship Coach', 
  'Mental Wellness Helper',
  'Career Coach',
  'Friend & Advisor',
  'Health Consultant'
];

export const CreateHelperDialog = ({ open, onClose, onSave }: CreateHelperDialogProps) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [step, setStep] = useState<'basic' | 'quiz'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
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
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-helper', {
        body: {
          name: formData.name,
          type: formData.type,
          description: formData.description,
          tone: preferences.tone,
          interactionStyle: preferences.interactionStyle,
          focus: preferences.focus.split(',').map(f => f.trim()),
          userId: userId
        },
      });

      if (error) {
        console.error('Error creating helper:', error);
      } else {
        // Refresh helpers list
        dispatch(fetchHelpers(userId) as any);
        onSave({
          ...formData,
          ...preferences
        });
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
    setFormData({ name: '', type: '', description: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'basic' ? 'Create New Helper' : 'Configure Helper'}
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
                placeholder="Enter a name for your helper"
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
                  value={formData.type === 'custom' ? '' : formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Enter custom helper type"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this helper will help you with"
                rows={3}
              />
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
          <HelperQuiz
            helperType={formData.type}
            onComplete={handleQuizComplete}
            onCancel={() => setStep('basic')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};