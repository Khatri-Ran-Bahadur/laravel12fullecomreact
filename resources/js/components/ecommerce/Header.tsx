import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Facebook, Instagram, Menu, Search, ShoppingCart, Twitter, User } from 'lucide-react';
import { useState } from 'react';
import CategoryMenuItem from './CategoryMenuItem';

export default function EcommerceHeader() {
    const { parentCategories } = usePage().props as any;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isSubCategoriesOpen, setIsSubCategoriesOpen] = useState(false);

    return (
        <>
            {/* Top Header */}
            <div className="bg-gray-800 py-2 text-white">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="flex space-x-4">
                        <Link href="#" className="hover:text-gray-300">
                            <Facebook className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="hover:text-gray-300">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="hover:text-gray-300">
                            <Instagram className="h-5 w-5" />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        {/* Currency Dropdown */}
                        <div className="relative">
                            <button onClick={() => setIsCurrencyOpen(!isCurrencyOpen)} className="flex items-center space-x-1 hover:text-gray-300">
                                <span>USD</span>
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            {isCurrencyOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-md bg-white text-gray-800 shadow-lg">
                                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                        USD - US Dollar
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                        EUR - Euro
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                        GBP - British Pound
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Language Dropdown */}
                        <div className="relative">
                            <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} className="flex items-center space-x-1 hover:text-gray-300">
                                <span>English</span>

                                <ChevronDown className="h-3 w-3" />
                            </button>
                            {isLanguageOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-md bg-white text-gray-800 shadow-lg">
                                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                        English
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                        Français
                                    </Link>
                                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                        Español
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link href="/login" className="flex items-center space-x-1 hover:text-gray-300">
                            <User className="h-5 w-5" />
                            <span>Login</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="bg-white py-4 shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <Link href="/" className="text-2xl font-bold text-indigo-600">
                        ShopMart
                    </Link>

                    <div className="mx-8 max-w-xl flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <button className="absolute top-0 right-0 h-full px-4 text-gray-500 hover:text-indigo-600">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Cart Dropdown */}
                        <div className="relative">
                            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative hover:text-indigo-600">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    2
                                </span>
                            </button>
                            {isCartOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md bg-white shadow-lg">
                                    {/* Cart content */}
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <Link href="/login" className="text-gray-700 hover:text-indigo-600">
                                Login
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link href="/register" className="text-gray-700 hover:text-indigo-600">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white shadow">
                <div className="container mx-auto px-4">
                    <div className="flex">
                        <div className="group dropdown relative" x-data="{ open: false }">
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 focus:outline-none"
                            >
                                <Menu className="mr-2 h-5 w-5" />
                                <span>All Categories</span>
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </button>
                            <div x-show="open" className="dropdown-menu absolute left-0 z-50 w-64 rounded-b-md bg-white shadow-lg">
                                {/* <!-- Category with subcategories --> */}
                                {parentCategories.length > 0 &&
                                    parentCategories.map((category: any) => <CategoryMenuItem key={category.id} category={category} />)}
                            </div>
                        </div>

                        {/* Main Menu */}
                        <ul className="flex">
                            <li>
                                <Link href="/" className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/new-arrivals" className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600">
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link href="/deals" className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600">
                                    Deals
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
