import { useState } from 'react';
import './styles.css';
import { AnimatePresence } from 'framer-motion';
import { StartScene } from './scenes/StartScene';
import { ChapterTransition } from './components/ChapterTransition';
import { CHAPTERS } from './data/chapters';

// --- Main App ---

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(false);

  // Start the game
  const handleStartGame = (chapterIndex: number = 0) => {
    setGameStarted(true);
    setShowTransition(true); // Show first chapter title
    setCurrentChapterIndex(chapterIndex);
    setCurrentSceneIndex(0);
  };

  // Called when a scene finishes
  const handleSceneComplete = () => {
    const currentChapter = CHAPTERS[currentChapterIndex];
    
    // Check if there are more scenes in this chapter
    if (currentSceneIndex < currentChapter.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      // Chapter finished
      if (currentChapterIndex < CHAPTERS.length - 1) {
        // Prepare next chapter
        setCurrentChapterIndex(currentChapterIndex + 1);
        setCurrentSceneIndex(0);
        setShowTransition(true);
      } else {
        // Game Over (Back to start for now)
        setGameStarted(false);
      }
    }
  };

  // Called when chapter transition finishes
  const handleTransitionComplete = () => {
    setShowTransition(false);
  };

  // Render Logic
  const renderContent = () => {
    if (!gameStarted) {
      return <StartScene onComplete={() => handleStartGame(0)} onChapterSelect={handleStartGame} />;
    }

    if (showTransition) {
      const previousChapters = CHAPTERS
        .slice(0, currentChapterIndex)
        .map(c => c.title);
        
      return (
        <ChapterTransition
          key={`transition-${currentChapterIndex}`}
          chapterNumber={currentChapterIndex + 1}
          title={CHAPTERS[currentChapterIndex].title}
          previousChapters={previousChapters}
          onComplete={handleTransitionComplete}
        />
      );
    }

    // Render Current Scene
    const CurrentSceneComponent = CHAPTERS[currentChapterIndex].scenes[currentSceneIndex];
    return (
      <CurrentSceneComponent 
        key={`scene-${currentChapterIndex}-${currentSceneIndex}`}
        onComplete={handleSceneComplete} 
      />
    );
  };

  return (
    <div className="game-frame">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}
