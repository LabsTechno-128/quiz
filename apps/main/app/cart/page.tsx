'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

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
    name: 'Geography Mastery',
    category: 'Geography',
    price: 15,
    img: '/assets/card-quzzy.png'
  },
  {
    id: 2,
    name: 'Grammar Essentials',
    category: 'English',
    price: 20,
    img: '/assets/card-quzzy.png'
  },
  {
    id: 3,
    name: 'Human Body System',
    category: 'Science',
    price: 46,
    img: '/assets/card-quzzy.png'
  }
];

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>(
    initialProducts.map((p) => ({ ...p, qty: 1, selected: false }))
  );

  const toggleSelect = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const changeQty = (id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, (p.qty || 1) + delta) } : p
      )
    );
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const selectedProducts = products.filter((p) => p.selected);
  const totalPrice = selectedProducts.reduce(
    (sum, p) => sum + p.price * (p.qty || 1),
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#F7F7F7] py-14 px-4 md:px-10 lg:px-24 max-w-[1440px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Shopping Chart</h1>
          <p className="text-normal pt-2">Showing your choices product</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort By:</label>
          <select className="border border-gray-300 rounded-md px-2 py-3 text-sm focus:outline-none">
            <option value="relevant">Relevant Order</option>
            <option value="price_low_high">Price: Low → High</option>
            <option value="price_high_low">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-24 max-w-[1440px] mx-auto -mt-9 overflow-hidden">
        {/* Left Section */}
        <div className="bg-white w-full lg:w-2/3 rounded-xl shadow-sm border border-[#E4E9EE]">
          <div className="p-5">
            <h2 className="font-semibold text-gray-800 text-lg">
              Logitech Indonesia
            </h2>
            <p className="text-sm text-gray-500">Central Jakarta</p>
          </div>

          <div>
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-gray-50 transition border-t border-[#E4E9EE]"
              >
                {/* Checkbox + Image + Info */}
                <div className="flex  items-center gap-4">
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
                    width={20}
                    height={20}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{p.name}</h4>
                    <p className="text-sm text-gray-500">{p.category}</p>
                    <p className="text-green-600 font-semibold">${p.price}</p>
                  </div>
                </div>

                {/* Quantity & Delete */}
                <div className="flex t md:items-center gap-4 pt-3 ">
                  <div className="flex items-center border border-[#E4E9EE] rounded-lg px-2">
                    <button
                      onClick={() => changeQty(p.id, -1)}
                      className="p-1 hover:text-indigo-600"
                    >
                      <FiMinus />
                    </button>
                    <span className="px-3">{p.qty}</span>
                    <button
                      onClick={() => changeQty(p.id, 1)}
                      className="p-1 hover:text-indigo-600"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeProduct(p.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 size={18} />
                  </button>
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
              <Link href="/checkout">
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



