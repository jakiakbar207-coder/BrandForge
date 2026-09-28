import "./ConfirmDialog.css";

function ConfirmDialog({
    show = false,
    title = "Konfirmasi",
    message = "Apakah Anda yakin ingin melanjutkan?",
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    onConfirm,
    onCancel,
    loading = false,
}) {
    if (!show) {
        return null;
    }

    return (
        <div className="common-dialog-overlay">
            <div
                className="common-confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="common-confirm-title"
            >
                <div className="common-confirm-icon">
                    <i className="bi bi-exclamation-triangle"></i>
                </div>

                <div className="common-confirm-content">
                    <h3 id="common-confirm-title">
                        {title}
                    </h3>

                    <p>{message}</p>
                </div>

                <div className="common-confirm-actions">
                    <button
                        type="button"
                        className="common-confirm-cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="common-confirm-submit"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;