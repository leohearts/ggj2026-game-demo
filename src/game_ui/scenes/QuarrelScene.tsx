import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';

const DIALOGUES = [
  { text: "You're late again.", side: 'left' },
  { text: "I had a meeting!", side: 'right' },
  { text: "You always have an excuse.", side: 'left' },
  { text: "I'm doing this for us!", side: 'right' },
  { text: "It doesn't feel like us.", side: 'left' },
  { text: "What do you want from me?", side: 'right' },
  { text: "Just be here.", side: 'left' },
  { text: "I am here!", side: 'right' },
  { text: "...", side: 'left' },
  { text: "...", side: 'right' },
];

export const QuarrelScene: React.FC<SceneProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);

  const handleClick = () => {
    if (index < DIALOGUES.length) {
      setIndex(index + 1);
    }
  };

  useEffect(() => {
    if (index >= DIALOGUES.length) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [index, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, backgroundColor: '#fff' }}
      animate={{ 
        opacity: 1, 
        backgroundColor: index > 5 ? '#2d3436' : '#fff' // Darkens as argument heats up
      }}
      exit={{ opacity: 0 }}
      style={{
        ...commonStyles.sceneContainer,
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <h2 style={{ 
        position: 'absolute', 
        top: 20, 
        opacity: 0.5, 
        color: index > 5 ? '#dfe6e9' : '#2d3436' 
      }}>
        The Argument
      </h2>

      {DIALOGUES.slice(0, index).map((line, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          style={{
            alignSelf: line.side === 'left' ? 'flex-start' : 'flex-end',
            backgroundColor: line.side === 'left' ? '#ff7675' : '#74b9ff',
            color: 'white',
            padding: '15px 25px',
            borderRadius: 20,
            margin: '10px 40px',
            maxWidth: '60%',
            fontSize: 18 + (i * 1.5), // Gets louder (bigger)
            fontWeight: i > 5 ? 'bold' : 'normal',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {line.text}
        </motion.div>
      ))}

      {index < DIALOGUES.length && (
        <div style={{
          position: 'absolute',
          bottom: 50,
          opacity: 0.5,
          color: index > 5 ? '#dfe6e9' : '#2d3436',
          fontSize: 14
        }}>
          Tap to continue
        </div>
      )}
    </motion.div>
  );
};
