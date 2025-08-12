import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/AppContext';

interface JournalingToolProps {
  onComplete: (data: any) => void;
}

const prompts = [
  "What's been weighing on your mind today?",
  "What emotions came up for you this week that surprised you?",
  "What do you think triggered that reaction?",
  "What would you tell a friend going through this?"
];

export const JournalingTool = ({ onComplete }: JournalingToolProps) => {
  const { helperType, tonePreference } = useAppContext();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  const handleNext = () => {
    const newResponses = [...responses, currentResponse];
    setResponses(newResponses);
    
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
      setCurrentResponse('');
    } else {
      onComplete({
        type: 'journaling',
        prompts: prompts.slice(0, currentPrompt + 1),
        responses: newResponses,
        insight: 'Completed journaling exercise'
      });
    }
  };

  const handleSkip = () => {
    if (responses.length > 0) {
      onComplete({
        type: 'journaling',
        prompts: prompts.slice(0, currentPrompt),
        responses,
        insight: 'Partial journaling exercise completed'
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Question {currentPrompt + 1} of {prompts.length}
            </span>
            <div className="flex gap-1">
              {prompts.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentPrompt ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">{prompts[currentPrompt]}</h3>
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Take your time to reflect..."
              className="min-h-32"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleNext}
              disabled={!currentResponse.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {currentPrompt < prompts.length - 1 ? 'Next' : 'Complete'}
            </Button>
            <Button variant="outline" onClick={handleSkip}>
              {responses.length > 0 ? 'Finish here' : 'Skip'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};