import { Handle } from "@xyflow/react";


interface ImageNodeData {
    image?: string;
    label?: string;
}

export const ImageNode = ({ data }: { data: ImageNodeData }) => {
    return (
        <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-40 h-40 p-2">
            <Handle
                type="source"
                position="right"
                className="w-2 h-2 -right-1 rounded-full bg-green-500 border-2 border-white transition-colors duration-200 hover:bg-blue-600"
            />

            <div className="w-full h-full flex items-center justify-center">
                {data.image ? (
                    <div className="w-36 h-36 bg-gray-100 rounded-md ring-1 ring-gray-200">
                        <img
                            src={data.image}
                            alt={data.label || "Node image"}
                            className="w-36 h-36 rounded-md object-contain"
                        />
                    </div>
                ) : (
                    <div className="w-36 h-36 bg-gray-100 rounded-md flex items-center justify-center">
                        <div className="text-gray-400 text-sm">No image</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageNode;