const DeletePopUp = ({ show, setShow, func }) => {
    return (
        <div>
            {show && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-xl">
                        <h3 className="text-xl font-bold text-red-600 mb-2">Delete Account?</h3>
                        <p className="text-sm text-gray-600 mb-5">This action is permanent and cannot be undone.</p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShow(false)}
                                className="px-4 py-2 rounded-xl bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={func}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeletePopUp;
