"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiChevronRight,
  FiLoader,
  FiShoppingBag,
  FiTag,
  FiInfo,
} from "react-icons/fi";
import { bannerService } from "@/services/banner.service";
import ProductCard from "@/components/card/ProductCard";

export default function BannerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const response = await bannerService.getById(id);
        setBanner(response);
      } catch (error) {
        console.error("Error fetching banner:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <FiLoader className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading campaign details...</p>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Campaign Not Found</h2>
        <p className="text-slate-500 mb-6">The promotion you're looking for doesn't exist or has expired.</p>
        <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  // Use the merged products from the banner entity
  const products = banner.products || [];

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-24 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <FiChevronRight className="shrink-0" />
          <span className="hover:text-indigo-600 transition-colors">Campaigns</span>
          <FiChevronRight className="shrink-0" />
          <span className="text-slate-900 font-medium line-clamp-1">{banner.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 mb-24">
          
          {/* Left Column: Banner Image */}
          <div className="relative aspect-[16/9] lg:aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden group shadow-sm border border-slate-100">
            {banner.image ? (
              <Image
                src={banner.image}
                alt={banner.name || "Campaign"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <FiTag size={80} />
              </div>
            )}
            
            <div className="absolute top-8 left-8 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg uppercase tracking-wider">
              Special Campaign
            </div>
          </div>

          {/* Right Column: Banner Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {banner.category && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {banner.category.name}
                  </span>
                )}
                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <FiShoppingBag /> Active Now
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                {banner.name}
              </h1>
              
              <h2 className="text-2xl font-bold text-indigo-600 mb-8">
                {banner.subName}
              </h2>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-10">
                <div className="flex items-start gap-3">
                  <FiInfo className="text-indigo-500 mt-1 shrink-0" />
                  <p className="text-slate-600 leading-relaxed text-lg italic">
                    {banner.description || "Explore our exclusive collection curated specifically for this campaign."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Listing Section */}
        <div className="mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Campaign Products</h2>
              <p className="text-slate-500 font-medium">Handpicked items for the {banner.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-900">{products.length} Items Found</span>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6 shadow-sm">
                <FiShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Products Linked</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                We haven't added any products to this campaign yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
