import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getTrackingPesanan } from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import "./TrackingPage.css";

function TrackingPage() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [tracking, setTracking] = useState(null);

    const loadTracking = async () => {
        try {
            setLoading(true);

            const response =
                await getTrackingPesanan(id);

            const result =
                response?.data || response;

            setTracking(result);
        } catch (error) {
            console.error(
                "Gagal memuat tracking:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Data tracking pesanan gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadTracking();
        }
    }, [id]);

    const formatTanggal = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    const formatTanggalWaktu = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    if (loading) {
        return (
            <div className="tracking-page">
                <Loading />
            </div>
        );
    }

    const data =
        tracking?.data ||
        tracking ||
        {};

    const pengiriman =
        data?.pengiriman ||
        data;

    const transaksi =
        data?.transaksi ||
        pengiriman?.transaksi ||
        {};

    const kodeTransaksi =
        transaksi?.kode_transaksi ||
        data?.kode_transaksi ||
        `#${id}`;

    const status =
        pengiriman?.status ||
        "menunggu";

    const statusLower = String(
        status
    ).toLowerCase();

    const nomorResi =
        pengiriman?.nomor_resi ||
        pengiriman?.resi ||
        "-";

    const kurir =
        pengiriman?.kurir ||
        "-";

    const layanan =
        pengiriman?.layanan ||
        "-";

    const ongkir =
        Number(
            pengiriman?.ongkir ||
                transaksi?.ongkir ||
                0
        );

    const isMenunggu =
        statusLower === "menunggu" ||
        statusLower === "pending";

    const isDiproses =
        statusLower === "diproses" ||
        statusLower === "processing";

    const isDikirim =
        statusLower === "dikirim" ||
        statusLower === "shipped";

    const isSelesai =
        statusLower === "selesai" ||
        statusLower === "diterima" ||
        statusLower === "delivered";

    const isBatal =
        statusLower === "batal" ||
        statusLower === "dibatalkan" ||
        statusLower === "cancelled";

    const steps = [
        {
            key: "menunggu",
            title: "Pesanan Diterima",
            description:
                "Pesanan telah dibuat dan menunggu proses.",
            active:
                isMenunggu ||
                isDiproses ||
                isDikirim ||
                isSelesai,
        },
        {
            key: "diproses",
            title: "Pesanan Diproses",
            description:
                "Pesanan sedang dipersiapkan oleh toko.",
            active:
                isDiproses ||
                isDikirim ||
                isSelesai,
        },
        {
            key: "dikirim",
            title: "Pesanan Dikirim",
            description:
                "Pesanan sedang dalam perjalanan.",
            active:
                isDikirim ||
                isSelesai,
        },
        {
            key: "selesai",
            title: "Pesanan Selesai",
            description:
                "Pesanan telah selesai diterima.",
            active: isSelesai,
        },
    ];

    return (
        <div className="tracking-page">
            <div className="tracking-container">
                <div className="tracking-header">
                    <div>
                        <span className="tracking-label">
                            Pengiriman Pesanan
                        </span>

                        <h1>
                            Lacak Pesanan
                        </h1>

                        <p>
                            Pantau status dan informasi
                            pengiriman pesanan kamu.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan/riwayat"
                        className="tracking-back-button"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Riwayat Pesanan
                    </Link>
                </div>

                <div className="tracking-layout">
                    <main className="tracking-main">
                        <section className="tracking-section">
                            <div className="tracking-section-header">
                                <div>
                                    <span className="tracking-section-number">
                                        1
                                    </span>

                                    <div>
                                        <h2>
                                            Status Pesanan
                                        </h2>

                                        <p>
                                            Informasi terbaru
                                            mengenai pesanan.
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`tracking-current-status ${
                                        isSelesai
                                            ? "tracking-status-success"
                                            : isBatal
                                            ? "tracking-status-danger"
                                            : "tracking-status-process"
                                    }`}
                                >
                                    {status}
                                </span>
                            </div>

                            {isBatal ? (
                                <div className="tracking-cancelled">
                                    <div className="tracking-cancelled-icon">
                                        <i className="bi bi-x-circle"></i>
                                    </div>

                                    <div>
                                        <h3>
                                            Pesanan Dibatalkan
                                        </h3>

                                        <p>
                                            Pesanan ini telah
                                            dibatalkan dan
                                            proses pengiriman
                                            tidak dilanjutkan.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="tracking-timeline">
                                    {steps.map(
                                        (
                                            step,
                                            index
                                        ) => (
                                            <div
                                                className={`tracking-step ${
                                                    step.active
                                                        ? "active"
                                                        : ""
                                                } ${
                                                    index ===
                                                    steps.length -
                                                        1
                                                        ? "last"
                                                        : ""
                                                }`}
                                                key={
                                                    step.key
                                                }
                                            >
                                                <div className="tracking-step-line"></div>

                                                <div className="tracking-step-icon">
                                                    {step.active ? (
                                                        <i className="bi bi-check"></i>
                                                    ) : (
                                                        <span>
                                                            {index +
                                                                1}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="tracking-step-content">
                                                    <h3>
                                                        {
                                                            step.title
                                                        }
                                                    </h3>

                                                    <p>
                                                        {
                                                            step.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </section>

                        <section className="tracking-section">
                            <div className="tracking-section-header">
                                <div>
                                    <span className="tracking-section-number">
                                        2
                                    </span>

                                    <div>
                                        <h2>
                                            Informasi Pengiriman
                                        </h2>

                                        <p>
                                            Detail jasa
                                            pengiriman pesanan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="tracking-info-grid">
                                <div className="tracking-info-card">
                                    <span>
                                        Nomor Resi
                                    </span>

                                    <strong>
                                        {nomorResi}
                                    </strong>
                                </div>

                                <div className="tracking-info-card">
                                    <span>
                                        Kurir
                                    </span>

                                    <strong>
                                        {kurir}
                                    </strong>
                                </div>

                                <div className="tracking-info-card">
                                    <span>
                                        Layanan
                                    </span>

                                    <strong>
                                        {layanan}
                                    </strong>
                                </div>

                                <div className="tracking-info-card">
                                    <span>
                                        Ongkir
                                    </span>

                                    <strong>
                                        Rp{" "}
                                        {ongkir.toLocaleString(
                                            "id-ID"
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="tracking-resi-box">
                                <div className="tracking-resi-icon">
                                    <i className="bi bi-truck"></i>
                                </div>

                                <div>
                                    <span>
                                        Nomor Resi
                                    </span>

                                    <strong>
                                        {nomorResi}
                                    </strong>

                                    <p>
                                        Gunakan nomor resi
                                        untuk melakukan
                                        pengecekan pengiriman
                                        pada layanan kurir
                                        apabila tersedia.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="tracking-section">
                            <div className="tracking-section-header">
                                <div>
                                    <span className="tracking-section-number">
                                        3
                                    </span>

                                    <div>
                                        <h2>
                                            Detail Transaksi
                                        </h2>

                                        <p>
                                            Informasi transaksi
                                            yang terkait dengan
                                            pengiriman.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="tracking-transaction">
                                <div className="tracking-transaction-row">
                                    <span>
                                        Kode Transaksi
                                    </span>

                                    <strong>
                                        {
                                            kodeTransaksi
                                        }
                                    </strong>
                                </div>

                                <div className="tracking-transaction-row">
                                    <span>
                                        Tanggal Transaksi
                                    </span>

                                    <strong>
                                        {formatTanggal(
                                            transaksi?.tanggal_transaksi ||
                                                transaksi?.created_at
                                        )}
                                    </strong>
                                </div>

                                <div className="tracking-transaction-row">
                                    <span>
                                        Total Transaksi
                                    </span>

                                    <strong>
                                        Rp{" "}
                                        {Number(
                                            transaksi?.total_harga ||
                                                0
                                        ).toLocaleString(
                                            "id-ID"
                                        )}
                                    </strong>
                                </div>

                                <div className="tracking-transaction-row">
                                    <span>
                                        Status Transaksi
                                    </span>

                                    <strong>
                                        {transaksi?.status ||
                                            status}
                                    </strong>
                                </div>

                                <div className="tracking-transaction-row">
                                    <span>
                                        Terakhir Diperbarui
                                    </span>

                                    <strong>
                                        {formatTanggalWaktu(
                                            pengiriman?.updated_at
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </section>
                    </main>

                    <aside className="tracking-sidebar">
                        <div className="tracking-summary">
                            <h2>
                                Ringkasan
                            </h2>

                            <div className="tracking-summary-code">
                                <span>
                                    Kode Pesanan
                                </span>

                                <strong>
                                    {kodeTransaksi}
                                </strong>
                            </div>

                            <div className="tracking-summary-divider"></div>

                            <div className="tracking-summary-status">
                                <div className="tracking-summary-status-icon">
                                    <i className="bi bi-box-seam"></i>
                                </div>

                                <div>
                                    <span>
                                        Status Saat Ini
                                    </span>

                                    <strong>
                                        {status}
                                    </strong>
                                </div>
                            </div>

                            <div className="tracking-summary-divider"></div>

                            <div className="tracking-summary-item">
                                <span>
                                    Kurir
                                </span>

                                <strong>
                                    {kurir}
                                </strong>
                            </div>

                            <div className="tracking-summary-item">
                                <span>
                                    Nomor Resi
                                </span>

                                <strong>
                                    {nomorResi}
                                </strong>
                            </div>

                            <div className="tracking-secure-info">
                                <i className="bi bi-info-circle"></i>

                                <span>
                                    Status pengiriman
                                    diperbarui oleh toko
                                    sesuai proses
                                    pengiriman pesanan.
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default TrackingPage;
