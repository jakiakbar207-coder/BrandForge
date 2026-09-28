import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createWarna } from "../api/warna";

import FormModal from "../components/common/FormModal";

import "./Warna.css";

function WarnaCreatePage() {
    const navigate = useNavigate();

    const [namaWarna, setNamaWarna] = useState("");
    const [loading, setLoading] = useState(false);

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
            setLoading(true);

            await createWarna({
                nama_warna: nama,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data warna berhasil ditambahkan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/warna");
        } catch (error) {
            console.error(
                "Gagal menambahkan warna:",
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            const message =
                firstError ??
                error.response?.data?.message ??
                "Data warna gagal ditambahkan.";

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
            title="Tambah Warna"
            onClose={() => navigate("/warna")}
            onSubmit={handleSubmit}
            submitText="Simpan"
            cancelText="Batal"
            loading={loading}
            size="medium"
        >
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
                    disabled={loading}
                    autoFocus
                />
            </div>
        </FormModal>
    );
}

export default WarnaCreatePage;