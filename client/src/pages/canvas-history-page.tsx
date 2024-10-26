import { useEffect, useState } from 'react';
import { PlusCircle, Search, Clock, Layout, Grid, Menu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useHttpRequest } from '@/hooks/httpClient';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

function CanvasHistoryPage() {
    const navigate = useNavigate();
    const sendRequest = useHttpRequest();
    const [isOpen, setIsOpen] = useState(false);
    const [canvasName, setCanvasName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [canvases, setCanvases] = useState([]);
    const [isGridView, setIsGridView] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCanvases = canvases.filter(canvas =>
        (canvas as any).name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function handleGetAllCanvas() {
        try {
            const token = localStorage.getItem('token');
            const response = await sendRequest('/api/user/canvas', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCanvases(response.data.data);
        } catch (error) {
            console.error('Failed to retrieve canvases:', error);
        }
    }

    useEffect(() => {
        handleGetAllCanvas();
    }, []);

    async function handleCreateCanvas() {
        if (!canvasName.trim()) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await sendRequest('/api/user/canvas/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: canvasName.trim()
                })
            });

            if (response != null) {
                setIsOpen(false);
                setCanvasName('');
                navigate("/canvas/history");
            }
        } catch (error) {
            console.error('Failed to create canvas:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function formatDate(dateString: any) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-72 bg-white border-r border-gray-200 p-6 shadow-sm">
                <div className="space-y-6">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                                <PlusCircle className="h-4 w-4" />
                                New Canvas
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Canvas</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Canvas Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter canvas name..."
                                        value={canvasName}
                                        onChange={(e) => setCanvasName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                    onClick={handleCreateCanvas}
                                    disabled={!canvasName.trim() || isLoading}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isLoading ? 'Creating...' : 'Create Canvas'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search canvases..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">View Mode</span>
                            <div className="flex gap-2">
                                <Button
                                    variant={isGridView ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setIsGridView(true)}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={!isGridView ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setIsGridView(false)}
                                >
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Your Canvases</h1>
                    <p className="text-gray-500 mt-1">You have {filteredCanvases.length} canvas{filteredCanvases.length !== 1 ? 'es' : ''}</p>
                </div>

                {isGridView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCanvases.map((canvas) => (
                            <Card
                                key={(canvas as any).canvas_id}
                                className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                                onClick={() => navigate(`/canvas/${(canvas as any)._id}`)}
                            >
                                <CardContent className="p-4">
                                    <div className="h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                                        <Layout className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                        {(canvas as any).name}
                                    </h3>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>Last edited {formatDate((canvas as any).updated_at || new Date())}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredCanvases.map((canvas) => (
                            <Card
                                key={(canvas as any)._id}
                                className="group hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                onClick={() => navigate(`/canvas/${(canvas as any)._id}`)}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                                            <Layout className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                                {(canvas as any).name}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>Last edited {formatDate((canvas as any).updated_at || new Date())}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CanvasHistoryPage;