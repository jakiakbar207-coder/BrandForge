import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getUkuran,
    deleteUkuran,
} from "../api/ukuran";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";

import "./Ukuran.css";

function UkuranListPage() {
    const navigate = useNavigate();

    const [ukuran, setUkuran] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const loadUkuran = async () => {
        try {
            setLoading(true);

            const response = await getUkuran();

            const data =
                response?.data?.data ??
                response?.data ??
                response ??
                [];

            setUkuran(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data ukuran:", error);

            let message = "Data ukuran gagal dimuat.";

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
        loadUkuran();
    }, []);

    const filteredUkuran = ukuran.filter((item) => {
        const keyword = search.toLowerCase();

        return (
            String(item.id ?? item.id_ukuran ?? "")
                .toLowerCase()
                .includes(keyword) ||
            String(item.nama_ukuran ?? "")
                .toLowerCase()
                .includes(keyword)
        );
    });

    const totalPages = Math.ceil(
        filteredUkuran.length / itemsPerPage
    );

    const startIndex = (currentPage - 1) * itemsPerPage;

    const paginatedUkuran = filteredUkuran.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleDelete = async (item) => {
        const id = item.id ?? item.id_ukuran;

        const result = await ConfirmDialog({
            title: "Hapus Ukuran?",
            text: `Ukuran "${item.nama_ukuran}" akan dihapus.`,
            confirmText: "Ya, Hapus",
            cancelText: "Batal",
        });

        if (!result?.isConfirmed) {
            return;
        }

        try {
            await deleteUkuran(id);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data ukuran berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });

            loadUkuran();
        } catch (error) {
            console.error("Gagal menghapus ukuran:", error);

            let message = "Data ukuran gagal dihapus.";

            if (error.response?.status === 404) {
                message = "Data ukuran tidak ditemukan.";
            } else if (error.response?.status === 422) {
                message =
                    error.response?.data?.message ??
                    "Ukuran tidak dapat dihapus karena masih digunakan.";
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
            label: "ID Ukuran",
            render: (item) =>
                item.id ?? item.id_ukuran ?? "-",
        },
        {
            key: "nama_ukuran",
            label: "Nama Ukuran",
        },
    ];

    return (
        <div className="ukuran-page">
            <div className="ukuran-header">
                <div>
                    <div className="ukuran-breadcrumb">
                        Master Data / Ukuran
                    </div>

                    <h1>Ukuran</h1>

                    <p>
                        Kelola data ukuran produk BrandForge.
                    </p>
                </div>

                <button
                    type="button"
                    className="ukuran-add-button"
                    onClick={() => navigate("/ukuran/create")}
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Ukuran
                </button>
            </div>

            <div className="ukuran-card">
                <div className="ukuran-toolbar">
                    <div className="ukuran-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Cari ukuran..."
                        />
                    </div>

                    <div className="ukuran-total">
                        Total:{" "}
                        <strong>
                            {filteredUkuran.length}
                        </strong>{" "}
                        ukuran
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedUkuran}
                    loading={loading}
                    onEdit={(item) => {
                        const id =
                            item.id ?? item.id_ukuran;

                        navigate(`/ukuran/edit/${id}`);
                    }}
                    onDelete={handleDelete}
                    emptyMessage="Belum ada data ukuran."
                />

                {!loading && totalPages > 0 && (
                    <div className="ukuran-pagination">
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

export default UkuranListPage;