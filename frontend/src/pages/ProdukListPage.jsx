import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getProduk,
    deleteProduk,
} from "../api/produk";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";

import "./Produk.css";

function ProdukListPage() {
    const navigate = useNavigate();

    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [showDeleteDialog, setShowDeleteDialog] =
        useState(false);

    const [selectedProduk, setSelectedProduk] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const itemsPerPage = 10;

    const loadProduk = async () => {
        try {
            setLoading(true);

            const response = await getProduk();

            const data =
                response?.data?.data ??
                response?.data ??
                response ??
                [];

            setProduk(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data produk:",
                error
            );

            setProduk([]);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Data produk gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProduk();
    }, []);

    const filteredProduk = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return produk;
        }

        return produk.filter((item) => {
            const id = String(
                item.id_produk ?? ""
            ).toLowerCase();

            const nama = String(
                item.nama_produk ?? ""
            ).toLowerCase();

            const kategori = String(
                item.nama_kategori ??
                    item.kategori?.nama_kategori ??
                    ""
            ).toLowerCase();

            const koleksi = String(
                item.nama_koleksi ??
                    item.koleksi?.nama_koleksi ??
                    ""
            ).toLowerCase();

            return (
                id.includes(keyword) ||
                nama.includes(keyword) ||
                kategori.includes(keyword) ||
                koleksi.includes(keyword)
            );
        });
    }, [produk, search]);

    const totalPages = Math.ceil(
        filteredProduk.length / itemsPerPage
    );

    const paginatedProduk = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return filteredProduk.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [
        filteredProduk,
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
            `/produk/edit/${item.id_produk}`
        );
    };

    const handleDeleteClick = (item) => {
        setSelectedProduk(item);
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedProduk) {
            return;
        }

        try {
            setDeleteLoading(true);

            await deleteProduk(
                selectedProduk.id_produk
            );

            setShowDeleteDialog(false);
            setSelectedProduk(null);

            await loadProduk();

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Produk berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Gagal menghapus produk:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Produk gagal dihapus.",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatRupiah = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }
        ).format(Number(value));
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
            key: "id_produk",
            label: "ID Produk",
        },
        {
            key: "nama_produk",
            label: "Nama Produk",
        },
        {
            key: "kategori",
            label: "Kategori",
            render: (item) =>
                item.nama_kategori ??
                item.kategori?.nama_kategori ??
                "-",
        },
        {
            key: "koleksi",
            label: "Koleksi",
            render: (item) =>
                item.nama_koleksi ??
                item.koleksi?.nama_koleksi ??
                "-",
        },
        {
            key: "harga",
            label: "Harga",
            render: (item) =>
                formatRupiah(
                    item.harga ??
                        item.harga_jual ??
                        item.price
                ),
        },
    ];

    return (
        <div className="produk-page">
            <div className="produk-header">
                <div>
                    <div className="produk-breadcrumb">
                        Dashboard / Produk
                    </div>

                    <h1>Data Produk</h1>

                    <p>
                        Kelola data produk
                        BrandForge.
                    </p>
                </div>

                <button
                    type="button"
                    className="produk-add-button"
                    onClick={() =>
                        navigate(
                            "/produk/create"
                        )
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Produk
                </button>
            </div>

            <div className="produk-card">
                <div className="produk-toolbar">
                    <div className="produk-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Cari produk..."
                        />
                    </div>

                    <div className="produk-total">
                        Total:{" "}
                        <strong>
                            {filteredProduk.length}
                        </strong>{" "}
                        data
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedProduk}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    emptyMessage={
                        search
                            ? "Produk yang dicari tidak ditemukan."
                            : "Belum ada data produk."
                    }
                />

                {!loading &&
                    filteredProduk.length > 0 && (
                        <div className="produk-pagination">
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
                title="Hapus Produk"
                message={
                    selectedProduk
                        ? `Apakah Anda yakin ingin menghapus produk "${selectedProduk.nama_produk}"?`
                        : "Apakah Anda yakin ingin menghapus produk ini?"
                }
                confirmText="Ya, Hapus"
                cancelText="Batal"
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!deleteLoading) {
                        setShowDeleteDialog(false);
                        setSelectedProduk(null);
                    }
                }}
                loading={deleteLoading}
            />
        </div>
    );
}

export default ProdukListPage;