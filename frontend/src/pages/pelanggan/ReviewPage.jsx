import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getReview,
    kirimReview,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import "./ReviewPage.css";

function ReviewPage() {
    const { detailTransaksiId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [foto, setFoto] = useState(null);

    const loadReview = async () => {
        try {
            setLoading(true);

            const response =
                await getReview(detailTransaksiId);

            const result =
                response?.data || response;

            setData(result);
        } catch (error) {
            console.error(
                "Gagal memuat data review:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Data review tidak dapat dimuat.",
            }).then(() => {
                navigate("/pelanggan/riwayat");
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (detailTransaksiId) {
            loadReview();
        }
    }, [detailTransaksiId]);

    const getDetail = () => {
        return (
            data?.detail_transaksi ||
            data?.detailTransaksi ||
            data?.detail ||
            data
        );
    };

    const getProduk = () => {
        const detail = getDetail();

        return (
            detail?.produk ||
            data?.produk ||
            null
        );
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const getImageUrl = (produk) => {
        const fotoProduk =
            produk?.fotos?.[0]?.foto ||
            produk?.foto ||
            null;

        if (!fotoProduk) {
            return "/images/no-image.png";
        }

        if (
            fotoProduk.startsWith("http://") ||
            fotoProduk.startsWith("https://")
        ) {
            return fotoProduk;
        }

        if (
            fotoProduk.startsWith("/storage/")
        ) {
            return fotoProduk;
        }

        return `/storage/${fotoProduk}`;
    };

    const handleFotoChange = (event) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            setFoto(null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: "warning",
                title: "Format Tidak Didukung",
                text:
                    "Gunakan foto JPG, JPEG, PNG, atau WEBP.",
            });

            event.target.value = "";
            setFoto(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: "warning",
                title: "Ukuran Terlalu Besar",
                text:
                    "Ukuran foto maksimal 5 MB.",
            });

            event.target.value = "";
            setFoto(null);
            return;
        }

        setFoto(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (rating < 1) {
            Swal.fire({
                icon: "warning",
                title: "Rating Belum Dipilih",
                text:
                    "Silakan pilih rating terlebih dahulu.",
            });

            return;
        }

        if (!review.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Review Kosong",
                text:
                    "Silakan tuliskan review produk.",
            });

            return;
        }

        if (review.trim().length > 1000) {
            Swal.fire({
                icon: "warning",
                title: "Review Terlalu Panjang",
                text:
                    "Review maksimal 1000 karakter.",
            });

            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();

            formData.append(
                "rating",
                rating
            );

            formData.append(
                "review",
                review.trim()
            );

            if (foto) {
                formData.append(
                    "foto[]",
                    foto
                );
            }

            await kirimReview(
                detailTransaksiId,
                formData
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    "Review berhasil dikirim.",
            });

            navigate(
                "/pelanggan/riwayat"
            );
        } catch (error) {
            console.error(
                "Gagal mengirim review:",
                error
            );

            const errors =
                error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                "Review gagal dikirim.";

            if (errors) {
                const firstError =
                    Object.values(errors)
                        .flat()
                        .find(Boolean);

                if (firstError) {
                    message = firstError;
                }
            }

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="review-page">
                <Loading />
            </div>
        );
    }

    const produk = getProduk();
    const detail = getDetail();

    return (
        <div className="review-page">
            <div className="review-container">
                <div className="review-header">
                    <div>
                        <span className="review-label">
                            Berikan Penilaian
                        </span>

                        <h1>
                            Review Produk
                        </h1>

                        <p>
                            Bagikan pengalaman kamu
                            setelah membeli produk ini.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/riwayat"
                        className="review-back-button"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Kembali
                    </Link>
                </div>

                <div className="review-content">
                    <div className="review-product-card">
                        <div className="review-product-image">
                            <img
                                src={getImageUrl(
                                    produk
                                )}
                                alt={
                                    produk?.nama_produk ||
                                    "Produk"
                                }
                                onError={(event) => {
                                    event.currentTarget.src =
                                        "/images/no-image.png";
                                }}
                            />
                        </div>

                        <div className="review-product-info">
                            <span>
                                {produk?.kategori
                                    ?.nama_kategori ||
                                    "Produk"}
                            </span>

                            <h2>
                                {produk?.nama_produk ||
                                    "Produk"}
                            </h2>

                            <p>
                                {produk?.harga
                                    ? formatRupiah(
                                          produk.harga
                                      )
                                    : ""}
                            </p>

                            {detail?.jumlah && (
                                <small>
                                    Jumlah:{" "}
                                    {detail.jumlah}
                                </small>
                            )}
                        </div>
                    </div>

                    <form
                        className="review-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="review-form-section">
                            <label>
                                Rating Produk
                            </label>

                            <div className="review-stars">
                                {[1, 2, 3, 4, 5].map(
                                    (value) => (
                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                value <=
                                                (hoverRating ||
                                                    rating)
                                                    ? "review-star active"
                                                    : "review-star"
                                            }
                                            onMouseEnter={() =>
                                                setHoverRating(
                                                    value
                                                )
                                            }
                                            onMouseLeave={() =>
                                                setHoverRating(
                                                    0
                                                )
                                            }
                                            onClick={() =>
                                                setRating(
                                                    value
                                                )
                                            }
                                            aria-label={`Rating ${value}`}
                                        >
                                            <i className="bi bi-star-fill"></i>
                                        </button>
                                    )
                                )}
                            </div>

                            <div className="review-rating-text">
                                {rating === 0
                                    ? "Pilih rating"
                                    : rating === 1
                                    ? "Sangat buruk"
                                    : rating === 2
                                    ? "Kurang"
                                    : rating === 3
                                    ? "Cukup"
                                    : rating === 4
                                    ? "Bagus"
                                    : "Sangat bagus"}
                            </div>
                        </div>

                        <div className="review-form-section">
                            <label htmlFor="review">
                                Review
                            </label>

                            <textarea
                                id="review"
                                value={review}
                                onChange={(event) =>
                                    setReview(
                                        event.target.value
                                    )
                                }
                                maxLength={1000}
                                rows={7}
                                placeholder="Tuliskan pengalaman kamu terhadap produk ini..."
                            />

                            <div className="review-character-count">
                                {review.length}/1000
                            </div>
                        </div>

                        <div className="review-form-section">
                            <label htmlFor="foto">
                                Foto Produk
                            </label>

                            <div className="review-upload">
                                <input
                                    id="foto"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={
                                        handleFotoChange
                                    }
                                />

                                <div className="review-upload-info">
                                    <i className="bi bi-image"></i>

                                    <div>
                                        <strong>
                                            Tambahkan Foto
                                        </strong>

                                        <span>
                                            JPG, JPEG, PNG,
                                            atau WEBP
                                            maksimal 5 MB
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {foto && (
                                <div className="review-file-name">
                                    <i className="bi bi-paperclip"></i>

                                    <span>
                                        {foto.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="review-form-actions">
                            <Link
                                to="/pelanggan/riwayat"
                                className="review-cancel-button"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                className="review-submit-button"
                                disabled={
                                    submitting
                                }
                            >
                                <i className="bi bi-send"></i>

                                {submitting
                                    ? "Mengirim..."
                                    : "Kirim Review"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReviewPage;
