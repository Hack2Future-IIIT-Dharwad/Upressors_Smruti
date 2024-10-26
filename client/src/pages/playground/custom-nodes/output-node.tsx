import { Handle } from "@xyflow/react";
import { CloudFog } from "lucide-react";
import React from "react";

interface OutputNodeData {
    processedImage?: string;
    label?: string;
}

export const OutputNode = ({ data }: { data: OutputNodeData }) => {
    const label = data.label

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

    return (

        <>{
            label == "OUTPUT-IMG2IMG" && <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-40 h-40 p-2">
                <Handle
                    type="target"
                    position="left"
                    className="w-2 h-2 -left-1 rounded-full bg-black-500 border-2 border-white transition-colors duration-200 hover:bg-blue-600"
                />

                <div className="w-full h-full flex items-center justify-center">
                    {data.processedFile ? (
                        <div className="w-36 h-36 bg-gray-100 rounded-md ring-1 ring-gray-200">
                            <img
                                src={data.processedFile}
                                alt="Processed"
                                className="w-36 h-36 rounded-md object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-36 h-36 bg-gray-100 rounded-md flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <svg
                                    className="animate-spin h-8 w-8 text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span className="text-sm text-gray-500">Processing...</span>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        }

            {
                label == "OUTPUT-VID2VID" &&
                <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-40 h-40 p-2">
                    <Handle
                        type="target"
                        position="left"
                        className="w-2 h-2 -left-1 rounded-full bg-black-500 border-2 border-white transition-colors duration-200 hover:bg-blue-600"
                    />

                    <div className="w-full h-full flex items-center justify-center">
                        {data.processedFile ? (
                            <div className="relative w-36 h-36 bg-gray-100 rounded-md ring-1 ring-gray-200 overflow-hidden group">
                                <video
                                    ref={videoRef}
                                    src={data.processedFile}
                                    className="w-36 h-36 rounded-md object-cover"
                                    loop
                                    // autoPlay
                                    onClick={togglePlay}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                                    <button
                                        onClick={togglePlay}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 rounded-full p-2"
                                    >
                                        {isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-200" />
                            </div>
                        ) : (
                            <div className="w-36 h-36 bg-gray-100 rounded-md flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    <svg
                                        className="animate-spin h-8 w-8 text-blue-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    <span className="text-sm text-gray-500">Processing...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            }

        </>

    );
};

export default OutputNode;