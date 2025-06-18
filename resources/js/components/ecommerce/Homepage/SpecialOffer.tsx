import { ProductListItem } from '@/types';
import { usePage } from '@inertiajs/react';
import ProductCard from '../ProductCard';
interface SpecialOfferProps {
    specialOffers: ProductListItem[];
}
export default function SpecialOffer() {
    const { specialOffers } = usePage().props as any;
    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Special Offers</h2>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800">
                        View All
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* <!-- Discount Product Card 1 --> */}
                    {specialOffers.length > 0 ? (
                        specialOffers.map((product: ProductListItem) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                className="rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                                style={{ width: '100%' }}
                            />
                        ))
                    ) : (
                        <div className="col-span-4 text-center text-gray-500">No special offers available at the moment.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
