import { getCV } from "./opencvCore";

let classifier: any = null;

const loadHaarCascade = async () => {
    const cv = getCV();
    if (!cv) return;

    try {
        const response = await fetch('/models/haarcascade_frontalface_default.xml');
        if (!response.ok) throw new Error("Failed to load Haar Cascade");
        const buffer = await response.arrayBuffer();
        const data = new Uint8Array(buffer);

        cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', data, true, false, false);

        classifier = new cv.CascadeClassifier();
        classifier.load('haarcascade_frontalface_default.xml');
        console.log("Haar Cascade Loaded");
    } catch (e) {
        console.error("Error loading Haar Cascade:", e);
    }
}

export const ensureFaceClassifierLoaded = async () => {
    if (!classifier) {
        await loadHaarCascade();
    }
}

export const detectAndCropFace = async (base64Image: string): Promise<string | null> => {
    const cv = getCV();
    if (!cv || !classifier) {
        console.warn("OpenCV or Classifier not ready yet");
        // Try to load capability if missing?
        return null;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const src = cv.imread(img);
                const gray = new cv.Mat();
                cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

                const faces = new cv.RectVector();
                const msize = new cv.Size(0, 0);

                // Detect faces
                classifier.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);

                let resultBase64: string | null = null;

                if (faces.size() > 0) {
                    // Get the first face
                    const face = faces.get(0);
                    const roi = src.roi(face);

                    const dst = new cv.Mat();
                    roi.copyTo(dst);

                    // Convert back to base64 via canvas
                    const canvas = document.createElement('canvas');
                    cv.imshow(canvas, dst);
                    resultBase64 = canvas.toDataURL('image/jpeg');

                    dst.delete();
                    roi.delete();
                }

                src.delete();
                gray.delete();
                faces.delete();

                resolve(resultBase64);
            } catch (e) {
                console.error("OpenCV processing failed", e);
                reject(e);
            }
        };
        img.onerror = reject;
        img.src = base64Image;
    });
};
