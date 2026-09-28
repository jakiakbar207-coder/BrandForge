import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getRiwayatTransaksi,
    hapusTransaksi,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import "./PesananPage.css";

const API_URL = "http://127.0.0.1:8000";

function PesananPage() {
    const navigate = useNavigate();

    const [pesanan, setPesanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const loadPesanan = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getRiwayatTransaksi();
            const result = response?.data ?? response;

            const items = Array.isArray(result)
                ? result
                : result?.transaksi ||
                  result?.pesanan ||
                  result?.data ||
                  [];

            setPesanan(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Gagal memuat pesanan:", error);

            const message =
                error?.response?.data?.message ||
                "Gagal memuat data pesanan.";

            setError(message);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPesanan();
    }, [loadPesanan]);

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const formatTanggal = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const getStatusValue = (status) => {
        return String(status || "Menunggu")
            .trim()
            .toLowerCase();
    };

    const getStatusClass = (status) => {
        const value = getStatusValue(status);

        if (
            value.includes("selesai") ||
            value.includes("diterima")
        ) {
            return "pesanan-status-success";
        }

        if (
            value.includes("batal") ||
            value.includes("gagal") ||
            value.includes("ditolak")
        ) {
            return "pesanan-status-danger";
        }

        if (
            value.includes("verifikasi") ||
            value.includes("diproses") ||
            value.includes("dikirim")
        ) {
            return "pesanan-status-process";
        }

        return "pesanan-status-pending";
    };

    const getStatusLabel = (status) => {
        if (!status) {
            return "Menunggu";
        }

        return status;
    };

    const getDetail = (item) => {
        const details =
            item?.detail_transaksi ||
            item?.detailTransaksi ||
            item?.details ||
            [];

        return Array.isArray(details) ? details : [];
    };

    const getProdukPertama = (item) => {
        const details = getDetail(item);

        return details[0]?.produk || null;
    };

    const getFotoUrl = (produk) => {
        const foto =
            produk?.foto ||
            produk?.fotos?.[0]?.foto ||
            null;

        if (!foto) {
            return "/images/no-image.png";
        }

        if (
            foto.startsWith("http://") ||
            foto.startsWith("https://")
        ) {
            return foto;
        }

        if (foto.startsWith("/")) {
            return `${API_URL}${foto}`;
        }

        return `${API_URL}/produk/${foto}`;
    };

    const getTotalItem = (item) => {
        return getDetail(item).reduce(
            (total, detail) =>
                total + Number(detail?.jumlah || 0),
            0
        );
    };

    const isBelumBayar = (status) => {
        const value = getStatusValue(status);

        return (
            value === "belum bayar" ||
            value === "menunggu pembayaran"
        );
    };

    const handleHapus = async (item) => {
        const transaksiId =
            item?.id ||
            item?.id_transaksi;

        if (!transaksiId) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "ID transaksi tidak ditemukan.",
            });

            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus Pesanan?",
            text: "Pesanan ini akan dihapus dari riwayat.",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            confirmButtonColor: "#dc2626",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setDeletingId(transaksiId);

            await hapusTransaksi(transaksiId);

            setPesanan((previous) =>
                previous.filter(
                    (pesananItem) =>
                        (pesananItem?.id ||
                            pesananItem?.id_transaksi) !==
                        transaksiId
                )
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Pesanan berhasil dihapus.",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Gagal menghapus pesanan:", error);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Pesanan gagal dihapus.",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="pesanan-page">
                <Loading message="Memuat pesanan..." />
            </div>
        );
    }

    return (
        <div className="pesanan-page">
            <div className="pesanan-container">
                <div className="pesanan-header">
                    <div>
                        <span className="pesanan-label">
                            Akun Pelanggan
                        </span>

                        <h1>Pesanan Saya</h1>

                        <p>
                            Pantau pesanan dan status transaksi kamu.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/belanja"
                        className="pesanan-shop-button"
                    >
                        <i className="bi bi-bag"></i>
                        Belanja Lagi
                    </Link>
                </div>

                {error && pesanan.length === 0 ? (
                    <EmptyState
                        icon="bi-exclamation-triangle"
                        title="Gagal Memuat Pesanan"
                        message={error}
                    />
                ) : pesanan.length === 0 ? (
                    <div className="pesanan-empty">
                        <div className="pesanan-empty-icon">
                            <i className="bi bi-receipt"></i>
                        </div>

                        <h2>Belum Ada Pesanan</h2>

                        <p>
                            Kamu belum memiliki pesanan. Yuk mulai
                            belanja produk yang tersedia.
                        </p>

                        <Link
                            to="/pelanggan/belanja"
                            className="pesanan-empty-button"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="pesanan-list">
                        {pesanan.map((item, index) => {
                            const transaksiId =
                                item?.id ||
                                item?.id_transaksi ||
                                index;

                            const details = getDetail(item);
                            const produk = getProdukPertama(item);

                            const status =
                                item?.status || "Menunggu";

                            const total = Number(
                                item?.total_harga ??
                                    item?.total ??
                                    0
                            );

                            const kode =
                                item?.kode_transaksi ||
                                item?.kode ||
                                `TRX-${transaksiId}`;

                            const namaProduk =
                                produk?.nama_produk ||
                                "Pesanan Produk";

                            return (
                                <article
                                    className="pesanan-card"
                                    key={transaksiId}
                                >
                                    <div className="pesanan-card-header">
                                        <div>
                                            <span>Pesanan</span>

                                            <strong>{kode}</strong>
                                        </div>

                                        <span
                                            className={`pesanan-status ${getStatusClass(
                                                status
                                            )}`}
                                        >
                                            {getStatusLabel(status)}
                                        </span>
                                    </div>

                                    <div className="pesanan-card-body">
                                        <div className="pesanan-product-preview">
                                            <div className="pesanan-product-image">
                                                <img
                                                    src={getFotoUrl(produk)}
                                                    alt={namaProduk}
                                                    onError={(event) => {
                                                        event.currentTarget.onerror =
                                                            null;

                                                        event.currentTarget.src =
                                                            "/images/no-image.png";
                                                    }}
                                                />
                                            </div>

                                            <div className="pesanan-product-info">
                                                <span>
                                                    {produk?.kategori
                                                        ?.nama_kategori ||
                                                        "Produk"}
                                                </span>

                                                <h2>{namaProduk}</h2>

                                                {details.length > 1 && (
                                                    <p>
                                                        +{" "}
                                                        {details.length - 1}{" "}
                                                        produk lainnya
                                                    </p>
                                                )}

                                                <p>
                                                    {getTotalItem(item)} item
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pesanan-card-total">
                                            <span>Total Pesanan</span>

                                            <strong>
                                                {formatRupiah(total)}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="pesanan-card-footer">
                                        <div className="pesanan-date">
                                            <i className="bi bi-calendar3"></i>

                                            <span>
                                                {formatTanggal(
                                                    item?.tanggal_transaksi ||
                                                        item?.created_at
                                                )}
                                            </span>
                                        </div>

                                        <div className="pesanan-actions">
                                            <button
                                                type="button"
                                                className="pesanan-detail-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/pelanggan/tracking/${transaksiId}`
                                                    )
                                                }
                                            >
                                                <i className="bi bi-truck"></i>
                                                Lacak Pesanan
                                            </button>

                                            {isBelumBayar(status) && (
                                                <Link
                                                    to={`/pelanggan/pembayaran/${transaksiId}`}
                                                    className="pesanan-payment-button"
                                                >
                                                    <i className="bi bi-credit-card"></i>
                                                    Bayar
                                                </Link>
                                            )}

                                            <button
                                                type="button"
                                                className="pesanan-delete-button"
                                                onClick={() =>
                                                    handleHapus(item)
                                                }
                                                disabled={
                                                    deletingId ===
                                                    transaksiId
                                                }
                                            >
                                                <i className="bi bi-trash"></i>

                                                {deletingId === transaksiId
                                                    ? "Menghapus..."
                                                    : "Hapus"}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PesananPage;