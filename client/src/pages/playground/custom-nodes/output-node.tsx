import { Handle, Position } from "@xyflow/react";
import React from "react";

interface OutputNodeData {
    processedFile?: string;
    label?: string;
}

export const OutputNode = ({ data }: { data: OutputNodeData }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const baseNodeStyle = "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-40 h-40 ";

    const ChessboardSkeleton = () => (
        <div className="w-36 h-36 bg-gray-50 rounded-md grid grid-cols-6 grid-rows-6 overflow-hidden">
            {[...Array(36)].map((_, i) => (
                <div
                    key={i}
                    className={`${(Math.floor(i / 6) + (i % 6)) % 2 === 0
                        ? 'bg-gray-100'
                        : 'bg-gray-200'
                        }`}
                />
            ))}
        </div>
    );

    return (
        <>
            {data.label === "OUTPUT-IMAGE" && (
                <div className={baseNodeStyle}>
                    <Handle
                        type="target"
                        position={Position.Left}
                        className="w-2 h-2 -left-1 rounded-full bg-blue-500 "
                    />

                    <div className="w-full h-full flex items-center justify-center">
                        {data.processedFile ? (
                            <img
                                src={data.processedFile}
                                alt="Processed"
                                className="w-36 h-36 rounded-md object-cover"
                            />
                        ) : (
                            <ChessboardSkeleton />
                        )}
                    </div>
                </div>
            )}

            {data.label === "OUTPUT-VIDEO" && (
                <div className={baseNodeStyle}>
                    <Handle
                        type="target"
                        position="left"
                        className="w-2 h-2 -left-1 rounded-full bg-blue-500 border-2 border-white"
                    />

                    <div className="w-full h-full flex items-center justify-center">
                        {data.processedFile ? (
                            <div className="relative w-36 h-36">
                                <video
                                    ref={videoRef}
                                    src={data.processedFile}
                                    className="w-full h-full rounded-md object-cover"
                                    loop
                                />
                                <button
                                    onClick={togglePlay}
                                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200"
                                >
                                    {isPlaying ? (
                                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                                        </svg>
                                    ) : (
                                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <ChessboardSkeleton />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default OutputNode;