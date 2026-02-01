import React, { createContext, useContext, useState, ReactNode } from 'react';

// Track player choices and mask integrity throughout the game
interface GameState {
    // Chapter 3 choice: 'submit' = 认怂, or the emotion-based choice
    bullyChoice: 'submit' | 'angry' | 'sad' | 'neutral' | 'happy' | 'surprised' | 'disgusted' | 'fearful' | null;
    // Mask integrity: starts at 100, decreases when player shows true emotions
    maskIntegrity: number;
    // Whether player broke from social norms
    brokeMask: boolean;
}

interface GameContextType {
    gameState: GameState;
    setBullyChoice: (choice: GameState['bullyChoice']) => void;
    decreaseMaskIntegrity: (amount: number) => void;
    resetGame: () => void;
}

const initialState: GameState = {
    bullyChoice: null,
    maskIntegrity: 100,
    brokeMask: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>(initialState);

    const setBullyChoice = (choice: GameState['bullyChoice']) => {
        setGameState(prev => ({
            ...prev,
            bullyChoice: choice,
            // Breaking from social norms if not submitting
            brokeMask: choice !== 'submit' && choice !== null,
            // Decrease mask integrity for non-conforming choices
            maskIntegrity: choice === 'submit' ? prev.maskIntegrity : Math.max(0, prev.maskIntegrity - 30),
        }));
    };

    const decreaseMaskIntegrity = (amount: number) => {
        setGameState(prev => ({
            ...prev,
            maskIntegrity: Math.max(0, prev.maskIntegrity - amount),
            brokeMask: prev.maskIntegrity - amount < 50,
        }));
    };

    const resetGame = () => {
        setGameState(initialState);
    };

    return (
        <GameContext.Provider value={{ gameState, setBullyChoice, decreaseMaskIntegrity, resetGame }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameState = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameProvider');
    }
    return context;
};
