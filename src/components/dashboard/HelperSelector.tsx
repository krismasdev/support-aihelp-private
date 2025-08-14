import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext, HelperType, TonePreference } from '@/contexts/AppContext';
import { useSelector } from 'react-redux';
import { selectHelpers, selectDefaultHelper } from '@/store/helperSlice';
import { Users, Volume2 } from 'lucide-react';

export const HelperSelector = () => {
  const { helperType, tonePreference, setHelperType, setTonePreference } = useAppContext();
  const helpers = useSelector(selectHelpers);
  const defaultHelper = useSelector(selectDefaultHelper);

  const helperTypes: { type: HelperType; description: string }[] = [
    { type: 'Friend', description: 'Casual, supportive conversations' },
    { type: 'Mentor', description: 'Guidance and life advice' },
    { type: 'Coach', description: 'Goal-oriented support' },
    { type: 'Therapist', description: 'Professional therapeutic approach' }
  ];

  const tonePreferences: { tone: TonePreference; description: string }[] = [
    { tone: 'Gentle', description: 'Soft, nurturing communication' },
    { tone: 'Direct', description: 'Clear, straightforward responses' },
    { tone: 'Encouraging', description: 'Positive, uplifting language' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-indigo-600" size={20} />
            Helper Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {helperTypes.map(({ type, description }) => (
              <Button
                key={type}
                variant={helperType === type ? 'default' : 'outline'}
                className={`p-4 h-auto flex-col items-start ${
                  helperType === type ? 'bg-indigo-600 hover:bg-indigo-700' : ''
                }`}
                onClick={() => setHelperType(type)}
              >
                <div className="font-medium">{type}</div>
                <div className="text-xs opacity-80">{description}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="text-indigo-600" size={20} />
            Tone Preference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {tonePreferences.map(({ tone, description }) => (
              <Button
                key={tone}
                variant={tonePreference === tone ? 'default' : 'outline'}
                className={`p-4 h-auto flex-col items-start ${
                  tonePreference === tone ? 'bg-indigo-600 hover:bg-indigo-700' : ''
                }`}
                onClick={() => setTonePreference(tone)}
              >
                <div className="font-medium">{tone}</div>
                <div className="text-xs opacity-80">{description}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-900">
              {helperType}
            </Badge>
            <span className="text-gray-400">+</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-900">
              {tonePreference}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            Your AI helper will respond as a {helperType.toLowerCase()} with a {tonePreference.toLowerCase()} tone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};