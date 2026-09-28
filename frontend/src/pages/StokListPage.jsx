import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getStok, deleteStok } from "../api/stok";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";

import "./Stok.css";

function StokListPage() {
    const navigate = useNavigate();

    const [stok, setStok] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const loadStok = async () => {
        try {
            setLoading(true);

            const response = await getStok();

            const data =
                response?.data?.data ??
                response?.data ??
                response ??
                [];

            setStok(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data stok:", error);

            let message = "Data stok gagal dimuat.";

            if (error.response) {
                const status = error.response.status;

                if (status === 401) {
                    message = "Sesi login telah berakhir. Silakan login kembali.";
                } else if (status === 403) {
                    message = "Anda tidak memiliki akses ke data stok.";
                } else if (error.response.data?.message) {
                    message = error.response.data.message;
                }
            } else if (error.request) {
                message = "Server Laravel tidak dapat dihubungi.";
            }

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStok();
    }, []);

    const filteredStok = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return stok;
        }

        return stok.filter((item) => {
            const namaProduk =
                item.produk?.nama_produk ??
                item.produk?.nama ??
                "";

            const namaUkuran =
                item.ukuran?.nama_ukuran ??
                item.ukuran?.nama ??
                "";

            const namaWarna =
                item.warna?.nama_warna ??
                item.warna?.nama ??
                "";

            const jumlah = String(item.jumlah ?? "");

            return (
                namaProduk.toLowerCase().includes(keyword) ||
                namaUkuran.toLowerCase().includes(keyword) ||
                namaWarna.toLowerCase().includes(keyword) ||
                jumlah.includes(keyword)
            );
        });
    }, [stok, search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(
        filteredStok.length / itemsPerPage
    );

    const paginatedStok = filteredStok.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (item) => {
        const id = item.id;

        const confirmed = await ConfirmDialog({
            title: "Hapus Data Stok?",
            text: "Data stok yang dihapus tidak dapat dikembalikan.",
            confirmText: "Ya, Hapus",
            cancelText: "Batal",
        });

        if (!confirmed) {
            return;
        }

        try {
            await deleteStok(id);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data stok berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });

            loadStok();
        } catch (error) {
            console.error("Gagal menghapus stok:", error);

            let message = "Data stok gagal dihapus.";

            if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        }
    };

    const columns = [
        {
            header: "No",
            accessor: "no",
            render: (_, index) =>
                (currentPage - 1) * itemsPerPage + index + 1,
        },
        {
            header: "Produk",
            accessor: "produk",
            render: (item) =>
                item.produk?.nama_produk ??
                item.produk?.nama ??
                "-",
        },
        {
            header: "Ukuran",
            accessor: "ukuran",
            render: (item) =>
                item.ukuran?.nama_ukuran ??
                item.ukuran?.nama ??
                "-",
        },
        {
            header: "Warna",
            accessor: "warna",
            render: (item) =>
                item.warna?.nama_warna ??
                item.warna?.nama ??
                "-",
        },
        {
            header: "Jumlah",
            accessor: "jumlah",
            render: (item) => item.jumlah ?? 0,
        },
        {
            header: "Aksi",
            accessor: "aksi",
            render: (item) => (
                <div className="stok-action-buttons">
                    <button
                        type="button"
                        className="stok-action-button stok-action-edit"
                        onClick={() =>
                            navigate(`/stok/edit/${item.id}`)
                        }
                        title="Edit"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                        type="button"
                        className="stok-action-button stok-action-delete"
                        onClick={() => handleDelete(item)}
                        title="Hapus"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="stok-page">
            <div className="stok-header">
                <div>
                    <div className="stok-breadcrumb">
                        Dashboard / Stok
                    </div>

                    <h1>Stok</h1>

                    <p>
                        Kelola stok produk berdasarkan ukuran dan warna.
                    </p>
                </div>

                <button
                    type="button"
                    className="stok-add-button"
                    onClick={() => navigate("/stok/create")}
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Stok
                </button>
            </div>

            <div className="stok-card">
                <div className="stok-toolbar">
                    <div className="stok-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Cari produk, ukuran, warna..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="stok-total">
                        Total: <strong>{filteredStok.length}</strong> data
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedStok}
                    loading={loading}
                    emptyMessage="Belum ada data stok."
                />

                {!loading && filteredStok.length > 0 && (
                    <div className="stok-pagination">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default StokListPage;