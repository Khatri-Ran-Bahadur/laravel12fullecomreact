export default function Blog() {
    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Latest Blog Posts</h2>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800">
                        View All
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* <!-- Blog Card 1 --> */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <img src="./images/blog-1.jpg" alt="Blog" className="h-48 w-full object-cover" />
                        <div className="p-6">
                            <div className="mb-3 flex items-center text-sm text-gray-500">
                                <i className="far fa-calendar-alt mr-2"></i>
                                <span>April 12, 2025</span>
                                <span className="mx-2">|</span>
                                <i className="far fa-user mr-2"></i>
                                <span>Admin</span>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">10 Must-Have Tech Gadgets for 2025</h3>
                            <p className="mb-4 text-gray-600">Discover the latest tech innovations that are changing the game in 2025 and beyond.</p>
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800">
                                Read More →
                            </a>
                        </div>
                    </div>

                    {/* <!-- Blog Card 2 --> */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <img src="./images/blog-2.jpg" alt="Blog" className="h-48 w-full object-cover" />
                        <div className="p-6">
                            <div className="mb-3 flex items-center text-sm text-gray-500">
                                <i className="far fa-calendar-alt mr-2"></i>
                                <span>April 10, 2025</span>
                                <span className="mx-2">|</span>
                                <i className="far fa-user mr-2"></i>
                                <span>Admin</span>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">How to Choose the Perfect Headphones</h3>
                            <p className="mb-4 text-gray-600">
                                A comprehensive guide to finding headphones that match your lifestyle and preferences.
                            </p>
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800">
                                Read More →
                            </a>
                        </div>
                    </div>

                    {/* <!-- Blog Card 3 --> */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <img src="./images/blog-3.jpg" alt="Blog" className="h-48 w-full object-cover" />
                        <div className="p-6">
                            <div className="mb-3 flex items-center text-sm text-gray-500">
                                <i className="far fa-calendar-alt mr-2"></i>
                                <span>April 8, 2025</span>
                                <span className="mx-2">|</span>
                                <i className="far fa-user mr-2"></i>
                                <span>Admin</span>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">The Rise of Smart Home Devices</h3>
                            <p className="mb-4 text-gray-600">
                                Explore how smart home technology is transforming the way we live and interact with our spaces.
                            </p>
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-800">
                                Read More →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
