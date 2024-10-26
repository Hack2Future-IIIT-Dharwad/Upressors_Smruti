import { Handle } from "@xyflow/react";

export const OutputNode = ({ data }: any) => {
    return (
        <>
            <Handle
                type="target"
                position="left"
                className="w-3 h-3 bg-green-500"
            />
            <div className="flex flex-col">

                {data.processedImage ? (
                    <div className="w-full bg-gray-100 rounded-md overflow-hidden">
                        <img
                            src={data.processedImage}
                            alt="Processed"
                            className="w-24 h-24 object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}

            </div>
            <Handle
                type="source"
                position="right"
                className="w-3 h-3 bg-green-500"
            />
        </>
    );
};
