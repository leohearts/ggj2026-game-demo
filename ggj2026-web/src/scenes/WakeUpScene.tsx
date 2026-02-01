import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';

// --- Assets ---
const CLOCK_BG_URL = "https://images-ng.pixai.art/images/orig/df1368b2-fada-4e6d-bc53-b49d683aa429";
// Requirement: 1280x768
// Prompt: "Bedroom ceiling view from bed, morning sunlight, blurry depth of field, cozy atmosphere, watercolor style, Florence game art style, soft pastel colors, hand-drawn"

export const WakeUpScene: React.FC<SceneProps> = ({ onComplete }) => {
  const [clarity, setClarity] = useState(0); // 0 to 100

  const handleTap = () => {
    const newClarity = clarity + 15;
    if (newClarity >= 100) {
      setClarity(100);
      setTimeout(onComplete, 1000); // Pause briefly before transition
    } else {
      setClarity(newClarity);
    }
  };

  // Slowly fade back to sleep if not interacting
  useEffect(() => {
    const interval = setInterval(() => {
      setClarity(c => Math.max(0, c - 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const blurAmount = 20 - (clarity / 100) * 20;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        ...commonStyles.sceneContainer,
        backgroundImage: `url(${CLOCK_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleTap}
    >
      <div style={{...commonStyles.centerContent, filter: `blur(${blurAmount}px)`}}>
        <div style={styles.clockFace}>7:00</div>
        <p style={{marginTop: 20, color: '#5d4037'}}>Tap to wake up</p>
      </div>
      
      {/* Progress Indicator */}
      <div style={styles.progressBarWrapper}>
        <motion.div 
          style={styles.progressBar} 
          animate={{ width: `${clarity}%` }}
        />
      </div>
    </motion.div>
  );
};

const styles = {
  clockFace: {
    fontSize: '8rem',
    fontWeight: 'bold' as const,
    color: '#fab1a0',
    textShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  progressBarWrapper: {
    position: 'absolute' as const,
    bottom: 50,
    width: '300px',
    height: '6px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fab1a0',
  },
};
