import { Link } from '@inertiajs/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function BannerAndSlider() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="-mx-4 flex flex-wrap">
                {/* <!-- Left Side Swiper Slider --> */}
                <div className="mb-8 w-full px-4 lg:mb-0 lg:w-3/4">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        className="main-slider overflow-hidden rounded-lg shadow-lg"
                    >
                        <SwiperSlide>
                            <div className="relative h-96">
                                <img src="./images/banner-1.jpg" alt="Banner" className="h-full w-full object-cover" />
                                <div className="bg-opacity-40 absolute inset-0 flex flex-col justify-center px-12">
                                    <h2 className="mb-4 text-4xl font-bold text-white">Summer Collection</h2>
                                    <p className="mb-6 text-lg text-white">Up to 50% off on selected items</p>
                                    <Link
                                        href="#"
                                        className="inline-block max-w-xs rounded-md bg-indigo-600 px-6 py-3 text-center text-white transition duration-200 hover:bg-indigo-700"
                                    >
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="relative h-96">
                                <img src="./images/banner-2.jpg" alt="Banner" className="h-full w-full object-cover" />
                                <div className="bg-opacity-40 absolute inset-0 flex flex-col justify-center px-12">
                                    <h2 className="mb-4 text-4xl font-bold text-white">New Arrivals</h2>
                                    <p className="mb-6 text-lg text-white">Check out our latest products</p>
                                    <Link
                                        href="#"
                                        className="inline-block max-w-xs rounded-md bg-indigo-600 px-6 py-3 text-center text-white transition duration-200 hover:bg-indigo-700"
                                    >
                                        Discover
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>

                {/* <!-- Right Side Cards --> */}
                <div className="w-full px-4 lg:w-1/4">
                    <div className="relative mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
                        <img src="./images/banner-4.jpg" alt="Promo" className="h-44 w-full object-cover" />
                        <div className="absolute top-0 right-0 rounded-bl-lg bg-red-500 px-3 py-1 text-white">-30%</div>
                        <div className="p-4">
                            <h3 className="mb-2 text-lg font-semibold">Flash Sale</h3>
                            <p className="mb-3 text-sm text-gray-600">Limited time offer on premium products</p>
                            <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                Shop Now →
                            </Link>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                        <img src="./images/d025893b-f957-4b32-8950-d27b2bcfc37a.jpg" alt="Promo" className="h-44 w-full object-cover" />
                        <div className="absolute top-0 right-0 rounded-bl-lg bg-green-500 px-3 py-1 text-white">New</div>
                        <div className="p-4">
                            <h3 className="mb-2 text-lg font-semibold">Exclusive Items</h3>
                            <p className="mb-3 text-sm text-gray-600">Discover our premium collections</p>
                            <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                Learn More →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
