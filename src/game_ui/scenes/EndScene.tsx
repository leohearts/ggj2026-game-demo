import React from 'react';
import { motion } from 'framer-motion';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';

// --- Assets ---
const END_BG_URL = "https://placehold.co/1280x768/2c3e50/ffffff?text=Ready";
// Requirement: 1280x768
// Prompt: "Front door interior view, shoes arranged, backpack ready, soft morning light, watercolor style, Florence game art style, hand-drawn, pastel colors, emotional atmosphere"

export const EndScene: React.FC<SceneProps> = ({ onComplete }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
        ...commonStyles.sceneContainer,
        backgroundImage: `url(${END_BG_URL})`,
        backgroundSize: 'cover',
    }}
    onClick={onComplete}
  >
    <h1 style={{ color: 'white', fontSize: '4rem', fontWeight: 300 }}>Ready.</h1>
  </motion.div>
);
