// components/ui/DynamicBreadcrumb.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function DynamicBreadcrumb() {
  const pathname = usePathname(); // example: /dashboard/category/create

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const buildHref = (index: number) => {
    return "/" + pathSegments.slice(0, index + 1).join("/");
  };

  return (
    <nav className="flex items-center text-sm text-gray-500">
      <Link href="/" className="hover:text-gray-700">
        Home
      </Link>

      {pathSegments.map((segment, index) => {
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <span key={index} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-2" />
            <Link
              href={buildHref(index)}
              className="hover:text-gray-700 transition"
            >
              {label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
