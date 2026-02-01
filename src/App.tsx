import WebcamFeed from './components/WebcamFeed';
import { useGameLogic } from './hooks/useGameLogic';
import clsx from 'clsx';
import { Activity, Brain } from 'lucide-react';

function App() {
  const { gameState, handleFrame } = useGameLogic();
  const { currentEmotion, personaIntegrity, instruction } = gameState;

  // Determine theme based on integrity
  const isBroken = personaIntegrity < 50;

  return (
    <div className={clsx(
      "w-screen h-screen flex flex-col items-center justify-center transition-colors duration-1000",
      isBroken ? "bg-black text-red-500" : "bg-gray-50 text-gray-900"
    )}>
      {/* Header / HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest opacity-50">Current Directive</span>
            <h2 className="text-xl font-bold">{instruction}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-xs uppercase tracking-widest opacity-50">Persona Integrity</span>
            <div className="text-xl font-mono font-bold">{personaIntegrity}%</div>
          </div>
          <Activity className={clsx("w-6 h-6", isBroken ? "animate-pulse text-red-600" : "text-green-500")} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xl">
        {/* Background Layer (Visual Novel BG placeholder) */}
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center opacity-50">
          <span className="text-9xl opacity-5 select-none">SCENE 01</span>
        </div>

        {/* Character/Focus Layer */}
        <div className="z-10 flex flex-col items-center gap-8">
          <div className="w-[300px] h-[300px] bg-gray-200 rounded-full border-4 border-white shadow-lg overflow-hidden relative group">
            <WebcamFeed
              onFrameCapture={handleFrame}
              interval={500}
              className="w-full h-full"
              showFeed={true} // Show feed for demo purposes
            />

            {/* Overlay for "Scanning" effect */}
            <div className="absolute inset-0 border-4 border-transparent border-t-green-400 opacity-50 rounded-full animate-spin duration-[3000ms] pointer-events-none" />
          </div>

          {/* Emotion Readout */}
          <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-gray-200 flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">Analysis</span>
              <span className="font-mono text-lg">
                {currentEmotion?.emotion?.toUpperCase() || "SCANNING..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Debug */}
      <div className="absolute bottom-6 text-xs opacity-30 font-mono">
        SYSTEM: v0.1.0-ALPHA // MEMORY: OPTIMAL
      </div>
    </div>
  );
}

export default App;
