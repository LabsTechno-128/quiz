"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/api.types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
            type: "book",
        });
    };

    return (
        <div className="group relative bg-white border border-gray-100 rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl w-full max-w-[240px]">
            {/* Discount Badge */}
            {product?.discountPercentage && (
                <div className="absolute top-0 left-0 z-30">
                    <div className="relative flex items-center justify-center w-12 h-12">
                        <svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full fill-[#ffcc00] drop-shadow-sm"
                        >
                            <path d="M50 0 L58 12 L72 7 L75 21 L89 21 L85 35 L97 42 L88 53 L95 67 L81 70 L78 84 L65 82 L57 94 L44 87 L32 95 L26 82 L11 81 L16 67 L4 59 L13 47 L5 33 L18 29 L18 15 L31 18 L38 6 Z" />
                        </svg>
                        <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center justify-center leading-none">
                            <span className="text-xs font-black text-black">{Math.round(product?.discountPercentage)}%</span>
                            <span className="text-xs font-bold text-black">OFF</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Section */}
            <div className="relative bg-transparent aspect-[4/5] w-full  p-2 flex items-center justify-center b e">
                <Image
                    src={product?.image}
                    alt={product?.title}
                    width={3000}
                    height={2000}
                    className=" object-fit transition-transform duration-500 group-hover:opacity-80 h-full rounded-sm"
                />

                {/* Hover Overlay: Add to Cart Button */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <button
                        onClick={handleAddToCart}
                        className="bg-[#00A2E8] text-white font-bold text-[15px] py-2.5 px-6 rounded-sm shadow-md active:scale-95 transition-all"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="px-3 pb-4 text-center flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-[14px] text-[#444] group-hover:text-[#999] transition-colors line-clamp-2 leading-tight h-[36px] flex items-center justify-center mb-1">
                    {product?.title}
                </h3>

                {/* Brand */}
                <p className="text-[12px] text-[#999] group-hover:text-[#CCC] mb-1">
                    {product?.brand}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                        <FiStar
                            key={i}
                            size={13}
                            className={`${i < product?.rating
                                ? "fill-[#FFB400] text-[#FFB400] group-hover:fill-[#FFDE91] group-hover:text-[#FFDE91]"
                                : "text-gray-200"
                                } transition-colors`}
                        />
                    ))}
                    {/* <span className="text-[12px] text-[#999] group-hover:text-[#CCC] ml-1">({product.reviews})</span> */}
                </div>

                {/* Stock Status / Middle Text */}
                <div className="h-[20px]">
                    {product.stock > 0 ? (
                        <p className="text-[12px] text-[#22C55E] group-hover:hidden font-medium">
                            In Stock
                        </p>
                    ) : (
                        <p className="text-[12px] text-[#22C55E] group-hover:hidden font-medium">
                            Out of Stock
                        </p>
                    )}
                </div>

                {/* Price */}
                <div className="mt-1 flex items-center justify-center gap-2">
                    {product.sellPrice && (
                        <span className="text-[#999] line-through text-[13px] group-hover:text-[#CCC]">
                            TK. {product.sellPrice}
                        </span>
                    )}
                    <span className="text-black font-bold text-[15px] group-hover:text-[#999] transition-colors">
                        TK. {product.offerPrice}
                    </span>
                </div>
            </div>

            {/* Hover Footer: View Details */}
            {/* ... previous code ... */}

            {/* Hover Footer: View Details */}
            <div className="absolute bottom-0 left-0 w-full bg-[#F2F2F2] overflow-hidden transition-all duration-300 h-0 group-hover:h-12 border-t border-transparent group-hover:border-[#E4E4E4] z-40">
                <Link
                    href={`/product/${product.id}`}
                    className="w-full h-full flex items-center justify-center text-[#00A2E8] font-bold text-[15px] hover:bg-gray-100 transition-colors"
                >
                    View Details
                </Link>
            </div>

            {/* ... end of main div ... */}
            {/* <div className="bg-[#F2F2F2] overflow-hidden transition-all duration-300 h-0 group-hover:h-12 border-t border-transparent group-hover:border-[#E4E4E4]">
                <Link
                    href={`/product/${product.id}`}
                    className="w-full h-full flex items-center justify-center text-[#00A2E8] font-bold text-[15px] hover:bg-gray-100 transition-colors"
                >
                    View Details
                </Link>
            </div> */}
        </div>
    );
}
