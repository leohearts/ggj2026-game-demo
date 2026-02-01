import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';
import { detectEmotion, loadModels } from '../../services/faceApiService';
import WebcamFeed from '../../components/WebcamFeed';

// --- Assets ---
const BULLY_BG_URL = "https://images-ng.pixai.art/images/orig/bc82bb89-1198-46df-855b-a3f2fb227099"; 
const BULLY_SPRITE_URL = "https://images-ng.pixai.art/images/orig/c2782004-a9ec-4597-ae62-ee6e9c2bf1bf"; 

type GameState = 'INTRO' | 'CHOICE' | 'RESULT' | 'OUTRO';

// Define options for each emotion
const EMOTION_OPTIONS: Record<string, { label: string, response: string, style?: React.CSSProperties }> = {
  happy: { 
    label: "[微笑] 嘿，放轻松点嘛。", 
    response: "哈？你脑子坏掉了吗？还在笑？" 
  },
  sad: { 
    label: "[悲伤] 为什么是我...", 
    response: "别在那装可怜！看着就烦。" 
  },
  angry: { 
    label: "[愤怒] 给我滚开！", 
    response: "你...！你竟敢顶嘴？！",
    style: { backgroundColor: '#d63031', color: 'white', boxShadow: '0 0 20px rgba(214, 48, 49, 0.6)' }
  },
  neutral: { 
    label: "[冷漠] (无视他直接走开)", 
    response: "喂！我在跟你说话呢！别走！" 
  },
  surprised: { 
    label: "[惊讶] 你是在跟我说话？", 
    response: "废话！这里还有别人吗？" 
  },
  disgusted: { 
    label: "[厌恶] 离我远点。", 
    response: "你那是什么眼神？！" 
  },
  fearful: { 
    label: "[恐惧] 别、别打我...", 
    response: "哼，知道怕就好。" 
  },
};

export const BullyScene: React.FC<SceneProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<GameState>('INTRO');
  const [emotion, setEmotion] = useState<string>('neutral');
  const [dialogue, setDialogue] = useState("喂！说你呢。你以为你很特别吗？");
  const [showWebcam, setShowWebcam] = useState(false);
  
  // Load models on mount
  useEffect(() => {
    loadModels();
    setTimeout(() => setShowWebcam(true), 1000);
  }, []);

  const handleFrame = async (base64Image: string) => {
    const img = new Image();
    img.src = base64Image;
    await img.decode();
    
    const result = await detectEmotion(img);
    if (result) {
      setEmotion(result.emotion);
    }
  };

  const handleChoice = (optionKey: string) => {
    setGameState('RESULT');
    
    if (optionKey === 'default') {
      setDialogue("算你识相。");
    } else {
      const option = EMOTION_OPTIONS[optionKey];
      if (option) {
        setDialogue(option.response);
      }
    }
    
    setTimeout(onComplete, 3000);
  };

  // Intro sequence
  useEffect(() => {
    if (gameState === 'INTRO') {
      const timer = setTimeout(() => {
        setGameState('CHOICE');
        setDialogue("怎么？我在等你道歉呢。");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Determine which dynamic option to show
  const currentOption = EMOTION_OPTIONS[emotion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        ...commonStyles.sceneContainer,
        backgroundImage: `url(${BULLY_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Webcam Feed (Hidden or Small) */}
      {showWebcam && (
        <div style={{ position: 'absolute', top: 20, right: 20, width: 150, opacity: 0.7, borderRadius: 10, overflow: 'hidden' }}>
           <WebcamFeed onFrameCapture={handleFrame} interval={500} showFeed={true} />
           <div style={{ background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 10, padding: 2, textAlign: 'center' }}>
             Detected: {emotion}
           </div>
        </div>
      )}

      {/* The Bully */}
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }} // Breathing effect
        style={styles.bullyContainer}
      >
        <img 
          src={BULLY_SPRITE_URL} 
          alt="Bully" 
          style={{
            height: '80vh',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
          }} 
        />
      </motion.div>

      {/* Dialogue Box */}
      <div style={styles.dialogueBox}>
        <p style={styles.dialogueText}>{dialogue}</p>
      </div>

      {/* Choices */}
      <AnimatePresence>
        {gameState === 'CHOICE' && (
          <div style={styles.choicesContainer}>
            {/* Default Option: Submit */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.button}
              onClick={() => handleChoice('default')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              [认怂] "对不起，对不起..."
            </motion.button>

            {/* Dynamic Option based on Emotion */}
            {currentOption && (
              <motion.button
                key={emotion} // Re-render when emotion changes
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  ...styles.button,
                  ...(currentOption.style || {}) // Apply custom styles if any (e.g. for angry)
                }}
                onClick={() => handleChoice(emotion)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentOption.label}
              </motion.button>
            )}
          </div>
        )}
      </AnimatePresence>
      
      {/* Hint */}
      {gameState === 'CHOICE' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={styles.hint}
        >
          (提示：尝试做出不同的表情来解锁选项)
        </motion.div>
      )}

    </motion.div>
  );
};

const styles = {
  bullyContainer: {
    position: 'absolute' as const,
    bottom: -50,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    pointerEvents: 'none' as const,
  },
  dialogueBox: {
    position: 'absolute' as const,
    bottom: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '20px 40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    maxWidth: '80%',
    textAlign: 'center' as const,
  },
  dialogueText: {
    fontSize: '1.5rem',
    color: '#2d3436',
    fontWeight: 500,
  },
  choicesContainer: {
    position: 'absolute' as const,
    bottom: '10%',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1.2rem',
    borderRadius: '50px',
    border: 'none',
    backgroundColor: '#dfe6e9',
    color: '#636e72',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    fontWeight: 'bold' as const,
    minWidth: '200px',
  },
  hint: {
    position: 'absolute' as const,
    bottom: 20,
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  }
};
