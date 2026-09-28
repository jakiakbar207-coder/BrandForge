import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getKoleksi,
    deleteKoleksi,
} from "../api/koleksi";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";

import "./Koleksi.css";

function KoleksiListPage() {
    const navigate = useNavigate();

    const [koleksi, setKoleksi] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [showDeleteDialog, setShowDeleteDialog] =
        useState(false);

    const [selectedKoleksi, setSelectedKoleksi] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const itemsPerPage = 10;

    const loadKoleksi = async () => {
        try {
            setLoading(true);

            const response = await getKoleksi();

            const data =
                response?.data?.data ??
                response?.data ??
                response ??
                [];

            setKoleksi(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data koleksi:",
                error
            );

            setKoleksi([]);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Data koleksi gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKoleksi();
    }, []);

    const filteredKoleksi = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return koleksi;
        }

        return koleksi.filter((item) => {
            const id = String(
                item.id_koleksi ?? ""
            ).toLowerCase();

            const nama = String(
                item.nama_koleksi ?? ""
            ).toLowerCase();

            return (
                id.includes(keyword) ||
                nama.includes(keyword)
            );
        });
    }, [koleksi, search]);

    const totalPages = Math.ceil(
        filteredKoleksi.length / itemsPerPage
    );

    const paginatedKoleksi = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return filteredKoleksi.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [
        filteredKoleksi,
        currentPage,
    ]);

    useEffect(() => {
        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }

        if (
            totalPages === 0 &&
            currentPage !== 1
        ) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleEdit = (item) => {
        navigate(
            `/koleksi/edit/${item.id_koleksi}`
        );
    };

    const handleDeleteClick = (item) => {
        setSelectedKoleksi(item);
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedKoleksi) {
            return;
        }

        try {
            setDeleteLoading(true);

            await deleteKoleksi(
                selectedKoleksi.id_koleksi
            );

            setShowDeleteDialog(false);
            setSelectedKoleksi(null);

            await loadKoleksi();

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Koleksi berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Gagal menghapus koleksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Koleksi gagal dihapus.",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const columns = [
        {
            key: "no",
            label: "No",
            render: (_, index) =>
                (currentPage - 1) *
                    itemsPerPage +
                index +
                1,
        },
        {
            key: "id_koleksi",
            label: "ID Koleksi",
        },
        {
            key: "nama_koleksi",
            label: "Nama Koleksi",
        },
    ];

    return (
        <div className="koleksi-page">
            <div className="koleksi-header">
                <div>
                    <div className="koleksi-breadcrumb">
                        Dashboard / Koleksi
                    </div>

                    <h1>Data Koleksi</h1>

                    <p>
                        Kelola data koleksi produk
                        BrandForge.
                    </p>
                </div>

                <button
                    type="button"
                    className="koleksi-add-button"
                    onClick={() =>
                        navigate(
                            "/koleksi/create"
                        )
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Koleksi
                </button>
            </div>

            <div className="koleksi-card">
                <div className="koleksi-toolbar">
                    <div className="koleksi-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Cari koleksi..."
                        />
                    </div>

                    <div className="koleksi-total">
                        Total:{" "}
                        <strong>
                            {
                                filteredKoleksi.length
                            }
                        </strong>{" "}
                        data
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedKoleksi}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    emptyMessage={
                        search
                            ? "Koleksi yang dicari tidak ditemukan."
                            : "Belum ada data koleksi."
                    }
                />

                {!loading &&
                    filteredKoleksi.length > 0 && (
                        <div className="koleksi-pagination">
                            <Pagination
                                currentPage={
                                    currentPage
                                }
                                totalPages={
                                    totalPages
                                }
                                onPageChange={
                                    setCurrentPage
                                }
                            />
                        </div>
                    )}
            </div>

            <ConfirmDialog
                show={showDeleteDialog}
                title="Hapus Koleksi"
                message={
                    selectedKoleksi
                        ? `Apakah Anda yakin ingin menghapus koleksi "${selectedKoleksi.nama_koleksi}"?`
                        : "Apakah Anda yakin ingin menghapus koleksi ini?"
                }
                confirmText="Ya, Hapus"
                cancelText="Batal"
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!deleteLoading) {
                        setShowDeleteDialog(false);
                        setSelectedKoleksi(null);
                    }
                }}
                loading={deleteLoading}
            />
        </div>
    );
}

export default KoleksiListPage;