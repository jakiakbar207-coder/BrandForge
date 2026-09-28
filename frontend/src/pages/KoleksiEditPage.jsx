import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import Swal from "sweetalert2";

import {
    getKoleksiById,
    updateKoleksi,
} from "../api/koleksi";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Koleksi.css";

function KoleksiEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [namaKoleksi, setNamaKoleksi] =
        useState("");

    const [loadingData, setLoadingData] =
        useState(true);

    const [loadingSubmit, setLoadingSubmit] =
        useState(false);

    const loadKoleksi = async () => {
        try {
            setLoadingData(true);

            const response =
                await getKoleksiById(id);

            const data =
                response?.data?.data ??
                response?.data ??
                response;

            setNamaKoleksi(
                data?.nama_koleksi ??
                data?.namaKoleksi ??
                data?.nama ??
                ""
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data koleksi:",
                error
            );

            let message =
                "Data koleksi gagal dimuat.";

            if (error.response) {
                const status =
                    error.response.status;

                if (status === 404) {
                    message =
                        "Data koleksi tidak ditemukan.";
                } else if (status === 401) {
                    message =
                        "Sesi login telah berakhir. Silakan login kembali.";
                } else if (status === 403) {
                    message =
                        "Anda tidak memiliki akses ke data koleksi.";
                } else if (
                    error.response.data?.message
                ) {
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

            navigate("/koleksi");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "ID koleksi tidak ditemukan.",
            }).then(() => {
                navigate("/koleksi");
            });

            return;
        }

        loadKoleksi();
    }, [id]);

    const handleSubmit = async () => {
        const nama = namaKoleksi.trim();

        if (!nama) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Nama koleksi wajib diisi.",
            });

            return;
        }

        try {
            setLoadingSubmit(true);

            await updateKoleksi(id, {
                nama_koleksi: nama,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data koleksi berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/koleksi");
        } catch (error) {
            console.error(
                "Gagal memperbarui koleksi:",
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(
                      validationErrors
                  ).flat()[0]
                : null;

            let message =
                firstError ||
                error.response?.data?.message ||
                "Data koleksi gagal diperbarui.";

            if (
                error.response?.status ===
                404
            ) {
                message =
                    "Data koleksi tidak ditemukan.";
            }

            if (
                error.response?.status ===
                401
            ) {
                message =
                    "Sesi login telah berakhir. Silakan login kembali.";
            }

            if (
                error.response?.status ===
                403
            ) {
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
            <div className="koleksi-loading">
                <Loading />
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title="Edit Koleksi"
            onClose={() =>
                navigate("/koleksi")
            }
            onSubmit={handleSubmit}
            submitText="Simpan Perubahan"
            cancelText="Batal"
            loading={loadingSubmit}
            size="medium"
        >
            <div className="koleksi-form-group">
                <label htmlFor="id_koleksi">
                    ID Koleksi
                </label>

                <input
                    id="id_koleksi"
                    type="text"
                    value={id || ""}
                    disabled
                />

                <small>
                    ID koleksi tidak dapat diubah.
                </small>
            </div>

            <div className="koleksi-form-group">
                <label htmlFor="nama_koleksi">
                    Nama Koleksi
                    <span>*</span>
                </label>

                <input
                    id="nama_koleksi"
                    type="text"
                    value={namaKoleksi}
                    onChange={(event) =>
                        setNamaKoleksi(
                            event.target.value
                        )
                    }
                    placeholder="Masukkan nama koleksi"
                    disabled={loadingSubmit}
                    autoFocus
                />
            </div>
        </FormModal>
    );
}

export default KoleksiEditPage;