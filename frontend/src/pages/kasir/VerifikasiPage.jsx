import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getTransaksiKasirById,
    verifikasiTransaksiKasir,
} from "../../api/transaksi";

import Loading from "../../components/common/Loading";

import "./Verifikasi.css";

function VerifikasiPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transaksi, setTransaksi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        loadTransaksi();
    }, [id]);

    const loadTransaksi = async () => {
        setLoading(true);

        try {
            const response =
                await getTransaksiKasirById(id);

            const data =
                response?.data || response;

            setTransaksi(data);

            setVerified(
                data?.status === "Diproses" ||
                data?.status === "Selesai"
            );
        } catch (error) {
            console.error(
                "Gagal mengambil transaksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Data transaksi gagal dimuat.",
            });

            navigate("/kasir/transaksi");
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value) || 0);
    };

    const handleVerify = async () => {
        if (verifying || verified) {
            return;
        }

        setVerifying(true);

        try {
            const response =
                await verifikasiTransaksiKasir(id);

            setVerified(true);

            setTransaksi((previous) => ({
                ...previous,
                ...(response?.data || {}),
                status:
                    response?.data?.status ||
                    "Diproses",
            }));

            await Swal.fire({
                icon: "success",
                title: "Transaksi Terverifikasi",
                text:
                    response?.message ||
                    "Data transaksi dan pembayaran telah diverifikasi.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Gagal memverifikasi transaksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Transaksi gagal diverifikasi.",
            });
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="transaksi-page">
                <Loading />
            </div>
        );
    }

    if (!transaksi) {
        return null;
    }

    const detailItems =
        transaksi.detail_transaksi ||
        transaksi.detailTransaksi ||
        [];

    return (
        <div className="transaksi-page">
            <div className="transaksi-page-header">
                <div>
                    <h1>Verifikasi Transaksi</h1>

                    <p>
                        Periksa kembali data transaksi sebelum diselesaikan
                    </p>
                </div>

                <button
                    type="button"
                    className="transaksi-secondary-button"
                    onClick={() =>
                        navigate(
                            `/kasir/transaksi/detail/${transaksi.id}`
                        )
                    }
                >
                    <i className="bi bi-arrow-left"></i>
                    Kembali
                </button>
            </div>

            <div className="transaksi-card">
                <div className="transaksi-card-header">
                    <h2>Data Transaksi</h2>

                    <span
                        className={
                            verified
                                ? "transaksi-status success"
                                : "transaksi-status warning"
                        }
                    >
                        {verified
                            ? "Terverifikasi"
                            : "Belum Diverifikasi"}
                    </span>
                </div>

                <div className="transaksi-info-grid">
                    <div>
                        <span>Kode Transaksi</span>

                        <strong>
                            {transaksi.kode_transaksi || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>Kasir</span>

                        <strong>
                            {transaksi.user?.name || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>Total Harga</span>

                        <strong>
                            {formatRupiah(
                                transaksi.total_harga
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Uang Bayar</span>

                        <strong>
                            {formatRupiah(
                                transaksi.bayar
                            )}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="transaksi-card">
                <div className="transaksi-card-header">
                    <h2>Produk</h2>

                    <span>
                        {detailItems.length} produk
                    </span>
                </div>

                <div className="transaksi-detail-table-wrapper">
                    <table className="transaksi-detail-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Produk</th>
                                <th>Ukuran</th>
                                <th>Warna</th>
                                <th>Jumlah</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {detailItems.map(
                                (item, index) => (
                                    <tr
                                        key={
                                            item.id ||
                                            `${item.stok_id}-${index}`
                                        }
                                    >
                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {item.produk
                                                ?.nama_produk ||
                                                "-"}
                                        </td>

                                        <td>
                                            {item.stok
                                                ?.ukuran
                                                ?.nama_ukuran ||
                                                "-"}
                                        </td>

                                        <td>
                                            {item.stok
                                                ?.warna
                                                ?.nama_warna ||
                                                "-"}
                                        </td>

                                        <td>
                                            {item.jumlah}
                                        </td>

                                        <td>
                                            {formatRupiah(
                                                item.subtotal
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="transaksi-card">
                <div className="transaksi-summary transaksi-detail-summary">
                    <div>
                        <span>Total</span>

                        <strong>
                            {formatRupiah(
                                transaksi.total_harga
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Bayar</span>

                        <strong>
                            {formatRupiah(
                                transaksi.bayar
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Kembalian</span>

                        <strong>
                            {formatRupiah(
                                transaksi.kembalian
                            )}
                        </strong>
                    </div>
                </div>

                <div className="transaksi-verification-actions">
                    {!verified ? (
                        <button
                            type="button"
                            className="transaksi-submit-button"
                            onClick={handleVerify}
                            disabled={verifying}
                        >
                            <i className="bi bi-check-circle"></i>

                            {verifying
                                ? "Memverifikasi..."
                                : "Verifikasi Transaksi"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="transaksi-submit-button"
                            onClick={() =>
                                navigate(
                                    `/kasir/transaksi/selesai/${transaksi.id}`
                                )
                            }
                        >
                            <i className="bi bi-arrow-right-circle"></i>
                            Lanjutkan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifikasiPage;