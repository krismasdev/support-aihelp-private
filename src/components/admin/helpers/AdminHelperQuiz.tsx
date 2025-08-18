import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import type { TonePreference } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

interface DefaultHelper {
  id: number;
  name: string;
  type: string;
  description: string;
  tone: string;
  interaction_style: string;
  focus: string;
}

interface AdminHelperQuizProps {
  editingHelper?: DefaultHelper;
  helperType: string;
  onComplete: (preferences: { tone: TonePreference; interactionStyle: string; focus: string }) => void;
  onCancel: () => void;
}

const quizQuestions = {
  'Spiritual Guide': [
    {
      question: "How should spiritual guidance feel?",
      options: [
        { value: 'Gentle', label: 'Gentle and nurturing' },
        { value: 'Direct', label: 'Clear and purposeful' },
        { value: 'Encouraging', label: 'Uplifting and inspiring' }
      ]
    },
    {
      question: "What interaction style works best?",
      options: [
        { value: 'meditative', label: 'Meditative and reflective' },
        { value: 'conversational', label: 'Conversational and flowing' },
        { value: 'structured', label: 'Structured with practices' }
      ]
    },
    {
      question: "What spiritual focus is most important?",
      options: [
        { value: 'mindfulness', label: 'Mindfulness and presence' },
        { value: 'purpose', label: 'Life purpose and meaning' },
        { value: 'growth', label: 'Personal growth and wisdom' }
      ]
    }
  ],
  'default': [
    {
      question: "How should this helper communicate?",
      options: [
        { value: 'Gentle', label: 'Gentle and supportive' },
        { value: 'Direct', label: 'Direct and clear' },
        { value: 'Encouraging', label: 'Encouraging and positive' }
      ]
    },
    {
      question: "What interaction style is preferred?",
      options: [
        { value: 'supportive', label: 'Supportive and understanding' },
        { value: 'practical', label: 'Practical and solution-focused' },
        { value: 'exploratory', label: 'Exploratory and reflective' }
      ]
    },
    {
      question: "What should this helper focus on?",
      options: [
        { value: 'listening', label: 'Active listening and validation' },
        { value: 'guidance', label: 'Guidance and advice' },
        { value: 'growth', label: 'Personal growth and development' }
      ]
    }
  ]
};
export const AdminHelperQuiz = ({ editingHelper, helperType, onComplete, onCancel }: AdminHelperQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = quizQuestions[helperType as keyof typeof quizQuestions] || quizQuestions.default;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Initialize answers with existing values if editing
  useState(() => {
    if (editingHelper) {
      setAnswers([
        editingHelper.tone,
        editingHelper.interaction_style,
        editingHelper.focus
      ]);
    }
  });

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      handleQuizComplete({
        tone: answers[0] as TonePreference,
        interactionStyle: answers[1],
        focus: answers[2]
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = async (preferences: {
    tone: TonePreference;
    interactionStyle: string;
    focus: string;
  }) => {
    if (editingHelper) {
      try {
        const { data, error } = await supabase
          .from('default_helpers')
          .update({
            name: editingHelper.name,
            type: editingHelper.type,
            description: editingHelper.description,
            tone: preferences.tone,
            interaction_style: preferences.interactionStyle,
            focus: preferences.focus,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingHelper.id);

        if (error) {
          console.error('Error updating helper:', error);
          return;
        }

        console.log('Helper updated successfully:', data);
        onComplete(preferences);
      } catch (error) {
        console.error('Error updating helper:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Configure {helperType}</CardTitle>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {questions[currentQuestion].question}
          </h3>
          <RadioGroup
            value={answers[currentQuestion] || ''}
            onValueChange={handleAnswer}
          >
            {questions[currentQuestion].options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={currentQuestion === 0 ? onCancel : handlePrevious}
          >
            {currentQuestion === 0 ? 'Cancel' : 'Previous'}
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
          >
            {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};