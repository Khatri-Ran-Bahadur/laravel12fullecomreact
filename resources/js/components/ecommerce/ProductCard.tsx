import { ProductListItem } from '@/types';
import { router } from '@inertiajs/react';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductCard = (product: ProductListItem) => {
    const handleDetail = (slug: string) => {
        router.visit(route('product.detail', { slug }));
    };
    return (
        <div className="group overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="relative">
                <img src={product.image} alt="Product" className="h-64 w-full object-cover" />
                {product.isDiscount && (
                    <div className="absolute top-0 right-0 m-2 rounded-md bg-red-500 px-2 py-1 text-sm text-white">-{product.discount}%</div>
                )}
                <div className="bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="mx-2 rounded-full bg-white p-3 text-gray-800 transition hover:bg-indigo-600 hover:text-white">
                        <ShoppingBag className="h-5 w-5" />
                    </button>
                    <button className="mx-2 rounded-full bg-white p-3 text-gray-800 transition hover:bg-indigo-600 hover:text-white">
                        <Heart className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="p-4" onClick={() => handleDetail(product.slug)}>
                <h3 className="mb-2 text-lg font-medium">{product.name}</h3>
                <p className="mb-3 text-sm text-gray-600">{product.description}...</p>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-bold text-indigo-600">${product.price}</span>
                        {product.isDiscount && <span className="ml-2 text-gray-400 line-through">$119.99</span>}
                    </div>
                    <div className="flex text-yellow-400">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
