import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAlamat,
    simpanAlamat,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import "./AlamatPage.css";

function AlamatPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState(null);

    const [form, setForm] = useState({
        nama_penerima: "",
        no_telepon: "",
        alamat: "",
        kecamatan: "",
        kota: "",
        provinsi: "",
        kode_pos: "",
    });

    const loadAlamat = async () => {
        try {
            setLoading(true);

            const response = await getAlamat(id);
            const result = response?.data || response;

            setData(result);

            const transaksi =
                result?.transaksi ||
                result?.data ||
                result;

            const alamat =
                result?.alamat ||
                transaksi?.alamat ||
                null;

            if (alamat) {
                setForm({
                    nama_penerima:
                        alamat?.nama_penerima ||
                        alamat?.nama ||
                        "",
                    no_telepon:
                        alamat?.no_telepon ||
                        alamat?.telepon ||
                        alamat?.nomor_telepon ||
                        "",
                    alamat:
                        alamat?.alamat ||
                        alamat?.alamat_lengkap ||
                        "",
                    kecamatan:
                        alamat?.kecamatan || "",
                    kota:
                        alamat?.kota ||
                        alamat?.kabupaten ||
                        "",
                    provinsi:
                        alamat?.provinsi || "",
                    kode_pos:
                        alamat?.kode_pos ||
                        alamat?.kodepos ||
                        "",
                });
            }
        } catch (error) {
            console.error(
                "Gagal memuat alamat:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat data alamat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadAlamat();
        }
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !form.nama_penerima.trim() ||
            !form.no_telepon.trim() ||
            !form.alamat.trim() ||
            !form.kecamatan.trim() ||
            !form.kota.trim() ||
            !form.provinsi.trim() ||
            !form.kode_pos.trim()
        ) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text:
                    "Silakan lengkapi seluruh data alamat.",
            });

            return;
        }

        try {
            setSaving(true);

            const response = await simpanAlamat(
                id,
                form
            );

            const result =
                response?.data?.data ||
                response?.data ||
                response;

            const transaksiId =
                result?.id ||
                result?.id_transaksi ||
                result?.transaksi_id ||
                id;

            await Swal.fire({
                icon: "success",
                title: "Alamat Disimpan",
                text:
                    "Alamat pengiriman berhasil disimpan.",
                confirmButtonText:
                    "Lanjut Pembayaran",
            });

            navigate(
                `/pelanggan/pembayaran/${transaksiId}`
            );
        } catch (error) {
            console.error(
                "Gagal menyimpan alamat:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal Menyimpan",
                text:
                    error?.response?.data?.message ||
                    "Alamat gagal disimpan.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="alamat-page">
                <Loading />
            </div>
        );
    }

    const transaksi =
        data?.transaksi ||
        data?.data ||
        data ||
        {};

    const kodeTransaksi =
        transaksi?.kode_transaksi ||
        transaksi?.kode ||
        `#${id}`;

    return (
        <div className="alamat-page">
            <div className="alamat-container">
                <div className="alamat-header">
                    <div>
                        <span className="alamat-label">
                            Pengiriman Pesanan
                        </span>

                        <h1>
                            Alamat Pengiriman
                        </h1>

                        <p>
                            Lengkapi alamat untuk
                            pengiriman pesanan kamu.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/riwayat"
                        className="alamat-back-button"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Riwayat Pesanan
                    </Link>
                </div>

                <div className="alamat-layout">
                    <main className="alamat-main">
                        <section className="alamat-section">
                            <div className="alamat-section-header">
                                <div>
                                    <span className="alamat-section-number">
                                        1
                                    </span>

                                    <div>
                                        <h2>
                                            Detail Penerima
                                        </h2>

                                        <p>
                                            Masukkan informasi
                                            penerima pesanan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                className="alamat-form"
                                onSubmit={
                                    handleSubmit
                                }
                            >
                                <div className="alamat-form-group">
                                    <label htmlFor="nama_penerima">
                                        Nama Penerima
                                    </label>

                                    <input
                                        id="nama_penerima"
                                        type="text"
                                        name="nama_penerima"
                                        value={
                                            form.nama_penerima
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Masukkan nama penerima"
                                    />
                                </div>

                                <div className="alamat-form-group">
                                    <label htmlFor="no_telepon">
                                        Nomor Telepon
                                    </label>

                                    <input
                                        id="no_telepon"
                                        type="text"
                                        name="no_telepon"
                                        value={
                                            form.no_telepon
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>

                                <div className="alamat-form-group alamat-full">
                                    <label htmlFor="alamat">
                                        Alamat Lengkap
                                    </label>

                                    <textarea
                                        id="alamat"
                                        name="alamat"
                                        value={
                                            form.alamat
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Nama jalan, nomor rumah, RT/RW, dan detail lainnya"
                                    ></textarea>
                                </div>

                                <div className="alamat-form-group">
                                    <label htmlFor="kecamatan">
                                        Kecamatan
                                    </label>

                                    <input
                                        id="kecamatan"
                                        type="text"
                                        name="kecamatan"
                                        value={
                                            form.kecamatan
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Masukkan kecamatan"
                                    />
                                </div>

                                <div className="alamat-form-group">
                                    <label htmlFor="kota">
                                        Kota / Kabupaten
                                    </label>

                                    <input
                                        id="kota"
                                        type="text"
                                        name="kota"
                                        value={
                                            form.kota
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Masukkan kota atau kabupaten"
                                    />
                                </div>

                                <div className="alamat-form-group">
                                    <label htmlFor="provinsi">
                                        Provinsi
                                    </label>

                                    <input
                                        id="provinsi"
                                        type="text"
                                        name="provinsi"
                                        value={
                                            form.provinsi
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Masukkan provinsi"
                                    />
                                </div>

                                <div className="alamat-form-group">
                                    <label htmlFor="kode_pos">
                                        Kode Pos
                                    </label>

                                    <input
                                        id="kode_pos"
                                        type="text"
                                        name="kode_pos"
                                        value={
                                            form.kode_pos
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Masukkan kode pos"
                                    />
                                </div>

                                <div className="alamat-form-actions">
                                    <Link
                                        to="/pelanggan/keranjang"
                                        className="alamat-cancel-button"
                                    >
                                        Kembali
                                    </Link>

                                    <button
                                        type="submit"
                                        className="alamat-submit-button"
                                        disabled={
                                            saving
                                        }
                                    >
                                        <i className="bi bi-check2-circle"></i>

                                        {saving
                                            ? "Menyimpan..."
                                            : "Simpan & Lanjut Pembayaran"}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </main>

                    <aside className="alamat-sidebar">
                        <div className="alamat-summary">
                            <h2>
                                Detail Pesanan
                            </h2>

                            <div className="alamat-summary-code">
                                <span>
                                    Kode Transaksi
                                </span>

                                <strong>
                                    {kodeTransaksi}
                                </strong>
                            </div>

                            <div className="alamat-summary-divider"></div>

                            <div className="alamat-summary-info">
                                <div>
                                    <i className="bi bi-geo-alt"></i>

                                    <span>
                                        Alamat Pengiriman
                                    </span>
                                </div>

                                <p>
                                    Pastikan alamat yang
                                    dimasukkan sudah benar
                                    agar pesanan dapat
                                    dikirim ke lokasi yang
                                    sesuai.
                                </p>
                            </div>

                            <div className="alamat-secure-info">
                                <i className="bi bi-shield-check"></i>

                                <span>
                                    Data alamat digunakan
                                    untuk keperluan
                                    pengiriman pesanan.
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default AlamatPage;
