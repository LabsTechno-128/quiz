"use client";
import ProductCard from "@/components/card/ProductCard";
import { Product } from "@/types/api.types";
import { productService } from "@/services/product.service";
import React, { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiGrid,
  FiMenu,
  FiLoader,
} from "react-icons/fi";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const decodeSlug = decodeURIComponent(slug)
  const [sortOrder, setSortOrder] = useState("relevant");
  const [openBestFilter, setOpenBestFilter] = useState(true);
  const [openPriceFilter, setOpenPriceFilter] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [activeView, setActiveView] = useState("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const priceRanges = [
    { label: "TK. 0 – 100", min: 0, max: 100 },
    { label: "TK. 100 – 200", min: 100, max: 200 },
    { label: "TK. 200 – 300", min: 200, max: 300 },
    { label: "TK. 300 – 400", min: 300, max: 400 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await productService.getByCategorySlug(decodeSlug, {
          limit: 20,
        });
        console.log(response, slug)

        let filteredProducts = response.result || [];

        // Simple client-side sorting/filtering for now as API might not support all yet
        if (minPrice) {
          filteredProducts = filteredProducts.filter(p => (p.offerPrice || p.price) >= Number(minPrice));
        }
        if (maxPrice) {
          filteredProducts = filteredProducts.filter(p => (p.offerPrice || p.price) <= Number(maxPrice));
        }

        if (sortOrder === "price_low_high") {
          filteredProducts.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        } else if (sortOrder === "price_high_low") {
          filteredProducts.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, sortOrder, minPrice, maxPrice]);

  const handleRangeClick = (range: any) => {
    if (selectedRange === range.label) {
      setSelectedRange("");
      setMinPrice("");
      setMaxPrice("");
    } else {
      setSelectedRange(range.label);
      setMinPrice(range.min.toString());
      setMaxPrice(range.max.toString());
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto py-10 px-4 md:px-8 lg:px-24">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Home / <span className="text-black font-medium capitalize">{decodeSlug.replace(/-/g, ' ')}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-xl font-semibold">Showing products for “<span className="capitalize">{decodeSlug.replace(/-/g, ' ')}</span>”</h2>
        <div className="flex gap-2 sm:gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort By:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm focus:outline-none bg-white"
            >
              <option value="relevant">Relevant Order</option>
              <option value="price_low_high">Price: Low → High</option>
              <option value="price_high_low">Price: High → Low</option>
            </select>
          </div>
          <button
            onClick={() => setActiveView("grid")}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200
          ${activeView === "grid"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
          >
            <FiGrid size={18} />
          </button>
          <button
            onClick={() => setActiveView("list")}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200
          ${activeView === "list"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
          >
            <FiMenu size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="border border-[#E4E9EE] rounded-2xl p-6 bg-white shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <FiFilter className="text-indigo-500" /> Filter Options
            </h3>
            <hr className="border-slate-100 mb-6" />

            {/* Availability Filter */}
            <div className="mb-6">
              <button
                className="font-bold text-slate-700 mb-4 flex items-center justify-between cursor-pointer w-full group"
                onClick={() => setOpenBestFilter(!openBestFilter)}
              >
                <span>Availability</span>
                {openBestFilter ? (
                  <FiChevronUp className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                ) : (
                  <FiChevronDown className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                )}
              </button>
              {openBestFilter && (
                <div className="flex flex-col gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">4 Stars & Upper</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">In Stock Only</span>
                  </label>
                </div>
              )}
            </div>

            <hr className="border-slate-100 mb-6" />

            {/* Price Filter */}
            <div>
              <button
                className="font-bold text-slate-700 mb-4 flex items-center justify-between cursor-pointer w-full group"
                onClick={() => setOpenPriceFilter(!openPriceFilter)}
              >
                <span>Price Range</span>
                {openPriceFilter ? (
                  <FiChevronUp className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                ) : (
                  <FiChevronDown className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                )}
              </button>
              {openPriceFilter && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Min</p>
                      <input
                        type="number"
                        placeholder="TK. 0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase ml-1">Max</p>
                      <input
                        type="number"
                        placeholder="TK. 1000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => handleRangeClick(range)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 text-left
                        ${selectedRange === range.label
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30"}`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 text-slate-400">
              <FiLoader className="h-10 w-10 animate-spin mb-4 text-indigo-500" />
              <p className="font-medium">Finding best products for you...</p>
            </div>
          ) : products.length > 0 ? (
            <div className={`grid gap-6 ${activeView === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <FiFilter className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="text-sm text-slate-500 mt-1 px-10 text-center">We couldn't find any products in this category matching your current filters.</p>
              <button
                onClick={() => { setMinPrice(""); setMaxPrice(""); setSelectedRange(""); setSortOrder("relevant"); }}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
