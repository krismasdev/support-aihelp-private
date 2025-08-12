import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Wrench, Package, TrendingUp } from 'lucide-react';
import type { UserProfile } from '@/pages/Dashboard';

interface HomeSectionProps {
  userProfile: UserProfile;
}

const moodEmojis = ['😔', '😐', '🙂', '😊', '😄'];
const encouragementCards = [
  "You're stronger than you think.",
  "Every small step counts.",
  "It's okay to not be okay sometimes.",
  "You deserve support and care."
];

export const HomeSection = ({ userProfile }: HomeSectionProps) => {
  const todaysCard = encouragementCards[new Date().getDay() % encouragementCards.length];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-indigo-900 mb-2">
          Hi {userProfile.name}, how are you feeling today?
        </h1>
        <p className="text-gray-600">Welcome back to your safe space.</p>
      </div>

      <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-indigo-900 mb-4">How are you feeling?</h3>
          <div className="flex gap-4 justify-center">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                className="text-4xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-white/50"
              >
                {emoji}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageCircle className="mx-auto mb-3 text-indigo-600" size={32} />
            <h3 className="font-medium text-gray-900 mb-2">Resume Chat</h3>
            <p className="text-sm text-gray-600">Continue your conversation</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Wrench className="mx-auto mb-3 text-indigo-600" size={32} />
            <h3 className="font-medium text-gray-900 mb-2">Use a Tool</h3>
            <p className="text-sm text-gray-600">Quick self-help exercises</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Package className="mx-auto mb-3 text-indigo-600" size={32} />
            <h3 className="font-medium text-gray-900 mb-2">Life Resources</h3>
            <p className="text-sm text-gray-600">Explore helpful content</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={20} />
            Daily Encouragement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-indigo-900 font-medium">{todaysCard}</p>
        </CardContent>
      </Card>
    </div>
  );
};