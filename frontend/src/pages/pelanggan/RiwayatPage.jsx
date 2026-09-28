import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getRiwayatTransaksi,
    hapusTransaksi,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import "./RiwayatPage.css";

function RiwayatPage() {
    const navigate = useNavigate();

    const [riwayat, setRiwayat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const loadRiwayat = async () => {
        try {
            setLoading(true);

            const response =
                await getRiwayatTransaksi();

            const result =
                response?.data || response;

            const items = Array.isArray(result)
                ? result
                : result?.transaksi ||
                  result?.riwayat ||
                  result?.data ||
                  [];

            setRiwayat(items);
        } catch (error) {
            console.error(
                "Gagal memuat riwayat transaksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat riwayat transaksi.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRiwayat();
    }, []);

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const formatTanggal = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    const getStatusClass = (status) => {
        const value = String(
            status || ""
        ).toLowerCase();

        if (
            value.includes("selesai") ||
            value.includes("diterima")
        ) {
            return "riwayat-status-success";
        }

        if (
            value.includes("batal") ||
            value.includes("gagal")
        ) {
            return "riwayat-status-danger";
        }

        if (
            value.includes("verifikasi") ||
            value.includes("diproses") ||
            value.includes("dikirim")
        ) {
            return "riwayat-status-process";
        }

        return "riwayat-status-pending";
    };

    const getDetail = (item) => {
        return (
            item?.detail_transaksi ||
            item?.detailTransaksi ||
            item?.details ||
            []
        );
    };

    const getTotalItem = (item) => {
        const details = getDetail(item);

        if (!Array.isArray(details)) {
            return 0;
        }

        return details.reduce(
            (total, detail) =>
                total +
                Number(detail?.jumlah || 0),
            0
        );
    };

    const getFirstProduct = (item) => {
        const details = getDetail(item);

        if (!Array.isArray(details)) {
            return null;
        }

        return details[0]?.produk || null;
    };

    const getImageUrl = (produk) => {
        const foto =
            produk?.fotos?.[0]?.foto ||
            produk?.foto ||
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

        if (foto.startsWith("/storage/")) {
            return foto;
        }

        return `/storage/${foto}`;
    };

    const handleHapus = async (item) => {
        const transaksiId =
            item?.id ||
            item?.id_transaksi;

        if (!transaksiId) {
            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus Riwayat?",
            text:
                "Riwayat transaksi ini akan dihapus.",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setDeletingId(transaksiId);

            await hapusTransaksi(
                transaksiId
            );

            setRiwayat((previous) =>
                previous.filter(
                    (transaction) =>
                        (transaction?.id ||
                            transaction?.id_transaksi) !==
                        transaksiId
                )
            );

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    "Riwayat transaksi berhasil dihapus.",
            });
        } catch (error) {
            console.error(
                "Gagal menghapus riwayat:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Riwayat transaksi gagal dihapus.",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="riwayat-page">
                <Loading />
            </div>
        );
    }

    return (
        <div className="riwayat-page">
            <div className="riwayat-container">
                <div className="riwayat-header">
                    <div>
                        <span className="riwayat-label">
                            Aktivitas Akun
                        </span>

                        <h1>
                            Riwayat Transaksi
                        </h1>

                        <p>
                            Lihat seluruh transaksi
                            yang pernah kamu lakukan.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/belanja"
                        className="riwayat-shop-button"
                    >
                        <i className="bi bi-bag"></i>
                        Belanja Lagi
                    </Link>
                </div>

                <div className="riwayat-summary">
                    <div className="riwayat-summary-card">
                        <div className="riwayat-summary-icon">
                            <i className="bi bi-receipt"></i>
                        </div>

                        <div>
                            <span>
                                Total Transaksi
                            </span>

                            <strong>
                                {riwayat.length}
                            </strong>
                        </div>
                    </div>

                    <div className="riwayat-summary-card">
                        <div className="riwayat-summary-icon">
                            <i className="bi bi-box-seam"></i>
                        </div>

                        <div>
                            <span>
                                Total Item
                            </span>

                            <strong>
                                {riwayat.reduce(
                                    (total, item) =>
                                        total +
                                        getTotalItem(
                                            item
                                        ),
                                    0
                                )}
                            </strong>
                        </div>
                    </div>

                    <div className="riwayat-summary-card">
                        <div className="riwayat-summary-icon">
                            <i className="bi bi-check-circle"></i>
                        </div>

                        <div>
                            <span>
                                Pesanan Selesai
                            </span>

                            <strong>
                                {
                                    riwayat.filter(
                                        (item) =>
                                            String(
                                                item?.status ||
                                                    ""
                                            )
                                                .toLowerCase()
                                                .includes(
                                                    "selesai"
                                                )
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>
                </div>

                {riwayat.length === 0 ? (
                    <div className="riwayat-empty">
                        <div className="riwayat-empty-icon">
                            <i className="bi bi-clock-history"></i>
                        </div>

                        <h2>
                            Belum Ada Riwayat
                        </h2>

                        <p>
                            Belum ada transaksi yang
                            tersimpan di akun kamu.
                        </p>

                        <Link
                            to="/pelanggan/belanja"
                            className="riwayat-empty-button"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="riwayat-list">
                        {riwayat.map(
                            (item, index) => {
                                const transaksiId =
                                    item?.id ||
                                    item?.id_transaksi ||
                                    index;

                                const produk =
                                    getFirstProduct(
                                        item
                                    );

                                const status =
                                    item?.status ||
                                    "Menunggu";

                                const total =
                                    Number(
                                        item?.total_harga ??
                                            item?.total ??
                                            0
                                    );

                                const kode =
                                    item?.kode_transaksi ||
                                    item?.kode ||
                                    `TRX-${transaksiId}`;

                                const details =
                                    getDetail(item);

                                return (
                                    <article
                                        className="riwayat-card"
                                        key={
                                            transaksiId
                                        }
                                    >
                                        <div className="riwayat-card-top">
                                            <div className="riwayat-code">
                                                <span>
                                                    Kode Transaksi
                                                </span>

                                                <strong>
                                                    {kode}
                                                </strong>
                                            </div>

                                            <span
                                                className={`riwayat-status ${getStatusClass(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>
                                        </div>

                                        <div className="riwayat-card-content">
                                            <div className="riwayat-product">
                                                <div className="riwayat-product-image">
                                                    <img
                                                        src={getImageUrl(
                                                            produk
                                                        )}
                                                        alt={
                                                            produk?.nama_produk ||
                                                            "Produk"
                                                        }
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.src =
                                                                "/images/no-image.png";
                                                        }}
                                                    />
                                                </div>

                                                <div className="riwayat-product-info">
                                                    <span>
                                                        {produk
                                                            ?.kategori
                                                            ?.nama_kategori ||
                                                            "Produk"}
                                                    </span>

                                                    <h2>
                                                        {produk?.nama_produk ||
                                                            "Transaksi Produk"}
                                                    </h2>

                                                    <p>
                                                        {getTotalItem(
                                                            item
                                                        )}{" "}
                                                        item
                                                    </p>

                                                    {details.length >
                                                        1 && (
                                                        <small>
                                                            +{" "}
                                                            {details.length -
                                                                1}{" "}
                                                            produk
                                                            lainnya
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="riwayat-total">
                                                <span>
                                                    Total
                                                </span>

                                                <strong>
                                                    {formatRupiah(
                                                        total
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="riwayat-card-bottom">
                                            <div className="riwayat-date">
                                                <i className="bi bi-calendar3"></i>

                                                <span>
                                                    {formatTanggal(
                                                        item?.tanggal_transaksi ||
                                                            item?.created_at
                                                    )}
                                                </span>
                                            </div>

                                            <div className="riwayat-actions">
                                                <button
                                                    type="button"
                                                    className="riwayat-tracking-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/pelanggan/tracking/${transaksiId}`
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-truck"></i>
                                                    Lacak
                                                </button>

                                                {String(
                                                    status
                                                )
                                                    .toLowerCase()
                                                    .includes(
                                                        "belum bayar"
                                                    ) && (
                                                    <Link
                                                        to={`/pelanggan/pembayaran/${transaksiId}`}
                                                        className="riwayat-payment-button"
                                                    >
                                                        <i className="bi bi-credit-card"></i>
                                                        Bayar
                                                    </Link>
                                                )}

                                                <button
                                                    type="button"
                                                    className="riwayat-delete-button"
                                                    onClick={() =>
                                                        handleHapus(
                                                            item
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        transaksiId
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>

                                                    {deletingId ===
                                                    transaksiId
                                                        ? "Menghapus..."
                                                        : "Hapus"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RiwayatPage;
