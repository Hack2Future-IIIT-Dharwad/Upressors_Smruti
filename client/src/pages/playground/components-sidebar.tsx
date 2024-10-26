import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Play, Trash2, Image, Cpu, Sparkles } from "lucide-react";

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
        event.dataTransfer.setData('application/xyflow-file', data.file);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleFileUpload = (event: any) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setUploadedImages(prev => [...prev, {
                        type: file.type.startsWith('image/') ? 'image' : 'video',
                        name: (file as any).name,
                        color: 'green',
                        file: e.target.result
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
        // {
        //     type: 'model',
        //     name: 'MISTRAL-7B-INSTRUCT-V0.2',
        //     color: 'blue',
        //     image: null
        // },
        // {
        //     type: 'model',
        //     name: 'GEMMA-7B-IT',
        //     color: 'blue',
        //     image: null
        // },
    ];

    const imageGeneration = [
        {
            type: 'output',
            name: 'OUTPUT-IMG2IMG',
            color: 'blue',
            image: null
        },
        {
            type: 'output',
            name: 'OUTPUT-VID2VID',
            color: 'blue',
            image: null
        },
        {
            type: 'output',
            name: 'OUTPUT-TXT2IMG',
            color: 'blue',
            image: null
        },
    ];


    const video_to_video = [
        {
            type: 'model',
            name: 'EnRes video',
            color: 'blue',
            image: null
        },
    ];

    return (
        <div className="w-80 h-full bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col gap-4 shadow-xl">
            {/* Action Buttons */}
            <div className="sticky top-0 bg-gray-900/90 backdrop-blur-sm p-4 border-b border-gray-800/50 z-10">
                <div className="space-y-2">
                    <Button
                        onClick={onRunPipeline}
                        disabled={isProcessing}
                        className={`w-full h-10 font-medium ${isProcessing
                            ? 'bg-blue-500/50 text-blue-200'
                            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            } transition-all duration-200`}
                    >
                        <Play className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                        {isProcessing ? 'Processing...' : 'Run Pipeline'}
                    </Button>

                    <Button
                        onClick={onClear}
                        variant="outline"
                        className="w-full h-10 bg-gray-800/50 hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-gray-200 shadow-lg shadow-gray-950/20"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Canvas
                    </Button>
                </div>
            </div>

            <div className="px-4 pb-4 space-y-4 overflow-y-auto custom-scrollbar">
                {/* Input Section */}
                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Image className="w-4 h-4 mr-2 text-gray-500" />
                            INPUTS
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <label className="flex items-center justify-center p-3 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-800/50 border border-dashed border-gray-700/50 transition-all duration-200 group">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={handleFileUpload}
                                multiple
                            />
                            <Upload className="w-4 h-4 mr-2 text-emerald-500 group-hover:text-emerald-400" />
                            <span className="text-gray-400 text-sm group-hover:text-gray-300">Upload Image / Video</span>
                        </label>

                        {uploadedImages.map((image, index) => (
                            <div
                                key={`${image.name}-${index}`}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg group hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <div
                                    draggable
                                    onDragStart={(event) => onDragStart(event, image)}
                                    className="flex items-center flex-1 cursor-move"
                                >
                                    <span className="text-emerald-400 text-sm font-medium truncate max-w-[180px]">
                                        {image.name}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 ml-2 flex-shrink-0"></div>
                                </div>
                                <button
                                    onClick={() => removeImage(index)}
                                    className="ml-2 p-1.5 rounded-full hover:bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-all duration-200"
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
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <span className="text-emerald-400 text-sm font-medium">{input.name}</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Image to Image Section */}
                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Cpu className="w-4 h-4 mr-2 text-gray-500" />
                            IMAGE TO IMAGE
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {imageToImage.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <span className="text-blue-400 text-sm font-medium">{model.name}</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Image Generation Section */}



                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-gray-500" />
                            VIDEO TO VIDEO
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {video_to_video.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <span className="text-blue-400 text-sm font-medium">{model.name}</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>


                <Card className="bg-gray-800/50 border-gray-700/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-400 tracking-wider flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-gray-500" />
                            OUTPUT
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {imageGeneration.map((model) => (
                            <div
                                key={model.name}
                                draggable
                                onDragStart={(event) => onDragStart(event, model)}
                                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-move hover:bg-gray-800/50 transition-all duration-200"
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