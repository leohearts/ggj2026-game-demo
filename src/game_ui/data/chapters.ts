import { Chapter } from '../types';
import { WakeUpScene } from '../scenes/WakeUpScene';
import { BrushTeethScene } from '../scenes/BrushTeethScene';
import { WaveGoodbyeScene } from '../scenes/WaveGoodbyeScene';
import { QuarrelScene } from '../scenes/QuarrelScene';
import { EndScene } from '../scenes/EndScene';

export const CHAPTERS: Chapter[] = [
  {
    title: "Morning Routine",
    scenes: [WakeUpScene, BrushTeethScene]
  },
  {
    title: "Departure",
    scenes: [WaveGoodbyeScene]
  },
  {
    title: "Conflict",
    scenes: [QuarrelScene]
  },
  {
    title: "The End",
    scenes: [EndScene]
  }
];
