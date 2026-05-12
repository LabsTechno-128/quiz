"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiStar,
  FiShoppingCart,
  FiZap,
  FiHeart,
  FiShare2,
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiLoader
} from "react-icons/fi";
import { productService } from "@/services/product.service";
import { Product } from "@/types/api.types";
import { useCart } from "@/contexts/CartContext";

import { useRouter } from "next/navigation";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(id);
        setProduct(response.result);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <FiLoader className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.offerPrice || product.price,
      image: product.image,
      quantity: quantity,
      type: "product",
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-24 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <FiChevronRight className="shrink-0" />
          <Link href={`/category/${(product.category as any)?.slug || (product.category as any)?.id}`} className="hover:text-indigo-600 transition-colors capitalize">{(product.category as any)?.name || "General"}</Link>
          <FiChevronRight className="shrink-0" />
          <span className="text-slate-900 font-medium line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Left Column: Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden group shadow-sm border border-slate-100">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-8 md:p-12 transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Discount Badge */}
              {product.discountPercentage > 0 && (
                <div className="absolute top-8 left-8 bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-lg">
                  {Math.round(product.discountPercentage)}% OFF
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute top-8 right-8 flex flex-col gap-3">
                <button className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:shadow-xl transition-all shadow-md group">
                  <FiHeart className="h-5 w-5 group-active:fill-rose-500" />
                </button>
                <button className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-xl transition-all shadow-md">
                  <FiShare2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails (Mocked for now) */}
            <div className="flex gap-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className={`h-24 w-24 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${i === 0 ? "border-indigo-600 bg-indigo-50" : "border-slate-100 hover:border-indigo-200 bg-slate-50"}`}>
                  <Image src={product.image} alt="thumb" width={96} height={96} className="h-full w-full object-contain p-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {(product.category as any)?.name || "General"}
                </span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <FiCheckCircle /> In Stock
                  </span>
                ) : (
                  <span className="text-rose-500 text-xs font-bold">Out of Stock</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-amber-400" : "fill-slate-100 text-slate-100"}`} />
                  ))}
                  <span className="text-slate-900 font-bold ml-2">{product.rating}</span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <div className="text-sm text-slate-500 font-medium">
                  <span className="text-slate-900 font-bold">{product.totalSell || 0}</span> Sold
                </div>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-black text-indigo-600">
                  TK. {product.offerPrice || product.price}
                </span>
                {product.offerPrice && product.offerPrice < product.price && (
                  <span className="text-xl text-slate-400 line-through decoration-rose-500/30 font-medium">
                    TK. {product.price}
                  </span>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed text-lg mb-10">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-8 mt-auto">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-slate-900">Quantity</span>
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white transition-all text-slate-600"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white transition-all text-slate-600"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 bg-indigo-600 text-white h-16 rounded-[1.25rem] font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 group"
                >
                  <FiShoppingCart className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white h-16 rounded-[1.25rem] font-bold text-lg hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 group"
                >
                  <FiZap className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <FiTruck size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <FiShield size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <FiRotateCcw size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">7 Days Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Info Tabs (Mockup) */}
        <div className="mt-24">
          <div className="flex border-b border-slate-100 gap-10 mb-10">
            <button className="pb-4 text-lg font-bold text-slate-900 border-b-4 border-indigo-600">Description</button>
            <button className="pb-4 text-lg font-bold text-slate-400 hover:text-slate-600 transition-colors">Specifications</button>
            <button className="pb-4 text-lg font-bold text-slate-400 hover:text-slate-600 transition-colors">Reviews (12)</button>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Detailed Information</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              This product is crafted with precision to meet your highest standards. Whether you're looking for performance, durability, or style, this item delivers on all fronts. Our team has carefully selected the materials to ensure long-lasting quality and an exceptional user experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[2rem]">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Brand/Author</span>
                  <span className="text-slate-900 font-bold">{product.author || product.brand || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">ISBN</span>
                  <span className="text-slate-900 font-bold">{product.isbn || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Language</span>
                  <span className="text-slate-900 font-bold">{product.language || "English"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Published Date</span>
                  <span className="text-slate-900 font-bold">{product.publishedDate || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
