import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const moodData = [
  { day: 'Mon', mood: 3 },
  { day: 'Tue', mood: 4 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 4 },
  { day: 'Fri', mood: 5 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 3 }
];

const themes = [
  { word: 'anxiety', size: 'text-2xl', color: 'text-purple-600' },
  { word: 'work', size: 'text-xl', color: 'text-blue-600' },
  { word: 'stress', size: 'text-lg', color: 'text-red-500' },
  { word: 'family', size: 'text-base', color: 'text-green-600' },
  { word: 'sleep', size: 'text-lg', color: 'text-indigo-600' },
  { word: 'relationships', size: 'text-xl', color: 'text-pink-600' }
];

export const InsightsSection = () => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-indigo-900 mb-2">Insights</h1>
          <p className="text-gray-600">Your emotional patterns and progress.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowDetail(!showDetail)}
          className="flex items-center gap-2"
        >
          {showDetail ? <EyeOff size={16} /> : <Eye size={16} />}
          {showDetail ? 'Show Less' : 'Show More Detail'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={20} />
            Mood Trend This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 gap-2">
            {moodData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-8 h-4 mb-1 rounded-sm ${
                        level <= data.mood ? 'bg-indigo-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>😔 Low</span>
            <span>😊 High</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="text-indigo-600" size={20} />
              Conversation Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center p-4">
              {themes.map((theme, index) => (
                <span
                  key={index}
                  className={`${theme.size} ${theme.color} font-medium hover:opacity-70 cursor-pointer`}
                >
                  {theme.word}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={20} />
              Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Most Discussed</h3>
                <p className="text-sm text-purple-700">You've focused most on anxiety and work stress lately</p>
              </div>
              
              {showDetail && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Anxiety discussions</span>
                    <Badge variant="secondary">12 times</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Work-related topics</span>
                    <Badge variant="secondary">8 times</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sleep concerns</span>
                    <Badge variant="secondary">5 times</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-900 leading-relaxed">
              Over the past week, you've shown resilience in managing work-related stress. 
              Your mood has been relatively stable with some ups and downs, which is completely normal. 
              You've been particularly open about anxiety, and your helper has adapted to provide 
              more grounding techniques in response.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};