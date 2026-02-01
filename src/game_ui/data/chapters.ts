import { Chapter } from '../types';
import { WakeUpScene } from '../scenes/WakeUpScene';
import { BrushTeethScene } from '../scenes/BrushTeethScene';
import { WaveGoodbyeScene } from '../scenes/WaveGoodbyeScene';
import { BullyScene } from '../scenes/BullyScene';
import { EndScene } from '../scenes/EndScene';

export const CHAPTERS: Chapter[] = [
  {
    title: "早晨的日常",
    scenes: [WakeUpScene, BrushTeethScene]
  },
  {
    title: "出门",
    scenes: [WaveGoodbyeScene]
  },
  {
    title: "冲突",
    scenes: [BullyScene]
  },
  {
    title: "结局",
    scenes: [EndScene]
  }
];
