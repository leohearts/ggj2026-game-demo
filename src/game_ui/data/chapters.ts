import { Chapter } from '../types';
import { WakeUpScene } from '../scenes/WakeUpScene';
import { BrushTeethScene } from '../scenes/BrushTeethScene';
import { WaveGoodbyeScene } from '../scenes/WaveGoodbyeScene';
import { BullyScene } from '../scenes/BullyScene';
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
    title: "Confrontation",
    scenes: [BullyScene]
  },
  {
    title: "The End",
    scenes: [EndScene]
  }
];
