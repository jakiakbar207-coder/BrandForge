import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getKategori,
    deleteKategori,
} from "../api/kategori";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";

import "./Kategori.css";

function KategoriListPage() {
    const navigate = useNavigate();

    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const itemsPerPage = 10;

    const loadKategori = async () => {
        try {
            setLoading(true);

            const response = await getKategori();

            const data =
                response?.data?.data ??
                response?.data ??
                response ??
                [];

            setKategori(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data kategori:", error);

            setKategori([]);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Data kategori gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKategori();
    }, []);

    const filteredKategori = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return kategori;
        }

        return kategori.filter((item) => {
            const id = String(item.id_kategori ?? "").toLowerCase();
            const nama = String(item.nama_kategori ?? "").toLowerCase();

            return (
                id.includes(keyword) ||
                nama.includes(keyword)
            );
        });
    }, [kategori, search]);

    const totalPages = Math.ceil(
        filteredKategori.length / itemsPerPage
    );

    const paginatedKategori = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return filteredKategori.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [
        filteredKategori,
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
        navigate(`/kategori/edit/${item.id_kategori}`);
    };

    const handleDeleteClick = (item) => {
        setSelectedKategori(item);
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedKategori) {
            return;
        }

        try {
            setDeleteLoading(true);

            await deleteKategori(
                selectedKategori.id_kategori
            );

            setShowDeleteDialog(false);
            setSelectedKategori(null);

            await loadKategori();

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Kategori berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Gagal menghapus kategori:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Kategori gagal dihapus.",
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
                (currentPage - 1) * itemsPerPage +
                index +
                1,
        },
        {
            key: "id_kategori",
            label: "ID Kategori",
        },
        {
            key: "nama_kategori",
            label: "Nama Kategori",
        },
    ];

    return (
        <div className="kategori-page">
            <div className="kategori-header">
                <div>
                    <div className="kategori-breadcrumb">
                        Dashboard / Kategori
                    </div>

                    <h1>Data Kategori</h1>

                    <p>
                        Kelola data kategori produk
                        BrandForge.
                    </p>
                </div>

                <button
                    type="button"
                    className="kategori-add-button"
                    onClick={() =>
                        navigate("/kategori/tambah")
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Kategori
                </button>
            </div>

            <div className="kategori-card">
                <div className="kategori-toolbar">
                    <div className="kategori-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Cari kategori..."
                        />
                    </div>

                    <div className="kategori-total">
                        Total:{" "}
                        <strong>
                            {filteredKategori.length}
                        </strong>{" "}
                        data
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedKategori}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    emptyMessage={
                        search
                            ? "Kategori yang dicari tidak ditemukan."
                            : "Belum ada data kategori."
                    }
                />

                {!loading &&
                    filteredKategori.length > 0 && (
                        <div className="kategori-pagination">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
            </div>

            <ConfirmDialog
                show={showDeleteDialog}
                title="Hapus Kategori"
                message={
                    selectedKategori
                        ? `Apakah Anda yakin ingin menghapus kategori "${selectedKategori.nama_kategori}"?`
                        : "Apakah Anda yakin ingin menghapus kategori ini?"
                }
                confirmText="Ya, Hapus"
                cancelText="Batal"
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!deleteLoading) {
                        setShowDeleteDialog(false);
                        setSelectedKategori(null);
                    }
                }}
                loading={deleteLoading}
            />
        </div>
    );
}

export default KategoriListPage;