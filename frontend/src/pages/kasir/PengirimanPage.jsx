import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getTransaksiKasirById } from "../../api/transaksi";

import Loading from "../../components/common/Loading";

import "./Pengiriman.css";

function PengirimanPage() {
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

            setTransaksi(
                response?.data || response
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

    const pengiriman =
        transaksi.pengiriman || null;

    return (
        <div className="transaksi-page">
            <div className="transaksi-page-header">
                <div>
                    <h1>Pengiriman</h1>

                    <p>
                        Informasi pengiriman transaksi
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
                    <h2>Informasi Transaksi</h2>
                </div>

                <div className="transaksi-info-grid">
                    <div>
                        <span>Kode Transaksi</span>

                        <strong>
                            {transaksi.kode_transaksi ||
                                "-"}
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
            </div>

            <div className="transaksi-card">
                <div className="transaksi-card-header">
                    <h2>Status Pengiriman</h2>
                </div>

                {!pengiriman ? (
                    <div className="transaksi-empty-cart">
                        <i className="bi bi-truck"></i>

                        <strong>
                            Tidak Ada Pengiriman
                        </strong>

                        <span>
                            Transaksi ini belum memiliki data pengiriman.
                        </span>
                    </div>
                ) : (
                    <div className="transaksi-info-grid">
                        <div>
                            <span>Status</span>

                            <strong>
                                {pengiriman.status ||
                                    "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Nomor Resi</span>

                            <strong>
                                {pengiriman.nomor_resi ||
                                    "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Kurir</span>

                            <strong>
                                {pengiriman.kurir ||
                                    "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Layanan</span>

                            <strong>
                                {pengiriman.layanan ||
                                    "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Ongkir</span>

                            <strong>
                                Rp{" "}
                                {new Intl.NumberFormat(
                                    "id-ID"
                                ).format(
                                    Number(
                                        pengiriman.ongkir
                                    ) || 0
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>Catatan</span>

                            <strong>
                                {pengiriman.catatan ||
                                    "-"}
                            </strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PengirimanPage;