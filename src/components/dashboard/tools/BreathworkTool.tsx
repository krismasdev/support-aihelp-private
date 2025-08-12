import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathworkToolProps {
  onComplete: (data: any) => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

export const BreathworkTool = ({ onComplete }: BreathworkToolProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(5);

  const phaseConfig = {
    inhale: { duration: 4, next: 'hold', text: 'Breathe in' },
    hold: { duration: 4, next: 'exhale', text: 'Hold' },
    exhale: { duration: 6, next: 'pause', text: 'Breathe out' },
    pause: { duration: 2, next: 'inhale', text: 'Pause' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && count > 0) {
      interval = setInterval(() => {
        setCount(count - 1);
      }, 1000);
    } else if (isActive && count === 0) {
      const currentPhase = phaseConfig[phase];
      const nextPhase = currentPhase.next as Phase;
      
      if (phase === 'pause') {
        setCycle(cycle + 1);
        if (cycle + 1 >= totalCycles) {
          setIsActive(false);
          onComplete({
            type: 'breathwork',
            pattern: '4-4-6-2',
            cycles: totalCycles,
            insight: 'Completed breathing exercise'
          });
          return;
        }
      }
      
      setPhase(nextPhase);
      setCount(phaseConfig[nextPhase].duration);
    }
    
    return () => clearInterval(interval);
  }, [isActive, count, phase, cycle, totalCycles, onComplete]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
  };

  const handlePause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };

  const getCircleSize = () => {
    const baseSize = 120;
    const maxSize = 180;
    
    if (phase === 'inhale') {
      const progress = (phaseConfig.inhale.duration - count) / phaseConfig.inhale.duration;
      return baseSize + (maxSize - baseSize) * progress;
    } else if (phase === 'exhale') {
      const progress = count / phaseConfig.exhale.duration;
      return baseSize + (maxSize - baseSize) * progress;
    }
    
    return phase === 'hold' ? maxSize : baseSize;
  };

  return (
    <Card>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Cycle {cycle + 1} of {totalCycles}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((cycle) / totalCycles) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div 
              className="rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium transition-all duration-1000 ease-in-out"
              style={{ 
                width: `${getCircleSize()}px`, 
                height: `${getCircleSize()}px`,
                opacity: isActive ? 0.8 : 0.6
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm opacity-90">
                  {phaseConfig[phase].text}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              {!isActive && cycle === 0 && "Ready to begin a calming breathing exercise?"}
              {isActive && "Follow the circle and breathe naturally"}
              {!isActive && cycle > 0 && "Great work! How do you feel?"}
            </p>

            <div className="flex gap-3 justify-center">
              {!isActive && cycle === 0 && (
                <Button onClick={handleStart} className="bg-indigo-600 hover:bg-indigo-700">
                  <Play size={16} className="mr-2" />
                  Start Breathing
                </Button>
              )}
              
              {isActive && (
                <Button onClick={handlePause} variant="outline">
                  <Pause size={16} className="mr-2" />
                  Pause
                </Button>
              )}
              
              {(isActive || cycle > 0) && (
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};