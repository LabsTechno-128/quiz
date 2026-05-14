import { useEffect, useState } from "react";
import ProductCard from "../card/ProductCard";
import ProductLayout from "../productLayout/ProductLayout";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/api.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function ProductSection() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categoryProduct, setCategoryProduct] = useState<Category[]>([])

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await categoryService.getAllHomepageCategoryProduct();
            setCategoryProduct(response.result)
        } catch (e: unknown) {
            console.error("Error loading books:", e);
            setError(e instanceof Error ? e.message : "Failed to load books");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="py-20 text-center text-gray-400">Loading collections...</div>;

    return (
        <section className="space-y-8 pb-20">
            {categoryProduct.map((category) => (
                <ProductLayout key={category.id} title={category.name} slug={category.slug || ''}>
                    <div className="relative group px-2 sm:px-4">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={10}
                            slidesPerView={2}
                            navigation={{
                                nextEl: `.next-${category.id}`,
                                prevEl: `.prev-${category.id}`,
                            }}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1280: { slidesPerView: 5, spaceBetween: 25 },
                            }}
                            className="pb-4"
                        >
                            {category.products?.map((product) => (
                                <SwiperSlide key={product.id}>
                                    <div className="h-full py-2">
                                        <ProductCard product={product} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <button 
                            className={`prev-${category.id} absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 shadow-md rounded-full text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 sm:-translate-x-4 border border-gray-100 disabled:hidden`}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            className={`next-${category.id} absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 shadow-md rounded-full text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 sm:translate-x-4 border border-gray-100 disabled:hidden`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </ProductLayout>
            ))}
        </section>
    );
}
