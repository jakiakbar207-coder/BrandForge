import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getPelangganDetail,
    beliSekarang,
    tambahKeranjang,
    tambahWishlist,
} from "../../api/pelanggan";

import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

import "./DetailProdukPage.css";

function DetailProdukPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produk, setProduk] = useState(null);
    const [warna, setWarna] = useState([]);
    const [ukuran, setUkuran] = useState([]);
    const [produkTerkait, setProdukTerkait] = useState([]);

    const [selectedWarna, setSelectedWarna] = useState(null);
    const [selectedUkuran, setSelectedUkuran] = useState(null);
    const [jumlah, setJumlah] = useState(1);

    const [selectedImage, setSelectedImage] = useState(0);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadDetail();
    }, [id]);

    const loadDetail = async () => {
        try {
            setLoading(true);

            const response = await getPelangganDetail(id);

            const data = response?.data || response;

            setProduk(data?.produk || null);
            setWarna(data?.warna || []);
            setUkuran(data?.ukuran || []);
            setProdukTerkait(data?.produk_terkait || []);

            setSelectedImage(0);

            if (data?.warna?.length > 0) {
                setSelectedWarna(data.warna[0]);
            } else {
                setSelectedWarna(null);
            }

            if (data?.ukuran?.length > 0) {
                setSelectedUkuran(data.ukuran[0]);
            } else {
                setSelectedUkuran(null);
            }

            setJumlah(1);
        } catch (error) {
            console.error(
                "Gagal memuat detail produk:",
                error
            );

            setProduk(null);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Gagal memuat detail produk.",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const getImageUrl = (foto) => {
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

    const images = useMemo(() => {
        if (!produk) {
            return [];
        }

        const result = [];

        if (produk.foto) {
            result.push(produk.foto);
        }

        if (Array.isArray(produk.fotos)) {
            produk.fotos.forEach((item) => {
                if (
                    item?.foto &&
                    !result.includes(item.foto)
                ) {
                    result.push(item.foto);
                }
            });
        }

        return result;
    }, [produk]);

    const stokData = useMemo(() => {
        if (!produk) {
            return [];
        }

        return (
            produk.stok_data ||
            produk.stokData ||
            []
        );
    }, [produk]);

    const selectedWarnaId =
        selectedWarna?.id_warna ||
        selectedWarna?.id ||
        null;

    const selectedUkuranId =
        selectedUkuran?.id_ukuran ||
        selectedUkuran?.id ||
        null;

    const stokTersedia = useMemo(() => {
        if (!stokData.length) {
            return 0;
        }

        if (
            selectedWarnaId &&
            selectedUkuranId
        ) {
            const stok = stokData.find((item) => {
                const warnaId =
                    item?.warna_id;

                const ukuranId =
                    item?.ukuran_id;

                return (
                    Number(warnaId) ===
                        Number(selectedWarnaId) &&
                    Number(ukuranId) ===
                        Number(selectedUkuranId)
                );
            });

            return Number(stok?.jumlah || 0);
        }

        if (selectedWarnaId) {
            return stokData
                .filter(
                    (item) =>
                        Number(item?.warna_id) ===
                        Number(selectedWarnaId)
                )
                .reduce(
                    (total, item) =>
                        total +
                        Number(item?.jumlah || 0),
                    0
                );
        }

        if (selectedUkuranId) {
            return stokData
                .filter(
                    (item) =>
                        Number(item?.ukuran_id) ===
                        Number(selectedUkuranId)
                )
                .reduce(
                    (total, item) =>
                        total +
                        Number(item?.jumlah || 0),
                    0
                );
        }

        return Number(
            produk?.stok_total || 0
        );
    }, [
        stokData,
        selectedWarnaId,
        selectedUkuranId,
        produk,
    ]);

    const handleSelectWarna = (item) => {
        setSelectedWarna(item);

        const warnaId =
            item?.id_warna ||
            item?.id;

        const ukuranId =
            selectedUkuran?.id_ukuran ||
            selectedUkuran?.id;

        if (
            warnaId &&
            ukuranId
        ) {
            const stok = stokData.find(
                (stock) =>
                    Number(stock?.warna_id) ===
                        Number(warnaId) &&
                    Number(stock?.ukuran_id) ===
                        Number(ukuranId)
            );

            const stokJumlah = Number(
                stok?.jumlah || 0
            );

            if (stokJumlah > 0) {
                setJumlah((current) =>
                    Math.min(
                        current,
                        stokJumlah
                    )
                );
            }
        }
    };

    const handleSelectUkuran = (item) => {
        setSelectedUkuran(item);

        const warnaId =
            selectedWarna?.id_warna ||
            selectedWarna?.id;

        const ukuranId =
            item?.id_ukuran ||
            item?.id;

        if (
            warnaId &&
            ukuranId
        ) {
            const stok = stokData.find(
                (stock) =>
                    Number(stock?.warna_id) ===
                        Number(warnaId) &&
                    Number(stock?.ukuran_id) ===
                        Number(ukuranId)
            );

            const stokJumlah = Number(
                stok?.jumlah || 0
            );

            if (stokJumlah > 0) {
                setJumlah((current) =>
                    Math.min(
                        current,
                        stokJumlah
                    )
                );
            }
        }
    };

    const handleDecrease = () => {
        setJumlah((current) =>
            Math.max(1, current - 1)
        );
    };

    const handleIncrease = () => {
        if (stokTersedia <= 0) {
            return;
        }

        setJumlah((current) =>
            Math.min(
                stokTersedia,
                current + 1
            )
        );
    };

    const validateSelection = () => {
        if (
            warna.length > 0 &&
            !selectedWarna
        ) {
            Swal.fire({
                icon: "warning",
                title: "Pilih Warna",
                text: "Silakan pilih warna produk terlebih dahulu.",
            });

            return false;
        }

        if (
            ukuran.length > 0 &&
            !selectedUkuran
        ) {
            Swal.fire({
                icon: "warning",
                title: "Pilih Ukuran",
                text: "Silakan pilih ukuran produk terlebih dahulu.",
            });

            return false;
        }

        if (stokTersedia <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Stok Habis",
                text: "Produk ini sedang tidak tersedia.",
            });

            return false;
        }

        if (jumlah < 1) {
            Swal.fire({
                icon: "warning",
                title: "Jumlah Tidak Valid",
                text: "Jumlah pembelian minimal 1.",
            });

            return false;
        }

        if (jumlah > stokTersedia) {
            Swal.fire({
                icon: "warning",
                title: "Stok Tidak Cukup",
                text: `Stok tersedia hanya ${stokTersedia}.`,
            });

            setJumlah(stokTersedia);

            return false;
        }

        return true;
    };

    const handleTambahKeranjang = async () => {
        if (!validateSelection()) {
            return;
        }

        try {
            setProcessing(true);

            await tambahKeranjang(
                produk.id,
                {
                    warna_id:
                        selectedWarnaId,
                    ukuran_id:
                        selectedUkuranId,
                    jumlah,
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Produk berhasil ditambahkan ke keranjang.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Gagal menambahkan ke keranjang:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Produk gagal ditambahkan ke keranjang.",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleBeliSekarang = async () => {
        if (!validateSelection()) {
            return;
        }

        try {
            setProcessing(true);

            const response =
                await beliSekarang(
                    produk.id,
                    {
                        warna_id:
                            selectedWarnaId,
                        ukuran_id:
                            selectedUkuranId,
                        jumlah,
                    }
                );

            const transaksiId =
                response?.transaksi?.id ||
                response?.data?.id ||
                response?.id ||
                response?.transaksi_id;

            if (!transaksiId) {
                throw new Error(
                    "ID transaksi tidak ditemukan."
                );
            }

            navigate(
                `/pelanggan/alamat/${transaksiId}`
            );
        } catch (error) {
            console.error(
                "Gagal membeli produk:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Gagal memproses pembelian.",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleWishlist = async () => {
        try {
            await tambahWishlist(
                produk.id
            );

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Produk ditambahkan ke wishlist.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Gagal menambahkan wishlist:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Produk gagal ditambahkan ke wishlist.",
            });
        }
    };

    if (loading) {
        return (
            <Loading
                message="Memuat detail produk..."
                size="large"
            />
        );
    }

    if (!produk) {
        return (
            <EmptyState
                icon="bi-box-seam"
                title="Produk Tidak Ditemukan"
                message="Data produk yang kamu cari tidak tersedia."
            />
        );
    }

    const activeImage =
        images[selectedImage] ||
        produk.foto ||
        null;

    return (
        <div className="detail-produk-page">
            <div className="detail-produk-container">
                <div className="detail-produk-breadcrumb">
                    <Link to="/pelanggan">
                        Beranda
                    </Link>

                    <i className="bi bi-chevron-right"></i>

                    <Link to="/pelanggan/belanja">
                        Belanja
                    </Link>

                    <i className="bi bi-chevron-right"></i>

                    <span>
                        {produk.nama_produk}
                    </span>
                </div>

                <div className="detail-produk-content">
                    <div className="detail-produk-gallery">
                        <div className="detail-produk-main-image-wrapper">
                            {activeImage ? (
                                <img
                                    src={getImageUrl(
                                        activeImage
                                    )}
                                    alt={
                                        produk.nama_produk
                                    }
                                    className="detail-produk-main-image"
                                    onError={(event) => {
                                        event.currentTarget.src =
                                            "/images/no-image.png";
                                    }}
                                />
                            ) : (
                                <div className="detail-produk-no-image">
                                    <i className="bi bi-image"></i>
                                    <span>
                                        Foto tidak tersedia
                                    </span>
                                </div>
                            )}
                        </div>

                        {images.length > 0 && (
                            <div className="detail-produk-thumbnails">
                                {images.map(
                                    (foto, index) => (
                                        <button
                                            type="button"
                                            key={`${foto}-${index}`}
                                            className={`detail-produk-thumbnail ${
                                                selectedImage ===
                                                index
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedImage(
                                                    index
                                                )
                                            }
                                        >
                                            <img
                                                src={getImageUrl(
                                                    foto
                                                )}
                                                alt={`${produk.nama_produk} ${
                                                    index +
                                                    1
                                                }`}
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.src =
                                                        "/images/no-image.png";
                                                }}
                                            />
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="detail-produk-info">
                        <div className="detail-produk-category">
                            {produk?.kategori
                                ?.nama_kategori ||
                                "Produk"}
                        </div>

                        <h1>
                            {produk.nama_produk}
                        </h1>

                        <div className="detail-produk-rating">
                            <div className="detail-produk-stars">
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star"></i>
                            </div>

                            <span>
                                {produk?.reviews?.length ||
                                    0}{" "}
                                ulasan
                            </span>
                        </div>

                        <div className="detail-produk-price">
                            {formatRupiah(
                                produk.harga
                            )}
                        </div>

                        {produk?.koleksi && (
                            <div className="detail-produk-collection">
                                <span>
                                    Koleksi:
                                </span>

                                <strong>
                                    {
                                        produk
                                            .koleksi
                                            .nama_koleksi
                                    }
                                </strong>
                            </div>
                        )}

                        {produk.deskripsi && (
                            <div className="detail-produk-description">
                                <h3>
                                    Deskripsi
                                </h3>

                                <p>
                                    {
                                        produk.deskripsi
                                    }
                                </p>
                            </div>
                        )}

                        {warna.length > 0 && (
                            <div className="detail-produk-option">
                                <div className="detail-produk-option-title">
                                    <span>
                                        Warna
                                    </span>

                                    {selectedWarna && (
                                        <strong>
                                            {selectedWarna.nama_warna}
                                        </strong>
                                    )}
                                </div>

                                <div className="detail-produk-option-list">
                                    {warna.map(
                                        (item) => {
                                            const itemId =
                                                item?.id_warna ||
                                                item?.id;

                                            const active =
                                                Number(
                                                    selectedWarnaId
                                                ) ===
                                                Number(
                                                    itemId
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        itemId
                                                    }
                                                    className={`detail-produk-option-button ${
                                                        active
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleSelectWarna(
                                                            item
                                                        )
                                                    }
                                                >
                                                    {
                                                        item.nama_warna
                                                    }
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}

                        {ukuran.length > 0 && (
                            <div className="detail-produk-option">
                                <div className="detail-produk-option-title">
                                    <span>
                                        Ukuran
                                    </span>

                                    {selectedUkuran && (
                                        <strong>
                                            {selectedUkuran.nama_ukuran}
                                        </strong>
                                    )}
                                </div>

                                <div className="detail-produk-option-list">
                                    {ukuran.map(
                                        (item) => {
                                            const itemId =
                                                item?.id_ukuran ||
                                                item?.id;

                                            const active =
                                                Number(
                                                    selectedUkuranId
                                                ) ===
                                                Number(
                                                    itemId
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        itemId
                                                    }
                                                    className={`detail-produk-option-button ${
                                                        active
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleSelectUkuran(
                                                            item
                                                        )
                                                    }
                                                >
                                                    {
                                                        item.nama_ukuran
                                                    }
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="detail-produk-stock">
                            <span>
                                Stok tersedia
                            </span>

                            <strong>
                                {stokTersedia}
                            </strong>
                        </div>

                        <div className="detail-produk-quantity">
                            <span>
                                Jumlah
                            </span>

                            <div className="detail-produk-quantity-control">
                                <button
                                    type="button"
                                    onClick={
                                        handleDecrease
                                    }
                                    disabled={
                                        jumlah <=
                                        1
                                    }
                                >
                                    <i className="bi bi-dash"></i>
                                </button>

                                <span>
                                    {jumlah}
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        handleIncrease
                                    }
                                    disabled={
                                        stokTersedia <=
                                        0 ||
                                        jumlah >=
                                            stokTersedia
                                    }
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div className="detail-produk-actions">
                            <button
                                type="button"
                                className="detail-produk-cart-button"
                                onClick={
                                    handleTambahKeranjang
                                }
                                disabled={
                                    processing ||
                                    stokTersedia <=
                                        0
                                }
                            >
                                <i className="bi bi-cart-plus"></i>

                                {processing
                                    ? "Memproses..."
                                    : "Tambah ke Keranjang"}
                            </button>

                            <button
                                type="button"
                                className="detail-produk-buy-button"
                                onClick={
                                    handleBeliSekarang
                                }
                                disabled={
                                    processing ||
                                    stokTersedia <=
                                        0
                                }
                            >
                                Beli Sekarang
                            </button>

                            <button
                                type="button"
                                className="detail-produk-wishlist-button"
                                onClick={
                                    handleWishlist
                                }
                                disabled={
                                    processing
                                }
                                title="Tambah ke wishlist"
                            >
                                <i className="bi bi-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {produkTerkait.length > 0 && (
                    <section className="detail-produk-related">
                        <div className="detail-produk-section-header">
                            <div>
                                <span>
                                    Pilihan Lain
                                </span>

                                <h2>
                                    Produk Terkait
                                </h2>
                            </div>

                            <Link to="/pelanggan/belanja">
                                Lihat Semua
                                <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>

                        <div className="detail-produk-related-grid">
                            {produkTerkait.map(
                                (item) => {
                                    const image =
                                        item?.foto ||
                                        item?.fotos?.[0]
                                            ?.foto ||
                                        null;

                                    return (
                                        <Link
                                            key={
                                                item.id
                                            }
                                            to={`/pelanggan/detail/${item.id}`}
                                            className="detail-produk-related-card"
                                        >
                                            <div className="detail-produk-related-image">
                                                {image ? (
                                                    <img
                                                        src={getImageUrl(
                                                            image
                                                        )}
                                                        alt={
                                                            item.nama_produk
                                                        }
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.src =
                                                                "/images/no-image.png";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="detail-produk-no-image">
                                                        <i className="bi bi-image"></i>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="detail-produk-related-info">
                                                <span>
                                                    {item
                                                        ?.kategori
                                                        ?.nama_kategori ||
                                                        "Produk"}
                                                </span>

                                                <h3>
                                                    {
                                                        item.nama_produk
                                                    }
                                                </h3>

                                                <strong>
                                                    {formatRupiah(
                                                        item.harga
                                                    )}
                                                </strong>
                                            </div>
                                        </Link>
                                    );
                                }
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default DetailProdukPage;