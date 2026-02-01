import React, { useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import clsx from 'clsx';

interface WebcamFeedProps {
    onFrameCapture: (base64Image: string) => void;
    interval?: number; // ms
    isActive?: boolean;
    className?: string;
    showFeed?: boolean;
    onVideoReady?: (video: HTMLVideoElement) => void;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({
    onFrameCapture,
    interval = 2000,
    isActive = true,
    className,
    showFeed = false,
    onVideoReady,
}) => {
    const webcamRef = useRef<Webcam>(null);

    const handleUserMedia = useCallback(() => {
        if (webcamRef.current?.video && onVideoReady) {
            onVideoReady(webcamRef.current.video);
        }
    }, [onVideoReady]);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                onFrameCapture(imageSrc);
            }
        }
    }, [onFrameCapture]);

    useEffect(() => {
        if (!isActive) return;

        const intervalId = setInterval(capture, interval);
        return () => clearInterval(intervalId);
    }, [capture, interval, isActive]);

    return (
        <div className={clsx("relative overflow-hidden rounded-lg", className)}>
            <Webcam
                audio={false}
                ref={webcamRef}
                onUserMedia={handleUserMedia}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 256,
                    height: 256,
                    facingMode: "user"
                }}
                className={clsx(
                    "w-full h-full object-cover transition-opacity duration-500",
                    showFeed ? "opacity-100" : "opacity-0 pointer-events-none absolute"
                )}
            />
            {!showFeed && (
                <div className="absolute inset-0 bg-black flex items-center justify-center text-xs text-gray-500 border border-gray-800 rounded-lg">
                    [CAMERA HIDDEN]
                </div>
            )}
        </div>
    );
};

export default WebcamFeed;
