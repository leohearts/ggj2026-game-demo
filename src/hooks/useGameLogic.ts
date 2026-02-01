import { useState, useCallback } from 'react';
import { analyzeEmotion, type EmotionAnalysisResult } from '../services/llmService';

export interface GameState {
    currentEmotion: EmotionAnalysisResult | null;
    history: EmotionAnalysisResult[];
    personaIntegrity: number; // 0-100
    instruction: string;
}

export const useGameLogic = () => {
    const [gameState, setGameState] = useState<GameState>({
        currentEmotion: null,
        history: [],
        personaIntegrity: 100,
        instruction: "Maintain social composure. Smile politely.",
    });

    // No initialization needed for LLM service (stateless/API based)

    const handleFrame = useCallback(async (base64Image: string) => {
        // Fire and forget - don't wait for previous requests
        try {
            // DIRECTLY call LLM analysis without OpenCV cropping
            const result = await analyzeEmotion(base64Image);

            setGameState(prev => {
                // Logic: If angry, damage persona
                let newIntegrity = prev.personaIntegrity;

                if (result.emotion === 'angry') {
                    newIntegrity = Math.max(0, newIntegrity - 10);
                } else if (result.emotion === 'happy') {
                    // restore slightly or maintain
                    newIntegrity = Math.min(100, newIntegrity + 2);
                }

                return {
                    ...prev,
                    currentEmotion: result,
                    history: [...prev.history, result].slice(-10),
                    personaIntegrity: newIntegrity
                };
            });
        } catch (error) {
            console.error("Emotion analysis failed", error);
        }
    }, []);

    return {
        gameState,
        handleFrame
    };
};
