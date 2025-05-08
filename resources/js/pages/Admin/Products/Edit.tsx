import DeleteDialog from '@/components/DeleteDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import { AlertCircle, ArrowLeft, Grid, Images, Layers, List, Pencil, Save, TagIcon, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'Products', href: route('admin.products.index') },
    { title: 'Edit Product', href: '' },
];

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
];

interface Product {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    brand_id: number;
    description: string;
    price: number;
    quantity: number;
    status: string;
    sku: string;
    barcode: string;
    created_at: string;
    updated_at: string;
}
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
    product: Product;
    categories: Category[];
    brands: Brand[];
}

export default function Edit({ product, categories, brands }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: product.name,
        slug: product.slug,
        category_id: product.category_id.toString(),
        brand_id: product.brand_id.toString(),
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        status: product.status,
        sku: product.sku,
        barcode: product.barcode,
    });

    const editor = useRef(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.products.update', product.id), {
            data: {
                ...data,
            },
            preserveScroll: true,
            onSuccess: () => {
                // Handle success
            },
            onError: () => {
                // Handle error
            },
        });
    };

    const handleDelete = (id: number) => {
        router.delete(route('admin.products.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {},
            onError: () => {},
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="grid grid-cols-12 gap-4">
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
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="name"
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                >
                                                    <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                                    Name
                                                </Label>

                                                <div className="group relative">
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 pl-10 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        placeholder="Enter name"
                                                        required
                                                        autoFocus
                                                    />
                                                    <TagIcon
                                                        size={18}
                                                        className="group-hover:text-primary dark:group-hover:text-primary-light absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors dark:text-gray-500"
                                                    />
                                                </div>

                                                {errors.name && (
                                                    <div className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                        <AlertCircle size={14} />
                                                        <span>{errors.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* category and brand */}
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
                                                    <Label
                                                        htmlFor="sku"
                                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    >
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

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="description"
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                >
                                                    <TagIcon size={14} className="text-primary dark:text-primary-light" />
                                                    Description
                                                </Label>

                                                <div className="group relative">
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
                                                            onBlur={(newContent: any) => {
                                                                if (newContent !== data.description) {
                                                                    setData('description', newContent);
                                                                }
                                                            }}
                                                            onChange={(newContent: any) => {
                                                                // setData('description', newContent);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
                                            <Button
                                                variant="destructive"
                                                onClick={() => setShowDeleteDialog(true)}
                                                type="button"
                                                className="flex items-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Delete Product
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                                                disabled={processing}
                                            >
                                                <Save size={16} />
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

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
                                            'bg-primary/10 text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Pencil size={16} />
                                        Edit Product
                                    </Link>
                                    <Link
                                        href={route('admin.products.images.index', product.id)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
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
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
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

            <DeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={() => handleDelete(product.id)}
                title="Delete Item"
                message="Are you sure you want to delete this item? This action cannot be undone."
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
            />
        </AppLayout>
    );
}
