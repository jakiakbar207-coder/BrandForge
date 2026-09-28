import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getPengiriman,
    deletePengiriman,
    updateStatusPengiriman,
    updateResiPengiriman,
} from "../api/pengiriman";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import Loading from "../components/common/Loading";

import "./Pengiriman.css";

const normalizeResponse = (response) => {
    return response?.data?.data ?? response?.data ?? response ?? [];
};

const getId = (item) => {
    return item?.id ?? item?.id_pengiriman;
};

const statusLabel = {
    menunggu: "Menunggu",
    diproses: "Diproses",
    dikemas: "Dikemas",
    dikirim: "Dikirim",
    selesai: "Selesai",
};

function PengirimanListPage() {
    const navigate = useNavigate();

    const [pengiriman, setPengiriman] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const loadPengiriman = async () => {
        try {
            setLoading(true);

            const response = await getPengiriman();
            const data = normalizeResponse(response);

            setPengiriman(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data pengiriman:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Data pengiriman gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPengiriman();
    }, []);

    const filteredPengiriman = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return pengiriman;
        }

        return pengiriman.filter((item) => {
            const transaksiId =
                item?.transaksi_id ??
                item?.transaksi?.id ??
                "";

            const kodeTransaksi =
                item?.transaksi?.kode_transaksi ??
                "";

            const kurir = item?.kurir ?? "";
            const layanan = item?.layanan ?? "";
            const nomorResi = item?.nomor_resi ?? "";
            const status = item?.status ?? "";

            return (
                String(transaksiId)
                    .toLowerCase()
                    .includes(keyword) ||
                String(kodeTransaksi)
                    .toLowerCase()
                    .includes(keyword) ||
                String(kurir)
                    .toLowerCase()
                    .includes(keyword) ||
                String(layanan)
                    .toLowerCase()
                    .includes(keyword) ||
                String(nomorResi)
                    .toLowerCase()
                    .includes(keyword) ||
                String(status)
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [pengiriman, search]);

    const totalPages = Math.ceil(
        filteredPengiriman.length / itemsPerPage
    );

    const paginatedPengiriman = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return filteredPengiriman.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [filteredPengiriman, currentPage]);

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
                text: "ID pengiriman tidak ditemukan.",
            });

            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus Pengiriman?",
            text: "Data pengiriman akan dihapus.",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await deletePengiriman(id);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data pengiriman berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });

            await loadPengiriman();
        } catch (error) {
            console.error(
                "Gagal menghapus pengiriman:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Data pengiriman gagal dihapus.",
            });
        }
    };

    const handleStatus = async (item) => {
        const id = getId(item);

        const result = await Swal.fire({
            title: "Ubah Status Pengiriman",
            input: "select",
            inputOptions: statusLabel,
            inputValue: item?.status ?? "menunggu",
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            inputValidator: (value) => {
                if (!value) {
                    return "Silakan pilih status.";
                }

                return null;
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await updateStatusPengiriman(
                id,
                result.value
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Status pengiriman berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            await loadPengiriman();
        } catch (error) {
            console.error(
                "Gagal mengubah status:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Status pengiriman gagal diperbarui.",
            });
        }
    };

    const handleResi = async (item) => {
        const id = getId(item);

        const result = await Swal.fire({
            title: "Nomor Resi",
            input: "text",
            inputValue: item?.nomor_resi ?? "",
            inputPlaceholder: "Masukkan nomor resi",
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            inputValidator: (value) => {
                if (!value?.trim()) {
                    return "Nomor resi wajib diisi.";
                }

                return null;
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await updateResiPengiriman(
                id,
                result.value.trim()
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Nomor resi berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            await loadPengiriman();
        } catch (error) {
            console.error(
                "Gagal memperbarui nomor resi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Nomor resi gagal diperbarui.",
            });
        }
    };

    const columns = [
        {
            header: "No",
            accessor: (_, index) =>
                (currentPage - 1) *
                    itemsPerPage +
                index +
                1,
        },
        {
            header: "Transaksi",
            accessor: (item) =>
                item?.transaksi?.kode_transaksi ??
                item?.transaksi_id ??
                "-",
        },
        {
            header: "Kurir",
            accessor: (item) =>
                item?.kurir ?? "-",
        },
        {
            header: "Layanan",
            accessor: (item) =>
                item?.layanan ?? "-",
        },
        {
            header: "Ongkir",
            accessor: (item) =>
                `Rp ${Number(
                    item?.ongkir ?? 0
                ).toLocaleString("id-ID")}`,
        },
        {
            header: "No. Resi",
            accessor: (item) =>
                item?.nomor_resi || "-",
        },
        {
            header: "Status",
            accessor: (item) => (
                <span
                    className={`pengiriman-status status-${item?.status ?? "menunggu"}`}
                >
                    {statusLabel[
                        item?.status
                    ] ??
                        item?.status ??
                        "Menunggu"}
                </span>
            ),
        },
        {
            header: "Aksi",
            accessor: (item) => (
                <div className="pengiriman-actions">
                    <button
                        type="button"
                        className="pengiriman-btn pengiriman-btn-edit"
                        onClick={() =>
                            navigate(
                                `/pengiriman/edit/${getId(
                                    item
                                )}`
                            )
                        }
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="pengiriman-btn pengiriman-btn-status"
                        onClick={() =>
                            handleStatus(item)
                        }
                    >
                        Status
                    </button>

                    <button
                        type="button"
                        className="pengiriman-btn pengiriman-btn-resi"
                        onClick={() =>
                            handleResi(item)
                        }
                    >
                        Resi
                    </button>

                    <button
                        type="button"
                        className="pengiriman-btn pengiriman-btn-delete"
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
            <div className="pengiriman-page">
                <Loading text="Memuat data pengiriman..." />
            </div>
        );
    }

    return (
        <div className="pengiriman-page">
            <div className="pengiriman-card">
                <div className="pengiriman-header">
                    <div>
                        <h2>Data Pengiriman</h2>
                        <p>
                            Kelola pengiriman pesanan,
                            status, dan nomor resi.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="pengiriman-btn pengiriman-btn-primary"
                        onClick={() =>
                            navigate(
                                "/pengiriman/create"
                            )
                        }
                    >
                        + Tambah Pengiriman
                    </button>
                </div>

                <div className="pengiriman-toolbar">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            handleSearch(
                                e.target.value
                            )
                        }
                        placeholder="Cari transaksi, kurir, layanan, resi..."
                        className="pengiriman-search"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedPengiriman}
                    emptyMessage="Belum ada data pengiriman."
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

export default PengirimanListPage;