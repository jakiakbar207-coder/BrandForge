import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getReview,
    uploadFotoProduk,
} from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import "./UploadFotoProdukPage.css";

function UploadFotoProdukPage() {
    const { transaksiId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);

            const response =
                await getReview(transaksiId);

            const result =
                response?.data || response;

            setData(result);
        } catch (error) {
            console.error(
                "Gagal memuat data produk:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Data transaksi tidak dapat dimuat.",
            }).then(() => {
                navigate("/pelanggan/riwayat");
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (transaksiId) {
            loadData();
        }
    }, [transaksiId]);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

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
            setPreview("");
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
            setPreview("");
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
            setPreview("");
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setFoto(file);
        setPreview(
            URL.createObjectURL(file)
        );
    };

    const handleRemoveFoto = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setFoto(null);
        setPreview("");

        const input =
            document.getElementById(
                "foto-produk"
            );

        if (input) {
            input.value = "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!foto) {
            Swal.fire({
                icon: "warning",
                title: "Foto Belum Dipilih",
                text:
                    "Silakan pilih foto produk terlebih dahulu.",
            });

            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();

            formData.append(
                "foto",
                foto
            );

            await uploadFotoProduk(
                transaksiId,
                formData
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    "Foto produk berhasil diupload.",
            });

            navigate(
                "/pelanggan/riwayat"
            );
        } catch (error) {
            console.error(
                "Gagal upload foto produk:",
                error
            );

            const errors =
                error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                "Foto produk gagal diupload.";

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
            <div className="upload-foto-page">
                <Loading />
            </div>
        );
    }

    const produk = getProduk();
    const detail = getDetail();

    return (
        <div className="upload-foto-page">
            <div className="upload-foto-container">
                <div className="upload-foto-header">
                    <div>
                        <span className="upload-foto-label">
                            Pesanan Selesai
                        </span>

                        <h1>
                            Upload Foto Produk
                        </h1>

                        <p>
                            Bagikan foto produk yang
                            kamu terima.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/riwayat"
                        className="upload-foto-back-button"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Kembali
                    </Link>
                </div>

                <div className="upload-foto-content">
                    <div className="upload-foto-product-card">
                        <div className="upload-foto-product-image">
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

                        <div className="upload-foto-product-info">
                            <span>
                                {produk?.kategori
                                    ?.nama_kategori ||
                                    "Produk"}
                            </span>

                            <h2>
                                {produk?.nama_produk ||
                                    "Produk"}
                            </h2>

                            {detail?.jumlah && (
                                <p>
                                    Jumlah pesanan:{" "}
                                    {detail.jumlah}
                                </p>
                            )}
                        </div>
                    </div>

                    <form
                        className="upload-foto-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="upload-foto-section">
                            <label>
                                Foto Produk
                            </label>

                            {!preview ? (
                                <div className="upload-foto-dropzone">
                                    <input
                                        id="foto-produk"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={
                                            handleFotoChange
                                        }
                                    />

                                    <div className="upload-foto-dropzone-content">
                                        <div className="upload-foto-icon">
                                            <i className="bi bi-cloud-arrow-up"></i>
                                        </div>

                                        <h3>
                                            Pilih Foto Produk
                                        </h3>

                                        <p>
                                            Klik area ini untuk
                                            memilih foto
                                        </p>

                                        <span>
                                            JPG, JPEG, PNG, atau
                                            WEBP • Maksimal 5 MB
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="upload-foto-preview">
                                    <div className="upload-foto-preview-image">
                                        <img
                                            src={preview}
                                            alt="Preview foto produk"
                                        />
                                    </div>

                                    <div className="upload-foto-preview-info">
                                        <div>
                                            <strong>
                                                Foto siap
                                                diupload
                                            </strong>

                                            <span>
                                                {foto?.name}
                                            </span>

                                            <small>
                                                {(
                                                    foto?.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(
                                                    2
                                                )}{" "}
                                                MB
                                            </small>
                                        </div>

                                        <button
                                            type="button"
                                            className="upload-foto-remove-button"
                                            onClick={
                                                handleRemoveFoto
                                            }
                                        >
                                            <i className="bi bi-trash"></i>
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="upload-foto-info-box">
                            <div className="upload-foto-info-icon">
                                <i className="bi bi-info-circle"></i>
                            </div>

                            <div>
                                <strong>
                                    Informasi Upload
                                </strong>

                                <p>
                                    Pastikan foto menampilkan
                                    produk dengan jelas dan
                                    memiliki kualitas yang
                                    baik.
                                </p>

                                <ul>
                                    <li>
                                        Format JPG, JPEG, PNG,
                                        atau WEBP
                                    </li>
                                    <li>
                                        Ukuran maksimal 5 MB
                                    </li>
                                    <li>
                                        Gunakan foto yang sesuai
                                        dengan produk yang
                                        diterima
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="upload-foto-actions">
                            <Link
                                to="/pelanggan/riwayat"
                                className="upload-foto-cancel-button"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                className="upload-foto-submit-button"
                                disabled={
                                    submitting ||
                                    !foto
                                }
                            >
                                <i className="bi bi-cloud-upload"></i>

                                {submitting
                                    ? "Mengupload..."
                                    : "Upload Foto"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadFotoProdukPage;
