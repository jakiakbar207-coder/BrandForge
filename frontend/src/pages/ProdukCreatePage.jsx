import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createProduk } from "../api/produk";
import { getKategori } from "../api/kategori";
import { getKoleksi } from "../api/koleksi";

import FormModal from "../components/common/FormModal";

import "./Produk.css";

function ProdukCreatePage() {
    const navigate = useNavigate();

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

    const [loadingData, setLoadingData] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const loadFormData = async () => {
        try {
            setLoadingData(true);

            const [
                kategoriResponse,
                koleksiResponse,
            ] = await Promise.all([
                getKategori(),
                getKoleksi(),
            ]);

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
        } catch (error) {
            console.error(
                "Gagal mengambil data form produk:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Data kategori dan koleksi gagal dimuat.",
            });
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadFormData();
    }, []);

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
            setLoading(true);

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

            if (form.deskripsi.trim()) {
                formData.append(
                    "deskripsi",
                    form.deskripsi.trim()
                );
            }

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

            await createProduk(formData);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Produk berhasil ditambahkan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/produk");
        } catch (error) {
            console.error(
                "Gagal menambahkan produk:",
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
                    "Produk gagal ditambahkan.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="produk-loading">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Memuat...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title="Tambah Produk"
            onClose={() =>
                navigate("/produk")
            }
            onSubmit={handleSubmit}
            submitText="Simpan"
            cancelText="Batal"
            loading={loading}
            size="large"
        >
            <div className="produk-form-grid">
                <div className="produk-form-group produk-form-full">
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="stok">
                        Stok Awal
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
                        disabled={loading}
                    />
                </div>

                <div className="produk-form-group">
                    <label htmlFor="foto">
                        Foto Produk
                    </label>

                    <input
                        id="foto"
                        name="foto"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={
                            handleFileChange
                        }
                        disabled={loading}
                    />

                    <small>
                        Format: JPG, JPEG, PNG,
                        WEBP. Maksimal 2 MB.
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
                        disabled={loading}
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
                        disabled={loading}
                    />

                    <small>
                        Satuan mengikuti database
                        produk.
                    </small>
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>
            </div>
        </FormModal>
    );
}

export default ProdukCreatePage;