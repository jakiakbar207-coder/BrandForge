import "./EmptyState.css";

function EmptyState({
    icon = "bi-inbox",
    title = "Belum Ada Data",
    message = "Belum ada data yang tersedia.",
}) {
    return (
        <div className="common-empty-state">
            <div className="common-empty-icon">
                <i className={`bi ${icon}`}></i>
            </div>

            <h3>{title}</h3>

            <p>{message}</p>
        </div>
    );
}

export default EmptyState;