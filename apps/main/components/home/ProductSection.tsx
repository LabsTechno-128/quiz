import { useEffect, useState } from "react";
import ProductCard from "../card/ProductCard";
import ProductLayout from "../productLayout/ProductLayout";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/api.types";

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
            console.log(response, "responseeeeeeee")
            setCategoryProduct(response.result)
        } catch (e: unknown) {
            console.error("Error loading books:", e);
            setError(e instanceof Error ? e.message : "Failed to load books");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="pt-16 text-center">
            {categoryProduct.map((category) => (
                <ProductLayout key={category.id} title={category.name} slug={category.slug || ''}>
                    <div className="flex gap-2">
                        {category.products?.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </ProductLayout>
            ))}
        </section>
    );
}
