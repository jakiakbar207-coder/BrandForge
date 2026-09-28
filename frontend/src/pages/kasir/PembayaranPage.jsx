import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getTransaksiKasirById } from "../../api/transaksi";

import Loading from "../../components/common/Loading";

import "./Pembayaran.css";

function PembayaranPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transaksi, setTransaksi] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    "Data pembayaran gagal dimuat.",
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

    const handlePrint = () => {
        window.print();
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
        <div className="transaksi-page pembayaran-page">
            <div className="transaksi-page-header pembayaran-page-actions">
                <div>
                    <h1>Pembayaran</h1>

                    <p>
                        Detail pembayaran transaksi Kasir
                    </p>
                </div>

                <div className="transaksi-header-actions">
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

                    <button
                        type="button"
                        className="transaksi-primary-button"
                        onClick={handlePrint}
                    >
                        <i className="bi bi-printer"></i>
                        Cetak Struk
                    </button>
                </div>
            </div>

            <div className="pembayaran-receipt">
                <div className="pembayaran-receipt-header">
                    <h2>BRANDFORGE</h2>

                    <p>
                        Bukti Pembayaran
                    </p>
                </div>

                <div className="pembayaran-receipt-info">
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
                </div>

                <div className="pembayaran-receipt-items">
                    {detailItems.map(
                        (item, index) => (
                            <div
                                className="pembayaran-receipt-item"
                                key={
                                    item.id ||
                                    `${item.stok_id}-${index}`
                                }
                            >
                                <div>
                                    <strong>
                                        {item
                                            .produk
                                            ?.nama_produk ||
                                            "-"}
                                    </strong>

                                    <span>
                                        {item
                                            .stok
                                            ?.ukuran
                                            ?.nama_ukuran ||
                                            "-"}
                                        {" • "}
                                        {item
                                            .stok
                                            ?.warna
                                            ?.nama_warna ||
                                            "-"}
                                    </span>

                                    <span>
                                        {item.jumlah} x{" "}
                                        {formatRupiah(
                                            item.harga
                                        )}
                                    </span>
                                </div>

                                <strong>
                                    {formatRupiah(
                                        item.subtotal
                                    )}
                                </strong>
                            </div>
                        )
                    )}
                </div>

                <div className="pembayaran-receipt-total">
                    <div>
                        <span>
                            Total
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

                <div className="pembayaran-receipt-footer">
                    <strong>
                        Pembayaran berhasil
                    </strong>

                    <span>
                        Terima kasih telah berbelanja di BrandForge.
                    </span>
                </div>
            </div>
        </div>
    );
}

export default PembayaranPage;