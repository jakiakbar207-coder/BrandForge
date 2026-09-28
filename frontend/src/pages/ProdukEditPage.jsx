import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import Swal from "sweetalert2";

import {
    getProdukById,
    updateProduk,
} from "../api/produk";

import { getKategori } from "../api/kategori";
import { getKoleksi } from "../api/koleksi";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Produk.css";

function ProdukEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        kategori_id: "",
        koleksi_id: "",
        nama_produk: "",
        deskripsi: "",
        harga: "",
        modal_produk: "",
        stok: "",
        foto: null,
        berat: "",
        panjang: "",
        lebar: "",
        tinggi: "",
    });

    const [kategori, setKategori] = useState([]);
    const [koleksi, setKoleksi] = useState([]);

    const [currentFoto, setCurrentFoto] =
        useState(null);

    const [loadingData, setLoadingData] =
        useState(true);

    const [loadingSubmit, setLoadingSubmit] =
        useState(false);

    const loadData = async () => {
        try {
            setLoadingData(true);

            const [
                produkResponse,
                kategoriResponse,
                koleksiResponse,
            ] = await Promise.all([
                getProdukById(id),
                getKategori(),
                getKoleksi(),
            ]);

            const produk =
                produkResponse?.data?.data ??
                produkResponse?.data ??
                produkResponse;

            const kategoriData =
                kategoriResponse?.data?.data ??
                kategoriResponse?.data ??
                kategoriResponse ??
                [];

            const koleksiData =
                koleksiResponse?.data?.data ??
                koleksiResponse?.data ??
                koleksiResponse ??
                [];

            setKategori(
                Array.isArray(kategoriData)
                    ? kategoriData
                    : []
            );

            setKoleksi(
                Array.isArray(koleksiData)
                    ? koleksiData
                    : []
            );

            setForm({
                kategori_id:
                    produk?.kategori_id ??
                    produk?.kategori?.id_kategori ??
                    "",
                koleksi_id:
                    produk?.koleksi_id ??
                    produk?.koleksi?.id_koleksi ??
                    "",
                nama_produk:
                    produk?.nama_produk ??
                    "",
                deskripsi:
                    produk?.deskripsi ??
                    "",
                harga:
                    produk?.harga ??
                    "",
                modal_produk:
                    produk?.modal_produk ??
                    "",
                stok:
                    produk?.stok ??
                    "",
                foto: null,
                berat:
                    produk?.berat ??
                    "",
                panjang:
                    produk?.panjang ??
                    "",
                lebar:
                    produk?.lebar ??
                    "",
                tinggi:
                    produk?.tinggi ??
                    "",
            });

            setCurrentFoto(
                produk?.foto ?? null
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data produk:",
                error
            );

            let message =
                "Data produk gagal dimuat.";

            if (error.response) {
                const status =
                    error.response.status;

                if (status === 404) {
                    message =
                        "Data produk tidak ditemukan.";
                } else if (status === 401) {
                    message =
                        "Sesi login telah berakhir. Silakan login kembali.";
                } else if (status === 403) {
                    message =
                        "Anda tidak memiliki akses ke data produk.";
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

            navigate("/produk");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "ID produk tidak ditemukan.",
            }).then(() => {
                navigate("/produk");
            });

            return;
        }

        loadData();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] ?? null;

        setForm((previous) => ({
            ...previous,
            foto: file,
        }));
    };

    const handleSubmit = async () => {
        const namaProduk =
            form.nama_produk.trim();

        if (!namaProduk) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Nama produk wajib diisi.",
            });

            return;
        }

        if (!form.harga) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Harga produk wajib diisi.",
            });

            return;
        }

        try {
            setLoadingSubmit(true);

            const formData = new FormData();

            if (form.kategori_id) {
                formData.append(
                    "kategori_id",
                    form.kategori_id
                );
            }

            if (form.koleksi_id) {
                formData.append(
                    "koleksi_id",
                    form.koleksi_id
                );
            }

            formData.append(
                "nama_produk",
                namaProduk
            );

            formData.append(
                "deskripsi",
                form.deskripsi.trim()
            );

            formData.append(
                "harga",
                form.harga
            );

            if (form.modal_produk !== "") {
                formData.append(
                    "modal_produk",
                    form.modal_produk
                );
            }

            if (form.stok !== "") {
                formData.append(
                    "stok",
                    form.stok
                );
            }

            if (form.foto) {
                formData.append(
                    "foto",
                    form.foto
                );
            }

            if (form.berat !== "") {
                formData.append(
                    "berat",
                    form.berat
                );
            }

            if (form.panjang !== "") {
                formData.append(
                    "panjang",
                    form.panjang
                );
            }

            if (form.lebar !== "") {
                formData.append(
                    "lebar",
                    form.lebar
                );
            }

            if (form.tinggi !== "") {
                formData.append(
                    "tinggi",
                    form.tinggi
                );
            }

            await updateProduk(id, formData);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data produk berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/produk");
        } catch (error) {
            console.error(
                "Gagal memperbarui produk:",
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
                "Data produk gagal diperbarui.";

            if (
                error.response?.status ===
                404
            ) {
                message =
                    "Data produk tidak ditemukan.";
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
            <div className="produk-loading">
                <Loading />
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title="Edit Produk"
            onClose={() =>
                navigate("/produk")
            }
            onSubmit={handleSubmit}
            submitText="Simpan Perubahan"
            cancelText="Batal"
            loading={loadingSubmit}
            size="large"
        >
            <div className="produk-form-grid">
                <div className="produk-form-group">
                    <label htmlFor="id_produk">
                        ID Produk
                    </label>

                    <input
                        id="id_produk"
                        type="text"
                        value={id || ""}
                        disabled
                    />

                    <small>
                        ID produk tidak dapat
                        diubah.
                    </small>
                </div>

                <div className="produk-form-group">
                    <label htmlFor="nama_produk">
                        Nama Produk
                        <span>*</span>
                    </label>

                    <input
                        id="nama_produk"
                        name="nama_produk"
                        type="text"
                        value={
                            form.nama_produk
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Masukkan nama produk"
                        disabled={
                            loadingSubmit
                        }
                        autoFocus
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="kategori_id">
                        Kategori
                    </label>

                    <select
                        id="kategori_id"
                        name="kategori_id"
                        value={
                            form.kategori_id
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            loadingSubmit
                        }
                    >
                        <option value="">
                            Pilih kategori
                        </option>

                        {kategori.map(
                            (item) => (
                                <option
                                    key={
                                        item.id_kategori
                                    }
                                    value={
                                        item.id_kategori
                                    }
                                >
                                    {
                                        item.nama_kategori
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div className="produk-form-group">
                    <label htmlFor="koleksi_id">
                        Koleksi
                    </label>

                    <select
                        id="koleksi_id"
                        name="koleksi_id"
                        value={
                            form.koleksi_id
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            loadingSubmit
                        }
                    >
                        <option value="">
                            Pilih koleksi
                        </option>

                        {koleksi.map(
                            (item) => (
                                <option
                                    key={
                                        item.id_koleksi
                                    }
                                    value={
                                        item.id_koleksi
                                    }
                                >
                                    {
                                        item.nama_koleksi
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div className="produk-form-group">
                    <label htmlFor="harga">
                        Harga Jual
                        <span>*</span>
                    </label>

                    <input
                        id="harga"
                        name="harga"
                        type="number"
                        min="0"
                        value={form.harga}
                        onChange={
                            handleChange
                        }
                        placeholder="Masukkan harga jual"
                        disabled={
                            loadingSubmit
                        }
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="modal_produk">
                        Modal Produk
                    </label>

                    <input
                        id="modal_produk"
                        name="modal_produk"
                        type="number"
                        min="0"
                        value={
                            form.modal_produk
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Masukkan modal produk"
                        disabled={
                            loadingSubmit
                        }
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="stok">
                        Stok
                    </label>

                    <input
                        id="stok"
                        name="stok"
                        type="number"
                        min="0"
                        value={form.stok}
                        onChange={
                            handleChange
                        }
                        placeholder="Masukkan stok"
                        disabled={
                            loadingSubmit
                        }
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="foto">
                        Ganti Foto Produk
                    </label>

                    <input
                        id="foto"
                        name="foto"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={
                            handleFileChange
                        }
                        disabled={
                            loadingSubmit
                        }
                    />

                    <small>
                        {currentFoto
                            ? "Biarkan kosong jika foto tidak ingin diganti."
                            : "Format: JPG, JPEG, PNG, WEBP. Maksimal 2 MB."}
                    </small>
                </div>

                <div className="produk-form-group produk-form-full">
                    <label htmlFor="deskripsi">
                        Deskripsi
                    </label>

                    <textarea
                        id="deskripsi"
                        name="deskripsi"
                        value={
                            form.deskripsi
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Masukkan deskripsi produk"
                        rows="4"
                        disabled={
                            loadingSubmit
                        }
                    ></textarea>
                </div>

                <div className="produk-form-section produk-form-full">
                    <div className="produk-form-section-title">
                        <i className="bi bi-box-seam"></i>
                        Informasi Ukuran dan Pengiriman
                    </div>
                </div>

                <div className="produk-form-group">
                    <label htmlFor="berat">
                        Berat
                    </label>

                    <input
                        id="berat"
                        name="berat"
                        type="number"
                        min="0"
                        value={form.berat}
                        onChange={
                            handleChange
                        }
                        placeholder="Berat produk"
                        disabled={
                            loadingSubmit
                        }
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="panjang">
                        Panjang
                    </label>

                    <input
                        id="panjang"
                        name="panjang"
                        type="number"
                        min="0"
                        value={form.panjang}
                        onChange={
                            handleChange
                        }
                        placeholder="Panjang produk"
                        disabled={
                            loadingSubmit
                        }
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="lebar">
                        Lebar
                    </label>

                    <input
                        id="lebar"
                        name="lebar"
                        type="number"
                        min="0"
                        value={form.lebar}
                        onChange={
                            handleChange
                        }
                        placeholder="Lebar produk"
                        disabled={
                            loadingSubmit
                        }
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="tinggi">
                        Tinggi
                    </label>

                    <input
                        id="tinggi"
                        name="tinggi"
                        type="number"
                        min="0"
                        value={form.tinggi}
                        onChange={
                            handleChange
                        }
                        placeholder="Tinggi produk"
                        disabled={
                            loadingSubmit
                        }
                    />
                </div>
            </div>
        </FormModal>
    );
}

export default ProdukEditPage;