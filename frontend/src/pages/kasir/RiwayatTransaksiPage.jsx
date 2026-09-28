import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getTransaksiKasir } from "../../api/transaksi";

import DataTable from "../../components/common/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

import "./RiwayatTransaksi.css";

function RiwayatTransaksiPage() {
    const navigate = useNavigate();

    const [transaksi, setTransaksi] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    useEffect(() => {
        loadTransaksi();
    }, []);

    const loadTransaksi = async () => {
        setLoading(true);

        try {
            const response =
                await getTransaksiKasir();

            const data = Array.isArray(response)
                ? response
                : response?.data || [];

            setTransaksi(data);
        } catch (error) {
            console.error(
                "Gagal mengambil riwayat transaksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Riwayat transaksi gagal dimuat.",
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

        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const keyword =
        search.trim().toLowerCase();

    const filteredData =
        transaksi.filter((item) => {
            if (!keyword) {
                return true;
            }

            const kode = String(
                item.kode_transaksi || ""
            ).toLowerCase();

            const kasir = String(
                item.user?.name || ""
            ).toLowerCase();

            const tanggal = String(
                item.tanggal_transaksi || ""
            ).toLowerCase();

            return (
                kode.includes(keyword) ||
                kasir.includes(keyword) ||
                tanggal.includes(keyword)
            );
        });

    const totalPages = Math.ceil(
        filteredData.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedData =
        filteredData.slice(
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
                formatRupiah(
                    item.total_harga
                ),
        },
        {
            header: "Aksi",
            render: (item) => (
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
                    <h1>Riwayat Transaksi</h1>

                    <p>
                        Daftar transaksi penjualan yang telah diproses
                    </p>
                </div>

                <button
                    type="button"
                    className="transaksi-secondary-button"
                    onClick={() =>
                        navigate(
                            "/kasir/transaksi"
                        )
                    }
                >
                    <i className="bi bi-arrow-left"></i>
                    Kembali
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
                        title="Belum Ada Riwayat"
                        message={
                            search
                                ? "Transaksi yang dicari tidak ditemukan."
                                : "Belum ada riwayat transaksi."
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
        </div>
    );
}

export default RiwayatTransaksiPage;