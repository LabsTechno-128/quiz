// components/EbookTable.jsx
"use client";

import DataTable from "react-data-table-component";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDelete } from "@/app/hooks/useDelete";

export default function EbookTable({ data, refetch, onEdit }: any) {
  const { remove, loading } = useDelete();

  const handleDelete = async (id: any) => {
    const ok = confirm("Are you sure you want to delete this ebook?");
    if (!ok) return;

    const result = await remove(`/ebooks/${id}`);
    if (result) {
      alert("Deleted successfully");
      refetch();
    }
  };

  const columns = [
    {
      name: "Title",
      selector: (row: any) => row.title || "—",
      sortable: true,
      wrap: true,
    },
    {
      name: "Author",
      selector: (row: any) => row.author || "—",
      sortable: true,
    },
    {
      name: "Categories",
      selector: (row: any) =>
        row.categories?.length > 0 ? row.categories.join(", ") : "—",
      wrap: true,
    },
    {
      name: "Published At",
      selector: (row: any) =>
        row.publishedAt
          ? new Date(row.publishedAt).toLocaleDateString("en-GB")
          : "Not Published",
    },
    {
      name: "Created",
      selector: (row: any) =>
        new Date(row.createdAt).toLocaleDateString("en-GB"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex gap-3">
          <FiEdit
            size={18}
            className="cursor-pointer text-blue-600"
            onClick={() => onEdit(row)}
          />
          <FiTrash2
            size={18}
            className="cursor-pointer text-red-600"
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Ebook List"
      columns={columns}
      data={data || []}
      pagination
      highlightOnHover
      pointerOnHover
      responsive
      progressPending={loading}
    />
  );
}
