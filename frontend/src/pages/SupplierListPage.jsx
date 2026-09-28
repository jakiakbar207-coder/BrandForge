import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getSupplier, deleteSupplier } from "../api/supplier";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";

import "./Supplier.css";

function SupplierListPage() {
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const loadSupplier = async () => {
        try {
            setLoading(true);

            const response = await getSupplier();

            const data =
                response?.data?.data ??
                response?.data ??
                response ??
                [];

            setSuppliers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data supplier:", error);

            let message = "Data supplier gagal dimuat.";

            if (error.response) {
                const status = error.response.status;

                if (status === 401) {
                    message =
                        "Sesi login telah berakhir. Silakan login kembali.";
                } else if (status === 403) {
                    message =
                        "Anda tidak memiliki akses ke data supplier.";
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
        loadSupplier();
    }, []);

    const filteredSuppliers = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return suppliers;
        }

        return suppliers.filter((item) => {
            const nama = item.nama_supplier ?? "";
            const kontak = item.kontak ?? "";
            const email = item.email ?? "";
            const alamat = item.alamat ?? "";

            return (
                nama.toLowerCase().includes(keyword) ||
                kontak.toLowerCase().includes(keyword) ||
                email.toLowerCase().includes(keyword) ||
                alamat.toLowerCase().includes(keyword)
            );
        });
    }, [suppliers, search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(
        filteredSuppliers.length / itemsPerPage
    );

    const paginatedSuppliers = filteredSuppliers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (item) => {
        const confirmed = await ConfirmDialog({
            title: "Hapus Supplier?",
            text: `Supplier "${item.nama_supplier}" akan dihapus.`,
            confirmText: "Ya, Hapus",
            cancelText: "Batal",
        });

        if (!confirmed) {
            return;
        }

        try {
            await deleteSupplier(item.id);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Supplier berhasil dihapus.",
                timer: 1500,
                showConfirmButton: false,
            });

            loadSupplier();
        } catch (error) {
            console.error("Gagal menghapus supplier:", error);

            let message = "Supplier gagal dihapus.";

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
            header: "Nama Supplier",
            accessor: "nama_supplier",
            render: (item) =>
                item.nama_supplier ?? "-",
        },
        {
            header: "Kontak",
            accessor: "kontak",
            render: (item) =>
                item.kontak ?? "-",
        },
        {
            header: "Email",
            accessor: "email",
            render: (item) =>
                item.email ?? "-",
        },
        {
            header: "Alamat",
            accessor: "alamat",
            render: (item) =>
                item.alamat ?? "-",
        },
        {
            header: "Aksi",
            accessor: "aksi",
            render: (item) => (
                <div className="supplier-action-buttons">
                    <button
                        type="button"
                        className="supplier-action-button supplier-action-edit"
                        onClick={() =>
                            navigate(`/supplier/edit/${item.id}`)
                        }
                        title="Edit"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                        type="button"
                        className="supplier-action-button supplier-action-delete"
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
        <div className="supplier-page">
            <div className="supplier-header">
                <div>
                    <div className="supplier-breadcrumb">
                        Dashboard / Supplier
                    </div>

                    <h1>Supplier</h1>

                    <p>
                        Kelola data supplier yang menyediakan produk.
                    </p>
                </div>

                <button
                    type="button"
                    className="supplier-add-button"
                    onClick={() =>
                        navigate("/supplier/create")
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Supplier
                </button>
            </div>

            <div className="supplier-card">
                <div className="supplier-toolbar">
                    <div className="supplier-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Cari supplier, kontak, email..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="supplier-total">
                        Total:{" "}
                        <strong>
                            {filteredSuppliers.length}
                        </strong>{" "}
                        data
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedSuppliers}
                    loading={loading}
                    emptyMessage="Belum ada data supplier."
                />

                {!loading && filteredSuppliers.length > 0 && (
                    <div className="supplier-pagination">
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

export default SupplierListPage;