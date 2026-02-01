import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';

// --- Assets ---
const HALLWAY_BG_URL = "https://images-ng.pixai.art/gi/orig/61ee73ce-c40d-47cd-97ef-086d497492f8"; // Placeholder
// Requirement: 1280x768
// Prompt: "Apartment hallway interior, front door open revealing morning light, shoes near the door, coat rack, warm home atmosphere, perspective view looking towards the door"

const PERSON_SPRITE_URL = "https://images-ng.pixai.art/gi/orig/d3393967-0c15-412e-9d22-1d50c7689c1e"; // Placeholder
// Requirement: 768x1280, transparent background
// Prompt: "Young man with messy hair wearing oversized beige sweater and grey sweatpants, standing and waving goodbye, gentle smile, soft morning lighting, full body shot"

const HAND_SPRITE_URL = "https://images-ng.pixai.art/gi/orig/a592d612-ff92-41d9-897b-0ff06de8e103"; // Placeholder
// Requirement: 768x768, transparent background
// Prompt: "First person view of a hand waving, palm open facing forward, fingers slightly spread, soft skin tone"

export const WaveGoodbyeScene: React.FC<SceneProps> = ({ onComplete }) => {
  const [waveCount, setWaveCount] = useState(0);
  const [handX, setHandX] = useState(0);
  const [handRotation, setHandRotation] = useState(0);
  const lastX = useRef(0);
  const direction = useRef<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (clientX - rect.left) - (rect.width / 2);
    
    // Clamp movement
    const clampedX = Math.max(-150, Math.min(150, relativeX));
    setHandX(clampedX);

    // Calculate rotation based on X position for natural wave feel
    setHandRotation(clampedX * 0.2); // Tilt hand as it moves

    // Detect Wave Direction Change
    const delta = relativeX - lastX.current;
    const currentDir = delta > 0 ? 'right' : 'left';

    if (Math.abs(delta) > 2) { // Threshold
      if (direction.current && direction.current !== currentDir) {
        // Direction changed! Count as part of a wave
        setWaveCount(c => Math.min(10, c + 1));
      }
      direction.current = currentDir;
    }
    
    lastX.current = relativeX;
  };

  // Check for completion
  useEffect(() => {
    if (waveCount >= 8) { // Require about 4 full waves (8 direction changes)
      setTimeout(onComplete, 800);
    }
  }, [waveCount, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        ...commonStyles.sceneContainer,
        backgroundColor: '#dfe6e9', // Fallback color
        backgroundImage: `url(${HALLWAY_BG_URL})`,
        backgroundSize: 'cover',
      }}
      ref={containerRef}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX);
      }}
    >
      <h2 style={{marginBottom: 40, opacity: 0.6, color: '#2d3436'}}>Say Goodbye</h2>

      {/* The Other Person */}
      <div style={styles.personContainer}>
         <img 
           src={PERSON_SPRITE_URL} 
           alt="Partner" 
           style={{
             width: 300, // Scaled down from 768px
             height: 'auto',
             filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))'
           }} 
         />
      </div>

      {/* Dialogue Bubble */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={styles.dialogueBubble}
      >
        "Have a nice day."
      </motion.div>

      {/* The Player's Hand */}
      <motion.div 
        style={{
          ...styles.handWrapper,
          x: handX,
          rotate: handRotation,
        }}
        animate={{ x: handX, rotate: handRotation }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* CSS Hand Placeholder - Replace with HAND_SPRITE_URL when ready */}
        <div style={styles.handPalm} />
        <div style={styles.handThumb} />
        <div style={styles.handFingers} />
      </motion.div>

      <p style={{
        marginTop: 'auto', 
        marginBottom: 40, 
        opacity: waveCount >= 8 ? 0 : 0.5, 
        color: '#2d3436',
        transition: 'opacity 0.5s'
      }}>
        Wave your hand
      </p>
    </motion.div>
  );
};

const styles = {
  personContainer: {
    position: 'absolute' as const,
    top: '15%', // Adjusted for sprite
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  dialogueBubble: {
    position: 'absolute' as const,
    top: '15%',
    right: '25%',
    backgroundColor: 'white',
    padding: '15px 25px',
    borderRadius: '20px 20px 20px 0',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    color: '#2d3436',
    fontWeight: 500,
    maxWidth: 200,
    zIndex: 10,
  },
  handWrapper: {
    position: 'absolute' as const,
    bottom: -50, // Start from bottom
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    pointerEvents: 'none' as const,
  },
  handPalm: {
    width: 100,
    height: 120,
    backgroundColor: '#ffccaa', // Skin tone
    borderRadius: '15px 15px 40px 40px',
    position: 'relative' as const,
    zIndex: 2,
  },
  handThumb: {
    position: 'absolute' as const,
    width: 30,
    height: 60,
    backgroundColor: '#ffccaa',
    borderRadius: 15,
    top: 40,
    right: -15,
    transform: 'rotate(30deg)',
    zIndex: 1,
  },
  handFingers: {
    position: 'absolute' as const,
    top: -30,
    width: 90,
    height: 40,
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 1,
  }
};
