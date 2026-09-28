import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getPembayaran,
    uploadBuktiPembayaran,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import "./PembayaranPage.css";

function PembayaranPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [data, setData] = useState(null);
    const [file, setFile] = useState(null);

    const loadPembayaran = async () => {
        try {
            setLoading(true);

            const response = await getPembayaran(id);
            const result = response?.data || response;

            setData(result);
        } catch (error) {
            console.error(
                "Gagal memuat pembayaran:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat data pembayaran.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadPembayaran();
        }
    }, [id]);

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const getPaymentData = () => {
        if (data?.data) {
            return data.data;
        }

        return data || {};
    };

    const paymentData = getPaymentData();

    const transaksi =
        paymentData?.transaksi ||
        data?.transaksi ||
        {};

    const detailTransaksi =
        paymentData?.detail_transaksi ||
        paymentData?.detailTransaksi ||
        transaksi?.detail_transaksi ||
        transaksi?.detailTransaksi ||
        [];

    const pembayaran =
        paymentData?.pembayaran ||
        transaksi?.pembayaran ||
        null;

    const kodeTransaksi =
        transaksi?.kode_transaksi ||
        paymentData?.kode_transaksi ||
        `#${id}`;

    const hargaProduk = Number(
        paymentData?.harga_produk ??
            paymentData?.subtotal ??
            transaksi?.total_harga ??
            0
    );

    const ongkir = Number(
        paymentData?.ongkir ??
            transaksi?.ongkir ??
            0
    );

    const totalPembayaran = Number(
        paymentData?.total_pembayaran ??
            transaksi?.total_harga ??
            hargaProduk + ongkir
    );

    const statusPembayaran =
        pembayaran?.status ||
        transaksi?.status ||
        "Belum Bayar";

    const handleFileChange = (event) => {
        const selectedFile =
            event.target.files?.[0];

        if (!selectedFile) {
            setFile(null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];

        if (
            !allowedTypes.includes(
                selectedFile.type
            )
        ) {
            Swal.fire({
                icon: "warning",
                title: "Format Tidak Didukung",
                text:
                    "Bukti pembayaran harus berupa JPG, JPEG, atau PNG.",
            });

            event.target.value = "";
            setFile(null);
            return;
        }

        if (
            selectedFile.size >
            2 * 1024 * 1024
        ) {
            Swal.fire({
                icon: "warning",
                title: "File Terlalu Besar",
                text:
                    "Ukuran bukti pembayaran maksimal 2 MB.",
            });

            event.target.value = "";
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            Swal.fire({
                icon: "warning",
                title: "Pilih Bukti Pembayaran",
                text:
                    "Silakan pilih file bukti pembayaran terlebih dahulu.",
            });

            return;
        }

        const result = await Swal.fire({
            icon: "question",
            title: "Upload Bukti Pembayaran?",
            text:
                "Pastikan bukti pembayaran yang dipilih sudah benar.",
            showCancelButton: true,
            confirmButtonText: "Ya, Upload",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append(
                "bukti",
                file
            );

            await uploadBuktiPembayaran(
                id,
                formData
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    "Bukti pembayaran berhasil diupload dan menunggu verifikasi kasir.",
                confirmButtonText:
                    "Lihat Pesanan",
            });

            navigate("/pelanggan/riwayat");
        } catch (error) {
            console.error(
                "Gagal upload bukti pembayaran:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Upload Gagal",
                text:
                    error?.response?.data?.message ||
                    "Bukti pembayaran gagal diupload.",
            });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="pembayaran-page">
                <Loading />
            </div>
        );
    }

    return (
        <div className="pembayaran-page">
            <div className="pembayaran-container">
                <div className="pembayaran-header">
                    <div>
                        <span className="pembayaran-label">
                            Penyelesaian Pesanan
                        </span>

                        <h1>
                            Pembayaran
                        </h1>

                        <p>
                            Lakukan pembayaran dan
                            upload bukti pembayaran
                            pesanan kamu.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/riwayat"
                        className="pembayaran-back-button"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Riwayat Pesanan
                    </Link>
                </div>

                <div className="pembayaran-layout">
                    <main className="pembayaran-main">
                        <section className="pembayaran-section">
                            <div className="pembayaran-section-header">
                                <div>
                                    <span className="pembayaran-section-number">
                                        1
                                    </span>

                                    <div>
                                        <h2>
                                            Detail Pesanan
                                        </h2>

                                        <p>
                                            Periksa informasi
                                            transaksi kamu.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pembayaran-order-card">
                                <div className="pembayaran-order-row">
                                    <span>
                                        Kode Transaksi
                                    </span>

                                    <strong>
                                        {kodeTransaksi}
                                    </strong>
                                </div>

                                <div className="pembayaran-order-row">
                                    <span>
                                        Status
                                    </span>

                                    <strong className="pembayaran-status">
                                        {statusPembayaran}
                                    </strong>
                                </div>
                            </div>

                            {Array.isArray(
                                detailTransaksi
                            ) &&
                                detailTransaksi.length >
                                    0 && (
                                    <div className="pembayaran-product-list">
                                        {detailTransaksi.map(
                                            (
                                                detail,
                                                index
                                            ) => {
                                                const produk =
                                                    detail?.produk ||
                                                    {};

                                                const jumlah =
                                                    Number(
                                                        detail?.jumlah ||
                                                            0
                                                    );

                                                const harga =
                                                    Number(
                                                        detail?.harga ||
                                                            produk?.harga ||
                                                            0
                                                    );

                                                const subtotal =
                                                    Number(
                                                        detail?.subtotal ??
                                                            harga *
                                                                jumlah
                                                    );

                                                return (
                                                    <div
                                                        className="pembayaran-product-item"
                                                        key={
                                                            detail?.id ||
                                                            detail?.id_detail_transaksi ||
                                                            index
                                                        }
                                                    >
                                                        <div className="pembayaran-product-info">
                                                            <span>
                                                                {produk
                                                                    ?.kategori
                                                                    ?.nama_kategori ||
                                                                    "Produk"}
                                                            </span>

                                                            <h3>
                                                                {produk?.nama_produk ||
                                                                    "Nama Produk"}
                                                            </h3>

                                                            <p>
                                                                {jumlah}{" "}
                                                                x{" "}
                                                                {formatRupiah(
                                                                    harga
                                                                )}
                                                            </p>
                                                        </div>

                                                        <strong>
                                                            {formatRupiah(
                                                                subtotal
                                                            )}
                                                        </strong>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                        </section>

                        <section className="pembayaran-section">
                            <div className="pembayaran-section-header">
                                <div>
                                    <span className="pembayaran-section-number">
                                        2
                                    </span>

                                    <div>
                                        <h2>
                                            Upload Bukti Pembayaran
                                        </h2>

                                        <p>
                                            Upload bukti
                                            pembayaran dalam
                                            format JPG, JPEG,
                                            atau PNG.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                className="pembayaran-upload-form"
                                onSubmit={
                                    handleUpload
                                }
                            >
                                <label
                                    htmlFor="bukti"
                                    className="pembayaran-upload-box"
                                >
                                    <div className="pembayaran-upload-icon">
                                        <i className="bi bi-cloud-arrow-up"></i>
                                    </div>

                                    <strong>
                                        {file
                                            ? file.name
                                            : "Pilih Bukti Pembayaran"}
                                    </strong>

                                    <span>
                                        JPG, JPEG, PNG
                                        maksimal 2 MB
                                    </span>

                                    <input
                                        id="bukti"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                        onChange={
                                            handleFileChange
                                        }
                                    />
                                </label>

                                {file && (
                                    <div className="pembayaran-file-info">
                                        <div>
                                            <i className="bi bi-file-earmark-image"></i>

                                            <span>
                                                {file.name}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFile(
                                                    null
                                                )
                                            }
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="pembayaran-upload-button"
                                    disabled={
                                        uploading
                                    }
                                >
                                    <i className="bi bi-upload"></i>

                                    {uploading
                                        ? "Mengupload..."
                                        : "Upload Bukti Pembayaran"}
                                </button>
                            </form>
                        </section>
                    </main>

                    <aside className="pembayaran-sidebar">
                        <div className="pembayaran-summary">
                            <h2>
                                Ringkasan Pembayaran
                            </h2>

                            <div className="pembayaran-summary-list">
                                <div className="pembayaran-summary-row">
                                    <span>
                                        Harga Produk
                                    </span>

                                    <strong>
                                        {formatRupiah(
                                            hargaProduk
                                        )}
                                    </strong>
                                </div>

                                <div className="pembayaran-summary-row">
                                    <span>
                                        Ongkir
                                    </span>

                                    <strong>
                                        {formatRupiah(
                                            ongkir
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="pembayaran-summary-divider"></div>

                            <div className="pembayaran-summary-total">
                                <span>
                                    Total Pembayaran
                                </span>

                                <strong>
                                    {formatRupiah(
                                        totalPembayaran
                                    )}
                                </strong>
                            </div>

                            <div className="pembayaran-bank-card">
                                <div className="pembayaran-bank-icon">
                                    <i className="bi bi-bank"></i>
                                </div>

                                <div>
                                    <strong>
                                        Pembayaran Manual
                                    </strong>

                                    <p>
                                        Lakukan pembayaran
                                        sesuai instruksi
                                        dari toko, kemudian
                                        upload bukti
                                        pembayaran.
                                    </p>
                                </div>
                            </div>

                            <div className="pembayaran-secure-info">
                                <i className="bi bi-shield-check"></i>

                                <span>
                                    Bukti pembayaran akan
                                    diperiksa oleh kasir
                                    sebelum pesanan
                                    diproses.
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default PembayaranPage;
