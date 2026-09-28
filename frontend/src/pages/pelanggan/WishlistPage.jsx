import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getWishlist,
    hapusWishlist,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import "./WishlistPage.css";

function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const loadWishlist = async () => {
        try {
            setLoading(true);

            const response = await getWishlist();
            const result = response?.data || response;

            setWishlist(
                Array.isArray(result)
                    ? result
                    : result?.wishlist || []
            );
        } catch (error) {
            console.error(
                "Gagal memuat wishlist:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat wishlist.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const getFotoProduk = (produk) => {
        if (produk?.foto) {
            return produk.foto;
        }

        if (
            Array.isArray(produk?.fotos) &&
            produk.fotos.length > 0
        ) {
            return produk.fotos[0]?.foto || null;
        }

        return null;
    };

    const getFotoUrl = (produk) => {
        const foto = getFotoProduk(produk);

        if (!foto) {
            return "/images/no-image.png";
        }

        if (
            foto.startsWith("http://") ||
            foto.startsWith("https://")
        ) {
            return foto;
        }

        const cleanFoto = foto
            .replace(/^\/+/, "")
            .replace(/^storage\//, "")
            .replace(/^produk\//, "");

        return `http://127.0.0.1:8000/produk/${cleanFoto}`;
    };

    const handleHapus = async (produkId) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Hapus Wishlist?",
            text: "Produk akan dihapus dari wishlist.",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setDeletingId(produkId);

            await hapusWishlist(produkId);

            setWishlist((current) =>
                current.filter((item) => {
                    const produk =
                        item?.produk || item;

                    const itemProdukId =
                        produk?.id ||
                        item?.produk_id;

                    return (
                        String(itemProdukId) !==
                        String(produkId)
                    );
                })
            );

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    "Produk berhasil dihapus dari wishlist.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Gagal menghapus wishlist:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Produk gagal dihapus dari wishlist.",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="wishlist-page">
                <Loading />
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <div>
                        <span className="wishlist-label">
                            Produk pilihanmu
                        </span>

                        <h1>Wishlist</h1>

                        <p>
                            Simpan produk yang ingin kamu
                            beli nanti.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/belanja"
                        className="wishlist-shopping-button"
                    >
                        <i className="bi bi-bag"></i>
                        Lanjut Belanja
                    </Link>
                </div>

                {wishlist.length === 0 ? (
                    <div className="wishlist-empty">
                        <div className="wishlist-empty-icon">
                            <i className="bi bi-heart"></i>
                        </div>

                        <h2>
                            Wishlist masih kosong
                        </h2>

                        <p>
                            Belum ada produk yang kamu
                            simpan ke wishlist.
                        </p>

                        <Link
                            to="/pelanggan/belanja"
                            className="wishlist-empty-button"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map((item) => {
                            const produk =
                                item?.produk || item;

                            const produkId =
                                produk?.id ||
                                item?.produk_id;

                            return (
                                <article
                                    className="wishlist-card"
                                    key={
                                        item?.id ||
                                        item?.id_wishlist ||
                                        produkId
                                    }
                                >
                                    <div className="wishlist-image">
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
                                                if (
                                                    event
                                                        .currentTarget
                                                        .src.includes(
                                                            "no-image.png"
                                                        )
                                                ) {
                                                    return;
                                                }

                                                event.currentTarget.src =
                                                    "/images/no-image.png";
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="wishlist-remove-button"
                                            onClick={() =>
                                                handleHapus(
                                                    produkId
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                produkId
                                            }
                                            title="Hapus dari wishlist"
                                        >
                                            <i className="bi bi-heart-fill"></i>
                                        </button>
                                    </div>

                                    <div className="wishlist-content">
                                        <span className="wishlist-category">
                                            {produk?.kategori
                                                ?.nama_kategori ||
                                                "Produk"}
                                        </span>

                                        <h2>
                                            {produk?.nama_produk ||
                                                "Nama Produk"}
                                        </h2>

                                        <p className="wishlist-price">
                                            {formatRupiah(
                                                produk?.harga
                                            )}
                                        </p>

                                        <div className="wishlist-actions">
                                            <Link
                                                to={`/pelanggan/detail/${produkId}`}
                                                className="wishlist-detail-button"
                                            >
                                                <i className="bi bi-eye"></i>
                                                Lihat Detail
                                            </Link>

                                            <button
                                                type="button"
                                                className="wishlist-delete-button"
                                                onClick={() =>
                                                    handleHapus(
                                                        produkId
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    produkId
                                                }
                                            >
                                                <i className="bi bi-trash"></i>

                                                {deletingId ===
                                                produkId
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

export default WishlistPage;