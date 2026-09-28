import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getPembelian,
    deletePembelian,
} from "../api/pembelian";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loading from "../components/common/Loading";

import "./Pembelian.css";

function PembelianListPage() {
    const navigate = useNavigate();

    const [pembelian, setPembelian] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const loadPembelian = async () => {
        try {
            setLoading(true);

            const response = await getPembelian();

            const data =
                response?.data?.data ??
                response?.data ??
                response ??
                [];

            setPembelian(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data pembelian:", error);

            let message = "Data pembelian gagal dimuat.";

            if (error.response?.status === 401) {
                message = "Sesi login telah berakhir.";
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
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
        loadPembelian();
    }, []);

    const filteredData = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return pembelian;
        }

        return pembelian.filter((item) => {
            const id = String(item.id ?? "");
            const supplier = String(
                item.supplier?.nama_supplier ?? ""
            ).toLowerCase();
            const tanggal = String(
                item.tanggal_pembelian ?? ""
            ).toLowerCase();

            return (
                id.includes(keyword) ||
                supplier.includes(keyword) ||
                tanggal.includes(keyword)
            );
        });
    }, [pembelian, search]);

    const totalPages = Math.ceil(
        filteredData.length / itemsPerPage
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
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
        const result = await ConfirmDialog({
            title: "Hapus Pembelian?",
            text: `Pembelian #${item.id} akan dihapus dan stok akan disesuaikan kembali.`,
            confirmText: "Ya, Hapus",
            cancelText: "Batal",
            icon: "warning",
        });

        if (!result?.isConfirmed) {
            return;
        }

        try {
            await deletePembelian(item.id);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Pembelian berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });

            loadPembelian();
        } catch (error) {
            console.error("Gagal menghapus pembelian:", error);

            const message =
                error.response?.data?.message ??
                "Pembelian gagal dihapus.";

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
            render: (_, index) =>
                (currentPage - 1) * itemsPerPage + index + 1,
        },
        {
            header: "ID Pembelian",
            render: (item) => `#${item.id}`,
        },
        {
            header: "Supplier",
            render: (item) =>
                item.supplier?.nama_supplier ?? "-",
        },
        {
            header: "Tanggal",
            render: (item) => {
                if (!item.tanggal_pembelian) {
                    return "-";
                }

                return new Date(
                    item.tanggal_pembelian
                ).toLocaleDateString("id-ID");
            },
        },
        {
            header: "Total Harga",
            render: (item) =>
                `Rp ${Number(
                    item.total_harga ?? 0
                ).toLocaleString("id-ID")}`,
        },
        {
            header: "Aksi",
            render: (item) => (
                <div className="pembelian-action-buttons">
                    <button
                        type="button"
                        className="pembelian-action-button detail"
                        onClick={() =>
                            navigate(
                                `/pembelian/detail/${item.id}`
                            )
                        }
                        title="Detail"
                    >
                        <i className="bi bi-eye"></i>
                    </button>

                    <button
                        type="button"
                        className="pembelian-action-button edit"
                        onClick={() =>
                            navigate(
                                `/pembelian/edit/${item.id}`
                            )
                        }
                        title="Edit"
                    >
                        <i className="bi bi-pencil"></i>
                    </button>

                    <button
                        type="button"
                        className="pembelian-action-button delete"
                        onClick={() => handleDelete(item)}
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
            <div className="pembelian-loading">
                <Loading />
            </div>
        );
    }

    return (
        <div className="pembelian-page">
            <div className="pembelian-header">
                <div>
                    <div className="pembelian-breadcrumb">
                        Admin / Pembelian
                    </div>

                    <h1>Data Pembelian</h1>

                    <p>
                        Kelola data pembelian barang dari supplier.
                    </p>
                </div>

                <button
                    type="button"
                    className="pembelian-add-button"
                    onClick={() =>
                        navigate("/pembelian/create")
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Pembelian
                </button>
            </div>

            <div className="pembelian-card">
                <div className="pembelian-toolbar">
                    <div className="pembelian-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Cari ID, supplier, atau tanggal..."
                        />
                    </div>

                    <div className="pembelian-total">
                        Total data:{" "}
                        <strong>{filteredData.length}</strong>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedData}
                    emptyMessage="Belum ada data pembelian."
                />

                {totalPages > 1 && (
                    <div className="pembelian-pagination">
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

export default PembelianListPage;