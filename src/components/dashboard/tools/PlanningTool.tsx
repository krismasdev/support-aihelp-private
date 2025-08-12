import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Circle } from 'lucide-react';

interface PlanningToolProps {
  onComplete: (data: any) => void;
}

type SMARTCriteria = {
  specific: boolean;
  measurable: boolean;
  achievable: boolean;
  relevant: boolean;
  timeBound: boolean;
};

export const PlanningTool = ({ onComplete }: PlanningToolProps) => {
  const [goal, setGoal] = useState('');
  const [step, setStep] = useState<'goal' | 'smart' | 'plan'>('goal');
  const [smartCheck, setSmartCheck] = useState<SMARTCriteria>({
    specific: false,
    measurable: false,
    achievable: false,
    relevant: false,
    timeBound: false
  });
  const [actionSteps, setActionSteps] = useState(['']);

  const handleGoalSubmit = () => {
    if (goal.trim()) {
      setStep('smart');
    }
  };

  const toggleSMART = (criteria: keyof SMARTCriteria) => {
    setSmartCheck(prev => ({ ...prev, [criteria]: !prev[criteria] }));
  };

  const handleSMARTNext = () => {
    setStep('plan');
  };

  const addActionStep = () => {
    setActionSteps([...actionSteps, '']);
  };

  const updateActionStep = (index: number, value: string) => {
    const updated = [...actionSteps];
    updated[index] = value;
    setActionSteps(updated);
  };

  const removeActionStep = (index: number) => {
    setActionSteps(actionSteps.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onComplete({
      type: 'planning',
      goal,
      smartCriteria: smartCheck,
      actionSteps: actionSteps.filter(step => step.trim()),
      insight: 'Created SMART goal with action plan'
    });
  };

  const smartCriteria = [
    { key: 'specific' as const, label: 'Specific', desc: 'Clear and well-defined' },
    { key: 'measurable' as const, label: 'Measurable', desc: 'You can track progress' },
    { key: 'achievable' as const, label: 'Achievable', desc: 'Realistic given your resources' },
    { key: 'relevant' as const, label: 'Relevant', desc: 'Important to you right now' },
    { key: 'timeBound' as const, label: 'Time-bound', desc: 'Has a clear deadline' }
  ];

  if (step === 'goal') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Set Your Goal</h3>
              <p className="text-gray-600 mb-4">
                What's one small thing you want to work toward this week?
              </p>
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="I want to..."
                className="min-h-24"
              />
            </div>
            <Button 
              onClick={handleGoalSubmit}
              disabled={!goal.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Next: Check SMART Criteria
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'smart') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">SMART Goal Check</h3>
              <p className="text-gray-600 mb-4">
                Let's check if your goal meets the SMART criteria:
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="font-medium text-sm">Your goal:</p>
                <p className="text-sm text-gray-700 italic">"{goal}"</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {smartCriteria.map((criteria) => (
                <div key={criteria.key} className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSMART(criteria.key)}
                    className="mt-1"
                  >
                    {smartCheck[criteria.key] ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <Circle className="text-gray-400" size={20} />
                    )}
                  </button>
                  <div>
                    <Label className="font-medium">{criteria.label}</Label>
                    <p className="text-sm text-gray-600">{criteria.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleSMARTNext} className="bg-indigo-600 hover:bg-indigo-700">
                Create Action Plan
              </Button>
              <Button variant="outline" onClick={() => setStep('goal')}>
                Back to Goal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Action Steps</h3>
            <p className="text-gray-600 mb-4">
              Break your goal into specific steps:
            </p>
          </div>
          
          <div className="space-y-3">
            {actionSteps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={step}
                  onChange={(e) => updateActionStep(index, e.target.value)}
                  placeholder={`Step ${index + 1}...`}
                />
                {actionSteps.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeActionStep(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={addActionStep}>
              Add Step
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={!actionSteps.some(step => step.trim())}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Complete Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};