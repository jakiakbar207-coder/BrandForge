import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTransaksiKasirById } from "../../api/transaksi";

import Loading from "../../components/common/Loading";

import "./TransaksiSelesai.css";

function TransaksiSelesaiPage() {
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

    return (
        <div className="transaksi-page transaksi-success-page">
            <div className="transaksi-success-card">
                <div className="transaksi-success-icon">
                    <i className="bi bi-check-lg"></i>
                </div>

                <h1>Transaksi Berhasil</h1>

                <p>
                    Transaksi telah berhasil diproses.
                </p>

                <div className="transaksi-success-code">
                    <span>Kode Transaksi</span>

                    <strong>
                        {transaksi.kode_transaksi}
                    </strong>
                </div>

                <div className="transaksi-success-total">
                    <span>Total Pembayaran</span>

                    <strong>
                        {formatRupiah(
                            transaksi.total_harga
                        )}
                    </strong>
                </div>

                <div className="transaksi-success-actions">
                    <button
                        type="button"
                        className="transaksi-primary-button"
                        onClick={() =>
                            navigate(
                                `/kasir/transaksi/struk/${transaksi.id}`
                            )
                        }
                    >
                        <i className="bi bi-receipt"></i>
                        Lihat Struk
                    </button>

                    <button
                        type="button"
                        className="transaksi-secondary-button"
                        onClick={() =>
                            navigate(
                                "/kasir/transaksi/create"
                            )
                        }
                    >
                        <i className="bi bi-plus-lg"></i>
                        Transaksi Baru
                    </button>

                    <button
                        type="button"
                        className="transaksi-link-button"
                        onClick={() =>
                            navigate(
                                "/kasir/transaksi"
                            )
                        }
                    >
                        Kembali ke Transaksi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransaksiSelesaiPage;