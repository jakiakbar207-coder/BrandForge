import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getUkuranById,
    updateUkuran,
} from "../api/ukuran";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Ukuran.css";

function UkuranEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [namaUkuran, setNamaUkuran] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const loadUkuran = async () => {
        try {
            setLoadingData(true);

            const response = await getUkuranById(id);

            const data =
                response?.data?.data ??
                response?.data ??
                response;

            setNamaUkuran(
                data?.nama_ukuran ?? ""
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data ukuran:",
                error
            );

            let message =
                "Data ukuran gagal dimuat.";

            if (error.response?.status === 404) {
                message =
                    "Data ukuran tidak ditemukan.";
            } else if (error.response?.data?.message) {
                message =
                    error.response.data.message;
            } else if (error.request) {
                message =
                    "Server Laravel tidak dapat dihubungi.";
            }

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });

            navigate("/ukuran");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "ID ukuran tidak ditemukan.",
            }).then(() => {
                navigate("/ukuran");
            });

            return;
        }

        loadUkuran();
    }, [id]);

    const handleSubmit = async () => {
        const nama = namaUkuran.trim();

        if (!nama) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Nama ukuran wajib diisi.",
            });

            return;
        }

        try {
            setLoadingSubmit(true);

            await updateUkuran(id, {
                nama_ukuran: nama,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data ukuran berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/ukuran");
        } catch (error) {
            console.error(
                "Gagal memperbarui ukuran:",
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
                "Data ukuran gagal diperbarui.";

            if (error.response?.status === 404) {
                message =
                    "Data ukuran tidak ditemukan.";
            }

            if (error.response?.status === 422) {
                message =
                    firstError ??
                    "Data ukuran tidak valid.";
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
            <div className="ukuran-loading">
                <Loading />
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title="Edit Ukuran"
            onClose={() => navigate("/ukuran")}
            onSubmit={handleSubmit}
            submitText="Simpan Perubahan"
            cancelText="Batal"
            loading={loadingSubmit}
            size="medium"
        >
            <div className="ukuran-form-group">
                <label htmlFor="id_ukuran">
                    ID Ukuran
                </label>

                <input
                    id="id_ukuran"
                    type="text"
                    value={id || ""}
                    disabled
                />

                <small>
                    ID ukuran tidak dapat diubah.
                </small>
            </div>

            <div className="ukuran-form-group">
                <label htmlFor="nama_ukuran">
                    Nama Ukuran
                    <span>*</span>
                </label>

                <input
                    id="nama_ukuran"
                    type="text"
                    value={namaUkuran}
                    onChange={(event) =>
                        setNamaUkuran(event.target.value)
                    }
                    placeholder="Contoh: S, M, L, XL"
                    disabled={loadingSubmit}
                    autoFocus
                />
            </div>
        </FormModal>
    );
}

export default UkuranEditPage;