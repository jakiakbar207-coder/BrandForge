import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getWarnaById,
    updateWarna,
} from "../api/warna";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Warna.css";

function WarnaEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [namaWarna, setNamaWarna] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const loadWarna = async () => {
        try {
            setLoadingData(true);

            const response = await getWarnaById(id);

            const data =
                response?.data?.data ??
                response?.data ??
                response;

            setNamaWarna(
                data?.nama_warna ?? ""
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data warna:",
                error
            );

            let message = "Data warna gagal dimuat.";

            if (error.response?.status === 404) {
                message = "Data warna tidak ditemukan.";
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.request) {
                message = "Server Laravel tidak dapat dihubungi.";
            }

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });

            navigate("/warna");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "ID warna tidak ditemukan.",
            }).then(() => {
                navigate("/warna");
            });

            return;
        }

        loadWarna();
    }, [id]);

    const handleSubmit = async () => {
        const nama = namaWarna.trim();

        if (!nama) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Nama warna wajib diisi.",
            });

            return;
        }

        try {
            setLoadingSubmit(true);

            await updateWarna(id, {
                nama_warna: nama,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data warna berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/warna");
        } catch (error) {
            console.error(
                "Gagal memperbarui warna:",
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            let message =
                firstError ??
                error.response?.data?.message ??
                "Data warna gagal diperbarui.";

            if (error.response?.status === 404) {
                message = "Data warna tidak ditemukan.";
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
            <div className="warna-loading">
                <Loading />
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title="Edit Warna"
            onClose={() => navigate("/warna")}
            onSubmit={handleSubmit}
            submitText="Simpan Perubahan"
            cancelText="Batal"
            loading={loadingSubmit}
            size="medium"
        >
            <div className="warna-form-group">
                <label htmlFor="id_warna">
                    ID Warna
                </label>

                <input
                    id="id_warna"
                    type="text"
                    value={id || ""}
                    disabled
                />

                <small>
                    ID warna tidak dapat diubah.
                </small>
            </div>

            <div className="warna-form-group">
                <label htmlFor="nama_warna">
                    Nama Warna
                    <span>*</span>
                </label>

                <input
                    id="nama_warna"
                    type="text"
                    value={namaWarna}
                    onChange={(event) =>
                        setNamaWarna(event.target.value)
                    }
                    placeholder="Contoh: Hitam"
                    disabled={loadingSubmit}
                    autoFocus
                />
            </div>
        </FormModal>
    );
}

export default WarnaEditPage;