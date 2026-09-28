import { Link, useNavigate } from "react-router-dom";
import "./OwnerDashboard.css";

function OwnerDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <div className="owner-dashboard">
            <div className="owner-container">
                <header className="owner-header">
                    <div className="owner-header-left">
                        <div className="owner-logo">
                            <i className="bi bi-crown-fill"></i>
                        </div>

                        <div className="owner-header-text">
                            <h1>Dashboard Owner</h1>

                            <p>
                                Kelola dan pantau sistem BrandForge
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="owner-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </header>

                <div className="owner-section-title">
                    <h2>Dashboard Utama</h2>

                    <span>Owner Control Panel</span>
                </div>

                <section className="owner-menu-grid">
                    <Link
                        to="/dashboard?view=admin"
                        className="owner-menu-card"
                    >
                        <div className="owner-card-icon owner-admin-icon">
                            <i className="bi bi-person-gear"></i>
                        </div>

                        <div className="owner-card-content">
                            <h3>Dashboard Admin</h3>

                            <p>
                                Kelola produk, koleksi, kategori,
                                stok, supplier, pembelian, retur,
                                pengiriman, dan biaya operasional.
                            </p>
                        </div>

                        <span className="owner-card-button">
                            Buka Dashboard
                        </span>
                    </Link>

                    <Link
                        to="/dashboard?view=kasir"
                        className="owner-menu-card"
                    >
                        <div className="owner-card-icon owner-kasir-icon">
                            <i className="bi bi-cash-register"></i>
                        </div>

                        <div className="owner-card-content">
                            <h3>Dashboard Kasir</h3>

                            <p>
                                Akses transaksi penjualan, pembayaran,
                                verifikasi, penyelesaian transaksi,
                                dan pengiriman.
                            </p>
                        </div>

                        <span className="owner-card-button">
                            Buka Dashboard
                        </span>
                    </Link>

                    <Link
                        to="/dashboard?view=pelanggan"
                        className="owner-menu-card"
                    >
                        <div className="owner-card-icon owner-pelanggan-icon">
                            <i className="bi bi-shop"></i>
                        </div>

                        <div className="owner-card-content">
                            <h3>Dashboard Pelanggan</h3>

                            <p>
                                Lihat tampilan toko dan fitur yang
                                digunakan oleh pelanggan BrandForge.
                            </p>
                        </div>

                        <span className="owner-card-button">
                            Buka Dashboard
                        </span>
                    </Link>
                </section>

                <Link
                    to="/laporan"
                    className="owner-report-card"
                >
                    <div className="owner-report-icon">
                        <i className="bi bi-bar-chart-line-fill"></i>
                    </div>

                    <div className="owner-report-content">
                        <h3>Dashboard Laporan</h3>

                        <p>
                            Pantau statistik bisnis, grafik penjualan,
                            laba/rugi, serta laporan bisnis BrandForge.
                        </p>
                    </div>

                    <span className="owner-card-button">
                        Buka Dashboard
                    </span>
                </Link>

                <div className="owner-footer">
                    <i className="bi bi-lock-fill"></i>

                    <span>
                        Area Owner — Akses penuh untuk mengelola
                        dan memantau BrandForge
                    </span>
                </div>
            </div>
        </div>
    );
}

export default OwnerDashboard;