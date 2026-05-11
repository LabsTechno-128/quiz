"use client";
import Image from "next/image";
import { FiHeart, FiStar } from "react-icons/fi";
import Link from "next/link";
import { Quiz, QuizQuestion } from "@/types/api.types";
import { useCart } from "@/contexts/CartContext";

export default function QuizCard({
  quiz,
  isFavorite,
  onToggleFavorite,
}: {
  quiz: Quiz;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: quiz.id,
      title: quiz.name,
      price: quiz.price ?? 0,
      image: quiz.image,
      quantity: 1,
      type: 'ebook', // or determine based on quiz properties
    });
  };
  return (
    <div className="bg-white rounded-2xl  transition-all duration-300  flex flex-col relative h-[420px]">
      {/* Favorite Icon */}
      <div className="flex justify-end absolute top-3 right-2 bg-white rounded-full p-1 ">
        <button
          onClick={() => onToggleFavorite(quiz.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <FiHeart
            size={22}
            fill={isFavorite ? "red" : "none"}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Image */}
      <div className="flex justify-center pt-14 mb-4 bg-[#F6F6F6] pb-14 rounded-xl ">
        <Image
          src={quiz.image || "/assets/card.png"}
          alt={quiz.name || "image"}
          width={100}
          height={100}
          className="object-contain mt-8"
        />
      </div>

      {/* Title + Price */}
      <div className="flex justify-between items-center mb-1 px-2">
        <h3 className="font-bold text-gray-800 text-base">{quiz.name}</h3>
        <span className="text-green-600 font-semibold">${quiz.price}</span>
      </div>

      {/* Category */}
      <p className="text-gray-500 text-sm mb-3 text-left px-2">
        {quiz?.category?.name || "General"}
      </p>

      {/* Rating + Info */}
      <div className="flex items-center gap-1  text-gray-500 mb-5 text-[14px] px-2">
        <FiStar className="text-yellow-400" size={16} />
        <span>{quiz.rating || 4.5}</span>
        <span className="mx-1">•</span>
        <span>{quiz.sold || 0} Sold</span>
        <span className="mx-1">•</span>
        <span>{quiz.totalQuestions || 15} MCQs + PDF</span>
      </div>


      {/* Button */}
      <div className="flex gap-2 px-2 mt-auto">
        <Link
          href={`/category/general/${quiz.id}`}
          className="flex-1"
        >
          <button className="bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all w-full">
            Details
          </button>
        </Link>
        <button
          onClick={handleAddToCart}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
