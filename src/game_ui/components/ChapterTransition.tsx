import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { commonStyles } from '../utils/styles';

interface ChapterTransitionProps {
  chapterNumber: number;
  title: string;
  previousChapters: string[];
  onComplete: () => void;
}

export const ChapterTransition: React.FC<ChapterTransitionProps> = ({ 
  chapterNumber, 
  title, 
  previousChapters,
  onComplete 
}) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        ...commonStyles.sceneContainer,
        backgroundColor: '#2d3436',
        color: '#dfe6e9',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Previous Chapters (Faded) */}
        <div style={{ marginBottom: 40, opacity: 0.3 }}>
          {previousChapters.map((prev, i) => (
            <div key={i} style={{ fontSize: 16, marginBottom: 8 }}>
              Chapter {i + 1}: {prev}
            </div>
          ))}
        </div>

        {/* Current Chapter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h3 style={{ fontSize: 24, fontWeight: 'normal', marginBottom: 10 }}>
            Chapter {chapterNumber}
          </h3>
          <h1 style={{ fontSize: 48, fontWeight: 'bold' }}>
            {title}
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
};
