import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getPelangganBelanja,
    tambahWishlist,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import "./BelanjaPage.css";

const LARAVEL_URL = "http://127.0.0.1:8000";

function BelanjaPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [kategoriId, setKategoriId] = useState(
        searchParams.get("kategori_id") || ""
    );

    const [koleksiId, setKoleksiId] = useState(
        searchParams.get("koleksi_id") || ""
    );

    const [warnaId, setWarnaId] = useState(
        searchParams.get("warna_id") || ""
    );

    const [ukuranId, setUkuranId] = useState(
        searchParams.get("ukuran_id") || ""
    );

    const [harga, setHarga] = useState(
        searchParams.get("harga") || ""
    );

    const loadProduk = async () => {
        try {
            setLoading(true);

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (kategoriId) {
                params.kategori_id = kategoriId;
            }

            if (koleksiId) {
                params.koleksi_id = koleksiId;
            }

            if (warnaId) {
                params.warna_id = warnaId;
            }

            if (ukuranId) {
                params.ukuran_id = ukuranId;
            }

            if (harga) {
                params.harga = harga;
            }

            const response = await getPelangganBelanja(params);

            setData(response?.data || response);
        } catch (error) {
            console.error(
                "Gagal memuat produk:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat data produk.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProduk();
    }, []);

    const handleFilter = async (event) => {
        event.preventDefault();

        const params = {};

        if (search.trim()) {
            params.search = search.trim();
        }

        if (kategoriId) {
            params.kategori_id = kategoriId;
        }

        if (koleksiId) {
            params.koleksi_id = koleksiId;
        }

        if (warnaId) {
            params.warna_id = warnaId;
        }

        if (ukuranId) {
            params.ukuran_id = ukuranId;
        }

        if (harga) {
            params.harga = harga;
        }

        setSearchParams(params);

        try {
            setLoading(true);

            const response =
                await getPelangganBelanja(params);

            setData(response?.data || response);
        } catch (error) {
            console.error(
                "Gagal menerapkan filter:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal menerapkan filter produk.",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetFilter = async () => {
        setSearch("");
        setKategoriId("");
        setKoleksiId("");
        setWarnaId("");
        setUkuranId("");
        setHarga("");

        setSearchParams({});

        try {
            setLoading(true);

            const response =
                await getPelangganBelanja();

            setData(response?.data || response);
        } catch (error) {
            console.error(
                "Gagal mereset filter:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat ulang produk.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleWishlist = async (produkId) => {
        if (!produkId) {
            return;
        }

        try {
            await tambahWishlist(produkId);

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Produk berhasil ditambahkan ke wishlist.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Produk gagal ditambahkan ke wishlist.",
            });
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const getFotoUrl = (foto) => {
        if (!foto) {
            return "";
        }

        const fotoString = String(foto).trim();

        if (!fotoString) {
            return "";
        }

        if (/^https?:\/\//i.test(fotoString)) {
            return fotoString;
        }

        const cleanPath = fotoString.replace(/^\/+/, "");

        if (cleanPath.startsWith("produk/")) {
            return `${LARAVEL_URL}/${cleanPath}`;
        }

        return `${LARAVEL_URL}/produk/${cleanPath}`;
    };

    const produk = Array.isArray(data?.produk)
        ? data.produk
        : [];

    const kategori = Array.isArray(data?.kategori)
        ? data.kategori
        : [];

    const koleksi = Array.isArray(data?.koleksi)
        ? data.koleksi
        : [];

    const warna = Array.isArray(data?.warna)
        ? data.warna
        : [];

    const ukuran = Array.isArray(data?.ukuran)
        ? data.ukuran
        : [];

    if (loading && !data) {
        return (
            <div className="belanja-page">
                <Loading message="Memuat produk..." />
            </div>
        );
    }

    return (
        <div className="belanja-page">
            <div className="belanja-container">
                <div className="belanja-header">
                    <div className="belanja-header-content">
                        <span className="belanja-header-label">
                            KOLEKSI PRODUK
                        </span>

                        <h1>Belanja</h1>

                        <p>
                            Temukan produk yang sesuai dengan
                            gaya dan kebutuhan kamu.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan"
                        className="belanja-back-button"
                    >
                        <i className="bi bi-arrow-left"></i>
                        <span>Dashboard</span>
                    </Link>
                </div>

                <div className="belanja-filter-card">
                    <div className="belanja-filter-title">
                        <div className="belanja-filter-title-icon">
                            <i className="bi bi-sliders"></i>
                        </div>

                        <div>
                            <h2>Filter Produk</h2>
                            <p>
                                Gunakan filter untuk menemukan
                                produk yang kamu cari.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleFilter}>
                        <div className="belanja-filter-grid">
                            <div className="belanja-filter-group belanja-filter-search">
                                <label htmlFor="search">
                                    Cari Produk
                                </label>

                                <div className="belanja-input-wrapper">
                                    <i className="bi bi-search"></i>

                                    <input
                                        id="search"
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Cari nama produk..."
                                    />
                                </div>
                            </div>

                            <div className="belanja-filter-group">
                                <label htmlFor="kategori">
                                    Kategori
                                </label>

                                <select
                                    id="kategori"
                                    value={kategoriId}
                                    onChange={(event) =>
                                        setKategoriId(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Semua Kategori
                                    </option>

                                    {kategori.map(
                                        (item, index) => (
                                            <option
                                                key={
                                                    item?.id ??
                                                    `kategori-${index}`
                                                }
                                                value={
                                                    item?.id ??
                                                    ""
                                                }
                                            >
                                                {item?.nama_kategori ||
                                                    "Kategori"}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="belanja-filter-group">
                                <label htmlFor="koleksi">
                                    Koleksi
                                </label>

                                <select
                                    id="koleksi"
                                    value={koleksiId}
                                    onChange={(event) =>
                                        setKoleksiId(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Semua Koleksi
                                    </option>

                                    {koleksi.map(
                                        (item, index) => (
                                            <option
                                                key={
                                                    item?.id ??
                                                    `koleksi-${index}`
                                                }
                                                value={
                                                    item?.id ??
                                                    ""
                                                }
                                            >
                                                {item?.nama_koleksi ||
                                                    "Koleksi"}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="belanja-filter-group">
                                <label htmlFor="warna">
                                    Warna
                                </label>

                                <select
                                    id="warna"
                                    value={warnaId}
                                    onChange={(event) =>
                                        setWarnaId(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Semua Warna
                                    </option>

                                    {warna.map(
                                        (item, index) => (
                                            <option
                                                key={
                                                    item?.id ??
                                                    `warna-${index}`
                                                }
                                                value={
                                                    item?.id ??
                                                    ""
                                                }
                                            >
                                                {item?.nama_warna ||
                                                    "Warna"}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="belanja-filter-group">
                                <label htmlFor="ukuran">
                                    Ukuran
                                </label>

                                <select
                                    id="ukuran"
                                    value={ukuranId}
                                    onChange={(event) =>
                                        setUkuranId(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Semua Ukuran
                                    </option>

                                    {ukuran.map(
                                        (item, index) => (
                                            <option
                                                key={
                                                    item?.id ??
                                                    `ukuran-${index}`
                                                }
                                                value={
                                                    item?.id ??
                                                    ""
                                                }
                                            >
                                                {item?.nama_ukuran ||
                                                    "Ukuran"}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="belanja-filter-group">
                                <label htmlFor="harga">
                                    Rentang Harga
                                </label>

                                <select
                                    id="harga"
                                    value={harga}
                                    onChange={(event) =>
                                        setHarga(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Semua Harga
                                    </option>

                                    <option value="0-100000">
                                        Di bawah Rp100.000
                                    </option>

                                    <option value="100000-250000">
                                        Rp100.000 - Rp250.000
                                    </option>

                                    <option value="250000-500000">
                                        Rp250.000 - Rp500.000
                                    </option>

                                    <option value="500000-1000000">
                                        Rp500.000 - Rp1.000.000
                                    </option>

                                    <option value="1000000">
                                        Di atas Rp1.000.000
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="belanja-filter-actions">
                            <button
                                type="submit"
                                className="belanja-button belanja-button-primary"
                            >
                                <i className="bi bi-search"></i>
                                Terapkan Filter
                            </button>

                            <button
                                type="button"
                                className="belanja-button belanja-button-secondary"
                                onClick={resetFilter}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div className="belanja-content-header">
                    <div>
                        <span className="belanja-section-label">
                            PRODUK TERSEDIA
                        </span>

                        <h2>Temukan Produk Favoritmu</h2>

                        <p>
                            Menampilkan{" "}
                            <strong>{produk.length}</strong>{" "}
                            produk
                        </p>
                    </div>

                    <div className="belanja-product-count">
                        <i className="bi bi-grid-3x3-gap"></i>
                        {produk.length} Produk
                    </div>
                </div>

                {loading ? (
                    <Loading message="Memuat produk..." />
                ) : produk.length === 0 ? (
                    <EmptyState
                        icon="bi-box-seam"
                        title="Produk Tidak Ditemukan"
                        message="Tidak ada produk yang sesuai dengan filter yang dipilih."
                    />
                ) : (
                    <div className="belanja-product-grid">
                        {produk.map((item, index) => {
                            const fotoUrl =
                                getFotoUrl(item?.foto);

                            const produkId =
                                item?.id;

                            return (
                                <article
                                    className="belanja-product-card"
                                    key={
                                        produkId ??
                                        `produk-${index}`
                                    }
                                >
                                    <div className="belanja-product-image">
                                        {fotoUrl ? (
                                            <img
                                                src={fotoUrl}
                                                alt={
                                                    item?.nama_produk ||
                                                    "Produk"
                                                }
                                                loading="lazy"
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.style.display =
                                                        "none";

                                                    const fallback =
                                                        event
                                                            .currentTarget
                                                            .parentElement
                                                            ?.querySelector(
                                                                ".belanja-image-fallback"
                                                            );

                                                    if (
                                                        fallback
                                                    ) {
                                                        fallback.style.display =
                                                            "flex";
                                                    }
                                                }}
                                            />
                                        ) : null}

                                        <div
                                            className="belanja-image-fallback"
                                            style={{
                                                display:
                                                    fotoUrl
                                                        ? "none"
                                                        : "flex",
                                            }}
                                        >
                                            <i className="bi bi-image"></i>
                                            <span>
                                                Foto tidak tersedia
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="belanja-wishlist-button"
                                            onClick={() =>
                                                handleWishlist(
                                                    produkId
                                                )
                                            }
                                            title="Tambah ke Wishlist"
                                        >
                                            <i className="bi bi-heart"></i>
                                        </button>

                                        {Number(
                                            item?.stok_total || 0
                                        ) > 0 && (
                                            <span className="belanja-stock-badge">
                                                Stok Tersedia
                                            </span>
                                        )}
                                    </div>

                                    <div className="belanja-product-body">
                                        <div className="belanja-product-meta">
                                            <span>
                                                {item?.kategori
                                                    ?.nama_kategori ||
                                                    "Produk"}
                                            </span>

                                            {item?.koleksi
                                                ?.nama_koleksi && (
                                                <>
                                                    <span className="belanja-meta-dot">
                                                        •
                                                    </span>

                                                    <span>
                                                        {
                                                            item
                                                                .koleksi
                                                                .nama_koleksi
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <h3>
                                            {item?.nama_produk ||
                                                "Nama Produk"}
                                        </h3>

                                        <div className="belanja-product-price">
                                            {formatRupiah(
                                                item?.harga
                                            )}
                                        </div>

                                        <div className="belanja-product-footer">
                                            <div className="belanja-product-stock">
                                                <i className="bi bi-box-seam"></i>

                                                <span>
                                                    Stok{" "}
                                                    {item?.stok_total ??
                                                        0}
                                                </span>
                                            </div>

                                            <Link
                                                to={`/pelanggan/detail/${produkId}`}
                                                className="belanja-detail-button"
                                            >
                                                <span>
                                                    Lihat Detail
                                                </span>

                                                <i className="bi bi-arrow-right"></i>
                                            </Link>
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

export default BelanjaPage;