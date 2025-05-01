// DeleteDialog.jsx

export default function DeleteDialog({
    isOpen = false,
    onClose = false,
    onConfirm = false,
    title = 'Confirm Deletion',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmButtonText = 'Delete',
    cancelButtonText = 'Cancel',
}) {
    if (!isOpen) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black" aria-modal="true">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-medium text-gray-900">{title}</h3>
                <p className="mb-5 text-sm text-gray-500">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                    >
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
