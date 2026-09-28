import "./FormModal.css";

function FormModal({
    show = false,
    title = "Form",
    children,
    onClose,
    onSubmit,
    submitText = "Simpan",
    cancelText = "Batal",
    loading = false,
    size = "medium",
}) {
    if (!show) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!loading && onSubmit) {
            onSubmit(event);
        }
    };

    const handleOverlayMouseDown = (event) => {
        if (
            event.target === event.currentTarget &&
            !loading
        ) {
            onClose?.();
        }
    };

    return (
        <div
            className="common-form-modal-overlay"
            onMouseDown={handleOverlayMouseDown}
        >
            <div
                className={`common-form-modal common-form-modal-${size}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="common-form-modal-title"
            >
                <div className="common-form-modal-header">
                    <h2 id="common-form-modal-title">
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="common-form-modal-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Tutup"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="common-form-modal-body">
                        {children}
                    </div>

                    <div className="common-form-modal-footer">
                        <button
                            type="button"
                            className="common-form-modal-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            {cancelText}
                        </button>

                        <button
                            type="submit"
                            className="common-form-modal-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Menyimpan..."
                                : submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormModal;