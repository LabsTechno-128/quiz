// components/ArticleTable.jsx
"use client";
import DataTable from "react-data-table-component";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDelete } from "@/app/hooks/useDelete";

export default function BannerTable({
  data,
  refetch,
  onEdit,
}: {
  data: any;
  refetch: any;
  onEdit: any;
}) {
  const { remove, loading } = useDelete();

  const handleDelete = async (id: any) => {
    const ok = confirm("Are you sure you want to delete?");
    if (!ok) return;

    const result = await remove(`/banners/${id}`);
    if (result) {
      alert("Deleted successfully");
      refetch(); // refresh table
    }
  };

  const columns = [
    {
      name: "Title",
      selector: (row: any) => row.title,
      sortable: true,
    },
    {
      name: "Subtitle",
      selector: (row: any) => row?.subtitle,
    },
    {
      name: "Description",
      selector: (row: any) => row?.description,
    },
    {
      name: "Status",
      selector: (row: any) => (row?.status ? "Active" : "Inactive"),
      sortable: true,
    },
    {
      name: "Created",
      selector: (row: any) =>
        new Date(row.created_at).toLocaleDateString("en-GB"),
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
      title="Banner List"
      columns={columns}
      data={data || []}
      pagination
      progressPending={loading}
      highlightOnHover
      pointerOnHover
      responsive
    />
  );
}
