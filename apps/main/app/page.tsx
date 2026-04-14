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

  return (
    <div className="max-w-[1440px] mx-auto">
      <h1>i hvae plan for yoiu</h1>
      <HeroSection></HeroSection>

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

      <QuizSection></QuizSection>
      <Physics></Physics>

      {/* Articles Section */}
      {isLoadingArticles ? (
        <div className="py-16">
          <ArticlesSectionSkeleton />
        </div>
      ) : articleError ? (
        <div className="py-16">
          <ErrorMessage message={articleError} onRetry={loadArticles} />
        </div>
      ) : (
        <ArticlesSection articles={articles}></ArticlesSection>
      )}
    </div>
  );
}
