import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getStokById, updateStok } from "../api/stok";
import { getProduk } from "../api/produk";
import { getUkuran } from "../api/ukuran";
import { getWarna } from "../api/warna";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Stok.css";

function StokEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [produk, setProduk] = useState([]);
    const [ukuran, setUkuran] = useState([]);
    const [warna, setWarna] = useState([]);

    const [produkId, setProdukId] = useState("");
    const [ukuranId, setUkuranId] = useState("");
    const [warnaId, setWarnaId] = useState("");
    const [jumlah, setJumlah] = useState("");

    const [loadingData, setLoadingData] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const loadData = async () => {
        try {
            setLoadingData(true);

            const [
                stokResponse,
                produkResponse,
                ukuranResponse,
                warnaResponse,
            ] = await Promise.all([
                getStokById(id),
                getProduk(),
                getUkuran(),
                getWarna(),
            ]);

            const stokData =
                stokResponse?.data?.data ??
                stokResponse?.data ??
                stokResponse;

            const produkData =
                produkResponse?.data?.data ??
                produkResponse?.data ??
                produkResponse ??
                [];

            const ukuranData =
                ukuranResponse?.data?.data ??
                ukuranResponse?.data ??
                ukuranResponse ??
                [];

            const warnaData =
                warnaResponse?.data?.data ??
                warnaResponse?.data ??
                warnaResponse ??
                [];

            setProduk(Array.isArray(produkData) ? produkData : []);
            setUkuran(Array.isArray(ukuranData) ? ukuranData : []);
            setWarna(Array.isArray(warnaData) ? warnaData : []);

            setProdukId(
                String(
                    stokData?.produk_id ??
                    stokData?.produk?.id ??
                    ""
                )
            );

            setUkuranId(
                String(
                    stokData?.ukuran_id ??
                    stokData?.ukuran?.id ??
                    ""
                )
            );

            setWarnaId(
                String(
                    stokData?.warna_id ??
                    stokData?.warna?.id ??
                    ""
                )
            );

            setJumlah(
                stokData?.jumlah !== undefined &&
                    stokData?.jumlah !== null
                    ? String(stokData.jumlah)
                    : ""
            );
        } catch (error) {
            console.error("Gagal mengambil data stok:", error);

            let message = "Data stok gagal dimuat.";

            if (error.response) {
                const status = error.response.status;

                if (status === 404) {
                    message = "Data stok tidak ditemukan.";
                } else if (status === 401) {
                    message =
                        "Sesi login telah berakhir. Silakan login kembali.";
                } else if (status === 403) {
                    message =
                        "Anda tidak memiliki akses ke data stok.";
                } else if (error.response.data?.message) {
                    message = error.response.data.message;
                }
            } else if (error.request) {
                message = "Server Laravel tidak dapat dihubungi.";
            }

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });

            navigate("/stok");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "ID stok tidak ditemukan.",
            }).then(() => navigate("/stok"));

            return;
        }

        loadData();
    }, [id]);

    const handleSubmit = async () => {
        if (!produkId || !ukuranId || !warnaId || jumlah === "") {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Produk, ukuran, warna, dan jumlah stok wajib diisi.",
            });

            return;
        }

        const jumlahNumber = Number(jumlah);

        if (!Number.isInteger(jumlahNumber) || jumlahNumber < 0) {
            Swal.fire({
                icon: "warning",
                title: "Jumlah Tidak Valid",
                text: "Jumlah stok harus berupa bilangan bulat minimal 0.",
            });

            return;
        }

        try {
            setLoadingSubmit(true);

            await updateStok(id, {
                produk_id: Number(produkId),
                ukuran_id: Number(ukuranId),
                warna_id: Number(warnaId),
                jumlah: jumlahNumber,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data stok berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/stok");
        } catch (error) {
            console.error("Gagal memperbarui stok:", error);

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            let message =
                firstError ||
                error.response?.data?.message ||
                "Data stok gagal diperbarui.";

            if (error.response?.status === 404) {
                message = "Data stok tidak ditemukan.";
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
            <div className="stok-loading">
                <Loading />
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title="Edit Stok"
            onClose={() => navigate("/stok")}
            onSubmit={handleSubmit}
            submitText="Simpan Perubahan"
            cancelText="Batal"
            loading={loadingSubmit}
            size="medium"
        >
            <div className="stok-form-grid">
                <div className="stok-form-group stok-form-full">
                    <label htmlFor="id_stok">
                        ID Stok
                    </label>

                    <input
                        id="id_stok"
                        type="text"
                        value={id || ""}
                        disabled
                    />

                    <small>
                        ID stok tidak dapat diubah.
                    </small>
                </div>

                <div className="stok-form-group stok-form-full">
                    <label htmlFor="produk_id">
                        Produk<span>*</span>
                    </label>

                    <select
                        id="produk_id"
                        value={produkId}
                        onChange={(event) =>
                            setProdukId(event.target.value)
                        }
                        disabled={loadingSubmit}
                    >
                        <option value="">
                            Pilih Produk
                        </option>

                        {produk.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.nama_produk ?? item.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="stok-form-group">
                    <label htmlFor="ukuran_id">
                        Ukuran<span>*</span>
                    </label>

                    <select
                        id="ukuran_id"
                        value={ukuranId}
                        onChange={(event) =>
                            setUkuranId(event.target.value)
                        }
                        disabled={loadingSubmit}
                    >
                        <option value="">
                            Pilih Ukuran
                        </option>

                        {ukuran.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.nama_ukuran ?? item.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="stok-form-group">
                    <label htmlFor="warna_id">
                        Warna<span>*</span>
                    </label>

                    <select
                        id="warna_id"
                        value={warnaId}
                        onChange={(event) =>
                            setWarnaId(event.target.value)
                        }
                        disabled={loadingSubmit}
                    >
                        <option value="">
                            Pilih Warna
                        </option>

                        {warna.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.nama_warna ?? item.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="stok-form-group stok-form-full">
                    <label htmlFor="jumlah">
                        Jumlah Stok<span>*</span>
                    </label>

                    <input
                        id="jumlah"
                        type="number"
                        min="0"
                        value={jumlah}
                        onChange={(event) =>
                            setJumlah(event.target.value)
                        }
                        placeholder="Masukkan jumlah stok"
                        disabled={loadingSubmit}
                    />
                </div>
            </div>
        </FormModal>
    );
}

export default StokEditPage;