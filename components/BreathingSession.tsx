import React, { useState, useEffect, useRef } from 'react';
import { Technique, BreathingPhase } from '../types';
import Button from './Button';

interface BreathingSessionProps {
  technique: Technique;
  onFinish: () => void;
}

const BreathingSession: React.FC<BreathingSessionProps> = ({ technique, onFinish }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsRemainingInPhase, setSecondsRemainingInPhase] = useState(technique.pattern[0].duration);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const timerRef = useRef<number | null>(null);

  const currentPhase: BreathingPhase = technique.pattern[currentPhaseIndex];

  useEffect(() => {
    // Reset when technique changes
    setCurrentPhaseIndex(0);
    setSecondsRemainingInPhase(technique.pattern[0].duration);
    setCyclesCompleted(0);
    setIsActive(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, [technique]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemainingInPhase((prev) => {
          if (prev <= 1) {
            handlePhaseTransition();
            return 0; // Will be reset in transition immediately
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentPhaseIndex]);

  const handlePhaseTransition = () => {
    const nextIndex = (currentPhaseIndex + 1) % technique.pattern.length;
    
    if (nextIndex === 0) {
      setCyclesCompleted(c => c + 1);
    }

    setCurrentPhaseIndex(nextIndex);
    setSecondsRemainingInPhase(technique.pattern[nextIndex].duration);
  };

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  // Helper to determine visual state
  const getVisualState = () => {
    if (!isActive) return 'idle';
    return currentPhase.type;
  };

  const visualState = getVisualState();

  // Styles configuration based on state
  // UPDATED: Using 'sky' for inhale/hold (Celeste) and 'ocean' for exhale (Deep Blue)
  const getCircleStyles = (state: string) => {
    const baseClasses = "absolute inset-0 rounded-full flex items-center justify-center transition-all cubic-bezier(0.4, 0, 0.2, 1) shadow-xl backdrop-blur-sm border-2";
    
    switch (state) {
      case 'inhale':
        return {
          classes: `${baseClasses} bg-sky-400 border-sky-200`,
          scale: 1.3
        };
      case 'hold':
        return {
          classes: `${baseClasses} bg-sky-600 border-sky-400`,
          scale: 1.35 // Slight expansion for hold to feel "full"
        };
      case 'exhale':
        return {
          classes: `${baseClasses} bg-ocean-500 border-ocean-300`, // Deep peaceful blue
          scale: 0.85
        };
      case 'hold_empty':
        return {
          classes: `${baseClasses} bg-mist-400 border-mist-300`,
          scale: 0.85
        };
      default: // idle
        return {
          classes: `${baseClasses} bg-mist-200 border-mist-100`,
          scale: 1.0
        };
    }
  };

  const currentStyle = getCircleStyles(visualState);

  const getInstructionText = () => {
    if (!isActive && cyclesCompleted === 0 && secondsRemainingInPhase === technique.pattern[0].duration) {
      return "Pulsa Iniciar";
    }
    return currentPhase.label;
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto py-6 animate-fade-in relative z-0">
      
      {/* Header Info */}
      <div className="text-center space-y-4 z-10 w-full">
        <h2 className="text-3xl font-bold text-mist-900">{technique.name}</h2>
        
        {/* Progress Dots */}
        <div className="flex gap-2 justify-center items-center h-4">
            {technique.pattern.map((p, i) => (
                <div 
                  key={i} 
                  className={`rounded-full transition-all duration-500 ${
                    i === currentPhaseIndex 
                      ? 'w-8 h-2 bg-sky-500 shadow-sm' 
                      : 'w-2 h-2 bg-mist-300'
                  }`} 
                />
            ))}
        </div>
      </div>

      {/* Main Animation Container */}
      <div className="relative w-80 h-80 flex items-center justify-center my-6">
        
        {/* Layer 1: Ambient Background Pulse (Cool Blue Glow) */}
        <div 
            className={`absolute inset-0 bg-sky-100/40 rounded-full filter blur-3xl transition-transform duration-[4000ms] ease-in-out ${isActive ? 'scale-150 opacity-70' : 'scale-90 opacity-30'}`}
        />
        
        {/* Layer 2: Secondary Ring (Echo Effect) */}
        <div 
            className="absolute rounded-full border border-sky-300/30 z-0"
            style={{
                width: '100%',
                height: '100%',
                transform: (visualState === 'inhale' || visualState === 'hold') ? 'scale(1.45)' : 'scale(0.8)',
                opacity: (visualState === 'inhale') ? 0.4 : 0,
                transition: `all ${isActive ? currentPhase.duration : 0.8}s ease-in-out`
            }}
        />

        {/* Layer 3: Main Breathing Circle */}
        <div className="relative w-56 h-56 flex items-center justify-center z-10">
            <div 
                className={currentStyle.classes}
                style={{
                    transform: `scale(${currentStyle.scale})`,
                    transitionDuration: isActive ? `${currentPhase.duration}s` : '0.8s',
                }}
            >
            </div>
            
            {/* Layer 4: Text Overlay - Always White for contrast on colored circles */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 z-20 pointer-events-none select-none">
                 <div className="transition-all duration-300 transform drop-shadow-md text-center">
                    <span className="block text-2xl font-bold mb-2 leading-tight tracking-wide">
                        {getInstructionText()}
                    </span>
                    {isActive && (
                        <span className="block text-6xl font-medium opacity-95 tabular-nums">
                            {secondsRemainingInPhase}
                        </span>
                    )}
                 </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full space-y-5 px-6 z-10">
        <div className="flex gap-4">
            <Button 
                onClick={toggleSession} 
                fullWidth 
                variant={isActive ? "secondary" : "primary"}
                className="shadow-lg active:scale-95 transition-transform"
            >
                {isActive ? "Pausar" : (cyclesCompleted > 0 || secondsRemainingInPhase < technique.pattern[0].duration) ? "Continuar" : "Iniciar"}
            </Button>
            
            <Button onClick={onFinish} variant="ghost" className="text-sky-600 hover:text-sky-800 hover:bg-sky-50/50">
                Terminar
            </Button>
        </div>
        
        <div className={`text-center transition-all duration-700 ${cyclesCompleted > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-sm text-mist-600 bg-white/80 inline-block px-4 py-2 rounded-full shadow-sm border border-mist-100">
                Ciclos completados: <span className="font-bold text-mist-800">{cyclesCompleted}</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingSession;