"use client"
import useFetch from "@/app/hooks/useFetch";;
import BannerTable from "./components/bannerTable";

const Category = () => {
    const { data, loading, error, refetch } = useFetch("/banners");
    console.log(data)
    const handleEdit = (item: any) => {
        console.log("Edit item:", item);
        // you can open a modal here
    };
    return (
        <div className="p-5">
            {error && <p className="text-red-600">{error}</p>}
            <BannerTable
                data={data?.data}
                refetch={refetch}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default Category;