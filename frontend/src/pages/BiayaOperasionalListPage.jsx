import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getBiayaOperasional,
    deleteBiayaOperasional,
} from "../api/biayaOperasional";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import Loading from "../components/common/Loading";

import "./BiayaOperasional.css";

const normalizeResponse = (response) => {
    return response?.data?.data ?? response?.data ?? response ?? [];
};

const getId = (item) => {
    return item?.id ?? item?.id_biaya_operasional;
};

function BiayaOperasionalListPage() {
    const navigate = useNavigate();

    const [biayas, setBiayas] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const loadBiayas = async () => {
        try {
            setLoading(true);

            const response = await getBiayaOperasional();
            const data = normalizeResponse(response);

            setBiayas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(
                "Gagal mengambil data biaya operasional:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Data biaya operasional gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBiayas();
    }, []);

    const filteredBiayas = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return biayas;
        }

        return biayas.filter((item) => {
            const namaBiaya = item?.nama_biaya ?? "";
            const nominal = item?.nominal ?? "";
            const tanggal = item?.tanggal ?? "";
            const keterangan = item?.keterangan ?? "";

            return (
                String(namaBiaya)
                    .toLowerCase()
                    .includes(keyword) ||
                String(nominal)
                    .toLowerCase()
                    .includes(keyword) ||
                String(tanggal)
                    .toLowerCase()
                    .includes(keyword) ||
                String(keterangan)
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [biayas, search]);

    const totalPages = Math.ceil(
        filteredBiayas.length / itemsPerPage
    );

    const paginatedBiayas = useMemo(() => {
        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return filteredBiayas.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [filteredBiayas, currentPage]);

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
                text: "ID biaya operasional tidak ditemukan.",
            });

            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus Biaya Operasional?",
            text: "Data biaya operasional akan dihapus.",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await deleteBiayaOperasional(id);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Biaya operasional berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });

            await loadBiayas();
        } catch (error) {
            console.error(
                "Gagal menghapus biaya operasional:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Biaya operasional gagal dihapus.",
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
            header: "Nama Biaya",
            accessor: (item) =>
                item?.nama_biaya ?? "-",
        },
        {
            header: "Nominal",
            accessor: (item) =>
                `Rp ${Number(
                    item?.nominal ?? 0
                ).toLocaleString("id-ID")}`,
        },
        {
            header: "Tanggal",
            accessor: (item) => {
                if (!item?.tanggal) {
                    return "-";
                }

                return new Date(
                    item.tanggal
                ).toLocaleDateString("id-ID");
            },
        },
        {
            header: "Keterangan",
            accessor: (item) =>
                item?.keterangan || "-",
        },
        {
            header: "Aksi",
            accessor: (item) => (
                <div className="biaya-operasional-actions">
                    <button
                        type="button"
                        className="biaya-operasional-btn biaya-operasional-btn-edit"
                        onClick={() =>
                            navigate(
                                `/biaya-operasional/edit/${getId(
                                    item
                                )}`
                            )
                        }
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="biaya-operasional-btn biaya-operasional-btn-delete"
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
            <div className="biaya-operasional-page">
                <Loading text="Memuat data biaya operasional..." />
            </div>
        );
    }

    return (
        <div className="biaya-operasional-page">
            <div className="biaya-operasional-card">
                <div className="biaya-operasional-header">
                    <div>
                        <h2>Biaya Operasional</h2>
                        <p>
                            Kelola data pengeluaran
                            operasional toko.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="biaya-operasional-btn biaya-operasional-btn-primary"
                        onClick={() =>
                            navigate(
                                "/biaya-operasional/create"
                            )
                        }
                    >
                        + Tambah Biaya
                    </button>
                </div>

                <div className="biaya-operasional-toolbar">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            handleSearch(
                                e.target.value
                            )
                        }
                        placeholder="Cari nama biaya, nominal, tanggal..."
                        className="biaya-operasional-search"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedBiayas}
                    emptyMessage="Belum ada data biaya operasional."
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

export default BiayaOperasionalListPage;