import Link from "next/link";

export default function ProductLayout({ title, slug, children }: { title: string, slug: string, children: React.ReactNode }) {

    return (
        <div className="shadow-md  rounded-md border border-gray-200 p-4">
            <div className="flex justify-between items-center py-4">
                <span className="text-title">{title}</span>
                <div className="flex gap-2">
                    <Link href={`/category/${slug}`} className="border border-gray-200 px-4 py-2 rounded-md">View All</Link>
                </div>
            </div>
            {children}
        </div>
    );
}
