import { useState, useRef } from 'react';
import ComponentsSideBar from "./playground/components-sidebar";
import ReactFlowCanvas, { ReactFlowCanvasRef } from "./playground/react-flow-canvas";
import { Toaster } from '@/components/ui/toaster';
import { useCam } from '@/store/CamContext';
import { useText } from '@/store/TextContext';



const PlayGroundPage = ({ }: PlayGroundPageProps) => {
    const [shouldClear, setShouldClear] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const reactFlowRef = useRef<ReactFlowCanvasRef>(null);
    const { setCamdata } = useCam()
    const { setText } = useText()

    const handleClear = () => {
        if (isProcessing) return; // Prevent clearing while processing
        setShouldClear(true);
        setCamdata("")
        setText("")
        setTimeout(() => setShouldClear(false), 100);
    };

    const handleRunPipeline = async () => {
        if (!reactFlowRef.current || isProcessing) return;

        try {
            setIsProcessing(true);
            console.log("calling ref")
            await reactFlowRef.current.executePipeline();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="relative flex w-full h-screen">
            <ComponentsSideBar
                onClear={handleClear}
                onRunPipeline={handleRunPipeline}
                isProcessing={isProcessing}
            />
            <div className="flex-1">
                <ReactFlowCanvas
                    ref={reactFlowRef}
                    shouldClear={shouldClear}
                    isProcessing={isProcessing}
                />
            </div>
            <Toaster />
        </div>
    );
};

export default PlayGroundPage;