"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ebookService } from "../../services/ebook.service";
import { FiDownload, FiBookOpen, FiLoader, FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function PurchaseListPage() {
  const { data: myEbooks, isLoading } = useQuery({
    queryKey: ["my-ebooks"],
    queryFn: () => ebookService.getMyEbooks(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4">
            <FiBookOpen className="text-indigo-600" /> My Library
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Access and download your purchased ebooks.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {!myEbooks || myEbooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <FiBookOpen size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your library is empty</h2>
            <p className="text-gray-500 mt-2 mb-8">You haven't purchased any ebooks yet.</p>
            <Link
              href="/"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Browse Ebooks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myEbooks.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.product.image || "/assets/placeholder.png"}
                    alt={item.product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a
                      href={item.product.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-gray-900 p-4 rounded-full hover:bg-indigo-600 hover:text-white transition-colors"
                      title="Download PDF"
                    >
                      <FiDownload size={24} />
                    </a>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {item.product.title}
                      </h3>
                      <p className="text-gray-500 text-sm">By {item.product.author}</p>
                    </div>
                    <span className="bg-green-50 text-green-600 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      Purchased
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                      Bought on {new Date(item.purchasedAt).toLocaleDateString()}
                    </span>
                    <a
                      href={item.product.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Download <FiArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
