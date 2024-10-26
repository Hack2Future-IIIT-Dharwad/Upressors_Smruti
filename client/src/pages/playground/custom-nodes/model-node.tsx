import { Handle } from "@xyflow/react";

export const ModelNode = ({ data }: any) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200 min-w-[200px]">
            <Handle type="target" position="left" className="w-3 h-3 bg-green-500" />
            <div>{data.label}</div>
            <Handle type="source" position="right" className="w-3 h-3 bg-green-500" />
        </div>
    );
};