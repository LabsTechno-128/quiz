"use client";
import useFetch from "@/app/hooks/useFetch";
import CategoryTable from "./components/categoryTable";

const Category = () => {
  const { data, loading, error, refetch } = useFetch("/ebooks");
  console.log(data);
  const handleEdit = (item: any) => {
    console.log("Edit item:", item);
    // you can open a modal here
  };
  return (
    <div className="p-5">
      {error && <p className="text-red-600">{error}</p>}
      <CategoryTable data={data?.data} refetch={refetch} onEdit={handleEdit} />
    </div>
  );
};

export default Category;
