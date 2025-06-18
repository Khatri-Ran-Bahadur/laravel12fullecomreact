import { Link } from '@inertiajs/react';
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 pt-16 pb-6 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo and Description */}
                    <div>
                        <Link href="/" className="mb-4 block text-2xl font-bold text-white">
                            ShopMart
                        </Link>
                        <p className="mb-6 text-gray-400">
                            ShopMart offers a wide range of high-quality products at competitive prices. We're committed to providing an exceptional
                            shopping experience with fast shipping and excellent customer service.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-indigo-600"
                            >
                                <Facebook className="h-5 w-5 text-white" />
                            </Link>
                            <Link
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-indigo-600"
                            >
                                <Twitter className="h-5 w-5 text-white" />
                            </Link>
                            <Link
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-indigo-600"
                            >
                                <Instagram className="h-5 w-5 text-white" />
                            </Link>
                            <Link
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-indigo-600"
                            >
                                <Youtube className="h-5 w-5 text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 transition-colors hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className="text-gray-400 transition-colors hover:text-white">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-400 transition-colors hover:text-white">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 transition-colors hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 transition-colors hover:text-white">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-400 transition-colors hover:text-white">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/account" className="text-gray-400 transition-colors hover:text-white">
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-gray-400 transition-colors hover:text-white">
                                    Order History
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="text-gray-400 transition-colors hover:text-white">
                                    Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-400 transition-colors hover:text-white">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-400 transition-colors hover:text-white">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 transition-colors hover:text-white">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="mt-1 mr-3 h-5 w-5 text-indigo-500" />
                                <span className="text-gray-400">
                                    1234 Market St, Suite 900
                                    <br />
                                    San Francisco, CA 94103
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="mr-3 h-5 w-5 text-indigo-500" />
                                <span className="text-gray-400">+1 (800) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="mr-3 h-5 w-5 text-indigo-500" />
                                <span className="text-gray-400">info@shopmart.com</span>
                            </li>
                            <li className="flex items-center">
                                <Clock className="mr-3 h-5 w-5 text-indigo-500" />
                                <span className="text-gray-400">Mon-Fri: 9AM - 6PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-8 border-gray-700" />

                <div className="flex flex-col items-center justify-between md:flex-row">
                    <p className="mb-4 text-gray-400 md:mb-0">© {new Date().getFullYear()} ShopMart. All Rights Reserved.</p>
                    <div className="flex space-x-6">
                        <img src="/images/payment-4.png" alt="Payment" className="h-8" />
                        <img src="/images/payment-3.png" alt="Payment" className="h-8" />
                        <img src="/images/payment-2.png" alt="Payment" className="h-8" />
                        <img src="/images/payment-1.png" alt="Payment" className="h-8" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
