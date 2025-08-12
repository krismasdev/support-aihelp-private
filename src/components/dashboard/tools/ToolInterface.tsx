import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface ToolInterfaceProps {
  tool: {
    id: string;
    title: string;
    description: string;
    framework: string;
  };
  onBack: () => void;
}

export const ToolInterface = ({ tool, onBack }: ToolInterfaceProps) => {
  const { helperType, tonePreference } = useAppContext();
  const [step, setStep] = useState<'intro' | 'exercise' | 'recap'>('intro');
  const [userInput, setUserInput] = useState('');
  const [exerciseData, setExerciseData] = useState<any>(null);

  const getIntroMessage = () => {
    const baseMessage = `This is a ${tool.framework} exercise to help you ${tool.description.toLowerCase()}. You can skip or stop anytime.`;
    const question = "Would you like to try a short exercise for this?";
    return { baseMessage, question };
  };

  const getExercisePrompt = () => {
    switch (tool.id) {
      case 'journaling':
        return "What's been weighing on your mind today?";
      case 'reframe':
        return "What's a thought that's been bothering you lately?";
      case 'planning':
        return "What's one small thing you want to work toward this week?";
      case 'breathwork':
        return "Let's start with a simple breathing pattern. Ready?";
      default:
        return "Let's begin this exercise together.";
    }
  };

  const handleStart = () => {
    setStep('exercise');
  };

  const handleComplete = () => {
    setExerciseData({ input: userInput, insight: 'Sample insight based on input' });
    setStep('recap');
  };

  const renderIntro = () => {
    const { baseMessage, question } = getIntroMessage();
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} />
          <span>3-5 minutes</span>
        </div>
        <p className="text-gray-700">{baseMessage}</p>
        <p className="font-medium">{question}</p>
        <div className="flex gap-3">
          <Button onClick={handleStart} className="bg-indigo-600 hover:bg-indigo-700">
            Yes, let's try it
          </Button>
          <Button variant="outline" onClick={onBack}>
            That's okay. Let's just talk instead.
          </Button>
        </div>
      </div>
    );
  };

  const renderExercise = () => {
    return (
      <div className="space-y-4">
        <p className="font-medium">{getExercisePrompt()}</p>
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Take your time to reflect..."
          className="min-h-32"
        />
        <div className="flex gap-3">
          <Button onClick={handleComplete} disabled={!userInput.trim()}>
            Continue
          </Button>
          <Button variant="outline" onClick={() => setStep('intro')}>
            Back
          </Button>
        </div>
      </div>
    );
  };

  const renderRecap = () => {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Reflection Summary</h4>
          <p className="text-green-700 text-sm">
            You explored how {tool.title.toLowerCase()} has been affecting you, and identified some key insights.
          </p>
        </div>
        <p className="font-medium">What would you like to do next?</p>
        <div className="flex gap-3">
          <Button onClick={() => setStep('exercise')} variant="outline">
            Try another exercise
          </Button>
          <Button onClick={onBack}>
            Return to tools
          </Button>
        </div>
        <p className="text-sm text-gray-600">Should I keep this in mind for next time?</p>
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <CardTitle>{tool.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {step === 'intro' && renderIntro()}
        {step === 'exercise' && renderExercise()}
        {step === 'recap' && renderRecap()}
        
        <div className="mt-6 p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
          <p className="text-sm text-yellow-800">
            This might be a lot to carry alone. If you're ever in crisis, I can connect you to resources like the Suicide & Crisis Lifeline (988 in the U.S.).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};