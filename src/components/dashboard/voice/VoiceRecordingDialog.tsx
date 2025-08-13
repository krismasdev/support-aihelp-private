import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Send, X, AlertTriangle } from 'lucide-react';

interface VoiceRecordingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSendRecording: (audioBlob: Blob) => void;
}

export const VoiceRecordingDialog = ({ isOpen, onClose, onSendRecording }: VoiceRecordingDialogProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      
      // Audio visualization
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      const updateAudio = () => {
        if (!isRecording) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        animationRef.current = requestAnimationFrame(updateAudio);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      updateAudio();
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Cannot access microphone. Please check your microphone connection and permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSendRecording(audioBlob);
      handleClose();
    }
  };

  const handleClose = () => {
    if (isRecording) stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
    setAudioLevel(0);
    setError(null);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const audioLevels = Array.from({ length: 20 }, (_, i) => 
    Math.sin((Date.now() / 100) + i) * audioLevel * 0.5 + 0.1
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Recording
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
            <div className="flex items-end gap-1 h-20">
              {audioLevels.map((level, index) => (
                <div
                  key={index}
                  className="bg-indigo-500 rounded-t transition-all duration-100"
                  style={{
                    width: '4px',
                    height: `${Math.max(4, Math.abs(level) * 80)}px`,
                    opacity: isRecording ? 0.7 + Math.abs(level) * 0.3 : 0.3
                  }}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            {isRecording ? (
              <div>
                <p className="text-lg font-medium text-red-600">Recording...</p>
                <p className="text-sm text-gray-500">{formatTime(recordingTime)}</p>
              </div>
            ) : audioBlob ? (
              <div>
                <p className="text-lg font-medium text-green-600">Recording Complete</p>
                <p className="text-sm text-gray-500">Duration: {formatTime(recordingTime)}</p>
              </div>
            ) : (
              <p className="text-gray-600">Tap the microphone to start recording</p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {!isRecording && !audioBlob && (
              <Button onClick={startRecording} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600">
                <Mic className="w-6 h-6 text-white" />
              </Button>
            )}
            
            {isRecording && (
              <Button onClick={stopRecording} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600">
                <MicOff className="w-6 h-6 text-white" />
              </Button>
            )}
            
            {audioBlob && (
              <>
                <Button onClick={() => { setAudioBlob(null); setRecordingTime(0); }} variant="outline" className="w-16 h-16 rounded-full">
                  <X className="w-6 h-6" />
                </Button>
                <Button onClick={handleSend} className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600">
                  <Send className="w-6 h-6 text-white" />
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};