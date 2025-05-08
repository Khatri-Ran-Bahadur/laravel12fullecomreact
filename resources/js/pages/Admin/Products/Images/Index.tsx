import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Grid, Images, Layers, Pencil, TagIcon, Trash2, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'Products', href: route('admin.products.index') },
    { title: 'Edit Product', href: '' },
];

interface Product {
    id: number;
    name: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export default function ProductImages({ product }: { product: Product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        id: product.id,
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(product.image);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState('images');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles((prev) => [...prev, ...acceptedFiles]);

        // Generate previews
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
        maxSize: 5242880, // 5MB
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles((prev) => [...prev, ...files]);

        // Generate previews for new files
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('images[]', file);
        });
        formData.append('product_id', product.id.toString());

        post(route('admin.products.images.store', product.id), {
            data: formData,
            preserveScroll: true,
            onProgress: (progress) => {
                if (progress.percentage) {
                    setUploadProgress(progress.percentage);
                }
            },
            onSuccess: () => {
                setIsUploading(false);
                setUploadProgress(0);
                setSelectedFiles([]);
                setPreviews([]);
            },
            onError: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="grid grid-cols-12 gap-4">
                    {/* Main Content - 9 columns */}
                    <div className="col-span-9">
                        <Card className="border-none bg-white shadow-xl dark:bg-gray-800">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/20 dark:bg-primary/30 rounded-xl p-2 shadow-sm backdrop-blur-sm">
                                            <TagIcon className="text-primary dark:text-primary-light" size={20} />
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Product</h1>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">Update product details</p>
                                        </div>
                                    </div>

                                    <Link href={route('admin.products.index')}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <ArrowLeft size={16} />
                                            Back
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="p-4">
                                    <div className="space-y-4">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Product Images</Label>
                                        {/* Dropzone Area */}
                                        <div
                                            {...getRootProps()}
                                            className={cn(
                                                'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all',
                                                isDragActive ? 'border-primary bg-primary/5' : 'hover:border-primary border-gray-300',
                                            )}
                                        >
                                            <input {...getInputProps()} />
                                            <Upload
                                                className={cn(
                                                    'mx-auto mb-4 h-12 w-12 transition-colors',
                                                    isDragActive ? 'text-primary' : 'text-gray-400',
                                                )}
                                            />
                                            {isDragActive ? (
                                                <p className="text-primary font-medium">Drop the files here</p>
                                            ) : (
                                                <>
                                                    <p className="font-medium text-gray-600 dark:text-gray-300">
                                                        Drag & drop images here, or click to select
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">Supports: JPG, PNG, GIF (Max: 5MB)</p>
                                                </>
                                            )}
                                        </div>

                                        {/* Selected Files Preview */}
                                        {selectedFiles.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                        Selected Images ({selectedFiles.length})
                                                    </h3>
                                                    <Button onClick={handleUpload} disabled={isUploading} className="bg-primary hover:bg-primary/90">
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        {isUploading ? 'Uploading...' : 'Upload All'}
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                                    {previews.map((preview, index) => (
                                                        <div key={index} className="group relative">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="aspect-square w-full rounded-lg object-cover"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="rounded-full"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeImage(index);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <p className="mt-2 truncate text-sm text-gray-500">{selectedFiles[index].name}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {isUploading && (
                                                    <div className="mt-4">
                                                        <Progress value={uploadProgress} className="h-2 w-full" />
                                                        <p className="mt-1 text-sm text-gray-500">{uploadProgress}% uploaded</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar - 3 columns */}
                    <div className="col-span-3">
                        <Card className="sticky top-4 border-none bg-white shadow-xl dark:bg-gray-800">
                            <CardContent className="p-0">
                                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                                    <h2 className="font-semibold text-gray-900 dark:text-white">Product Settings</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product details</p>
                                </div>
                                <nav className="flex flex-col space-y-1 p-2">
                                    <Link
                                        href={route('admin.products.edit', product.id)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Pencil size={16} />
                                        Edit Product
                                    </Link>
                                    <Link
                                        href={route('admin.products.images.index', product.id)}
                                        className={cn(
                                            'bg-primary/10 text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                        )}
                                    >
                                        <Images size={16} />
                                        Product Images
                                    </Link>
                                    <Link
                                        href={route('admin.products.variation-types.index', product.id)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Layers size={16} />
                                        Variation Types
                                    </Link>
                                    <Link
                                        href={route('admin.products.variations.index', product.id)}
                                        className={cn(
                                            'transition-alltext-gray-600 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Grid size={16} />
                                        Variations
                                    </Link>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
