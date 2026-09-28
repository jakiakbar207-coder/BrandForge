import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getKeranjang,
    hapusKeranjang,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import "./KeranjangPage.css";

function KeranjangPage() {
    const navigate = useNavigate();

    const [keranjang, setKeranjang] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const loadKeranjang = async () => {
        try {
            setLoading(true);

            const response = await getKeranjang();
            const result = response?.data || response;

            setKeranjang(
                Array.isArray(result)
                    ? result
                    : result?.keranjang || []
            );
        } catch (error) {
            console.error(
                "Gagal memuat keranjang:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat keranjang.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKeranjang();
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

    const getProduk = (item) => {
        return item?.produk || {};
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

        return getHarga(item) * getJumlah(item);
    };

    const totalHarga = keranjang.reduce(
        (total, item) =>
            total + getSubtotal(item),
        0
    );

    const totalItem = keranjang.reduce(
        (total, item) =>
            total + getJumlah(item),
        0
    );

    const handleHapus = async (id) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus Produk?",
            text:
                "Produk ini akan dihapus dari keranjang.",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setDeletingId(id);

            await hapusKeranjang(id);

            setKeranjang((current) =>
                current.filter(
                    (item) =>
                        String(
                            item?.id ||
                                item?.id_keranjang
                        ) !== String(id)
                )
            );

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    "Produk berhasil dihapus dari keranjang.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Produk gagal dihapus dari keranjang.",
            });
        } finally {
            setDeletingId(null);
        }
    };

    const handleCheckout = () => {
        if (keranjang.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Keranjang Kosong",
                text:
                    "Tambahkan produk terlebih dahulu.",
            });

            return;
        }

        navigate("/pelanggan/checkout");
    };

    if (loading) {
        return (
            <div className="keranjang-page">
                <Loading />
            </div>
        );
    }

    return (
        <div className="keranjang-page">
            <div className="keranjang-container">
                <div className="keranjang-header">
                    <div>
                        <span className="keranjang-label">
                            Produk pilihanmu
                        </span>

                        <h1>Keranjang Belanja</h1>

                        <p>
                            Periksa kembali produk sebelum
                            melanjutkan ke checkout.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/belanja"
                        className="keranjang-shopping-button"
                    >
                        <i className="bi bi-bag"></i>
                        Lanjut Belanja
                    </Link>
                </div>

                {keranjang.length === 0 ? (
                    <div className="keranjang-empty">
                        <div className="keranjang-empty-icon">
                            <i className="bi bi-cart3"></i>
                        </div>

                        <h2>
                            Keranjang masih kosong
                        </h2>

                        <p>
                            Belum ada produk yang
                            ditambahkan ke keranjang.
                        </p>

                        <Link
                            to="/pelanggan/belanja"
                            className="keranjang-empty-button"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="keranjang-layout">
                        <div className="keranjang-list">
                            {keranjang.map((item) => {
                                const produk =
                                    getProduk(item);

                                const itemId =
                                    item?.id ||
                                    item?.id_keranjang;

                                const ukuran =
                                    item?.ukuran
                                        ?.nama_ukuran ||
                                    produk?.ukuran
                                        ?.nama_ukuran ||
                                    "-";

                                const warna =
                                    item?.warna
                                        ?.nama_warna ||
                                    produk?.warna
                                        ?.nama_warna ||
                                    "-";

                                return (
                                    <article
                                        className="keranjang-item"
                                        key={itemId}
                                    >
                                        <Link
                                            to={`/pelanggan/detail/${produk?.id_produk}`}
                                            className="keranjang-item-image"
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

                                        <div className="keranjang-item-content">
                                            <div className="keranjang-item-top">
                                                <div>
                                                    <span className="keranjang-item-category">
                                                        {produk
                                                            ?.kategori
                                                            ?.nama_kategori ||
                                                            "Produk"}
                                                    </span>

                                                    <h2>
                                                        {produk?.nama_produk ||
                                                            "Nama Produk"}
                                                    </h2>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="keranjang-delete-button"
                                                    onClick={() =>
                                                        handleHapus(
                                                            itemId
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        itemId
                                                    }
                                                    title="Hapus produk"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>

                                            <div className="keranjang-item-options">
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
                                                        {
                                                            getJumlah(
                                                                item
                                                            )
                                                        }
                                                    </strong>
                                                </span>
                                            </div>

                                            <div className="keranjang-item-bottom">
                                                <span className="keranjang-item-price">
                                                    {formatRupiah(
                                                        getHarga(
                                                            item
                                                        )
                                                    )}
                                                </span>

                                                <strong className="keranjang-item-subtotal">
                                                    {formatRupiah(
                                                        getSubtotal(
                                                            item
                                                        )
                                                    )}
                                                </strong>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <aside className="keranjang-summary">
                            <h2>
                                Ringkasan Pesanan
                            </h2>

                            <div className="keranjang-summary-row">
                                <span>
                                    Total Item
                                </span>

                                <strong>
                                    {totalItem}
                                </strong>
                            </div>

                            <div className="keranjang-summary-row">
                                <span>
                                    Total Produk
                                </span>

                                <strong>
                                    {keranjang.length}
                                </strong>
                            </div>

                            <div className="keranjang-summary-divider"></div>

                            <div className="keranjang-summary-total">
                                <span>
                                    Total Harga
                                </span>

                                <strong>
                                    {formatRupiah(
                                        totalHarga
                                    )}
                                </strong>
                            </div>

                            <button
                                type="button"
                                className="keranjang-checkout-button"
                                onClick={
                                    handleCheckout
                                }
                            >
                                Lanjut ke Checkout
                                <i className="bi bi-arrow-right"></i>
                            </button>

                            <Link
                                to="/pelanggan/belanja"
                                className="keranjang-back-button"
                            >
                                <i className="bi bi-arrow-left"></i>
                                Kembali Belanja
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}

export default KeranjangPage;
