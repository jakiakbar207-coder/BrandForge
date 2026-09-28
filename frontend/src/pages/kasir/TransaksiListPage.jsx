import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getTransaksiKasir,
    deleteTransaksiKasir,
} from "../../api/transaksi";

import DataTable from "../../components/common/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import "./Transaksi.css";

function TransaksiListPage() {
    const navigate = useNavigate();

    const [transaksi, setTransaksi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);

    useEffect(() => {
        loadTransaksi();
    }, []);

    const loadTransaksi = async () => {
        setLoading(true);

        try {
            const response = await getTransaksiKasir();

            const data = Array.isArray(response)
                ? response
                : response?.data || [];

            setTransaksi(data);
        } catch (error) {
            console.error(
                "Gagal mengambil data transaksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Data transaksi gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value) || 0);
    };

    const formatTanggal = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getFilteredData = () => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return transaksi;
        }

        return transaksi.filter((item) => {
            const kode = String(
                item.kode_transaksi || ""
            ).toLowerCase();

            const namaUser = String(
                item.user?.name || ""
            ).toLowerCase();

            const tanggal = String(
                item.tanggal_transaksi || ""
            ).toLowerCase();

            return (
                kode.includes(keyword) ||
                namaUser.includes(keyword) ||
                tanggal.includes(keyword)
            );
        });
    };

    const filteredData = getFilteredData();

    const totalPages = Math.ceil(
        filteredData.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    useEffect(() => {
        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleDeleteClick = (item) => {
        setSelectedTransaksi(item);
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedTransaksi || deleting) {
            return;
        }

        setDeleting(true);

        try {
            await deleteTransaksiKasir(
                selectedTransaksi.id
            );

            setTransaksi((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== selectedTransaksi.id
                )
            );

            setShowDeleteDialog(false);
            setSelectedTransaksi(null);

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Transaksi berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Gagal menghapus transaksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Transaksi gagal dihapus.",
            });
        } finally {
            setDeleting(false);
        }
    };

    const columns = [
        {
            header: "No",
            render: (_, index) =>
                startIndex + index + 1,
        },
        {
            header: "Kode Transaksi",
            render: (item) => (
                <strong>
                    {item.kode_transaksi || "-"}
                </strong>
            ),
        },
        {
            header: "Tanggal",
            render: (item) =>
                formatTanggal(
                    item.tanggal_transaksi
                ),
        },
        {
            header: "Kasir",
            render: (item) =>
                item.user?.name || "-",
        },
        {
            header: "Total",
            render: (item) =>
                formatRupiah(item.total_harga),
        },
        {
            header: "Bayar",
            render: (item) =>
                formatRupiah(item.bayar),
        },
        {
            header: "Kembalian",
            render: (item) =>
                formatRupiah(item.kembalian),
        },
        {
            header: "Aksi",
            render: (item) => (
                <div className="transaksi-action-buttons">
                    <button
                        type="button"
                        className="transaksi-action-button detail"
                        onClick={() =>
                            navigate(
                                `/kasir/transaksi/detail/${item.id}`
                            )
                        }
                        title="Lihat Detail"
                    >
                        <i className="bi bi-eye"></i>
                    </button>

                    <button
                        type="button"
                        className="transaksi-action-button delete"
                        onClick={() =>
                            handleDeleteClick(item)
                        }
                        title="Hapus"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="transaksi-page">
                <Loading />
            </div>
        );
    }

    return (
        <div className="transaksi-page">
            <div className="transaksi-page-header">
                <div>
                    <h1>Transaksi</h1>

                    <p>
                        Kelola transaksi penjualan Kasir
                    </p>
                </div>

                <button
                    type="button"
                    className="transaksi-primary-button"
                    onClick={() =>
                        navigate(
                            "/kasir/transaksi/create"
                        )
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    Transaksi Baru
                </button>
            </div>

            <div className="transaksi-card">
                <div className="transaksi-toolbar">
                    <div className="transaksi-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Cari kode transaksi atau kasir..."
                        />
                    </div>

                    <button
                        type="button"
                        className="transaksi-refresh-button"
                        onClick={loadTransaksi}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                        Refresh
                    </button>
                </div>

                {filteredData.length === 0 ? (
                    <EmptyState
                        title="Belum Ada Transaksi"
                        message={
                            search
                                ? "Tidak ada transaksi yang sesuai dengan pencarian."
                                : "Belum ada transaksi Kasir."
                        }
                    />
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={paginatedData}
                        />

                        {totalPages > 1 && (
                            <div className="transaksi-pagination">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={
                                        setCurrentPage
                                    }
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Hapus Transaksi"
                message={
                    selectedTransaksi
                        ? `Yakin ingin menghapus transaksi ${selectedTransaksi.kode_transaksi}?`
                        : "Yakin ingin menghapus transaksi ini?"
                }
                confirmText={
                    deleting
                        ? "Menghapus..."
                        : "Hapus"
                }
                cancelText="Batal"
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!deleting) {
                        setShowDeleteDialog(false);
                        setSelectedTransaksi(null);
                    }
                }}
                loading={deleting}
            />
        </div>
    );
}

export default TransaksiListPage;