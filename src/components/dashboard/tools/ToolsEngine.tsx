import { useState } from 'react';
import { ToolInterface } from './ToolInterface';
import { JournalingTool } from './JournalingTool';
import { ReframeTool } from './ReframeTool';
import { BreathworkTool } from './BreathworkTool';
import { PlanningTool } from './PlanningTool';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Save, MessageCircle } from 'lucide-react';

interface ToolsEngineProps {
  selectedTool: string | null;
  onToolComplete: (data: any) => void;
  onBack: () => void;
}

const toolConfigs = {
  journaling: {
    id: 'journaling',
    title: 'Journaling Prompts',
    description: 'explore what\'s on your mind',
    framework: 'journaling prompt'
  },
  reframe: {
    id: 'reframe',
    title: 'Reframe Exercise',
    description: 'challenge and replace difficult thoughts',
    framework: 'CBT-style thinking'
  },
  breathwork: {
    id: 'breathwork',
    title: 'Breathwork Exercise',
    description: 'center yourself with calming breathing',
    framework: 'breathing pattern'
  },
  planning: {
    id: 'planning',
    title: 'Goal Planning',
    description: 'create actionable plans',
    framework: 'SMART goal setting'
  }
};

export const ToolsEngine = ({ selectedTool, onToolComplete, onBack }: ToolsEngineProps) => {
  const [step, setStep] = useState<'intro' | 'tool' | 'complete'>('intro');
  const [toolData, setToolData] = useState<any>(null);
  const [userDeclined, setUserDeclined] = useState(false);

  if (!selectedTool || !toolConfigs[selectedTool as keyof typeof toolConfigs]) {
    return null;
  }

  const tool = toolConfigs[selectedTool as keyof typeof toolConfigs];

  const handleStart = () => {
    setStep('tool');
  };

  const handleDecline = () => {
    setUserDeclined(true);
  };

  const handleToolComplete = (data: any) => {
    setToolData(data);
    setStep('complete');
  };

  const handleSave = () => {
    onToolComplete(toolData);
  };

  if (userDeclined) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            That's okay. We can just talk instead.
          </p>
          <Button onClick={onBack} className="bg-indigo-600 hover:bg-indigo-700">
            <MessageCircle size={16} className="mr-2" />
            Start Conversation
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'intro') {
    return (
      <ToolInterface 
        tool={tool}
        onBack={onBack}
      />
    );
  }

  if (step === 'tool') {
    const ToolComponent = {
      journaling: JournalingTool,
      reframe: ReframeTool,
      breathwork: BreathworkTool,
      planning: PlanningTool
    }[selectedTool as keyof typeof toolConfigs];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <h2 className="text-xl font-semibold">{tool.title}</h2>
        </div>
        <ToolComponent onComplete={handleToolComplete} />
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto text-green-600" size={48} />
            <h3 className="text-xl font-semibold">Exercise Complete</h3>
            
            <div className="bg-green-50 p-4 rounded-lg text-left">
              <h4 className="font-medium text-green-800 mb-2">Summary</h4>
              <p className="text-green-700 text-sm">
                You explored how {tool.description}, and identified some key insights.
              </p>
            </div>
            
            <p className="font-medium">What would you like to do next?</p>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                <Save size={16} className="mr-2" />
                Save & Continue
              </Button>
              <Button variant="outline" onClick={() => setStep('tool')}>
                Try Again
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back to Tools
              </Button>
            </div>
            
            <p className="text-sm text-gray-600">
              Should I keep this in mind for next time?
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};