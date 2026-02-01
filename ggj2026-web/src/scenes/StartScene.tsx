import React from 'react';
import { motion } from 'framer-motion';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';

// --- Assets ---
// Background Image for the Title Screen
const BG_IMAGE_URL = "https://images-ng.pixai.art/images/orig/fd8992d1-c7a8-40ec-b564-bcd89a5e29d3";
// Requirement: 1280x768
// Prompt: "Soft pastel morning sky, abstract watercolor style, sunrise colors, high resolution, minimal, Florence game art style, hand-drawn textures"

export const StartScene: React.FC<SceneProps> = ({ onComplete }) => {
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
      }}
      onClick={onComplete}
    >
      <p style={styles.subtitle}>( Tap to start )</p>
    </motion.div>
  );
};

const styles = {
  subtitle: {
    color: '#fff',
    fontSize: '1.2rem',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
};
