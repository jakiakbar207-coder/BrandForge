import "./Loading.css";

function Loading({
    message = "Memuat data...",
    size = "medium",
}) {
    return (
        <div
            className={`common-loading common-loading-${size}`}
            role="status"
            aria-live="polite"
        >
            <div
                className="spinner-border"
                aria-hidden="true"
            ></div>

            <span>{message}</span>
        </div>
    );
}

export default Loading;