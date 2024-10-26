import { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
    Background,
    Controls,
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    getIncomers,
    getOutgoers,
    getConnectedEdges,
    Node,
    Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from "@/hooks/use-toast";

import { ImageNode } from './custom-nodes/image-node';
import { ModelNode } from './custom-nodes/model-node';
import { OutputNode } from './custom-nodes/output-node';
import { WebCamNode } from './custom-nodes/webcam-node';
import { VideoNode } from './custom-nodes/video-node';
import { TextNode } from './custom-nodes/text-node';


const nodeTypes = {
    image: ImageNode,
    model: ModelNode,
    output: OutputNode,
    video: VideoNode,
    webcam: WebCamNode,
    text: TextNode
};

export type ReactFlowCanvasRef = {
    executePipeline: () => Promise<void>;
};

const ReactFlowCanvas = forwardRef<ReactFlowCanvasRef, PipelineProps>(({ shouldClear }, ref) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (shouldClear) {
            setNodes([]);
            setEdges([]);
        }
    }, [shouldClear, setNodes, setEdges]);

    const validatePipelineConnections = useCallback((inputNodes: Node[]) => {
        for (const inputNode of inputNodes) {
            let currentNode = inputNode;
            let hasModelConnection = false;
            let hasOutputConnection = false;

            while (true) {
                const outgoers = getOutgoers(currentNode, nodes, edges);
                if (outgoers.length === 0) break;

                const nextNode = outgoers[0];

                if (nextNode.type === 'model') {
                    hasModelConnection = true;
                } else if (nextNode.type === 'output') {
                    hasOutputConnection = true;
                    // Check if this output node has a model as input
                    const outputIncomers = getIncomers(nextNode, nodes, edges);
                    if (!outputIncomers.some(node => node.type === 'model')) {
                        toast({
                            title: "Pipeline Error",
                            description: "Output node must be connected to a model node",
                            variant: "destructive"
                        });
                        return false;
                    }
                }

                currentNode = nextNode;
            }

            if (!hasModelConnection) {
                toast({
                    title: "Pipeline Error",
                    description: "Input node must be connected to a model node",
                    variant: "destructive"
                });
                return false;
            }

            if (!hasOutputConnection) {
                toast({
                    title: "Pipeline Error",
                    description: "Model node must be connected to an output node",
                    variant: "destructive"
                });
                return false;
            }
        }

        return true;
    }, [nodes, edges]);

    const validatePipeline = useCallback(() => {

        const inputNodes = nodes.filter(node =>
            node.type === 'image' || node.type === 'webcam' || node.type === 'video' || node.type === "text"
        );

        console.log(inputNodes)

        if (inputNodes.length === 0) {

            toast({
                title: "Pipeline Error",
                description: "Pipeline must have at least one input node",
                variant: "destructive"
            });
            return false;
        }

        if (!nodes.some(node => node.type === 'model')) {
            toast({
                title: "Pipeline Error",
                description: "Pipeline must have at least one model node",
                variant: "destructive"
            });
            return false;
        }

        if (!nodes.some(node => node.type === 'output')) {
            toast({
                title: "Pipeline Error",
                description: "Pipeline must have at least one output node",
                variant: "destructive"
            });
            return false;
        }

        return validatePipelineConnections(inputNodes);
    }, [nodes, validatePipelineConnections]);

    const executePipeline = useCallback(async () => {
        console.log("inside execute pipeline")
        if (!validatePipeline()) return;

        setIsProcessing(true);
        try {
            const inputNodes = nodes.filter(node =>
                node.type === 'image' || node.type === 'webcam' || node.type === 'video' || node.type === "text"
            );

            for (const inputNode of inputNodes) {
                let currentNode = inputNode;
                let processedFile = inputNode.data.file;


                while (true) {
                    const outgoers = getOutgoers(currentNode, nodes, edges);
                    if (outgoers.length === 0) break;

                    const nextNode = outgoers[0];

                    if (nextNode.type === 'model') {


                        if (inputNode.data.type == "image") {
                            const response = await fetch('http://localhost:3000/enhance/image', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    image: processedFile,
                                    model: nextNode.data.label,
                                }),
                            });


                            if (!response.ok) {
                                throw new Error(`Processing failed at ${nextNode.data.label}`);
                            }

                            const result = await response.json();
                            processedFile = result.processedImage;

                        }
                        else if (inputNode.data.type == "video") {
                            const response = await fetch('http://localhost:3000/enhance/video', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    video: processedFile,
                                    model: nextNode.data.label,
                                }),
                            });


                            if (!response.ok) {
                                throw new Error(`Processing failed at ${nextNode.data.label}`);
                            }

                            const result = await response.json();
                            processedFile = result.processedVideo;
                        }





                        setNodes(nds => nds.map(node => {
                            if (node.id === nextNode.id) {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        processedFile: processedFile
                                    }
                                };
                            }
                            return node;
                        }));
                    } else if (nextNode.type === 'output') {
                        setNodes(nds => nds.map(node => {
                            if (node.id === nextNode.id) {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        processedFile: processedFile
                                    }
                                };
                            }
                            return node;
                        }));
                    }

                    currentNode = nextNode;
                }
            }

            toast({
                title: "Success",
                description: "Pipeline executed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to execute pipeline",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    }, [nodes, edges, setNodes, validatePipeline]);

    useImperativeHandle(ref, () => ({
        executePipeline

    }));

    const onConnect = useCallback((params: any) => {
        setEdges((eds) => addEdge({ ...params, animated: true }, eds) as any);
    }, [setEdges]);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const reactFlowBounds = event.currentTarget.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/xyflow-type');
        const name = event.dataTransfer.getData('application/xyflow-name');
        const file = event.dataTransfer.getData('application/xyflow-file');

        const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        };

        const newNode = {
            id: `${type}-${nodes.length + 1}`,
            type,
            position,
            data: {
                label: name,
                type,
                file
            },
        };

        setNodes((nds) => [...nds, newNode]);
    }, [nodes, setNodes]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div
            style={{ height: "100vh", width: "100%" }}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#aaa" gap={16} />
                <Controls />
            </ReactFlow>
        </div>
    );
});

ReactFlowCanvas.displayName = 'ReactFlowCanvas';

export default ReactFlowCanvas;