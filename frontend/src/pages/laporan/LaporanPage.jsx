import { useEffect, useState } from "react";
import "./LaporanPage.css";
import {
    getLaporan,
    downloadLaporanPdf,
    downloadLaporanExcel,
} from "../../api/laporan";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

function LaporanPage() {
    const [laporan, setLaporan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const loadLaporan = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getLaporan();

            setLaporan(data);
        } catch (err) {
            console.error("Gagal mengambil laporan:", err);

            setError(
                err.response?.data?.message ||
                    "Gagal mengambil data laporan."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLaporan();
    }, []);

    const handleDownloadPdf = async () => {
        try {
            const blob = await downloadLaporanPdf();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "laporan-transaksi.pdf";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Gagal download PDF:", err);

            alert("Gagal mengunduh laporan PDF.");
        }
    };

    const handleDownloadExcel = async () => {
        try {
            const blob = await downloadLaporanExcel();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "laporan_penjualan.xlsx";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Gagal download Excel:", err);

            alert("Gagal mengunduh laporan Excel.");
        }
    };

    if (loading) {
        return (
            <div className="laporan-page">
                <div className="laporan-container">
                    <Loading message="Memuat laporan..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="laporan-page">
                <div className="laporan-container">
                    <EmptyState
                        icon="bi-exclamation-triangle"
                        title="Gagal Memuat Laporan"
                        message={error}
                    />
                </div>
            </div>
        );
    }

    if (!laporan) {
        return (
            <div className="laporan-page">
                <div className="laporan-container">
                    <EmptyState
                        icon="bi-bar-chart-line"
                        title="Belum Ada Data Laporan"
                        message="Data laporan belum tersedia."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="laporan-page">
            <div className="laporan-container">
                <div className="laporan-header">
                    <div>
                        <div className="laporan-title">
                            <i className="bi bi-bar-chart-line-fill"></i>

                            <div>
                                <h1>Dashboard Laporan</h1>

                                <p>
                                    Pantau laporan dan statistik bisnis
                                    BrandForge.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="laporan-stat-grid">
                    <div className="laporan-stat-card">
                        <div className="laporan-stat-icon">
                            <i className="bi bi-cart-check"></i>
                        </div>

                        <div>
                            <span>Total Transaksi</span>

                            <strong>
                                {laporan.jumlahOrder || 0}
                            </strong>
                        </div>
                    </div>

                    <div className="laporan-stat-card">
                        <div className="laporan-stat-icon">
                            <i className="bi bi-cash-stack"></i>
                        </div>

                        <div>
                            <span>Total Penjualan</span>

                            <strong>
                                {formatRupiah(laporan.penjualan)}
                            </strong>
                        </div>
                    </div>

                    <div className="laporan-stat-card">
                        <div className="laporan-stat-icon">
                            <i className="bi bi-wallet2"></i>
                        </div>

                        <div>
                            <span>Total Biaya</span>

                            <strong>
                                {formatRupiah(
                                    laporan.biayaOperasional
                                )}
                            </strong>
                        </div>
                    </div>

                    <div className="laporan-stat-card">
                        <div className="laporan-stat-icon">
                            <i className="bi bi-graph-up-arrow"></i>
                        </div>

                        <div>
                            <span>Laba Bersih</span>

                            <strong>
                                {formatRupiah(laporan.labaBersih)}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="laporan-section">
                    <div className="laporan-section-header">
                        <div>
                            <h2>Ringkasan Pendapatan</h2>

                            <p>
                                Ringkasan pendapatan berdasarkan periode.
                            </p>
                        </div>
                    </div>

                    <div className="laporan-summary-grid">
                        <div className="laporan-summary-card">
                            <span>Pendapatan Hari Ini</span>

                            <strong>
                                {formatRupiah(
                                    laporan.pendapatanHarian
                                )}
                            </strong>
                        </div>

                        <div className="laporan-summary-card">
                            <span>Pendapatan Bulan Ini</span>

                            <strong>
                                {formatRupiah(
                                    laporan.pendapatanBulanan
                                )}
                            </strong>
                        </div>

                        <div className="laporan-summary-card">
                            <span>Pendapatan Tahun Ini</span>

                            <strong>
                                {formatRupiah(
                                    laporan.pendapatanTahunan
                                )}
                            </strong>
                        </div>

                        <div className="laporan-summary-card">
                            <span>Total Pendapatan</span>

                            <strong>
                                {formatRupiah(
                                    laporan.totalPendapatan
                                )}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="laporan-section">
                    <div className="laporan-section-header">
                        <div>
                            <h2>Ringkasan Bisnis</h2>

                            <p>
                                Informasi utama dari aktivitas BrandForge.
                            </p>
                        </div>
                    </div>

                    <div className="laporan-summary-grid">
                        <div className="laporan-summary-card">
                            <span>Produk Terjual</span>

                            <strong>
                                {laporan.produkTerjual || 0}
                            </strong>
                        </div>

                        <div className="laporan-summary-card">
                            <span>Jumlah Pelanggan</span>

                            <strong>
                                {laporan.jumlahPelanggan || 0}
                            </strong>
                        </div>

                        <div className="laporan-summary-card">
                            <span>Modal Produk</span>

                            <strong>
                                {formatRupiah(
                                    laporan.modalProduk
                                )}
                            </strong>
                        </div>

                        <div className="laporan-summary-card">
                            <span>Biaya Operasional</span>

                            <strong>
                                {formatRupiah(
                                    laporan.biayaOperasional
                                )}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="laporan-section">
                    <div className="laporan-section-header">
                        <div>
                            <h2>Download Laporan</h2>

                            <p>
                                Unduh laporan BrandForge dalam format PDF
                                atau Excel.
                            </p>
                        </div>
                    </div>

                    <div className="laporan-menu-grid">
                        <div className="laporan-menu-card">
                            <div className="laporan-menu-icon">
                                <i className="bi bi-file-earmark-pdf"></i>
                            </div>

                            <div>
                                <h3>Laporan PDF</h3>

                                <p>
                                    Download laporan transaksi dalam
                                    format PDF.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleDownloadPdf}
                            >
                                Download PDF
                            </button>
                        </div>

                        <div className="laporan-menu-card">
                            <div className="laporan-menu-icon">
                                <i className="bi bi-file-earmark-excel"></i>
                            </div>

                            <div>
                                <h3>Laporan Excel</h3>

                                <p>
                                    Download laporan penjualan dalam
                                    format Excel.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleDownloadExcel}
                            >
                                Download Excel
                            </button>
                        </div>
                    </div>
                </div>

                <div className="laporan-section">
                    <div className="laporan-section-header">
                        <div>
                            <h2>Data Transaksi</h2>

                            <p>
                                Daftar transaksi yang digunakan dalam
                                laporan.
                            </p>
                        </div>
                    </div>

                    {laporan.transaksi?.length > 0 ? (
                        <div className="laporan-table-wrapper">
                            <table className="laporan-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>ID</th>
                                        <th>Pelanggan</th>
                                        <th>Total</th>
                                        <th>Tanggal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {laporan.transaksi.map(
                                        (transaksi, index) => (
                                            <tr
                                                key={
                                                    transaksi.id ||
                                                    index
                                                }
                                            >
                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    #{transaksi.id}
                                                </td>

                                                <td>
                                                    {transaksi.user
                                                        ?.name ||
                                                        transaksi.user
                                                            ?.nama ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {formatRupiah(
                                                        transaksi.total_harga
                                                    )}
                                                </td>

                                                <td>
                                                    {transaksi.tanggal_transaksi ||
                                                        "-"}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState
                            icon="bi-receipt"
                            title="Belum Ada Transaksi"
                            message="Belum ada transaksi yang tersedia untuk ditampilkan."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default LaporanPage;