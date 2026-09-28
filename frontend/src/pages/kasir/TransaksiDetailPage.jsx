import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getTransaksiKasirById } from "../../api/transaksi";

import Loading from "../../components/common/Loading";

import "./Transaksi.css";

function TransaksiDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transaksi, setTransaksi] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDetail();
    }, [id]);

    const loadDetail = async () => {
        setLoading(true);

        try {
            const response =
                await getTransaksiKasirById(id);

            const data =
                response?.data || response;

            setTransaksi(data);
        } catch (error) {
            console.error(
                "Gagal mengambil detail transaksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Detail transaksi gagal dimuat.",
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

    const formatTanggal = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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
                    <h1>Detail Transaksi</h1>

                    <p>
                        Informasi transaksi penjualan Kasir
                    </p>
                </div>

                <div className="transaksi-header-actions">
                    <button
                        type="button"
                        className="transaksi-secondary-button"
                        onClick={() =>
                            navigate(
                                "/kasir/transaksi"
                            )
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        Kembali
                    </button>

                    <button
                        type="button"
                        className="transaksi-primary-button"
                        onClick={() =>
                            navigate(
                                `/kasir/transaksi/pembayaran/${transaksi.id}`
                            )
                        }
                    >
                        <i className="bi bi-cash-stack"></i>
                        Pembayaran
                    </button>
                </div>
            </div>

            <div className="transaksi-detail-grid">
                <div className="transaksi-card">
                    <div className="transaksi-card-header">
                        <h2>
                            Informasi Transaksi
                        </h2>
                    </div>

                    <div className="transaksi-info-grid">
                        <div>
                            <span>
                                Kode Transaksi
                            </span>

                            <strong>
                                {transaksi.kode_transaksi ||
                                    "-"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Tanggal
                            </span>

                            <strong>
                                {formatTanggal(
                                    transaksi.tanggal_transaksi
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Kasir
                            </span>

                            <strong>
                                {transaksi.user
                                    ?.name ||
                                    "-"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Jumlah Produk
                            </span>

                            <strong>
                                {detailItems.length}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="transaksi-card">
                    <div className="transaksi-card-header">
                        <h2>
                            Ringkasan Pembayaran
                        </h2>
                    </div>

                    <div className="transaksi-summary transaksi-detail-summary">
                        <div>
                            <span>
                                Total Harga
                            </span>

                            <strong>
                                {formatRupiah(
                                    transaksi.total_harga
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Bayar
                            </span>

                            <strong>
                                {formatRupiah(
                                    transaksi.bayar
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Kembalian
                            </span>

                            <strong>
                                {formatRupiah(
                                    transaksi.kembalian
                                )}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="transaksi-card">
                <div className="transaksi-card-header">
                    <h2>
                        Detail Produk
                    </h2>

                    <span>
                        {detailItems.length} produk
                    </span>
                </div>

                {detailItems.length === 0 ? (
                    <div className="transaksi-empty-cart">
                        <i className="bi bi-box-seam"></i>

                        <strong>
                            Tidak Ada Detail Produk
                        </strong>
                    </div>
                ) : (
                    <div className="transaksi-detail-table-wrapper">
                        <table className="transaksi-detail-table">
                            <thead>
                                <tr>
                                    <th>
                                        No
                                    </th>

                                    <th>
                                        Produk
                                    </th>

                                    <th>
                                        Ukuran
                                    </th>

                                    <th>
                                        Warna
                                    </th>

                                    <th>
                                        Harga
                                    </th>

                                    <th>
                                        Jumlah
                                    </th>

                                    <th>
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {detailItems.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                item.id ||
                                                `${item.stok_id}-${index}`
                                            }
                                        >
                                            <td>
                                                {index +
                                                    1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {item
                                                        .produk
                                                        ?.nama_produk ||
                                                        "-"}
                                                </strong>
                                            </td>

                                            <td>
                                                {item
                                                    .stok
                                                    ?.ukuran
                                                    ?.nama_ukuran ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {item
                                                    .stok
                                                    ?.warna
                                                    ?.nama_warna ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {formatRupiah(
                                                    item.harga
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    item.jumlah
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    {formatRupiah(
                                                        item.subtotal
                                                    )}
                                                </strong>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TransaksiDetailPage;