import { generateObject } from 'xsai';
import { z } from 'zod';

const LLM_CONFIG = {
  apiKey: 'sk-_MKrW68MD72R7J7g8nvfiA',
  baseURL: 'https://litellm.leohearts.com/v1/',
};

export interface EmotionAnalysisResult {
  emotion: 'happy' | 'angry' | 'neutral' | 'sad' | 'surprised';
  confidence: number;
  // description: string;
}

export const analyzeEmotion = async (base64Image: string): Promise<EmotionAnalysisResult> => {
  try {
    const { object } = await generateObject({
      ...LLM_CONFIG,
      model: 'gemini/gemini-2.5-flash',
      schema: z.object({
        emotion: z.enum(['happy', 'angry', 'neutral', 'sad', 'surprised']),
        confidence: z.number(),
        // description: z.string(),
      }),
      messages: [
        {
          role: 'system',
          content: 'You are an emotion detection system. Analyze the facial expression in the image. Return the emotion, confidence level (0-1)'
          // + ', and a brief description.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ]
    });

    return object;
  } catch (error) {
    console.error("Emotion analysis failed:", error);
    return {
      emotion: 'neutral',
      confidence: 0,
      // description: "Analysis failed"
    };
  }
};
