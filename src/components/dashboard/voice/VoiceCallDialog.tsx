import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Phone, Star, Video } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface VoiceCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const helperIcons: Record<string, string> = {
  'Spiritual Guide': '🙏',
  'Relationship Coach': '💕',
  'Mental Wellness Helper': '🧠',
  'Career Coach': '💼',
  'Friend & Advisor': '👥',
  'Health Consultant': '🏥'
};

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const dates = [
  { date: 'Today', day: 'Dec 15' },
  { date: 'Tomorrow', day: 'Dec 16' },
  { date: 'Monday', day: 'Dec 17' },
  { date: 'Tuesday', day: 'Dec 18' }
];

export const VoiceCallDialog = ({ isOpen, onClose }: VoiceCallDialogProps) => {
  const { helpers, activeHelper, setActiveHelper } = useAppContext();
  const [selectedHelper, setSelectedHelper] = useState(activeHelper);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState<'helper' | 'schedule' | 'confirm'>('helper');

  const handleHelperSelect = (helper: any) => {
    setSelectedHelper(helper);
    setStep('schedule');
  };

  const handleSchedule = () => {
    if (selectedTime) {
      setStep('confirm');
    }
  };

  const handleConfirm = () => {
    // Here you would integrate with actual scheduling system
    console.log('Scheduling call with:', selectedHelper?.name, selectedDate, selectedTime);
    onClose();
    setStep('helper');
    setSelectedTime('');
  };

  const renderHelperSelection = () => (
    <div className="space-y-4">
      <p className="text-gray-600 text-center">Choose who you'd like to have a voice call with:</p>
      <div className="grid gap-3">
        {helpers.map((helper) => (
          <Card 
            key={helper.id} 
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-indigo-200"
            onClick={() => handleHelperSelect(helper)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-indigo-100 text-indigo-900 text-lg">
                    {helperIcons[helper.type] || '🤖'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{helper.name}</h3>
                  <p className="text-sm text-gray-600">{helper.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-purple-100 text-purple-800 text-xs">{helper.tone}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">4.9</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">$1/min</p>
                  <p className="text-xs text-gray-500">Available now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Avatar className="w-16 h-16 mx-auto mb-3">
          <AvatarFallback className="bg-indigo-100 text-indigo-900 text-xl">
            {helperIcons[selectedHelper?.type || ''] || '🤖'}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{selectedHelper?.name}</h3>
        <p className="text-gray-600">{selectedHelper?.type}</p>
      </div>

      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Select Date
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {dates.map((date) => (
            <Button
              key={date.day}
              variant={selectedDate.day === date.day ? 'default' : 'outline'}
              onClick={() => setSelectedDate(date)}
              className="h-auto p-3"
            >
              <div>
                <p className="font-medium">{date.date}</p>
                <p className="text-xs opacity-75">{date.day}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Select Time
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? 'default' : 'outline'}
              onClick={() => setSelectedTime(time)}
              className="h-auto p-3"
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep('helper')} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSchedule} disabled={!selectedTime} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6 text-center">
      <div className="bg-green-50 p-6 rounded-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Confirm Your Call</h3>
        <p className="text-gray-600 mb-4">You're about to schedule a voice call with:</p>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-indigo-100 text-indigo-900">
                {helperIcons[selectedHelper?.type || ''] || '🤖'}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h4 className="font-semibold">{selectedHelper?.name}</h4>
              <p className="text-sm text-gray-600">{selectedHelper?.type}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{selectedDate.date} ({selectedDate.day})</p>
            </div>
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-medium">{selectedTime}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rate:</span>
              <span className="font-semibold text-green-600">$1/minute</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">You'll only be charged for the actual call duration</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep('schedule')} className="flex-1">
          Back
        </Button>
        <Button onClick={handleConfirm} className="flex-1 bg-green-600 hover:bg-green-700">
          Confirm Call
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {step === 'helper' && 'Start Voice Call'}
            {step === 'schedule' && 'Schedule Your Call'}
            {step === 'confirm' && 'Confirm Call'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'helper' && renderHelperSelection()}
        {step === 'schedule' && renderScheduling()}
        {step === 'confirm' && renderConfirmation()}
      </DialogContent>
    </Dialog>
  );
};