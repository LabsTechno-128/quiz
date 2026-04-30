"use client";
import { useEffect, useState } from "react";
import { Article, Category, Quiz } from "./types/api.types";
import { categoryService } from "./services/category.service";
import { articleService } from "./services/article.service";
import HeroSection from "./components/home/HeroSection";
import FeaturedCategorySkeleton from "./components/skeleton/featureSekeleton";
import ErrorMessage from "./components/common/ErrorMessage";
import FeaturedCategory from "./components/home/FeaturedCategory";
import QuizSection from "./components/home/QuizSection";
import Physics from "./components/home/Physics";
import ArticlesSectionSkeleton from "./components/skeleton/homeArticleSkeleton";
import ArticlesSection from "./components/card/QuzzyCard";
import BookSection from "./components/home/Book";
// import { serverApi } from "@/lib/serverApi";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [articleError, setArticleError] = useState<string | null>(null);
  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Load articles
  useEffect(() => {
    loadArticles();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoryError(null);
      const data = await categoryService.getAll();
      setCategories(data.result || []);
    } catch (e: unknown) {
      console.error("Error loading categories:", e);
      setCategoryError(
        e instanceof Error ? e.message : "Failed to load categories",
      );
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadArticles = async () => {
    try {
      setIsLoadingArticles(true);
      setArticleError(null);
      const response = await articleService.getAll({ page: 1, limit: 10 });

      setArticles(response.result || []);
    } catch (e: unknown) {
      console.error("Error loading articles:", e);
      setArticleError(
        e instanceof Error ? e.message : "Failed to load articles",
      );
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const download = async (cloudinaryUrl: string, filename?: string) => {
    try {
      const name = filename ?? cloudinaryUrl.split('/').pop()?.split('?')[0] ?? 'download';

      // Point to your NestJS backend
      const proxyUrl = `${process.env.NEXT_PUBLIC_API_URL}/attachments/download/proxy?url=${encodeURIComponent(cloudinaryUrl)}&filename=${encodeURIComponent(name)}`;

      const response = await fetch(proxyUrl);

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  return (
    <div className="max-w-[1440px] mx-auto">
      <HeroSection></HeroSection>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => download("https://res.cloudinary.com/dqakkjn5a/raw/upload/fl_attachment/v1777006660/attachments/attachments/1777006655476-Openspace_issues")}>Download PDF</button>
      <a href="https://res.cloudinary.com/dqakkjn5a/raw/upload/v1777006660/attachments/attachments/1777006655476-Openspace_issues" download="welcome.pdf"  >Download PDF</a>
      {/* Categories Section */}
      {isLoadingCategories ? (
        <div className="py-16">
          <FeaturedCategorySkeleton />
        </div>
      ) : categoryError ? (
        <div className="py-16">
          <ErrorMessage message={categoryError} onRetry={loadCategories} />
        </div>
      ) : (
        <FeaturedCategory category={categories}></FeaturedCategory>
      )}
      <BookSection />
      {/* <QuizSection></QuizSection> */}
      {/* <Physics></Physics> */}

      {/* Articles Section */}
      {/* {isLoadingArticles ? (
        <div className="py-16">
          <ArticlesSectionSkeleton />
        </div>
      ) : articleError ? (
        <div className="py-16">
          <ErrorMessage message={articleError} onRetry={loadArticles} />
        </div>
      ) : (
        <ArticlesSection articles={articles}></ArticlesSection>
      )} */}
    </div>
  );
}
