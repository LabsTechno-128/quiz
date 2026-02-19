'use client';

export default function NavbarSkeleton() {
    return (
        <nav className="w-full bg-white border-b border-gray-200 relative z-50">
            <div className="mx-auto flex items-center justify-between py-4 px-6 md:px-24 animate-pulse">

                {/* Left - Logo */}
                <div className="flex items-center gap-3">
                    <div className="hidden lg:block w-[150px] h-[40px] bg-gray-200 rounded-md"></div>
                    <div className="lg:hidden w-6 h-6 bg-gray-200 rounded"></div>
                </div>

                {/* Middle - Search */}
                <div className="hidden lg:flex items-center bg-gray-50 rounded-md w-[500px] xl:w-[800px] h-[44px] overflow-hidden">

                    {/* Category */}
                    <div className="w-28 h-full bg-gray-200"></div>

                    <div className="mx-2 w-[1px] h-5 bg-gray-300"></div>

                    {/* Search Input */}
                    <div className="flex-1 h-full bg-gray-200"></div>

                    {/* Search Icon */}
                    <div className="w-12 h-full bg-gray-300"></div>
                </div>

                {/* Right - Icons */}
                <div className="flex items-center gap-5">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="h-5 w-[1px] bg-gray-300"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </nav>
    );
}
