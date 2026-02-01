import cv from "@techstark/opencv-js";

let isOpenCvReady = false;

export const loadOpenCV = async (): Promise<void> => {
    if (isOpenCvReady) return;

    // Check if runtime is already ready (for hot reload or fast load)
    if ((cv as any).Mat) {
        console.log("OpenCV Ready (Detected Global)");
        isOpenCvReady = true;
        return;
    }

    // Wait for the runtime to be initialized
    return new Promise((resolve) => {
        (cv as any).onRuntimeInitialized = () => {
            console.log("OpenCV Ready (Callback)");
            isOpenCvReady = true;
            resolve();
        };
    });
};

export const getCV = () => {
    if (!isOpenCvReady) return null;
    return cv;
};
