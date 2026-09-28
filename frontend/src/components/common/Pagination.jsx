import "./Pagination.css";

function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
}) {
    if (totalPages <= 1) {
        return null;
    }

    const handlePageChange = (page) => {
        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        onPageChange(page);
    };

    const getPages = () => {
        if (totalPages <= 5) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, "...", totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };

    return (
        <div className="common-pagination">
            <button
                type="button"
                className="common-pagination-button"
                onClick={() =>
                    handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
            >
                <i className="bi bi-chevron-left"></i>
            </button>

            {getPages().map((page, index) =>
                page === "..." ? (
                    <span
                        key={`dots-${index}`}
                        className="common-pagination-dots"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        className={
                            page === currentPage
                                ? "common-pagination-button active"
                                : "common-pagination-button"
                        }
                        onClick={() =>
                            handlePageChange(page)
                        }
                    >
                        {page}
                    </button>
                )
            )}

            <button
                type="button"
                className="common-pagination-button"
                onClick={() =>
                    handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
            >
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
}

export default Pagination;