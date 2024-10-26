import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Play, Trash2 } from "lucide-react";


interface ComponentsSideBarProps {
    onClear: () => void;
    onRunPipeline: () => void;
    isProcessing: boolean;
}

const ComponentsSideBar = ({ onClear, onRunPipeline, isProcessing }: ComponentsSideBarProps) => {
    const [uploadedImages, setUploadedImages] = useState([]);


    const handleRunPipeline = () => {
        onRunPipeline();
    };

    const onDragStart = (event, data) => {
        event.dataTransfer.setData('application/xyflow-type', data.type);
        event.dataTransfer.setData('application/xyflow-name', data.name);
        event.dataTransfer.setData('application/xyflow-category', data.category);
        event.dataTransfer.setData('application/xyflow-image', data.image);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleImageUpload = (event: any) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setUploadedImages(prev => [...prev, {
                        type: 'image',
                        name: (file as any).name,
                        color: 'green',
                        image: e.target.result
                    }] as any);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: any) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const inputs = [
        {
            type: 'webcam',
            name: 'Webcam',
            color: 'green',
            image: null
        },
    ];

    const imageToImage = [
        {
            type: 'model',
            name: 'EnRes',
            color: 'blue',
            image: null
        },
        {
            type: 'model',
            name: 'MISTRAL-7B-INSTRUCT-V0.2',
            color: 'blue',
            image: null
        },
        {
            type: 'model',
            name: 'GEMMA-7B-IT',
            color: 'blue',
            image: null
        },
    ];

    const imageGeneration = [
        {
            type: 'output',
            name: 'STABLE-DIFFUSION-IMG2IMG',
            color: 'blue',
            image: null
        },
    ];

    return (
        <div className="w-80 h-full bg-gray-900 flex flex-col gap-6 shadow-lg overflow-y-auto">
            {/* Action Buttons */}
            <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800">
                <div className="space-y-3">
                    <button
                        onClick={onRunPipeline}
                        disabled={isProcessing}
                        className={`w-full px-4 py-2 text-white rounded ${isProcessing
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isProcessing ? 'Processing...' : 'Run Pipeline'}
                    </button>

                    <Button
                        onClick={onClear}
                        variant="outline"
                        className="w-full hover:bg-gray-800 hover:text-gray-200 border-gray-700 flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Canvas
                    </Button>
                </div>
            </div>

            <div className="px-4 pb-4 space-y-6">
                {/* Input Section */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider">INPUTS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <label className="flex items-center justify-center p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 border border-dashed border-gray-700 transition-colors duration-200 group">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                multiple
                            />
                            <Upload className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-300" />
                            <span className="text-gray-400 text-sm group-hover:text-gray-300">Upload Image</span>
                        </label>

                        {uploadedImages.map((image, index) => (
                            <div
                                key={`${image.name}-${index}`}
                                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg group hover:bg-gray-800 transition-colors duration-200"
                            >
                                <div
                                    draggable
                                    onDragStart={(event) => onDragStart(event, image)}
                                    className="flex items-center flex-1 cursor-move"
                                >
                                    <span className="text-emerald-400 text-sm font-medium">{image.name}</span>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 ml-2"></div>
                                </div>
                                <button
                                    onClick={() => removeImage(index)}
                                    className="ml-2 p-1.5 rounded-full hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                    title="Remove image"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        ))}

                        {inputs.map((input) => (
                            <div
                                key={input.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, input)}
                                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg cursor-move hover:bg-gray-800 transition-colors duration-200"
                            >
                                <span className="text-emerald-400 text-sm font-medium">{input.name}</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Image to Image Section */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider">IMAGE TO IMAGE</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {imageToImage.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg cursor-move hover:bg-gray-800 transition-colors duration-200"
                            >
                                <span className="text-blue-400 text-sm font-medium">{model.name}</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Image Generation Section */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider">IMAGE GENERATION</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {imageGeneration.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg cursor-move hover:bg-gray-800 transition-colors duration-200"
                            >
                                <span className="text-blue-400 text-sm font-medium">{model.name}</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ComponentsSideBar;