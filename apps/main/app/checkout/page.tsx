'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';


type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
  qty?: number;
  selected?: boolean;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Bkash',
    category: 'Geography',
    price: +8801712131343,
    img: '/assets/card-quzzy.png'
  },
  {
    id: 2,
    name: 'Rocket',
    category: 'English',
    price: +8801712131343,
    img: '/assets/card-quzzy.png'
  },
  {
    id: 3,
    name: 'Human Body System',
    category: 'Science',
    price: +8801712131343,
    img: '/assets/card-quzzy.png'
  }
];

export default function ChackOutPage() {
  const [products, setProducts] = useState<Product[]>(
    initialProducts.map((p) => ({ ...p, qty: 1, selected: false }))
  );

  const toggleSelect = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };
;

  const selectedProducts = products.filter((p) => p.selected);
  const totalPrice = selectedProducts.reduce(
    (sum, p) => sum + p.price * (p.qty || 1),
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="flex gap-4 justify-between bg-[#F7F7F7] py-14 px-6 lg:px-24 max-w-[1440px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-normal pt-2">Showing your choices product</p>
        </div>

      </div>

      {/* Main */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-16 max-w-[1440px] mx-auto -mt-9">
        {/* Left Section */}
        <div className="bg-white w-full lg:w-2/3 rounded-xl shadow-sm border border-[#E4E9EE]">
          <div className="p-5 ">
            <h2 className="font-semibold text-gray-800 text-lg">
              Payment Method
            </h2>
         
          </div>

          <div>
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition border-t border-[#E4E9EE]"
              >
                {/* Checkbox + Image + Info */}
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={p.selected}
                    onChange={() => toggleSelect(p.id)}
                    className="accent-indigo-600"
                  />
                  {/* <img
                    src={p.img}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  /> */}
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={30}
                    height={20}
                    className="w-16 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xl text-gray-800">{p.name}</h4>
               
                    <p className=" text-normal">{p.price}</p>
                  </div>
                </div>


              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-[#E4E9EE] p-5">
            <h3 className="font-semibold text-gray-800 mb-4">
              Product Summary
            </h3>

            {selectedProducts.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">No products selected</p>
            ) : (
              <ul className="mb-4 text-sm text-gray-700 space-y-1">
                {selectedProducts.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <span>
                      {p.name} × {p.qty}
                    </span>
                    <span>${p.price * (p.qty || 1)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-sm text-gray-600 border-t border-[#E4E9EE] pt-3 space-y-1">
              <p className="flex justify-between">
                <span>Total Price</span>
                <span>${totalPrice}</span>
              </p>
              <p className="flex justify-between">
                <span>Total Price (Discount)</span>
                <span>$0</span>
              </p>
              <p className="flex justify-between">
                <span>Tax & Fee</span>
                <span>$0</span>
              </p>
            </div>

            <div className="mt-4 border-t border-[#E4E9EE] pt-3">
              <p className="flex justify-between font-semibold text-gray-800">
                <span>Total Price</span>
                <span>${totalPrice}</span>
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full bg-gray-100 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-200">
                Use a Promo
              </button>
              <Link href="/success">
                <button className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm hover:bg-indigo-700">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
