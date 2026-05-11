"use client";
import { useState, useEffect } from "react";
import QuizCard from "../card/QuizCard";
import ErrorMessage from "../common/ErrorMessage";
import { QuizSectionSkeleton } from "../skeleton/homeQuizSkeleton";
import { bookServic } from "@/services/book.service";
import Link from "next/link";

export default function BookSection() {
    const [books, setBooks] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await bookServic.getAll({ page: 1, limit: 4 });
            console.log(response, "responseeeeeeee")
            setBooks(response.result || []);
        } catch (e: unknown) {
            console.error("Error loading books:", e);
            setError(e instanceof Error ? e.message : "Failed to load books");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
        );
    };
    console.log(books, "--->>")
    /** ✅ Skeleton instead of spinner */
    if (isLoading) {
        return <QuizSectionSkeleton />;
    }

    if (error) {
        return (
            <section className="pt-16 text-center">
                <div className="mx-auto px-4 md:px-10 lg:px-24">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-title">
                        Available Quiz on Quzzy
                    </h2>
                    <p className="text-normal mb-10">
                        Choose from a variety of topics. Buy now and get a free PDF guide
                        with each quiz!
                    </p>
                    <ErrorMessage message={error} onRetry={loadBooks} />
                </div>
            </section>
        );
    }

    return (
        <section className="pt-16 text-center">
            <div className="mx-auto px-4 md:px-10 lg:px-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-title">
                    Available Quiz on Quzzy
                </h2>
                <p className="text-normal mb-10">
                    Choose from a variety of topics. Buy now and get a free PDF guide with
                    each quiz!
                </p>

                {books.length === 0 ? (
                    <p className="text-gray-500">No books available at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {books.map((book) => (
                            <QuizCard
                                key={book.id}
                                quiz={book}
                                isFavorite={favorites.includes(book.id)}
                                onToggleFavorite={() => toggleFavorite(book.id)}
                            />
                        ))}
                    </div>
                )}

                {/* <Link href="/quiz" className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition mt-10">
                    View Detail
                </Link> */}
            </div>
        </section>
    );
}
