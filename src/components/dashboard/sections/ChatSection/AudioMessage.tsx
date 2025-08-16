import { useRef, useState } from 'react';

export function AudioMessage({
  audioUrl,
  pending,
}: {
  audioUrl: string;
  pending?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handlePause = () => setPlaying(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlay}
          className="p-1 rounded-full bg-indigo-100 hover:bg-indigo-200"
          title="Play audio"
          type="button"
        >
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M11 5L18 12L11 19V5Z" />
          </svg>
        </button>
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handlePause}
          onPause={handlePause}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}