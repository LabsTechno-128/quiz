"use client";
import Image from "next/image";
import type { Article } from "@/app/types/api.types";

export default function ArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <section className=" mx-auto px-4 md:px-10 lg:px-24 pt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-semibold text-gray-800">
          Quzzy&apos;s Article
        </h2>
        <button className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition">
          View Detail
        </button>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {articles.map((article) => (
          <div
            key={article.id}
            className=" rounded-xl overflow-hidden  transition"
          >
            <div className="relative h-48 w-full">
              <Image
                src={
                  article.thumbnail ||
                  article.coverImage ||
                  "/assets/card-quzzy.png"
                }
                alt={article.title || "Article Image"}
                fill
                className=""
              />
            </div>

            <div className="py-5 px-2">
              <p className="text-sm text-gray-500 mb-2">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : new Date(article.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {article.excerpt || article.content?.substring(0, 150) + "..."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
