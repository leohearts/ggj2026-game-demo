import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StartScene } from './scenes/StartScene';
import { WakeUpScene } from './scenes/WakeUpScene';
import { BrushTeethScene } from './scenes/BrushTeethScene';
import { EndScene } from './scenes/EndScene';

// --- Types ---
type SceneId = 'START' | 'WAKE_UP' | 'BRUSH_TEETH' | 'END';

// --- Main App Component (The Director) ---
export default function App() {
  const [currentScene, setCurrentScene] = useState<SceneId>('START');

  // Simple state machine for scene flow
  const handleNext = () => {
    if (currentScene === 'START') setCurrentScene('WAKE_UP');
    else if (currentScene === 'WAKE_UP') setCurrentScene('BRUSH_TEETH');
    else if (currentScene === 'BRUSH_TEETH') setCurrentScene('END');
    else if (currentScene === 'END') setCurrentScene('START');
  };

  return (
    <div className="game-frame">
      <AnimatePresence mode="wait">
        {currentScene === 'START' && (
          <StartScene key="start" onComplete={handleNext} />
        )}
        {currentScene === 'WAKE_UP' && (
          <WakeUpScene key="wake" onComplete={handleNext} />
        )}
        {currentScene === 'BRUSH_TEETH' && (
          <BrushTeethScene key="brush" onComplete={handleNext} />
        )}
        {currentScene === 'END' && (
          <EndScene key="end" onComplete={handleNext} />
        )}
      </AnimatePresence>
    </div>
  );
}
