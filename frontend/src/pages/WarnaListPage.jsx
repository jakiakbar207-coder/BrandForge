import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getWarna,
    deleteWarna,
} from "../api/warna";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";

import "./Warna.css";

function WarnaListPage() {
    const navigate = useNavigate();

    const [warna, setWarna] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const loadWarna = async () => {
        try {
            setLoading(true);

            const response = await getWarna();

            const data =
                response?.data?.data ??
                response?.data ??
                response ??
                [];

            setWarna(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data warna:", error);

            let message = "Data warna gagal dimuat.";

            if (error.response?.data?.message) {
                message = error.response.data.message;
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
        loadWarna();
    }, []);

    const filteredWarna = warna.filter((item) => {
        const keyword = search.toLowerCase();

        return (
            String(item.id ?? item.id_warna ?? "")
                .toLowerCase()
                .includes(keyword) ||
            String(item.nama_warna ?? "")
                .toLowerCase()
                .includes(keyword)
        );
    });

    const totalPages = Math.ceil(
        filteredWarna.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedWarna = filteredWarna.slice(
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

    const handleDelete = async (item) => {
        const id = item.id ?? item.id_warna;

        const result = await ConfirmDialog({
            title: "Hapus Warna?",
            text: `Warna "${item.nama_warna}" akan dihapus.`,
            confirmText: "Ya, Hapus",
            cancelText: "Batal",
        });

        if (!result?.isConfirmed) {
            return;
        }

        try {
            await deleteWarna(id);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data warna berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });

            loadWarna();
        } catch (error) {
            console.error("Gagal menghapus warna:", error);

            let message = "Data warna gagal dihapus.";

            if (error.response?.status === 404) {
                message = "Data warna tidak ditemukan.";
            } else if (error.response?.data?.message) {
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
            key: "no",
            label: "No",
            render: (_, index) =>
                startIndex + index + 1,
        },
        {
            key: "id",
            label: "ID Warna",
            render: (item) =>
                item.id ?? item.id_warna ?? "-",
        },
        {
            key: "nama_warna",
            label: "Nama Warna",
        },
    ];

    return (
        <div className="warna-page">
            <div className="warna-header">
                <div>
                    <div className="warna-breadcrumb">
                        Master Data / Warna
                    </div>

                    <h1>Warna</h1>

                    <p>
                        Kelola data warna produk BrandForge.
                    </p>
                </div>

                <button
                    type="button"
                    className="warna-add-button"
                    onClick={() => navigate("/warna/create")}
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Warna
                </button>
            </div>

            <div className="warna-card">
                <div className="warna-toolbar">
                    <div className="warna-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Cari warna..."
                        />
                    </div>

                    <div className="warna-total">
                        Total:{" "}
                        <strong>
                            {filteredWarna.length}
                        </strong>{" "}
                        warna
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedWarna}
                    loading={loading}
                    onEdit={(item) => {
                        const id =
                            item.id ?? item.id_warna;

                        navigate(`/warna/edit/${id}`);
                    }}
                    onDelete={handleDelete}
                    emptyMessage="Belum ada data warna."
                />

                {!loading && totalPages > 0 && (
                    <div className="warna-pagination">
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

export default WarnaListPage;