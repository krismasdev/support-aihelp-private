import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

interface ReframeToolProps {
  onComplete: (data: any) => void;
}

type Step = 'identify' | 'challenge' | 'replace';

export const ReframeTool = ({ onComplete }: ReframeToolProps) => {
  const [step, setStep] = useState<Step>('identify');
  const [thought, setThought] = useState('');
  const [challenge, setChallenge] = useState('');
  const [replacement, setReplacement] = useState('');

  const handleNext = () => {
    if (step === 'identify') {
      setStep('challenge');
    } else if (step === 'challenge') {
      setStep('replace');
    } else {
      onComplete({
        type: 'reframe',
        originalThought: thought,
        challenge,
        newThought: replacement,
        insight: 'Completed thought reframing exercise'
      });
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 'identify':
        return {
          title: 'Identify the Thought',
          prompt: "What's a thought that's been bothering you lately?",
          placeholder: "I always screw things up...",
          value: thought,
          onChange: setThought
        };
      case 'challenge':
        return {
          title: 'Challenge the Thought',
          prompt: "Is that 100% true, or are there times you've succeeded?",
          placeholder: "Actually, I did handle that project well last month...",
          value: challenge,
          onChange: setChallenge
        };
      case 'replace':
        return {
          title: 'Replace with a Balanced Thought',
          prompt: "What's a more balanced way to think about this?",
          placeholder: "I've had setbacks, but I'm learning. That counts.",
          value: replacement,
          onChange: setReplacement
        };
    }
  };

  const content = getStepContent();
  const canProceed = content.value.trim().length > 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'identify' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <ArrowRight size={16} className="text-gray-400" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'challenge' ? 'bg-indigo-600 text-white' : step === 'replace' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <ArrowRight size={16} className="text-gray-400" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'replace' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">{content.title}</h3>
            <p className="text-gray-600 mb-4">{content.prompt}</p>
            
            {step === 'identify' && (
              <Input
                value={content.value}
                onChange={(e) => content.onChange(e.target.value)}
                placeholder={content.placeholder}
                className="mb-4"
              />
            )}
            
            {(step === 'challenge' || step === 'replace') && (
              <Textarea
                value={content.value}
                onChange={(e) => content.onChange(e.target.value)}
                placeholder={content.placeholder}
                className="min-h-24 mb-4"
              />
            )}
          </div>

          {step !== 'identify' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Original thought:</h4>
              <p className="text-sm text-gray-700 italic">"{thought}"</p>
              {step === 'replace' && challenge && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm mb-2">Challenge:</h4>
                  <p className="text-sm text-gray-700">{challenge}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {step === 'replace' ? 'Complete' : 'Next'}
            </Button>
            {step !== 'identify' && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step === 'challenge' ? 'identify' : 'challenge')}
              >
                Back
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};