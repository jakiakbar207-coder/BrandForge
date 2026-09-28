function DataTable({
    columns = [],
    data = [],
    loading = false,
    onEdit,
    onDelete,
    emptyMessage = "Belum ada data.",
}) {
    const hasActions = Boolean(onEdit || onDelete);
    const totalColumns = columns.length + (hasActions ? 1 : 0);

    const getHeader = (column) => {
        return column?.header ?? column?.label ?? "";
    };

    const getCellValue = (column, item, index) => {
        if (typeof column?.render === "function") {
            return column.render(item, index);
        }

        if (typeof column?.accessor === "function") {
            return column.accessor(item, index);
        }

        if (column?.accessor) {
            return item?.[column.accessor] ?? "-";
        }

        if (column?.key) {
            return item?.[column.key] ?? "-";
        }

        return "-";
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={
                                    column?.key ??
                                    column?.header ??
                                    column?.label ??
                                    index
                                }
                            >
                                {getHeader(column)}
                            </th>
                        ))}

                        {hasActions && <th>Aksi</th>}
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={totalColumns}
                                className="text-center py-4"
                            >
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    <div
                                        className="spinner-border spinner-border-sm text-primary"
                                        role="status"
                                    ></div>

                                    <span>Memuat data...</span>
                                </div>
                            </td>
                        </tr>
                    ) : data.length > 0 ? (
                        data.map((item, index) => (
                            <tr
                                key={
                                    item?.id ??
                                    item?.id_biaya_operasional ??
                                    index
                                }
                            >
                                {columns.map((column, columnIndex) => (
                                    <td
                                        key={
                                            column?.key ??
                                            column?.header ??
                                            column?.label ??
                                            columnIndex
                                        }
                                    >
                                        {getCellValue(
                                            column,
                                            item,
                                            index
                                        )}
                                    </td>
                                ))}

                                {hasActions && (
                                    <td>
                                        <div className="d-flex gap-2">
                                            {onEdit && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        onEdit(item)
                                                    }
                                                    title="Edit"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        onDelete(item)
                                                    }
                                                    title="Hapus"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={totalColumns}
                                className="text-center py-4 text-muted"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;