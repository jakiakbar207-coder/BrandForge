import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createKoleksi } from "../api/koleksi";

import FormModal from "../components/common/FormModal";

import "./Koleksi.css";

function KoleksiCreatePage() {
    const navigate = useNavigate();

    const [namaKoleksi, setNamaKoleksi] =
        useState("");

    const [loading, setLoading] = useState(false);

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
            setLoading(true);

            await createKoleksi({
                nama_koleksi: nama,
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Koleksi berhasil ditambahkan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/koleksi");
        } catch (error) {
            console.error(
                "Gagal menambahkan koleksi:",
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(
                      validationErrors
                  ).flat()[0]
                : null;

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    firstError ||
                    error.response?.data?.message ||
                    "Koleksi gagal ditambahkan.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormModal
            show={true}
            title="Tambah Koleksi"
            onClose={() =>
                navigate("/koleksi")
            }
            onSubmit={handleSubmit}
            submitText="Simpan"
            cancelText="Batal"
            loading={loading}
            size="medium"
        >
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
                    disabled={loading}
                    autoFocus
                />
            </div>
        </FormModal>
    );
}

export default KoleksiCreatePage;