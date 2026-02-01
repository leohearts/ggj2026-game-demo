import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { SceneProps } from '../types';
import { commonStyles } from '../utils/styles';
import { loadOpenCV, getCV } from '../../services/opencvCore';
import { calculateMotionCentroid } from '../../services/motionDetectionService';

// --- Assets ---
const MIRROR_BG_URL = "https://placehold.co/1280x768/81ecec/ffffff?text=Bathroom+Mirror";
// Requirement: 1280x768
// Prompt: "Bathroom mirror reflection, clean white tiles, morning light, illustration style, Florence game art style, hand-drawn, pastel colors"

// const TOOTHBRUSH_SPRITE_URL = "https://placehold.co/100x300/0984e3/ffffff?text=Brush";
// Requirement: 100x300, transparent background
// Prompt: "Blue toothbrush, top down view, vector illustration, transparent background, Florence game art style, flat design, hand-drawn"

export const BrushTeethScene: React.FC<SceneProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [brushX, setBrushX] = useState(0);
  const lastX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Webcam & Motion Refs
  const webcamRef = useRef<Webcam>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);
  const previousFrameRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);

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
        // We need to make sure the canvas has an ID for OpenCV if we pass the ID, 
        // or just pass the ID string if we set it. 
        // Let's rely on the ID "motion-debug-canvas" which we will set in the JSX.

        const centroidX = calculateMotionCentroid(video, previousFrameRef.current, "motion-debug-canvas");

        if (centroidX !== null) {
          const width = video.videoWidth;
          // Map centroid (0..width) to range (-1..1)
          // Flip direction: moving left (small x) should equate to brush left (small/negative x)

          const normalizedX = (centroidX / width) - 0.5;
          // Scale it up. -0.5 to 0.5 -> -300 to 300 (Increased range for better coverage)
          const targetX = -4 * (normalizedX * 600 + 225);
          console.log(targetX)
          // Update brush
          const clampedX = Math.max(-200, Math.min(200, targetX));

          // Smooth the movement slightly
          setBrushX(prev => {
            return prev + (clampedX - prev);
          });

          // Calc delta from last frame's position for progress
          // logic similar to handleMove, but using the calculated clampedX
          const delta = Math.abs(clampedX - lastX.current);
          if (delta > 5) {
            setProgress(p => Math.min(100, p + 0.5));
          }
          lastX.current = clampedX;
        }
      }
    }
    requestRef.current = requestAnimationFrame(processVideo);
  };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    // Calculate relative X (-1 to 1)
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (clientX - rect.left) - (rect.width / 2);
    // Clamp visual range (Wider for landscape)
    const clampedX = Math.max(-200, Math.min(200, relativeX));
    setBrushX(clampedX);

    // Detect "scrubbing" motion
    const delta = Math.abs(relativeX - lastX.current);
    if (delta > 5) { // Threshold to ignore jitter
      setProgress(p => Math.min(100, p + 0.5));
    }
    lastX.current = relativeX;
  };

  // Check for completion
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(onComplete, 500);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        ...commonStyles.sceneContainer,
        backgroundImage: `url(${MIRROR_BG_URL})`,
        backgroundSize: 'cover',
      }}
      ref={containerRef}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <h2 style={{ marginBottom: 40, opacity: 0.6, color: '#2d3436' }}>Brush Teeth</h2>

      {/* Hidden Webcam for Motion Detection */}
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
          id="motion-debug-canvas"
          ref={debugCanvasRef}
          width={160}
          height={120}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.5, // Overlay semi-transparently
            pointerEvents: 'none',
            transform: 'scaleX(-1)'
          }}
        />
        {/* Centroid Marker */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${((brushX + 200) / 400) * 100}%`, // Map -200..200 back to 0..100%
          width: 2,
          backgroundColor: 'lime',
          transition: 'left 0.1s linear'
        }} />
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

      {/* The "Teeth" (Background) */}
      <div style={styles.teethContainer}>
        {/* Simple visual representation of dirty teeth getting clean */}
        <div style={{
          ...styles.teethOverlay,
          opacity: 1 - (progress / 100)
        }} />
      </div>

      {/* The Brush (Follows Mouse or Motion) */}
      <motion.div
        style={{
          ...styles.toothbrushWrapper,
          x: brushX
        }}
        animate={{ x: brushX }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Using CSS shapes for now, but ready for image replacement */}
        <div style={styles.bristles} />
        <div style={styles.handle} />
      </motion.div>

      <p style={{ marginTop: 40, opacity: 0.5, color: '#2d3436' }}>Scrub back and forth (Mouse or Shake Hand)</p>
    </motion.div>
  );
};

const styles = {
  teethContainer: {
    width: 400,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 15,
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
    border: '2px solid #dfe6e9',
  },
  teethOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffeaa7', // "Yellow" teeth
    position: 'absolute' as const,
  },
  toothbrushWrapper: {
    marginTop: -20, // Overlap teeth slightly
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    pointerEvents: 'none' as const, // Let clicks pass through
  },
  bristles: {
    width: 80,
    height: 25,
    backgroundColor: '#74b9ff',
    borderRadius: '4px 4px 0 0',
  },
  handle: {
    width: 20,
    height: 120,
    backgroundColor: '#0984e3',
    borderRadius: '0 0 10px 10px',
  },
};
