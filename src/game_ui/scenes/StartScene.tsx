import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';
import { CHAPTERS } from '../data/chapters';

// --- Assets ---
const BG_IMAGE_URL = "https://images-ng.pixai.art/images/orig/fd8992d1-c7a8-40ec-b564-bcd89a5e29d3";

export const StartScene: React.FC<SceneProps & { onChapterSelect?: (index: number) => void }> = ({ onComplete, onChapterSelect }) => {
  const [showChapters, setShowChapters] = useState(false);
  // In a real app, this would be persisted state
  const unlockedIndex = 0;

  const handleStart = () => {
    setShowChapters(true);
  };

  const handleChapterSelect = (index: number) => {
    if (onChapterSelect) {
      onChapterSelect(index);
    } else if (index <= unlockedIndex) {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        ...commonStyles.sceneContainer,
        backgroundImage: `url(${BG_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        justifyContent: showChapters ? 'flex-start' : 'center',
        paddingTop: showChapters ? 60 : 0,
        transition: 'all 0.8s ease-in-out',
      }}
    >
      {/* Title Section */}
      <motion.div
        layout
        style={{
          textAlign: 'center',
          marginBottom: showChapters ? 30 : 0,
          zIndex: 10
        }}
      >
        <h1 style={{
          fontSize: '3rem',
          color: '#fff',
          marginBottom: 10,
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          fontFamily: '"Helvetica Neue", sans-serif',
          fontWeight: 300
        }}>
          Untitled game
        </h1>

        {!showChapters && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={styles.subtitle}
            onClick={handleStart}
            whileHover={{ scale: 1.1 }}
          >
            ( Tap to start )
          </motion.p>
        )}
      </motion.div>

      {/* Chapter Grid */}
      <AnimatePresence>
        {showChapters && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={styles.chapterGrid}
          >
            {CHAPTERS.map((chapter, index) => {
              const isLocked = index > unlockedIndex;
              const isCurrent = index === unlockedIndex;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isLocked ? 0.5 : 1,
                    scale: 1,
                    filter: isLocked ? 'grayscale(100%)' : 'none'
                  }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  style={{
                    ...styles.chapterCard,
                    cursor: 'pointer', // Always pointer to indicate clickable
                  }}
                  onClick={() => handleChapterSelect(index)}
                  whileHover={!isLocked ? {
                    scale: 1.05,
                    y: -5,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                >
                  {/* "Polaroid" Image Area */}
                  <div style={{
                    ...styles.cardImage,
                    backgroundColor: getChapterColor(index),
                  }}>
                    {isLocked && (
                      <div style={styles.lockIcon}>🔒</div>
                    )}
                    {isCurrent && (
                      <motion.div
                        style={styles.playIcon}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        ▶
                      </motion.div>
                    )}
                  </div>

                  {/* Chapter Info */}
                  <div style={styles.cardContent}>
                    <div style={styles.chapterNumber}>Chapter {index + 1}</div>
                    <div style={styles.chapterTitle}>{chapter.title}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper to give each chapter a distinct color/vibe
const getChapterColor = (index: number) => {
  const colors = ['#fab1a0', '#74b9ff', '#ff7675', '#a29bfe'];
  return colors[index % colors.length];
};

const styles = {
  subtitle: {
    color: '#fff',
    fontSize: '1.2rem',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    marginTop: 20,
  },
  chapterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '25px',
    width: '100%',
    maxWidth: '800px',
    padding: '20px',
    justifyItems: 'center',
  },
  chapterCard: {
    backgroundColor: '#fff',
    padding: '10px 10px 20px 10px',
    borderRadius: '4px', // Slight rounding for card feel
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '160px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    transformOrigin: 'center center',
  },
  cardImage: {
    width: '100%',
    height: '120px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    position: 'relative' as const,
  },
  cardContent: {
    textAlign: 'center' as const,
  },
  chapterNumber: {
    fontSize: '0.7rem',
    color: '#b2bec3',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  chapterTitle: {
    fontSize: '0.9rem',
    color: '#2d3436',
    fontWeight: 500,
    lineHeight: '1.2',
  },
  lockIcon: {
    fontSize: '24px',
    opacity: 0.5,
  },
  playIcon: {
    fontSize: '24px',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }
};
