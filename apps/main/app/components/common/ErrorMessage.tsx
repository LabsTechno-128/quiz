import { FiAlertCircle } from 'react-icons/fi';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="p-3 bg-red-100 rounded-full text-red-600 mb-4">
                <FiAlertCircle size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
