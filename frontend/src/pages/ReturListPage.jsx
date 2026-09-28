import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getRetur,
    deleteRetur,
} from "../api/retur";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loading from "../components/common/Loading";

import "./Retur.css";

const normalizeResponse = (response) => {
    return response?.data?.data ?? response?.data ?? response ?? [];
};

const getId = (item) => {
    return item?.id ?? item?.id_retur;
};

function ReturListPage() {
    const navigate = useNavigate();

    const [retur, setRetur] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const loadRetur = async () => {
        try {
            setLoading(true);

            const response = await getRetur();
            const data = normalizeResponse(response);

            setRetur(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data retur:", error);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Data retur gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRetur();
    }, []);

    const filteredRetur = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return retur;
        }

        return retur.filter((item) => {
            const produk =
                item?.produk?.nama_produk ??
                item?.produk?.nama ??
                "";

            const transaksi =
                item?.transaksi_id ??
                item?.transaksi?.id ??
                "";

            const alasan = item?.alasan ?? "";
            const tanggal = item?.tanggal_retur ?? "";

            return (
                String(produk).toLowerCase().includes(keyword) ||
                String(transaksi).toLowerCase().includes(keyword) ||
                String(alasan).toLowerCase().includes(keyword) ||
                String(tanggal).toLowerCase().includes(keyword)
            );
        });
    }, [retur, search]);

    const totalPages = Math.ceil(
        filteredRetur.length / itemsPerPage
    );

    const paginatedRetur = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return filteredRetur.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [filteredRetur, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }

        if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleDelete = async (item) => {
        const id = getId(item);

        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "ID retur tidak ditemukan.",
            });

            return;
        }

        const result = await ConfirmDialog({
            title: "Hapus Data Retur?",
            text: "Data retur akan dihapus dan stok akan disesuaikan kembali.",
            confirmText: "Ya, Hapus",
            cancelText: "Batal",
            icon: "warning",
        });

        if (!result?.isConfirmed) {
            return;
        }

        try {
            await deleteRetur(id);

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data retur berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });

            await loadRetur();
        } catch (error) {
            console.error("Gagal menghapus retur:", error);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Data retur gagal dihapus.",
            });
        }
    };

    const columns = [
        {
            header: "No",
            accessor: (_, index) =>
                (currentPage - 1) * itemsPerPage + index + 1,
        },
        {
            header: "Tanggal",
            accessor: (item) => {
                if (!item?.tanggal_retur) {
                    return "-";
                }

                return new Date(
                    item.tanggal_retur
                ).toLocaleDateString("id-ID");
            },
        },
        {
            header: "Transaksi",
            accessor: (item) =>
                item?.transaksi_id ??
                item?.transaksi?.id ??
                "-",
        },
        {
            header: "Produk",
            accessor: (item) =>
                item?.produk?.nama_produk ??
                item?.produk?.nama ??
                "-",
        },
        {
            header: "Ukuran",
            accessor: (item) =>
                item?.ukuran?.nama_ukuran ??
                "-",
        },
        {
            header: "Warna",
            accessor: (item) =>
                item?.warna?.nama_warna ??
                "-",
        },
        {
            header: "Jumlah",
            accessor: (item) =>
                item?.jumlah ?? 0,
        },
        {
            header: "Alasan",
            accessor: (item) =>
                item?.alasan ?? "-",
        },
        {
            header: "Aksi",
            accessor: (item) => (
                <div className="retur-actions">
                    <button
                        type="button"
                        className="retur-btn retur-btn-detail"
                        onClick={() =>
                            navigate(
                                `/retur/detail/${getId(item)}`
                            )
                        }
                    >
                        Detail
                    </button>

                    <button
                        type="button"
                        className="retur-btn retur-btn-edit"
                        onClick={() =>
                            navigate(
                                `/retur/edit/${getId(item)}`
                            )
                        }
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="retur-btn retur-btn-delete"
                        onClick={() =>
                            handleDelete(item)
                        }
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="retur-page">
                <Loading text="Memuat data retur..." />
            </div>
        );
    }

    return (
        <div className="retur-page">
            <div className="retur-card">
                <div className="retur-header">
                    <div>
                        <h2>Data Retur</h2>
                        <p>
                            Kelola data retur produk dan
                            penyesuaian stok.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="retur-btn retur-btn-primary"
                        onClick={() =>
                            navigate("/retur/create")
                        }
                    >
                        + Tambah Retur
                    </button>
                </div>

                <div className="retur-toolbar">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            handleSearch(e.target.value)
                        }
                        placeholder="Cari produk, transaksi, alasan..."
                        className="retur-search"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedRetur}
                    emptyMessage="Belum ada data retur."
                />

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
}

export default ReturListPage;