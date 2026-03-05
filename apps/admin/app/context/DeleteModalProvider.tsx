"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import { FiTrash2 } from "react-icons/fi";

interface DeleteContextType {
    confirm: (callback: () => Promise<void> | void) => void;
}

const DeleteModalContext = createContext<DeleteContextType | null>(null);

export function DeleteModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState<(() => Promise<void> | void) | null>(null);

    const confirm = (callback: () => Promise<void> | void) => {
        setAction(() => callback);
        setIsOpen(true);
    };

    const handleConfirm = async () => {
        if (!action) return;
        try {
            setLoading(true);
            await action();
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) setIsOpen(false);
    };

    return (
        <DeleteModalContext.Provider value={{ confirm }}>
            {children}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"
                    }`}
            >
                {/* Overlay */}
                <div
                    onClick={handleClose}
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                        }`}
                />

                {/* Modal */}
                <div
                    className={`relative bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 transform transition-all duration-300 ${isOpen
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-4 scale-95 opacity-0"
                        }`}
                >
                    <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                        <FiTrash2 className="text-red-600 text-3xl" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-center text-gray-800">
                        Delete Item
                    </h2>

                    <p className="mt-2 text-sm text-center text-gray-500">
                        Are you sure? This action cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            disabled={loading}
                            onClick={handleClose}
                            className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            onClick={handleConfirm}
                            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>

        </DeleteModalContext.Provider>
    );
}

export function useDeleteConfirm() {
    const context = useContext(DeleteModalContext);
    if (!context) {
        throw new Error("useDeleteConfirm must be used inside DeleteModalProvider");
    }
    return context.confirm;
}