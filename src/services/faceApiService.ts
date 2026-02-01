import * as faceapi from '@vladmandic/face-api';

let modelsLoaded = false;

export const loadModels = async (): Promise<void> => {
    if (modelsLoaded) return;

    const MODEL_URL = '/models';
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        modelsLoaded = true;
        console.log("FaceAPI models loaded");
    } catch (e) {
        console.error("Failed to load FaceAPI models", e);
    }
};

export const detectEmotion = async (video: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => {
    if (!modelsLoaded) return null;

    try {
        // Use TinyFaceDetector for speed
        const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        if (detection) {
            const expressions = detection.expressions;
            // Find the expression with the highest score
            const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
            const [emotion, score] = sorted[0];

            return {
                emotion: emotion as 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised' | 'disgusted' | 'fearful',
                confidence: score
            };
        }
        return null;
    } catch (e) {
        console.error("FaceAPI detection error", e);
        return null;
    }
};
