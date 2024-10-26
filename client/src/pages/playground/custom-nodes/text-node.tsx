import { Handle } from "@xyflow/react";
import { useState } from "react";

export const TextNode = ({ data }: any) => {
    const [inputText, setInputText] = useState(data.text || "");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    return (
        <div className="flex items-center bg-gray-100 p-2 rounded-md shadow-md">
            <Handle
                type="source"
                position="right"
                className="w-3 h-3 bg-green-500"
            />
            <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                className="ml-2 p-1 border border-gray-300 rounded-md"
                placeholder="Enter text..."
            />
        </div>
    );
};
