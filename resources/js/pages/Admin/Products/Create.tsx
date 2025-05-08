import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import { AlertCircle, ArrowLeft, Diamond, File, List, Save, TagIcon } from 'lucide-react';
import { useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'Products', href: route('admin.products.index') },
    { title: 'Create Product', href: '' },
];

interface Category {
    id: number;
    path: string;
    name: string;
    level: number;
}

interface Brand {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    brands: Brand[];
}

const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
];

export default function Create({ categories, brands }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        brand_id: '',
        description: '',
        price: '',
        sku: '',
        barcode: '',
        status: 'draft',
        quantity: '',
        image: null as File | null,
    });

    const editor = useRef(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 dark:from-gray-900 dark:to-gray-800">
                <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-gray-800">
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/20 dark:bg-primary/30 rounded-xl p-3 shadow-sm backdrop-blur-sm">
                                    <Diamond className="text-primary dark:text-primary-light" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create Product</h1>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Add new product to your store</p>
                                </div>
                            </div>

                            <Link href={route('admin.products.index')}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-2 text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    <ArrowLeft size={16} />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="p-1">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mz-w-3xl mx-auto space-y-6">
                                {/* for the name field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        <File size={14} className="text-primary dark:text-primary-light" />
                                        Name
                                    </Label>

                                    <div className="group relative">
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    {errors.name && (
                                        <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                            <AlertCircle size={14} />
                                            <span>{errors.name}</span>
                                        </div>
                                    )}
                                </div>
                                {/* categories &  brand section */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* category */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="category_id"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            <List size={14} className="text-primary dark:text-primary-light" />
                                            Category
                                        </Label>

                                        <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                            <SelectTrigger className="h-12 w-full dark:border-gray-600 dark:bg-gray-800/80">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.path}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {errors.category_id && (
                                            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertCircle size={14} />
                                                <span>{errors.category_id}</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* brands */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="brand_id"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                            Brand
                                        </Label>

                                        <Select value={data.brand_id} onValueChange={(value) => setData('brand_id', value)}>
                                            <SelectTrigger className="h-12 w-full dark:border-gray-600 dark:bg-gray-800/80">
                                                <SelectValue placeholder="Select brand" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id.toString()}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {errors.brand_id && (
                                            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertCircle size={14} />
                                                <span>{errors.brand_id}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* pricing quantity and staus*/}
                                <div className="grid gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="price"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                            Price
                                        </Label>

                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                            placeholder="0.00"
                                        />

                                        {errors.price && (
                                            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertCircle size={14} />
                                                <span>{errors.price}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="quantity"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                            Quantity
                                        </Label>

                                        <Input
                                            id="quantity"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                            placeholder="Available quantity"
                                        />

                                        {errors.quantity && (
                                            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertCircle size={14} />
                                                <span>{errors.quantity}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="status"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                            Status
                                        </Label>

                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger className="h-12 w-full dark:border-gray-600 dark:bg-gray-800/80">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {errors.status && (
                                            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertCircle size={14} />
                                                <span>{errors.status}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SKU and Barcode */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="sku" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                            SKU
                                        </Label>

                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                            placeholder="Enter SKU"
                                        />

                                        {errors.sku && (
                                            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertCircle size={14} />
                                                <span>{errors.sku}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="barcode"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                            Barcode
                                        </Label>

                                        <Input
                                            id="barcode"
                                            value={data.barcode}
                                            onChange={(e) => setData('barcode', e.target.value)}
                                            className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                            placeholder="Enter barcode"
                                        />

                                        {errors.barcode && (
                                            <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertCircle size={14} />
                                                <span>{errors.barcode}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* description */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                        Description
                                    </Label>

                                    <div className="prose prose-sm dark:prose-invert w-full max-w-none">
                                        <JoditEditor
                                            ref={editor}
                                            value={data.description}
                                            config={{
                                                readonly: false,
                                                placeholder: 'Enter product description...',
                                                height: 400,
                                                toolbarButtonSize: 'medium',
                                                theme: 'default',
                                                enableDragAndDropFileToEditor: true,
                                                statusbar: false,
                                                askBeforePasteHTML: false,
                                                askBeforePasteFromWord: false,
                                                defaultMode: 1,
                                                buttons: [
                                                    'bold',
                                                    'italic',
                                                    'underline',
                                                    'strikethrough',
                                                    '|',
                                                    'font',
                                                    'fontsize',
                                                    'paragraph',
                                                    '|',
                                                    'align',
                                                    '|',
                                                    'ul',
                                                    'ol',
                                                    '|',
                                                    'link',
                                                    '|',
                                                    'undo',
                                                    'redo',
                                                ],
                                                colors: {
                                                    background: ['#ff0000', '#00ff00', '#0000ff'],
                                                    text: ['#000000', '#ffffff', '#333333'],
                                                },
                                                showXPathInStatusbar: false,
                                                showCharsCounter: false,
                                                showWordsCounter: false,
                                                enter: 'P',
                                            }}
                                            tabIndex={1}
                                            onBlur={(newContent) => {
                                                if (newContent !== data.description) {
                                                    setData('description', newContent);
                                                }
                                            }}
                                            onChange={(newContent) => {
                                                // setData('description', newContent);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* button */}
                                <div className="pt-4">
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        <Save size={16} className="mr-2" />
                                        {processing ? 'Saving...' : 'Save Product'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
