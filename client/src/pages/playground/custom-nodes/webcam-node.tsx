import { Handle } from "@xyflow/react";
import { useEffect, useRef } from "react";

export const WebCamNode = ({ data }: any) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => {
                    console.error("Error accessing webcam:", err);
                });
        }

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="flex flex-col">
            <div className="w-full  bg-gray-100 rounded-md overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-24 h-24 object-cover object-fit"
                />
            </div>

            <Handle type="source" position="right" className="w-3 h-3" />
        </div>
    );
};
