import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getSupplierById,
    updateSupplier,
} from "../api/supplier";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Supplier.css";

function SupplierEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [namaSupplier, setNamaSupplier] = useState("");
    const [kontak, setKontak] = useState("");
    const [email, setEmail] = useState("");
    const [alamat, setAlamat] = useState("");

    const [loadingData, setLoadingData] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const loadSupplier = async () => {
        try {
            setLoadingData(true);

            const response = await getSupplierById(id);

            const data =
                response?.data?.data ??
                response?.data ??
                response;

            setNamaSupplier(data?.nama_supplier ?? "");
            setKontak(data?.kontak ?? "");
            setEmail(data?.email ?? "");
            setAlamat(data?.alamat ?? "");
        } catch (error) {
            console.error(
                "Gagal mengambil data supplier:",
                error
            );

            let message = "Data supplier gagal dimuat.";

            if (error.response) {
                const status = error.response.status;

                if (status === 404) {
                    message =
                        "Data supplier tidak ditemukan.";
                } else if (status === 401) {
                    message =
                        "Sesi login telah berakhir. Silakan login kembali.";
                } else if (status === 403) {
                    message =
                        "Anda tidak memiliki akses ke data supplier.";
                } else if (error.response.data?.message) {
                    message =
                        error.response.data.message;
                }
            } else if (error.request) {
                message =
                    "Server Laravel tidak dapat dihubungi.";
            }

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });

            navigate("/supplier");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "ID supplier tidak ditemukan.",
            }).then(() => navigate("/supplier"));

            return;
        }

        loadSupplier();
    }, [id]);

    const handleSubmit = async () => {
        const nama = namaSupplier.trim();
        const kontakValue = kontak.trim();
        const emailValue = email.trim();
        const alamatValue = alamat.trim();

        if (!nama) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Nama supplier wajib diisi.",
            });

            return;
        }

        try {
            setLoadingSubmit(true);

            await updateSupplier(id, {
                nama_supplier: nama,
                kontak: kontakValue || null,
                email: emailValue || null,
                alamat: alamatValue || null,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Supplier berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/supplier");
        } catch (error) {
            console.error(
                "Gagal memperbarui supplier:",
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            let message =
                firstError ||
                error.response?.data?.message ||
                "Supplier gagal diperbarui.";

            if (error.response?.status === 404) {
                message =
                    "Data supplier tidak ditemukan.";
            }

            if (error.response?.status === 401) {
                message =
                    "Sesi login telah berakhir. Silakan login kembali.";
            }

            if (error.response?.status === 403) {
                message =
                    "Anda tidak memiliki izin untuk mengubah data ini.";
            }

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loadingData) {
        return (
            <div className="supplier-loading">
                <Loading />
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title="Edit Supplier"
            onClose={() => navigate("/supplier")}
            onSubmit={handleSubmit}
            submitText="Simpan Perubahan"
            cancelText="Batal"
            loading={loadingSubmit}
            size="medium"
        >
            <div className="supplier-form-grid">
                <div className="supplier-form-group supplier-form-full">
                    <label htmlFor="id_supplier">
                        ID Supplier
                    </label>

                    <input
                        id="id_supplier"
                        type="text"
                        value={id || ""}
                        disabled
                    />

                    <small>
                        ID supplier tidak dapat diubah.
                    </small>
                </div>

                <div className="supplier-form-group supplier-form-full">
                    <label htmlFor="nama_supplier">
                        Nama Supplier<span>*</span>
                    </label>

                    <input
                        id="nama_supplier"
                        type="text"
                        value={namaSupplier}
                        onChange={(event) =>
                            setNamaSupplier(event.target.value)
                        }
                        placeholder="Masukkan nama supplier"
                        disabled={loadingSubmit}
                        autoFocus
                    />
                </div>

                <div className="supplier-form-group">
                    <label htmlFor="kontak">
                        Kontak
                    </label>

                    <input
                        id="kontak"
                        type="text"
                        value={kontak}
                        onChange={(event) =>
                            setKontak(event.target.value)
                        }
                        placeholder="Nomor kontak"
                        disabled={loadingSubmit}
                    />
                </div>

                <div className="supplier-form-group">
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Email supplier"
                        disabled={loadingSubmit}
                    />
                </div>

                <div className="supplier-form-group supplier-form-full">
                    <label htmlFor="alamat">
                        Alamat
                    </label>

                    <textarea
                        id="alamat"
                        value={alamat}
                        onChange={(event) =>
                            setAlamat(event.target.value)
                        }
                        placeholder="Masukkan alamat supplier"
                        disabled={loadingSubmit}
                    />
                </div>
            </div>
        </FormModal>
    );
}

export default SupplierEditPage;