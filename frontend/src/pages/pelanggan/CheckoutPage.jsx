import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getCheckout,
    prosesCheckout,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import "./CheckoutPage.css";

function CheckoutPage() {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const loadCheckout = async () => {
        try {
            setLoading(true);

            const response = await getCheckout();
            const result = response?.data || response;

            setData(result);
        } catch (error) {
            console.error(
                "Gagal memuat checkout:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat data checkout.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCheckout();
    }, []);

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const getFotoUrl = (produk) => {
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

    const getKeranjang = () => {
        if (Array.isArray(data)) {
            return data;
        }

        return (
            data?.keranjang ||
            data?.items ||
            data?.data ||
            []
        );
    };

    const getHarga = (item) => {
        return Number(
            item?.harga ||
                item?.produk?.harga ||
                0
        );
    };

    const getJumlah = (item) => {
        return Number(item?.jumlah || 0);
    };

    const getSubtotal = (item) => {
        if (item?.subtotal !== undefined) {
            return Number(item.subtotal || 0);
        }

        return (
            getHarga(item) *
            getJumlah(item)
        );
    };

    const keranjang = getKeranjang();

    const subtotal = keranjang.reduce(
        (total, item) =>
            total + getSubtotal(item),
        0
    );

    const ongkir = Number(
        data?.ongkir ??
            data?.shipping_cost ??
            10000
    );

    const total =
        Number(
            data?.total_harga ??
                data?.total ??
                0
        ) || subtotal + ongkir;

    const totalItem = keranjang.reduce(
        (total, item) =>
            total + getJumlah(item),
        0
    );

    const handleCheckout = async () => {
        if (keranjang.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Keranjang Kosong",
                text:
                    "Tidak ada produk yang dapat diproses.",
            });

            return;
        }

        const result = await Swal.fire({
            icon: "question",
            title: "Lanjut Checkout?",
            text:
                "Pesanan akan dibuat dan kamu akan diarahkan ke halaman alamat.",
            showCancelButton: true,
            confirmButtonText: "Ya, Checkout",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setProcessing(true);

            const response =
                await prosesCheckout();

            const resultData =
                response?.data?.data ||
                response?.data ||
                response;

            const transaksiId =
                resultData?.id ||
                resultData?.id_transaksi ||
                resultData?.transaksi_id;

            if (!transaksiId) {
                throw new Error(
                    "ID transaksi tidak ditemukan."
                );
            }

            await Swal.fire({
                icon: "success",
                title: "Checkout Berhasil",
                text:
                    "Pesanan berhasil dibuat.",
                confirmButtonText:
                    "Lanjut ke Alamat",
            });

            navigate(
                `/pelanggan/alamat/${transaksiId}`
            );
        } catch (error) {
            console.error(
                "Checkout gagal:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Checkout Gagal",
                text:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Pesanan gagal diproses.",
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <Loading />
            </div>
        );
    }

    if (keranjang.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="checkout-header">
                        <div>
                            <span className="checkout-label">
                                Konfirmasi pesanan
                            </span>

                            <h1>
                                Checkout
                            </h1>

                            <p>
                                Periksa kembali pesanan
                                sebelum checkout.
                            </p>
                        </div>

                        <Link
                            to="/pelanggan/belanja"
                            className="checkout-back-button"
                        >
                            <i className="bi bi-arrow-left"></i>
                            Kembali Belanja
                        </Link>
                    </div>

                    <div className="checkout-empty">
                        <div className="checkout-empty-icon">
                            <i className="bi bi-cart3"></i>
                        </div>

                        <h2>
                            Keranjang masih kosong
                        </h2>

                        <p>
                            Tambahkan produk terlebih
                            dahulu sebelum checkout.
                        </p>

                        <Link
                            to="/pelanggan/belanja"
                            className="checkout-empty-button"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <div>
                        <span className="checkout-label">
                            Konfirmasi pesanan
                        </span>

                        <h1>
                            Checkout
                        </h1>

                        <p>
                            Periksa kembali produk
                            sebelum membuat pesanan.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/keranjang"
                        className="checkout-back-button"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Kembali ke Keranjang
                    </Link>
                </div>

                <div className="checkout-layout">
                    <div className="checkout-main">
                        <section className="checkout-section">
                            <div className="checkout-section-header">
                                <div>
                                    <span className="checkout-section-number">
                                        1
                                    </span>

                                    <div>
                                        <h2>
                                            Produk Pesanan
                                        </h2>

                                        <p>
                                            Produk yang akan
                                            kamu beli
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="checkout-product-list">
                                {keranjang.map(
                                    (item) => {
                                        const produk =
                                            item?.produk ||
                                            {};

                                        const itemId =
                                            item?.id ||
                                            item?.id_keranjang ||
                                            `${produk?.id_produk}-${item?.warna_id}-${item?.ukuran_id}`;

                                        const warna =
                                            item?.warna
                                                ?.nama_warna ||
                                            produk?.warna
                                                ?.nama_warna ||
                                            "-";

                                        const ukuran =
                                            item?.ukuran
                                                ?.nama_ukuran ||
                                            produk?.ukuran
                                                ?.nama_ukuran ||
                                            "-";

                                        return (
                                            <div
                                                className="checkout-product-item"
                                                key={
                                                    itemId
                                                }
                                            >
                                                <Link
                                                    to={`/pelanggan/detail/${produk?.id_produk}`}
                                                    className="checkout-product-image"
                                                >
                                                    <img
                                                        src={getFotoUrl(
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
                                                </Link>

                                                <div className="checkout-product-info">
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

                                                    <div className="checkout-product-meta">
                                                        <span>
                                                            Warna:{" "}
                                                            <strong>
                                                                {
                                                                    warna
                                                                }
                                                            </strong>
                                                        </span>

                                                        <span>
                                                            Ukuran:{" "}
                                                            <strong>
                                                                {
                                                                    ukuran
                                                                }
                                                            </strong>
                                                        </span>

                                                        <span>
                                                            Jumlah:{" "}
                                                            <strong>
                                                                {getJumlah(
                                                                    item
                                                                )}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="checkout-product-total">
                                                    <span>
                                                        Subtotal
                                                    </span>

                                                    <strong>
                                                        {formatRupiah(
                                                            getSubtotal(
                                                                item
                                                            )
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </section>

                        <section className="checkout-section">
                            <div className="checkout-section-header">
                                <div>
                                    <span className="checkout-section-number">
                                        2
                                    </span>

                                    <div>
                                        <h2>
                                            Informasi Pengiriman
                                        </h2>

                                        <p>
                                            Alamat pengiriman
                                            dapat dilengkapi
                                            setelah pesanan
                                            dibuat.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="checkout-address-box">
                                <div className="checkout-address-name">
                                    <i className="bi bi-geo-alt"></i>

                                    Alamat Pengiriman
                                </div>

                                <p>
                                    Setelah checkout
                                    berhasil, kamu akan
                                    diarahkan ke halaman
                                    untuk mengisi atau
                                    mengatur alamat
                                    pengiriman.
                                </p>
                            </div>
                        </section>

                        <section className="checkout-section">
                            <div className="checkout-section-header">
                                <div>
                                    <span className="checkout-section-number">
                                        3
                                    </span>

                                    <div>
                                        <h2>
                                            Konfirmasi
                                        </h2>

                                        <p>
                                            Pastikan pesanan
                                            sudah sesuai.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="checkout-address-box">
                                <div className="checkout-address-name">
                                    <i className="bi bi-check-circle"></i>

                                    Pesanan Siap Diproses
                                </div>

                                <p>
                                    Klik tombol checkout
                                    untuk membuat pesanan.
                                    Setelah pesanan dibuat,
                                    kamu dapat melanjutkan
                                    ke pengisian alamat
                                    pengiriman.
                                </p>
                            </div>
                        </section>
                    </div>

                    <aside className="checkout-summary">
                        <h2>
                            Ringkasan Pesanan
                        </h2>

                        <div className="checkout-summary-list">
                            <div className="checkout-summary-row">
                                <span>
                                    Total Item
                                </span>

                                <strong>
                                    {totalItem}
                                </strong>
                            </div>

                            <div className="checkout-summary-row">
                                <span>
                                    Total Produk
                                </span>

                                <strong>
                                    {keranjang.length}
                                </strong>
                            </div>

                            <div className="checkout-summary-row">
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    {formatRupiah(
                                        subtotal
                                    )}
                                </strong>
                            </div>

                            <div className="checkout-summary-row">
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

                        <div className="checkout-summary-divider"></div>

                        <div className="checkout-summary-total">
                            <span>
                                Total Pembayaran
                            </span>

                            <strong>
                                {formatRupiah(total)}
                            </strong>
                        </div>

                        <button
                            type="button"
                            className="checkout-submit-button"
                            onClick={
                                handleCheckout
                            }
                            disabled={processing}
                        >
                            <i className="bi bi-check2-circle"></i>

                            {processing
                                ? "Memproses..."
                                : "Checkout Sekarang"}
                        </button>

                        <div className="checkout-secure-info">
                            <i className="bi bi-shield-check"></i>

                            <span>
                                Pastikan data dan produk
                                yang dipilih sudah benar
                                sebelum melanjutkan.
                            </span>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
