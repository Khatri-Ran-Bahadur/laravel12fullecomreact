import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem } from '@/types';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { ChevronUpIcon, Layers } from 'lucide-react';
import ProductLayout from '../ProductLayout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'Products', href: route('admin.products.index') },
    { title: 'Variation Types', href: '' },
];

interface Product {
    id: number;
    name: string;
    image: string;
    created_at: string;
    updated_at: string;
}

interface VariationType {
    id: number;
    name: string;
    label: string;
}

interface Variation {
    [key: string]: VariationType | string | number;
    quantity: string | number;
    price: string | number;
}

export default function ProductVariations({ product, variationsLists }: { product: Product; variationsLists: Variation[] }) {
    const { data, setData, post, processing, errors } = useForm({
        variations: variationsLists.map((v) => ({
            ...v,
            quantity: String(v.quantity),
            price: String(v.price),
        })),
    });

    // Get all variation type fields from a variation
    const getVariationTypeFields = (variation: Variation) => {
        return Object.entries(variation)
            .filter(([key]) => key.startsWith('variation_type_'))
            .map(([key, value]) => ({
                key,
                value: value as VariationType,
            }));
    };

    // Handler for updating variation fields
    const handleChange = (index: number, field: string, value: string | number | VariationType) => {
        const updatedVariations = [...data.variations];
        updatedVariations[index] = {
            ...updatedVariations[index],
            [field]: value,
        };

        setData('variations', updatedVariations);
    };

    const handleSubmit = () => {
        post(route('admin.products.variations.update', product.id), {
            preserveScroll: true,
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
            onSuccess: () => {
                // Handle successful submission
            },
        });
    };

    return (
        <ProductLayout
            title="Product Variations"
            description="Manage product variations"
            breadcrumbs={breadcrumbs}
            backUrl={route('admin.products.edit', product.id)}
            productId={product.id}
            activeTab="variations"
            icon={<Layers className="text-primary dark:text-primary-light" size={20} />}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Product Variations</h2>
                </div>

                {data.variations.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-gray-600 dark:text-gray-400">No variation types found for this product.</p>
                    </div>
                ) : (
                    data.variations.map((variation, idx) => (
                        <Disclosure key={idx} defaultOpen>
                            {({ open }) => (
                                <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                                    <DisclosureButton className="flex w-full items-center justify-between p-4">
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {getVariationTypeFields(variation)
                                                    .map(({ value }) => value.name)
                                                    .join(' - ')}
                                            </span>
                                        </div>
                                        <ChevronUpIcon
                                            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                        />
                                    </DisclosureButton>
                                    <DisclosurePanel className="px-4 pb-4">
                                        <div className="mb-4 grid grid-cols-2 gap-6">
                                            {/* Dynamic variation type fields */}
                                            {getVariationTypeFields(variation).map(({ key, value }) => (
                                                <div key={key} className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{value.label}</Label>
                                                    <Input
                                                        className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        value={value.name}
                                                        readOnly={true}
                                                        placeholder={`Enter ${value.label.toLowerCase()}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</Label>
                                                <Input
                                                    className={`focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border ${
                                                        errors[`variations.${idx}.quantity`] ? 'border-red-500' : 'border-gray-200'
                                                    } bg-white/80 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500`}
                                                    type="number"
                                                    value={variation.quantity}
                                                    onChange={(e) => handleChange(idx, 'quantity', e.target.value)}
                                                    placeholder="Enter quantity"
                                                />
                                                {errors[`variations.${idx}.quantity`] && (
                                                    <p className="mt-1 text-sm text-red-500">{errors[`variations.${idx}.quantity`]}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</Label>
                                                <div className="relative">
                                                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">$</span>
                                                    <Input
                                                        className="focus:border-primary focus:ring-primary/20 dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 pl-8 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:ring-2 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        type="number"
                                                        value={variation.price}
                                                        onChange={(e) => handleChange(idx, 'price', e.target.value)}
                                                        placeholder="Enter price"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </DisclosurePanel>
                                </div>
                            )}
                        </Disclosure>
                    ))
                )}
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={processing}
                    className="bg-primary hover:bg-primary/90 focus:ring-primary/20 dark:bg-primary-light dark:hover:bg-primary-light/90 dark:focus:ring-primary-light/20 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing ? 'Updating...' : 'Update Variations'}
                </button>
            </div>
        </ProductLayout>
    );
}
