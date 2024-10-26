import { Handle } from "@xyflow/react";
import React from "react";

interface OutputNodeData {
    processedImage?: string;
    label?: string;
}

export const OutputNode = ({ data }: { data: OutputNodeData }) => {
    return (
        <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-40 h-40 p-2">
            <Handle
                type="target"
                position="left"
                className="w-2 h-2 -left-1 rounded-full bg-black-500 border-2 border-white transition-colors duration-200 hover:bg-blue-600"
            />

            <div className="w-full h-full flex items-center justify-center">
                {data.processedImage ? (
                    <div className="w-36 h-36 bg-gray-100 rounded-md ring-1 ring-gray-200">
                        <img
                            src={data.processedImage}
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
    );
};

export default OutputNode;