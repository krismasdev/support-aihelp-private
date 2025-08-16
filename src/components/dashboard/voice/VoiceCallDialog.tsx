import { useState, useEffect } from 'react';
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

export const VoiceCallDialog = ({ isOpen, onClose }: VoiceCallDialogProps) => {
  const { helpers, activeHelper, setActiveHelper } = useAppContext();
  const [selectedHelper, setSelectedHelper] = useState(activeHelper);
  const [step, setStep] = useState<'helper' | 'iframe'>('helper');

  const handleHelperSelect = (helper: any) => {
    setSelectedHelper(helper);
    setStep('iframe');
  };

  // Inject external script and custom CSS when showing iframe
  useEffect(() => {
    if (step === 'iframe') {
      const scriptId = "ehealer-form-embed";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.src = "https://ehealer.link/js/form_embed.js";
        script.type = "text/javascript";
        script.id = scriptId;
        document.body.appendChild(script);
      }
    }
  }, [step]);

  const renderHelperSelection = () => (
    <div className="space-y-4">
      <p className="text-gray-600 text-center">Choose who you'd like to have a voice call with:</p>
      <div className="grid gap-3">
        {helpers.map((helper) => (
          <Card
            key={helper.calendar_id}
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-indigo-200"
            onClick={() => handleHelperSelect(helper)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-indigo-100 text-indigo-900 text-lg">
                    <img src={helper.avatar} alt={helper.description} className="w-full h-full object-cover rounded-full" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{helper.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-purple-100 text-purple-800 text-xs">{helper.type}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">4.9</span>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700 shadow-lg">{helper.minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md shadow-lg">
                        <span className="text-xs text-green-600">$</span>
                        <span className="text-xs font-semibold text-green-700">{helper.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );



  const renderIframe = () => {
    // Use the calendar_url from the selected helper's data
    const src = selectedHelper?.calendar_url || "";
    const id = selectedHelper?.calendar_id || "";

    return (
      <div className="space-y-6">
        <iframe
          src={src}
          style={{
            width: "100%",
            height: "600px",
            border: "none",
            background: "white"
          }}
          scrolling="auto"
          id={id}
          title="Helper Booking Calendar"
        />
        <Button variant="outline" onClick={() => setStep('helper')}>
          Back
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={step !== 'iframe' ? "max-w-md" : "max-w-6xl"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {step === 'helper' && 'Start Voice Call'}
            {step === 'iframe' && 'Schedule Your Call'}
          </DialogTitle>
        </DialogHeader>

        {step === 'helper' && renderHelperSelection()}
        {step === 'iframe' && renderIframe()}
      </DialogContent>
    </Dialog>
  );
};