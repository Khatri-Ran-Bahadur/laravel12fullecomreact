import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Grid, Images, Layers, Pencil } from 'lucide-react';

interface ProductLayoutProps {
    title: string;
    description: string;
    breadcrumbs: BreadcrumbItem[];
    children: React.ReactNode;
    backUrl: string;
    icon?: React.ReactNode;
    productId?: number;
    activeTab?: 'edit' | 'images' | 'variation-types' | 'variations';
}

export default function ProductLayout({
    title,
    description,
    breadcrumbs,
    children,
    backUrl,
    icon,
    productId,
    activeTab = 'edit',
}: ProductLayoutProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="grid grid-cols-12 gap-4">
                    {/* Main Content */}
                    <div className="col-span-9">
                        <Card className="border-none bg-white shadow-xl dark:bg-gray-800">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/20 dark:bg-primary/30 rounded-xl p-2 shadow-sm backdrop-blur-sm">{icon}</div>
                                        <div>
                                            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">{description}</p>
                                        </div>
                                    </div>

                                    <Link href={backUrl}>
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
                                <div className="p-4">{children}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-3">
                        <Card className="sticky top-4 border-none bg-white shadow-xl dark:bg-gray-800">
                            <CardContent className="p-0">
                                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                                    <h2 className="font-semibold text-gray-900 dark:text-white">Product Settings</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product details</p>
                                </div>
                                <nav className="flex flex-col space-y-1 p-2">
                                    <Link
                                        href={route('admin.products.edit', productId)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                            activeTab === 'edit'
                                                ? 'bg-primary/10 text-primary dark:hover:bg-gray-800'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Pencil size={16} />
                                        Edit Product
                                    </Link>
                                    <Link
                                        href={route('admin.products.images.index', productId)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                            activeTab === 'images'
                                                ? 'bg-primary/10 text-primary dark:hover:bg-gray-800'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Images size={16} />
                                        Product Images
                                    </Link>
                                    <Link
                                        href={route('admin.products.variation-types.index', productId)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                            activeTab === 'variation-types'
                                                ? 'bg-primary/10 text-primary dark:hover:bg-gray-800'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                        )}
                                    >
                                        <Layers size={16} />
                                        Variation Types
                                    </Link>
                                    <Link
                                        href={route('admin.products.variations.index', productId)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                            activeTab === 'variations'
                                                ? 'bg-primary/10 text-primary dark:hover:bg-gray-800'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
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
