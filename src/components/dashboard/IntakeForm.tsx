import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Shield, Heart, MessageCircle, Brain, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { UserProfile } from '@/pages/Dashboard';
interface IntakeFormProps {
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
  isDemo?: boolean;
}

const steps = [
  'Welcome',
  'Basic Info',
  'Support Focus',
  'Helper Type',
  'Communication Style',
  'Consent & Boundaries',
  'Recap'
];

const supportAreas = [
  'Anxiety',
  'Work stress',
  'Relationships',
  'Self-esteem',
  'Grief or loss'
];

const helperTypes = [
  { id: 1, label: 'Spiritual Guide', description: 'Guidance with spiritual and life purpose questions', icon: Heart },
  { id: 2, label: 'Relationship Coach', description: 'Support with relationships and social connections', icon: MessageCircle },
  { id: 3, label: 'Mental Wellness Helper', description: 'Emotionally supportive for mental health (not a real therapist)', icon: Heart },
  { id: 4, label: 'Career Coach', description: 'Help with professional goals and career development', icon: Zap },
  { id: 5, label: 'Friend & Advisor', description: 'Just someone to talk to casually with friendly advice', icon: MessageCircle },
  { id: 6, label: 'Health Consultant', description: 'Support with wellness and healthy lifestyle choices', icon: Brain },
  { id: 7, label: 'Custom Type', description: 'Personalized helper based on your specific needs', icon: Zap }
];

const toneOptions = [
  { id: 'gentle', label: 'Gentle', description: 'Soft and supportive' },
  { id: 'direct', label: 'Direct', description: 'Straight to the point, with care' },
  { id: 'encouraging', label: 'Encouraging', description: 'Upbeat and positive' }
];

export const IntakeForm = ({ onComplete, onSkip, isDemo = false }: IntakeFormProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    pronouns: 1, // Default to They/Them
    supportAreas: [] as string[],
    otherSupport: '',
    helperType: '', // Changed to string since helper_type is text
    preferredTone: '',
    consentGiven: false
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Step 5 (after consent) - send data to create-user function
      if (user) {
        setIsSubmitting(true);
        try {
          const profileData = {
            name: formData.name || 'User',
            age: parseInt(formData.age) || 25,
            pronouns: formData.pronouns || 1,
            struggles: [...formData.supportAreas, formData.otherSupport].filter(Boolean),
            helper_type: formData.helperType || null, // Changed to helper_type as text
            preferred_tone: formData.preferredTone || 'gentle', // Changed to preferred_tone
            has_completed_intake: true // Changed to has_completed_intake
          };

          const { data, error } = await supabase.functions.invoke('create-user', {
            body: { 
              userId: user.id,
              profileData: profileData
            },
          });

          if (error) {
            console.error('Error updating profile:', error);
          } else {
            console.log('Profile updated successfully:', data);
            onComplete(profileData);
          }
        } catch (error) {
          console.error('Error calling create-user function:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() !== '';
      case 2: return formData.supportAreas.length > 0 || formData.otherSupport.trim() !== '';
      case 3: return formData.helperType !== ''; // Check for valid selection (not empty string)
      case 4: return formData.preferredTone !== '';
      case 5: return formData.consentGiven;
      default: return true;
    }
  };

  const handleSupportAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setFormData({...formData, supportAreas: [...formData.supportAreas, area]});
    } else {
      setFormData({...formData, supportAreas: formData.supportAreas.filter(a => a !== area)});
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-indigo-900">Welcome to YouMatter.ai</h2>
            <p className="text-gray-600">Your space for judgment-free support.</p>
            <p className="text-gray-600">Let's tailor your experience to match your communication style and support needs.</p>
            {isDemo && (
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={onSkip}
                  className="w-full mb-2"
                >
                  Skip Setup (Demo Mode)
                </Button>
                <p className="text-xs text-gray-500">You can always customize your experience later in settings</p>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name (First name only)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="age">Age (Optional)</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="Your age"
              />
            </div>
            <div>
              <Label>Pronouns</Label>
              <Select onValueChange={(value) => setFormData({...formData, pronouns: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pronouns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">They/Them</SelectItem>
                  <SelectItem value="2">She/Her</SelectItem>
                  <SelectItem value="3">He/Him</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Shield className="w-4 h-4" />
              <span>We respect your privacy. Your data won't be shared or sold.</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>What would you like support with? (Select all that apply)</Label>
              <div className="space-y-2 mt-2">
                {supportAreas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={formData.supportAreas.includes(area)}
                      onCheckedChange={(checked) => handleSupportAreaChange(area, checked as boolean)}
                    />
                    <Label htmlFor={area}>{area}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="other">Other (Optional)</Label>
              <Input
                id="other"
                value={formData.otherSupport}
                onChange={(e) => setFormData({...formData, otherSupport: e.target.value})}
                placeholder="Describe other areas you'd like support with"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label>What type of helper would you prefer?</Label>
            <div className="space-y-3">
              {helperTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.helperType === type.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({...formData, helperType: type.id})}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-indigo-600" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Label>What communication style do you prefer?</Label>
            <div className="space-y-3">
              {toneOptions.map((tone) => (
                <div
                  key={tone.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.preferredTone === tone.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, preferredTone: tone.id})}
                >
                  <div className="font-medium">{tone.label}</div>
                  <div className="text-sm text-gray-600">{tone.description}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Important Boundaries</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• This is not a replacement for professional therapy or medical advice</p>
              <p>• If you're having thoughts of self-harm, please contact a crisis helpline</p>
              <p>• Your conversations are private and not shared with others</p>
              <p>• You can end any conversation at any time</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={formData.consentGiven}
                onCheckedChange={(checked) => setFormData({...formData, consentGiven: checked as boolean})}
              />
              <Label htmlFor="consent" className="text-sm">
                I understand these boundaries and consent to using YouMatter.ai
              </Label>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">You're all set!</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {formData.name || 'User'}</p>
              <p><strong>Helper Type:</strong> {helperTypes.find(h => h.id === formData.helperType)?.label || 'Friend'}</p>
              <p><strong>Communication Style:</strong> {toneOptions.find(t => t.id === formData.preferredTone)?.label || 'Gentle'}</p>
              <p><strong>Support Areas:</strong> {[...formData.supportAreas, formData.otherSupport].filter(Boolean).join(', ') || 'General support'}</p>
            </div>
            <p className="text-center text-gray-600">Ready to start your first conversation?</p>
          </div>
        );
      default:
        return <div>Step content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-center">{steps[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button 
                variant="outline"
                onClick={handleBack} 
                className="flex-1"
              >
                Back
              </Button>
            )}
            {currentStep > 0 && (
              <Button 
                onClick={handleNext} 
                className="flex-1"
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (currentStep === steps.length - 1 ? 'Start Your First Conversation' : 'Continue')}
              </Button>
            )}
            {currentStep === 0 && !isDemo && (
              <Button 
                onClick={handleNext} 
                className="w-full"
              >
                Get Started
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};