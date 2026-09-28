import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createKategori } from "../api/kategori";

import FormModal from "../components/common/FormModal";

import "./Kategori.css";

function KategoriCreatePage() {
    const navigate = useNavigate();

    const [namaKategori, setNamaKategori] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const nama = namaKategori.trim();

        if (!nama) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Nama kategori wajib diisi.",
            });

            return;
        }

        try {
            setLoading(true);

            await createKategori({
                nama_kategori: nama,
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Kategori berhasil ditambahkan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/kategori");
        } catch (error) {
            console.error(
                "Gagal menambahkan kategori:",
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(validationErrors)
                      .flat()[0]
                : null;

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    firstError ||
                    error.response?.data?.message ||
                    "Kategori gagal ditambahkan.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormModal
            show={true}
            title="Tambah Kategori"
            onClose={() => navigate("/kategori")}
            onSubmit={handleSubmit}
            submitText="Simpan"
            cancelText="Batal"
            loading={loading}
            size="medium"
        >
            <div className="kategori-form-group">
                <label htmlFor="nama_kategori">
                    Nama Kategori
                    <span>*</span>
                </label>

                <input
                    id="nama_kategori"
                    type="text"
                    value={namaKategori}
                    onChange={(event) =>
                        setNamaKategori(
                            event.target.value
                        )
                    }
                    placeholder="Masukkan nama kategori"
                    disabled={loading}
                    autoFocus
                />
            </div>
        </FormModal>
    );
}

export default KategoriCreatePage;