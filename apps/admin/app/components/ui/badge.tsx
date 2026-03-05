"use client";

import clsx from "clsx";

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "processing"
  | "cancelled";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    styles: string;
  }
> = {
  active: {
    label: "Active",
    styles:
      "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
  },
  inactive: {
    label: "Inactive",
    styles:
      "bg-gray-100 text-gray-600 ring-gray-500/20",
  },
  pending: {
    label: "Pending",
    styles:
      "bg-amber-100 text-amber-700 ring-amber-600/20",
  },
  processing: {
    label: "Processing",
    styles:
      "bg-blue-100 text-blue-700 ring-blue-600/20",
  },
  cancelled: {
    label: "Cancelled",
    styles:
      "bg-rose-100 text-rose-700 ring-rose-600/20",
  },
};

export default function StatusBadge({
  status,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition-all duration-200",
        config.styles,
        className
      )}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
}