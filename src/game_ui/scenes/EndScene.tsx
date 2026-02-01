import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';
import { useGameState } from '../context/GameContext';

// --- Assets ---
// Good ending: Liberation - broken mask, true self emerges
const GOOD_END_BG = "https://images-ng.pixai.art/images/orig/bc82bb89-1198-46df-855b-a3f2fb227099";
// Neutral ending: Cracks appear - some genuine emotion shown
const NEUTRAL_END_BG = "https://images-ng.pixai.art/images/orig/bc82bb89-1198-46df-855b-a3f2fb227099";
// Bad ending: Eternal loop - continues wearing the mask
const BAD_END_BG = "https://images-ng.pixai.art/images/orig/62b887ee-1fbf-4e25-ac45-3a3eeb422746";

// 中等结局对应的情绪
const NEUTRAL_EMOTIONS = ['fearful', 'disgusted', 'sad', 'surprised'];

// 结局文案
const ENDINGS = {
  // 好结局：打破面具
  good: {
    title: "面具碎裂",
    scenes: [
      {
        text: "晚上，你回到了家。",
        delay: 0,
      },
      {
        text: "镜子里映出一张陌生的脸——",
        delay: 2000,
      },
      {
        text: "那是「社会的你」。",
        delay: 4000,
      },
      {
        text: "「今天在外面……你做了什么？」",
        speaker: "面具",
        delay: 6000,
      },
      {
        text: "「我只是……做了自己想做的事。」",
        speaker: "你",
        delay: 8500,
      },
      {
        text: "面具开始出现裂痕。",
        delay: 11000,
      },
      {
        text: "「你知道这样会带来什么后果吗？」",
        speaker: "面具",
        delay: 13000,
      },
      {
        text: "「……我不在乎。」",
        speaker: "你",
        delay: 15500,
      },
      {
        text: "面具碎裂，散落一地。",
        delay: 18000,
        style: { fontSize: '2rem', color: '#e17055' },
      },
      {
        text: "你第一次看清了镜中真正的自己。",
        delay: 21000,
      },
      {
        text: "也许明天，世界会很艰难。",
        delay: 24000,
      },
      {
        text: "但至少，那是属于你自己的选择。",
        delay: 27000,
        style: { fontSize: '1.8rem', color: '#55efc4' },
      },
      {
        text: "— 真 结 局 —",
        delay: 31000,
        style: { fontSize: '3rem', fontWeight: 'bold', color: '#ffeaa7' },
      },
    ],
  },
  // 中等结局：裂痕出现
  neutral: {
    title: "裂痕",
    scenes: [
      {
        text: "晚上，你回到了家。",
        delay: 0,
      },
      {
        text: "镜子里映出一张有些模糊的脸——",
        delay: 2000,
      },
      {
        text: "那是「社会的你」，但好像有些不一样。",
        delay: 4000,
      },
      {
        text: "「今天……你表露了一些情绪。」",
        speaker: "面具",
        delay: 6500,
      },
      {
        text: "「我只是……忍不住。」",
        speaker: "你",
        delay: 9000,
      },
      {
        text: "面具表面出现了细微的裂痕。",
        delay: 11500,
        style: { color: '#fdcb6e' },
      },
      {
        text: "「你知道吗，这样很危险。」",
        speaker: "面具",
        delay: 14000,
      },
      {
        text: "「但也……很真实。」",
        speaker: "面具",
        delay: 16500,
        style: { color: '#81ecec' },
      },
      {
        text: "你伸手触碰镜面，",
        delay: 19000,
      },
      {
        text: "指尖感受到了那道裂痕的温度。",
        delay: 21500,
      },
      {
        text: "也许……这是一个开始。",
        delay: 24000,
        style: { color: '#74b9ff' },
      },
      {
        text: "明天，又是新的一天。",
        delay: 27000,
      },
      {
        text: "但这次，会有些不一样。",
        delay: 29500,
        style: { color: '#a29bfe' },
      },
      {
        text: "— 裂 痕 —",
        delay: 32000,
        style: { fontSize: '3rem', fontWeight: 'bold', color: '#a29bfe' },
      },
    ],
  },
  // 坏结局：继续戴着面具
  bad: {
    title: "日常轮回",
    scenes: [
      {
        text: "晚上，你回到了家。",
        delay: 0,
      },
      {
        text: "镜子里映出一张熟悉的脸——",
        delay: 2000,
      },
      {
        text: "那是「社会的你」。",
        delay: 4000,
      },
      {
        text: "「今天做得很好。」",
        speaker: "面具",
        delay: 6000,
      },
      {
        text: "「是……是吗？」",
        speaker: "你",
        delay: 8000,
      },
      {
        text: "「当然。你很乖，很听话。」",
        speaker: "面具",
        delay: 10000,
      },
      {
        text: "「这样的话，大家都会喜欢你的。」",
        speaker: "面具",
        delay: 12500,
      },
      {
        text: "……",
        delay: 15000,
      },
      {
        text: "你看着镜中微笑的自己，",
        delay: 17000,
      },
      {
        text: "突然分不清哪个才是真实的你。",
        delay: 19500,
      },
      {
        text: "也许……这样也好。",
        delay: 22000,
        style: { color: '#b2bec3' },
      },
      {
        text: "明天，又是新的一天。",
        delay: 25000,
      },
      {
        text: "一切照旧。",
        delay: 28000,
        style: { color: '#636e72' },
      },
      {
        text: "— 日常轮回 —",
        delay: 31000,
        style: { fontSize: '3rem', fontWeight: 'bold', color: '#636e72' },
      },
    ],
  },
};

// 根据 Chapter 3 选择的特殊结局变体
const CHOICE_VARIANTS: Record<string, { intro: string; reflection: string }> = {
  angry: {
    intro: "今天，你对那个霸凌者说出了真心话。",
    reflection: "那一刻的愤怒，是真实的你。",
  },
  sad: {
    intro: "今天，你在那个人面前流露出了真实的悲伤。",
    reflection: "那滴眼泪，是你藏了太久的情绪。",
  },
  fearful: {
    intro: "今天，你承认了自己的恐惧。",
    reflection: "承认脆弱，本身就是一种勇气。",
  },
  disgusted: {
    intro: "今天，你第一次表达了厌恶。",
    reflection: "你终于敢说「不」了。",
  },
  neutral: {
    intro: "今天，你选择了无视那个霸凌者。",
    reflection: "沉默，有时也是一种抵抗。",
  },
  surprised: {
    intro: "今天，你表现出了困惑和惊讶。",
    reflection: "质疑，是觉醒的开始。",
  },
  happy: {
    intro: "今天，你选择用微笑面对一切。",
    reflection: "但那个笑容背后，藏着什么？",
  },
  submit: {
    intro: "今天，你选择了道歉、认怂。",
    reflection: "这个世界需要你这样的乖孩子。",
  },
};

// 判断结局类型
type EndingType = 'good' | 'neutral' | 'bad';

const getEndingType = (brokeMask: boolean, bullyChoice: string | undefined): EndingType => {
  if (bullyChoice === 'angry') {
    return 'good';
  }
  if (bullyChoice != null && NEUTRAL_EMOTIONS.includes(bullyChoice)) {
    return 'neutral';
  }
  return 'bad';
};

const getEndingBg = (endingType: EndingType): string => {
  switch (endingType) {
    case 'good': return GOOD_END_BG;
    case 'neutral': return NEUTRAL_END_BG;
    case 'bad': return BAD_END_BG;
  }
};

export const EndScene: React.FC<SceneProps> = ({ onComplete }) => {
  const { gameState } = useGameState();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showEnding, setShowEnding] = useState(false);

  // Determine which ending based on player choice
  const endingType = getEndingType(gameState.brokeMask, gameState.bullyChoice || undefined);
  console.log(endingType);
  const ending = ENDINGS[endingType];
  const choiceVariant = CHOICE_VARIANTS[gameState.bullyChoice || 'submit'];
  const isGoodEnding = endingType === 'good';

  // Progress through dialogue
  useEffect(() => {
    if (!showEnding) {
      // Show intro first
      const introTimer = setTimeout(() => setShowEnding(true), 3000);
      return () => clearTimeout(introTimer);
    }

    // Progress through ending scenes
    const timers: NodeJS.Timeout[] = [];
    ending.scenes.forEach((scene, index) => {
      const timer = setTimeout(() => {
        setCurrentTextIndex(index);
      }, scene.delay);
      timers.push(timer);
    });

    // Auto complete after all scenes
    const completeTimer = setTimeout(() => {
      // Don't auto-complete, let player click
    }, 35000);
    timers.push(completeTimer);

    return () => timers.forEach(t => clearTimeout(t));
  }, [showEnding, ending.scenes]);

  const bgUrl = getEndingBg(endingType);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      style={{
        ...commonStyles.sceneContainer,
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: showEnding && currentTextIndex >= ending.scenes.length - 1 ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (showEnding && currentTextIndex >= ending.scenes.length - 1) {
          onComplete();
        }
      }}
    >
      {/* Intro: What happened today */}
      <AnimatePresence>
        {!showEnding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.introContainer}
          >
            <motion.p style={styles.introText}>
              {choiceVariant.intro}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{ ...styles.introText, color: isGoodEnding ? '#55efc4' : '#b2bec3', marginTop: 20 }}
            >
              {choiceVariant.reflection}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Ending Dialogue */}
      <AnimatePresence>
        {showEnding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.dialogueContainer}
          >
            {ending.scenes.slice(0, currentTextIndex + 1).map((scene, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index === currentTextIndex ? 1 : 0.5, y: 0 }}
                transition={{ duration: 0.8 }}
                style={styles.dialogueWrapper}
              >
                {scene.speaker && (
                  <span style={{
                    ...styles.speaker,
                    color: scene.speaker === '面具' ? '#b2bec3' : '#ffeaa7',
                  }}>
                    {scene.speaker}：
                  </span>
                )}
                <p style={{
                  ...styles.dialogueText,
                  ...(scene.style || {}),
                }}>
                  {scene.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mask Integrity Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2 }}
        style={styles.maskIndicator}
      >
        <div style={styles.maskLabel}>面具完整度</div>
        <div style={styles.maskBar}>
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${gameState.maskIntegrity}%` }}
            transition={{ duration: 2, delay: 3 }}
            style={{
              ...styles.maskFill,
              backgroundColor: gameState.maskIntegrity > 50 ? '#636e72' : '#e17055',
            }}
          />
        </div>
        <div style={styles.maskPercent}>{gameState.maskIntegrity}%</div>
      </motion.div>

      {/* Click hint */}
      {showEnding && currentTextIndex >= ending.scenes.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={styles.clickHint}
        >
          点击继续...
        </motion.div>
      )}
    </motion.div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  introContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  introText: {
    fontSize: '1.8rem',
    color: '#dfe6e9',
    fontWeight: 300,
    lineHeight: 1.8,
    margin: 0,
  },
  dialogueContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '80%',
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: '20px',
  },
  dialogueWrapper: {
    textAlign: 'center',
  },
  speaker: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginRight: '8px',
  },
  dialogueText: {
    fontSize: '1.5rem',
    color: '#dfe6e9',
    fontWeight: 300,
    lineHeight: 1.6,
    margin: '8px 0',
  },
  maskIndicator: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  maskLabel: {
    color: '#b2bec3',
    fontSize: '0.9rem',
  },
  maskBar: {
    width: '200px',
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  maskFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'background-color 0.5s',
  },
  maskPercent: {
    color: '#dfe6e9',
    fontSize: '0.9rem',
    width: '40px',
  },
  clickHint: {
    position: 'absolute',
    bottom: 30,
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1rem',
    fontStyle: 'italic',
  },
};
