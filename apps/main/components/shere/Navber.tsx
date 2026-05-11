"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX,
  FiLogOut,
  FiShoppingBag,
} from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { GiPodiumWinner } from "react-icons/gi";
import Link from "next/link";
import Image from "next/image";
import NavbarSkeleton from "../skeleton/navskeleton";
import { publicRequest } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import LoginModal from "./LoginModal";
// import { clientApi } from '@/lib/clientApi';
// import { serverApi } from '@/lib/serverApi';

export default function Navbar() {
  // const result = serverApi("categories");
  // console.log("Categories in Navbar:", result);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const menuItems = [
    {
      label: "Purchase List",
      icon: <FiShoppingBag className="text-gray-600" />,
      href: "/purchase-list",
    },
    {
      label: "My Quiz",
      icon: <FaRegHeart className="text-gray-600" />,
      href: "/my-quiz",
    },
    {
      label: "Leaderboard",
      icon: <GiPodiumWinner className="text-gray-600" />,
      href: "/leaderboard",
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // api implement
  const [category, setCategory] = useState([{ id: 0, name: "Loading..." }]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await publicRequest.get("categories");
        // console.log("Categories in Navbar:", res.data);
        setCategory(res.data?.result);
        setLoading(false);
      } catch (e: unknown) {
        console.error("Error:", e);
        setLoading(false);
      }
    }
    loadData();
  }, []);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  return (
    <>
      {loading ? (
        <NavbarSkeleton />
      ) : (
        <nav className="w-full bg-white border-b border-gray-200 relative z-50">
          <div className="mx-auto flex items-center justify-between py-4 px-6 md:px-24">
            {/* Left - Logo */}


            {/* Middle - Search */}

            <div className="hidden lg:flex items-center bg-gray-50 rounded-md overflow-visible w-[500px] xl:w-[800px] relative">
              <Link href="/" className="flex items-center gap-2 ml-3">
                <div className="hidden lg:flex relative">
                  <Image
                    src="/free.png"
                    alt="Quizzy Logo"
                    className="object-contain rounded-md"
                    width={20}
                    height={30}
                  />
                </div>
                <button
                  className="text-gray-600 hover:text-indigo-600 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <FiMenu className="w-6 h-6" />
                </button>
              </Link>
              <div>
                <button
                  className="px-3 py-3 cursor-pointer hover:bg-gray-100 text-sm text-gray-600 text-nowrap ml-2"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  All Categories <span className="ml-1">▾</span>
                </button>
              </div>

              {/* Dropdown */}
              <div
                ref={dropdownRef}
                className="absolute top-14 left- w-40 z-50"
              >
                <ul
                  className={`shadow-lg mt-1 rounded-md bg-white transform transition-all duration-300 origin-top ${categoryOpen
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                    }`}
                >
                  {category?.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/category/${item.id}`}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                        onClick={() => setCategoryOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="border border-gray-300 h-5"></p>

              <div className="flex items-center justify-between w-[650px]">
                <input
                  type="text"
                  placeholder="Search on quizzy..."
                  className="px-3 py-2 focus:outline-none text-sm w-[90%] bg-gray-50"
                />
                <button className="px-3 text-gray-500 hover:text-indigo-600">
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right - Icons */}
            <div className=" relative">
              {user ? <div className="flex items-center gap-5  ">
                <Link href="/cart">
                  <button className="text-gray-600 hover:text-indigo-600 cursor-pointer relative">
                    <FiShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </Link>

                {/* <p className="border border-gray-300 h-5"></p> */}

                {/* Profile Button */}
                <button
                  className="text-gray-600 hover:text-indigo-600 border border-gray-200 rounded-full p-1.5 cursor-pointer relative"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <FiUser className="w-5 h-5" />
                </button>
              </div> :
                <button onClick={() => setLoginModalOpen(true)} className="text-gray-600 hover:text-indigo-600 border border-gray-200 rounded-full py-1 px-4 cursor-pointer">Login</button>}
              <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

              {/* Profile Popup */}
              <div
                className={`absolute top-10 right-0 w-64 md:w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-4 transform transition-all duration-300 z-[99999] ${profileOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
                  }`}
              >
                {/* Profile Info */}
                <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden">
                    <Image
                      src={user?.avatar || "/assets/card-quzzy.png"}
                      alt="loading"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {user ? (user.name || "Unknown") : "Abdul Malek Sarkar"}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {user ? user.email : "unknown@gmail.com"}
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                    Menu
                  </p>
                  <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 cursor-pointer transition"
                        >
                          {item.icon}
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* Sign Out */}
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-600 transition"
                >
                  <FiLogOut /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Background Blur (when popup open) */}
          {profileOpen && (
            <div
              className="fixed inset-0 bg-black/50  z-40"
              onClick={() => setProfileOpen(false)}
            ></div>
          )}

          {/* Category Dropdown */}
          {/* <div className="absolute top-14 left-[25%] w-40 bg-amber-500">
        <ul
          className={`shadow-lg mt-1 rounded-md bg-white z-[999] transform transition-all duration-300 origin-top ${
            categoryOpen
              ? 'opacity-100 scale-100 visible'
              : 'opacity-0 scale-95 invisible'
          }`}
        >
          {['Science', 'Math', 'History', 'Tech'].map((item) => (
            <li key={item}>
              <Link
                href={`/category/${item.toLowerCase()}`}
                className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                onClick={() => setCategoryOpen(false)}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div> */}

          {/* Sidebar for Small Devices */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[9999] transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                className="text-gray-600 hover:text-indigo-600"
                onClick={() => setSidebarOpen(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col p-5 gap-4 text-gray-700">
              <Link href="/" onClick={() => setSidebarOpen(false)}>
                Home
              </Link>
              <Link
                href="/category/science"
                onClick={() => setSidebarOpen(false)}
              >
                Science
              </Link>
              <Link href="/category/math" onClick={() => setSidebarOpen(false)}>
                Math
              </Link>
              <Link
                href="/category/history"
                onClick={() => setSidebarOpen(false)}
              >
                History
              </Link>
              <Link href="/category/tech" onClick={() => setSidebarOpen(false)}>
                Tech
              </Link>
              {/* <Link href="/cart" onClick={() => setSidebarOpen(false)}>
            Cart
          </Link>
          <Link href="/account" onClick={() => setSidebarOpen(false)}>
            My Account
          </Link> */}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
