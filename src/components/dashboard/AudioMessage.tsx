import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface AudioMessageProps {
  audioUrl: string;
  isUser?: boolean;
}

export const AudioMessage = ({ audioUrl, isUser = false }: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg min-w-48 ${
      isUser ? 'bg-indigo-600' : 'bg-gray-100'
    }`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <Button
        size="sm"
        onClick={togglePlayPause}
        className={`flex items-center gap-2 px-3 py-1 text-sm font-medium ${
          isUser 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        {isPlaying ? 'Pause' : 'Play Audio'}
      </Button>
      
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${
          isUser ? 'text-white' : 'text-gray-700'
        }`}>
          Voice message
        </span>
        <span className={`text-xs ${
          isUser ? 'text-indigo-200' : 'text-gray-500'
        }`}>
          {formatTime(isPlaying ? currentTime : duration)}
        </span>
      </div>
    </div>
  );
};