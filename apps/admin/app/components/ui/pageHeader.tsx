// components/ui/PageHeader.jsx
"use client";

import Link from "next/link";
import DynamicBreadcrumb from "./breadCrumbs";

export default function PageHeader({
  title,
  actionLink,
}: {
  title: string;
  actionLink: any;
}) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center md:justify-between 
      bg-white p-4 rounded-lg shadow mb-6"
    >
      {/* Left Title */}
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

      {/* Right: Dynamic Breadcrumb + Optional Button */}
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        <DynamicBreadcrumb />

        {actionLink && (
          <Link
            href={actionLink.href}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
            rounded-lg text-sm transition"
          >
            {actionLink.label}
          </Link>
        )}
      </div>
    </div>
  );
}
