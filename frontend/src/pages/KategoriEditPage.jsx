import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getKategoriById,
    updateKategori,
} from "../api/kategori";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Kategori.css";

function KategoriEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [namaKategori, setNamaKategori] =
        useState("");

    const [loadingData, setLoadingData] =
        useState(true);

    const [loadingSubmit, setLoadingSubmit] =
        useState(false);

    const loadKategori = async () => {
        try {
            setLoadingData(true);

            const response =
                await getKategoriById(id);

            const data =
                response?.data?.data ??
                response?.data ??
                response;

            setNamaKategori(
                data?.nama_kategori ?? ""
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data kategori:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Data kategori gagal dimuat.",
            });

            navigate("/kategori");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadKategori();
    }, [id]);

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
            setLoadingSubmit(true);

            await updateKategori(id, {
                nama_kategori: nama,
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Kategori berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/kategori");
        } catch (error) {
            console.error(
                "Gagal memperbarui kategori:",
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
                    "Kategori gagal diperbarui.",
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loadingData) {
        return (
            <div className="kategori-loading">
                <Loading />
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title="Edit Kategori"
            onClose={() => navigate("/kategori")}
            onSubmit={handleSubmit}
            submitText="Simpan Perubahan"
            cancelText="Batal"
            loading={loadingSubmit}
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
                    disabled={loadingSubmit}
                    autoFocus
                />
            </div>
        </FormModal>
    );
}

export default KategoriEditPage;