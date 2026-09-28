import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTransaksiKasirById } from "../../api/transaksi";

import Loading from "../../components/common/Loading";

import "./Struk.css";

function StrukPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transaksi, setTransaksi] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransaksi();
    }, [id]);

    const loadTransaksi = async () => {
        try {
            const response =
                await getTransaksiKasirById(id);

            setTransaksi(
                response?.data || response
            );
        } catch (error) {
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
            month: "2-digit",
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
        <div className="transaksi-page struk-page">
            <div className="transaksi-page-header struk-page-actions">
                <div>
                    <h1>Struk Transaksi</h1>

                    <p>
                        Bukti transaksi penjualan
                    </p>
                </div>

                <div className="transaksi-header-actions">
                    <button
                        type="button"
                        className="transaksi-secondary-button"
                        onClick={() =>
                            navigate(
                                `/kasir/transaksi/selesai/${transaksi.id}`
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
                            window.print()
                        }
                    >
                        <i className="bi bi-printer"></i>
                        Cetak
                    </button>
                </div>
            </div>

            <div className="struk-paper">
                <div className="struk-header">
                    <h2>BRANDFORGE</h2>

                    <span>
                        Penjualan Produk Football
                    </span>
                </div>

                <div className="struk-divider"></div>

                <div className="struk-info">
                    <div>
                        <span>Kode</span>

                        <strong>
                            {transaksi.kode_transaksi}
                        </strong>
                    </div>

                    <div>
                        <span>Tanggal</span>

                        <strong>
                            {formatTanggal(
                                transaksi.tanggal_transaksi
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Kasir</span>

                        <strong>
                            {transaksi.user?.name ||
                                "-"}
                        </strong>
                    </div>
                </div>

                <div className="struk-divider"></div>

                <div className="struk-items">
                    {detailItems.map(
                        (item, index) => (
                            <div
                                className="struk-item"
                                key={
                                    item.id ||
                                    `${item.stok_id}-${index}`
                                }
                            >
                                <div className="struk-item-name">
                                    <strong>
                                        {item.produk
                                            ?.nama_produk ||
                                            "-"}
                                    </strong>

                                    <span>
                                        {item.stok
                                            ?.ukuran
                                            ?.nama_ukuran ||
                                            "-"}
                                        {" / "}
                                        {item.stok
                                            ?.warna
                                            ?.nama_warna ||
                                            "-"}
                                    </span>
                                </div>

                                <div className="struk-item-calculation">
                                    <span>
                                        {item.jumlah} x{" "}
                                        {formatRupiah(
                                            item.harga
                                        )}
                                    </span>

                                    <strong>
                                        {formatRupiah(
                                            item.subtotal
                                        )}
                                    </strong>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="struk-divider"></div>

                <div className="struk-total">
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

                <div className="struk-divider"></div>

                <div className="struk-footer">
                    <strong>
                        TERIMA KASIH
                    </strong>

                    <span>
                        Barang yang sudah dibeli tidak dapat dikembalikan tanpa ketentuan yang berlaku.
                    </span>
                </div>
            </div>
        </div>
    );
}

export default StrukPage;