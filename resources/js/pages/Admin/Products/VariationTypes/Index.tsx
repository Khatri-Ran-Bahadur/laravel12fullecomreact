import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, Grid, Images, Layers, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'Products', href: route('admin.products.index') },
    { title: 'Variation Types', href: '' },
];

interface Product {
    id: number;
    name: string;
    slug: string;
    department: string;
    category: string;
    description: string;
    price: number;
    quantity: number;
    status: string;
    image: string;
    created_at: string;
    updated_at: string;
}

interface VariationType {
    name: string;
    type: 'select' | 'radio' | 'image';
    options: {
        name: string;
        images: File[];
    }[];
}

export default function VariationTypes({ product }: { product: Product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: product.name,
        slug: product.slug,
        department: product.department,
        category: product.category,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        status: product.status,
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(product.image);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState('details');
    const [variationTypes, setVariationTypes] = useState<VariationType[]>([
        {
            name: '',
            type: 'image',
            options: [{ name: '', images: [] }],
        },
    ]);
    const [expandedTypes, setExpandedTypes] = useState<Record<number, boolean>>(() => {
        const initial: Record<number, boolean> = {};
        variationTypes.forEach((_, index) => {
            initial[index] = true;
        });
        return initial;
    });
    const [expandedOptions, setExpandedOptions] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        variationTypes.forEach((type, typeIndex) => {
            type.options.forEach((_, optionIndex) => {
                initial[`${typeIndex}-${optionIndex}`] = true;
            });
        });
        return initial;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        post(route('admin.products.update', product.id), {
            data: {
                ...data,
            },
            preserveScroll: true,
            onProgress: (progress) => {
                if (progress.percentage) {
                    setUploadProgress(progress.percentage);
                }
            },
            onSuccess: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
            onError: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
        });
    };

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

    const handleAddVariationType = () => {
        const newTypeIndex = variationTypes.length;
        setVariationTypes([
            ...variationTypes,
            {
                name: '',
                type: 'image',
                options: [{ name: '', images: [] }],
            },
        ]);
        setExpandedTypes((prev) => ({
            ...prev,
            [newTypeIndex]: true,
        }));
        setExpandedOptions((prev) => ({
            ...prev,
            [`${newTypeIndex}-0`]: true,
        }));
    };

    const handleRemoveVariationType = (index: number) => {
        setVariationTypes(variationTypes.filter((_, i) => i !== index));
    };

    const handleAddOption = (typeIndex: number) => {
        const newVariationTypes = [...variationTypes];
        const newOptionIndex = newVariationTypes[typeIndex].options.length;
        newVariationTypes[typeIndex].options.push({ name: '', images: [] });
        setVariationTypes(newVariationTypes);
        setExpandedOptions((prev) => ({
            ...prev,
            [`${typeIndex}-${newOptionIndex}`]: true,
        }));
    };

    const handleRemoveOption = (typeIndex: number, optionIndex: number) => {
        const newVariationTypes = [...variationTypes];
        newVariationTypes[typeIndex].options = newVariationTypes[typeIndex].options.filter((_, i) => i !== optionIndex);
        setVariationTypes(newVariationTypes);
    };

    const handleImageUpload = (typeIndex: number, optionIndex: number, files: FileList) => {
        const newVariationTypes = [...variationTypes];
        newVariationTypes[typeIndex].options[optionIndex].images = [...Array.from(files)];
        setVariationTypes(newVariationTypes);
    };

    const toggleAllTypes = (expanded: boolean) => {
        const newExpandedTypes: Record<number, boolean> = {};
        variationTypes.forEach((_, index) => {
            newExpandedTypes[index] = expanded;
        });
        setExpandedTypes(newExpandedTypes);
    };

    const toggleAllOptions = (expanded: boolean) => {
        const newExpandedOptions: Record<string, boolean> = {};
        variationTypes.forEach((type, typeIndex) => {
            type.options.forEach((_, optionIndex) => {
                newExpandedOptions[`${typeIndex}-${optionIndex}`] = expanded;
            });
        });
        setExpandedOptions(newExpandedOptions);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Variation Types" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="grid grid-cols-12 gap-4">
                    {/* Main Content - 9 columns */}
                    <div className="col-span-9">
                        <Card className="border-none bg-white shadow-xl dark:bg-gray-800">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/20 dark:bg-primary/30 rounded-xl p-2 shadow-sm backdrop-blur-sm">
                                            <Layers className="text-primary dark:text-primary-light" size={20} />
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Variation Types</h1>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">Manage product variation types</p>
                                        </div>
                                    </div>

                                    <Link href={route('admin.products.index')}>
                                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                            <ArrowLeft size={16} />
                                            Back
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Variations</h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Configure your product variations and options
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleAllOptions(true)}
                                                    className="bg-white shadow-sm hover:bg-gray-50 dark:bg-gray-800"
                                                >
                                                    <ChevronDown size={14} className="mr-1" />
                                                    Expand All
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleAllOptions(false)}
                                                    className="bg-white shadow-sm hover:bg-gray-50 dark:bg-gray-800"
                                                >
                                                    <ChevronUp size={14} className="mr-1" />
                                                    Collapse All
                                                </Button>
                                            </div>
                                        </div>

                                        {variationTypes.map((variationType, typeIndex) => (
                                            <motion.div
                                                key={typeIndex}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
                                            >
                                                <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                                                                >
                                                                    {typeIndex + 1}
                                                                </Badge>
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {variationType.name || 'New Variation Type'}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setExpandedTypes({
                                                                        ...expandedTypes,
                                                                        [typeIndex]: !expandedTypes[typeIndex],
                                                                    })
                                                                }
                                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                            >
                                                                {expandedTypes[typeIndex] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRemoveVariationType(typeIndex)}
                                                                className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                                                            >
                                                                <Trash2 size={16} className="mr-1" />
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {expandedTypes[typeIndex] && (
                                                    <div className="space-y-6 p-6">
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                                    Type Name
                                                                </label>
                                                                <Input
                                                                    placeholder="Enter variation type name (e.g., Color, Size)"
                                                                    value={variationType.name}
                                                                    onChange={(e) => {
                                                                        const newTypes = [...variationTypes];
                                                                        newTypes[typeIndex].name = e.target.value;
                                                                        setVariationTypes(newTypes);
                                                                    }}
                                                                    className="h-11"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                                    Selection Type
                                                                </label>
                                                                <Select
                                                                    value={variationType.type}
                                                                    onValueChange={(value) => {
                                                                        const newTypes = [...variationTypes];
                                                                        newTypes[typeIndex].type = value;
                                                                        setVariationTypes(newTypes);
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="h-11">
                                                                        <SelectValue placeholder="Choose selection type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="select">Dropdown Select</SelectItem>
                                                                        <SelectItem value="radio">Radio Buttons</SelectItem>
                                                                        <SelectItem value="image">Image Selection</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="secondary" className="px-2 py-1">
                                                                        {variationType.options.length} Options
                                                                    </Badge>
                                                                    <h4 className="font-medium text-gray-900 dark:text-white">Variation Options</h4>
                                                                </div>
                                                            </div>

                                                            <div className="grid gap-4">
                                                                {variationType.options.map((option, optionIndex) => (
                                                                    <motion.div
                                                                        key={optionIndex}
                                                                        initial={{ opacity: 0, x: -20 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800/30"
                                                                    >
                                                                        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                                                                            <div className="flex items-center gap-3">
                                                                                <Badge className="flex h-6 w-6 items-center justify-center rounded-full">
                                                                                    {optionIndex + 1}
                                                                                </Badge>
                                                                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                                    {option.name || 'New Option'}
                                                                                </h5>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        setExpandedOptions({
                                                                                            ...expandedOptions,
                                                                                            [`${typeIndex}-${optionIndex}`]:
                                                                                                !expandedOptions[`${typeIndex}-${optionIndex}`],
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    {expandedOptions[`${typeIndex}-${optionIndex}`] ? (
                                                                                        <ChevronUp size={14} />
                                                                                    ) : (
                                                                                        <ChevronDown size={14} />
                                                                                    )}
                                                                                </Button>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="destructive"
                                                                                    size="sm"
                                                                                    onClick={() => handleRemoveOption(typeIndex, optionIndex)}
                                                                                    className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                        {expandedOptions[`${typeIndex}-${optionIndex}`] && (
                                                                            <div className="space-y-4 p-4">
                                                                                <div>
                                                                                    <Input
                                                                                        placeholder="Enter option name"
                                                                                        value={option.name}
                                                                                        onChange={(e) => {
                                                                                            const newTypes = [...variationTypes];
                                                                                            newTypes[typeIndex].options[optionIndex].name =
                                                                                                e.target.value;
                                                                                            setVariationTypes(newTypes);
                                                                                        }}
                                                                                        className="h-11"
                                                                                    />
                                                                                </div>

                                                                                <div>
                                                                                    <input
                                                                                        type="file"
                                                                                        multiple
                                                                                        accept="image/*"
                                                                                        onChange={(e) =>
                                                                                            handleImageUpload(typeIndex, optionIndex, e.target.files!)
                                                                                        }
                                                                                        className="hidden"
                                                                                        id={`images-${typeIndex}-${optionIndex}`}
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={`images-${typeIndex}-${optionIndex}`}
                                                                                        className="group hover:border-primary relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-800/50"
                                                                                    >
                                                                                        <div className="absolute inset-0 flex items-center justify-center bg-white/0 transition-all group-hover:bg-white/50 dark:group-hover:bg-gray-800/20">
                                                                                            <div className="text-center">
                                                                                                <div className="flex justify-center">
                                                                                                    <div className="rounded-full bg-gray-100/80 p-4 backdrop-blur-sm dark:bg-gray-800/80">
                                                                                                        <Images className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                                                                    </div>
                                                                                                </div>
                                                                                                <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                                                                    Click to upload images
                                                                                                </p>
                                                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                                                                                                    PNG, JPG up to 10MB
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </motion.div>
                                                                ))}
                                                            </div>

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => handleAddOption(typeIndex)}
                                                                className="w-full border-dashed"
                                                            >
                                                                <Plus size={16} className="mr-2" />
                                                                Add New Option
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddVariationType}
                                            className="h-16 w-full border-2 border-dashed bg-gray-50/50 hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
                                        >
                                            <Plus size={20} className="mr-2" />
                                            Add New Variation Type
                                        </Button>

                                        <div className="sticky bottom-4 flex justify-end rounded-lg bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
                                            <Button type="submit" className="bg-primary hover:bg-primary/90 min-w-[120px]">
                                                <Save size={16} className="mr-2" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                </form>
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
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                            'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Pencil size={16} />
                                        Edit Product
                                    </Link>
                                    <Link
                                        href={route('admin.products.images.index', product.id)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                            'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Images size={16} />
                                        Product Images
                                    </Link>
                                    <Link
                                        href={route('admin.products.variation-types.index', product.id)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                            'bg-primary/10 text-primary',
                                        )}
                                    >
                                        <Layers size={16} />
                                        Variation Types
                                    </Link>
                                    <Link
                                        href={route('admin.products.variations.index', product.id)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                            'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
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
