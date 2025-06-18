import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import { usePage } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function Brand() {
    const { brands } = usePage().props as any;
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">
                <h2 className="mb-8 text-center text-2xl font-bold">Our Brands</h2>

                <div className="swiper brand-slider">
                    <div className="swiper-wrapper items-center">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={5}
                            // navigation
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            className="swiper-wrapper items-center"
                        >
                            {brands.map((brand: any) => (
                                <SwiperSlide key={brand.id} className="swiper-slide p-4 text-center">
                                    <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 p-6">
                                        <img src={brand.image} alt={brand.name} className="max-h-16" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </div>
        </div>
    );
}
