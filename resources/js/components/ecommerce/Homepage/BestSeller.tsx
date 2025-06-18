import { usePage } from '@inertiajs/react';
import ProductCard from '../ProductCard';

export default function BestSeller() {
    const { bestSellingProducts } = usePage().props as any;
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Best Sellers</h2>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800">
                        View All
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* <!-- Product Card 1 --> */}
                    {bestSellingProducts.length > 0 ? (
                        bestSellingProducts.map((product: any) => <ProductCard key={product.id} {...product} />)
                    ) : (
                        <div className="col-span-4 text-center text-gray-500">No best sellers available at the moment.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
