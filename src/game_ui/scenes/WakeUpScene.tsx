import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';
import { loadOpenCV, getCV } from '../../services/opencvCore';
import { calculateMotionCentroid } from '../../services/motionDetectionService';

// --- Assets ---
const CLOCK_BG_URL = "https://images-ng.pixai.art/images/orig/df1368b2-fada-4e6d-bc53-b49d683aa429";

export const WakeUpScene: React.FC<SceneProps> = ({ onComplete }) => {
  const [clarity, setClarity] = useState(0); // 0 to 100
  
  // Webcam & Motion Refs
  const webcamRef = useRef<Webcam>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);
  const previousFrameRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);

  // Shake/Wave Logic Refs
  const lastX = useRef<number | null>(null);
  const lastDirection = useRef<'left' | 'right' | null>(null);
  const shakeCount = useRef(0);
  const lastShakeTime = useRef(0);

  useEffect(() => {
    // Initialize OpenCV
    loadOpenCV().then(() => {
      const cv = getCV();
      if (cv) {
        previousFrameRef.current = new cv.Mat();
        // Start processing loop
        processVideo();
      }
    });

    return () => {
      const cv = getCV();
      if (cv && previousFrameRef.current && !previousFrameRef.current.isDeleted()) {
        previousFrameRef.current.delete();
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const processVideo = () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const cv = getCV();
      if (cv && previousFrameRef.current) {
        const video = webcamRef.current.video;
        
        // Use unique ID or reuse concept
        const centroidX = calculateMotionCentroid(video, previousFrameRef.current, "wakeup-debug-canvas");

        if (centroidX !== null) {
          const currentX = centroidX;
          
          if (lastX.current !== null) {
            const delta = currentX - lastX.current;
            const threshold = 5; // Movement threshold
            
            if (Math.abs(delta) > threshold) {
              const currentDirection = delta > 0 ? 'right' : 'left';
              
              // Check for direction reversal (wave/shake)
              if (lastDirection.current && lastDirection.current !== currentDirection) {
                const now = Date.now();
                // Debounce shakes slightly
                if (now - lastShakeTime.current > 200) {
                  shakeCount.current += 1;
                  lastShakeTime.current = now;
                  
                  // Increase clarity
                  setClarity(prev => {
                    const newVal = prev + 15;
                    if (newVal >= 100) {
                      setTimeout(onComplete, 1000);
                      return 100;
                    }
                    return newVal;
                  });
                }
              }
              
              lastDirection.current = currentDirection;
            }
          }
          
          lastX.current = currentX;
        }
      }
    }
    requestRef.current = requestAnimationFrame(processVideo);
  };

  // Slowly fade back to sleep if not interacting
  useEffect(() => {
    const interval = setInterval(() => {
      setClarity(c => {
        if (c >= 100) return 100; // Don't fade if already fully awake
        return Math.max(0, c - 0.5); // Fade slower
      });
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
    >
      {/* Debug Webcam & Motion Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 160,
        height: 120,
        border: '2px solid red',
        zIndex: 100,
        backgroundColor: 'black'
      }}>
        <Webcam
          ref={webcamRef}
          width={160}
          height={120}
          mirrored
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Motion Mask Canvas */}
        <canvas
          id="wakeup-debug-canvas"
          ref={debugCanvasRef}
          width={160}
          height={120}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.5,
            pointerEvents: 'none',
            transform: 'scaleX(-1)' // Mirror to align with webcam
          }}
        />
        <div style={{
          position: 'absolute',
          top: 2,
          left: 2,
          color: 'lime',
          fontSize: 10,
          fontWeight: 'bold',
          textShadow: '1px 1px 0 #000'
        }}>
          Debug View
        </div>
      </div>

      <div style={{...commonStyles.centerContent, filter: `blur(${blurAmount}px)`}}>
        <div style={styles.clockFace}>7:00</div>
        <p style={{marginTop: 20, color: '#5d4037', fontSize: '1.5rem', fontWeight: 'bold'}}>
          Wave your hand to wake up!
        </p>
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
