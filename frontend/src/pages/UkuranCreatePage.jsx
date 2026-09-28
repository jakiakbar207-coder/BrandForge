import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createUkuran } from "../api/ukuran";

import FormModal from "../components/common/FormModal";

import "./Ukuran.css";

function UkuranCreatePage() {
    const navigate = useNavigate();

    const [namaUkuran, setNamaUkuran] = useState("");
    const [loading, setLoading] = useState(false);

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
            setLoading(true);

            await createUkuran({
                nama_ukuran: nama,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data ukuran berhasil ditambahkan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/ukuran");
        } catch (error) {
            console.error(
                "Gagal menambahkan ukuran:",
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
                "Data ukuran gagal ditambahkan.";

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
            setLoading(false);
        }
    };

    return (
        <FormModal
            show={true}
            title="Tambah Ukuran"
            onClose={() => navigate("/ukuran")}
            onSubmit={handleSubmit}
            submitText="Simpan"
            cancelText="Batal"
            loading={loading}
            size="medium"
        >
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
                    disabled={loading}
                    autoFocus
                />
            </div>
        </FormModal>
    );
}

export default UkuranCreatePage;