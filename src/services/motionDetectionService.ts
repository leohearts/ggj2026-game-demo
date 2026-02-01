import { getCV } from "./opencvCore";

export const calculateMotionCentroid = (
    videoElement: HTMLVideoElement,
    previousGrayMat: any, // cv.Mat, maintained by callee
    debugCanvasId?: string // Optional debug canvas ID
): number | null => {
    const cv = getCV();
    if (!cv || !videoElement || !previousGrayMat) return null;

    try {
        let src: any;
        if (debugCanvasId) {
            // If debug canvas is provided, draw video to it first, then read from it.
            // This ensures we have a valid canvas to read from.
            const canvas = document.getElementById(debugCanvasId) as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                    src = cv.imread(canvas);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            // If no debug canvas, we must create a temp one because imread(video) is failing.
            // Or try to fix the binding.
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                src = cv.imread(canvas);
            } else {
                return null;
            }
        }

        // Convert to YCrCb for skin detection
        const ycrcb = new cv.Mat();
        // src is RGBA (from canvas). Convert to RGB first, then YCrCb
        cv.cvtColor(src, ycrcb, cv.COLOR_RGBA2RGB);
        cv.cvtColor(ycrcb, ycrcb, cv.COLOR_RGB2YCrCb, 0);

        // Define skin color range (Y, Cr, Cb)
        // Typical skin range in YCrCb:
        // Y: 0-255 (Intensity - accept all)
        // Cr: 133-173
        // Cb: 77-127
        const lower = new cv.Mat(ycrcb.rows, ycrcb.cols, ycrcb.type(), [0, 133, 77, 0]);
        const upper = new cv.Mat(ycrcb.rows, ycrcb.cols, ycrcb.type(), [255, 173, 127, 255]);

        const mask = new cv.Mat();
        cv.inRange(ycrcb, lower, upper, mask);

        // Cleanup noise with erode/dilate
        const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3));
        cv.erode(mask, mask, kernel);
        cv.dilate(mask, mask, kernel);

        // --- Debug Visualization Prep (Draw on src) ---
        // We'll draw contours on the original image for clearer debug
        let debugMat: any = null;
        if (debugCanvasId) {
            debugMat = src.clone();
            // Note: source is RGBA. imread from canvas gives RGBA.
        }

        let centroidX: number | null = null;

        // Find contours
        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        let maxArea = 0;
        let maxContourIndex = -1;

        for (let i = 0; i < contours.size(); ++i) {
            const cnt = contours.get(i);
            const area = cv.contourArea(cnt, false);
            if (area > maxArea) {
                maxArea = area;
                maxContourIndex = i;
            }
        }

        // Threshold for significant object (Hand/Face) using 2000 area (hand is big)
        if (maxArea > 1000 && maxContourIndex !== -1) {
            const maxCnt = contours.get(maxContourIndex);

            // Calculate center
            const M = cv.moments(maxCnt, false);
            if (M.m00 !== 0) {
                centroidX = M.m10 / M.m00;
            } else {
                const rect = cv.boundingRect(maxCnt);
                centroidX = rect.x + (rect.width / 2);
            }

            if (debugMat) {
                const rect = cv.boundingRect(maxCnt);
                const point1 = new cv.Point(rect.x, rect.y);
                const point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
                // Draw Red Rectangle (R, G, B, A) -> [255, 0, 0, 255]
                cv.rectangle(debugMat, point1, point2, [255, 0, 0, 255], 2);
            }
        }

        if (debugCanvasId && debugMat) {
            cv.imshow(debugCanvasId, debugMat);
        }

        // Cleanup functions
        if (debugMat) debugMat.delete();
        ycrcb.delete();
        lower.delete();
        upper.delete();
        mask.delete();
        contours.delete();
        hierarchy.delete();
        kernel.delete();

        // Update previous frame (Not used anymore for skin, but keeping signature)
        // gray.copyTo(previousGrayMat); 
        // Need to clean up gray/src if we commented out the old code 
        // My replacement block starts after src creation?
        // Wait, I need to check where I am starting replacement.

        // Cleaning up the original 'gray' and 'src' 
        // (Assuming I am replacing the whole logic block after src is loaded)

        src.delete(); // We are done with src

        return centroidX;
    } catch (e) {
        console.error("Motion detection error:", e);
        return null;
    }
};
