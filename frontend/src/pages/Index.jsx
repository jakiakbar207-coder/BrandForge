import { useNavigate } from "react-router-dom";
import "../index.css";

function Index() {
    const navigate = useNavigate();

    return (
        <div className="brandforge-page">
            <nav className="brandforge-navbar">
                <div
                    className="brandforge-logo"
                    onClick={() => navigate("/")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            navigate("/");
                        }
                    }}
                >
                    <div className="brandforge-logo-icon">
                        BF
                    </div>

                    <span>BrandForge</span>
                </div>

                <div className="brandforge-nav-menu">
                    <button
                        type="button"
                        className="brandforge-login-btn"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
            </nav>

            <main className="brandforge-hero">
                <div className="brandforge-hero-content">
                    <div className="brandforge-badge">
                        🚀 Platform Manajemen Brand
                    </div>

                    <h1>
                        Kelola Brand Anda
                        <br />
                        <span>Dengan Lebih Mudah</span>
                    </h1>

                    <p>
                        BrandForge membantu Anda mengelola koleksi,
                        data brand, dan kebutuhan administrasi secara
                        lebih mudah, cepat, dan terorganisir.
                    </p>

                    <div className="brandforge-actions">
                        <button
                            type="button"
                            className="brandforge-primary-btn"
                            onClick={() => navigate("/login")}
                        >
                            Mulai Sekarang
                            <span>→</span>
                        </button>

                        <button
                            type="button"
                            className="brandforge-secondary-btn"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </div>
                </div>

                <div className="brandforge-hero-card">
                    <div className="hero-card-header">
                        <div className="hero-card-dot"></div>
                        <div className="hero-card-dot"></div>
                        <div className="hero-card-dot"></div>
                    </div>

                    <div className="hero-card-body">
                        <div className="hero-card-icon">
                            BF
                        </div>

                        <h3>BrandForge</h3>

                        <p>Brand Management</p>

                        <div className="hero-card-items">
                            <div className="hero-item">
                                <span>📁</span>

                                <div>
                                    <strong>Koleksi</strong>
                                    <small>
                                        Kelola data koleksi
                                    </small>
                                </div>
                            </div>

                            <div className="hero-item">
                                <span>📊</span>

                                <div>
                                    <strong>Data Terorganisir</strong>
                                    <small>
                                        Mudah dan cepat
                                    </small>
                                </div>
                            </div>

                            <div className="hero-item">
                                <span>⚡</span>

                                <div>
                                    <strong>Efisien</strong>
                                    <small>
                                        Hemat waktu pengelolaan
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section className="brandforge-features">
                <div className="feature-card">
                    <div className="feature-icon">
                        📁
                    </div>

                    <h3>Kelola Koleksi</h3>

                    <p>
                        Kelola data koleksi dengan lebih mudah
                        dan terstruktur.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">
                        📊
                    </div>

                    <h3>Data Terorganisir</h3>

                    <p>
                        Semua data tersimpan dengan rapi dan
                        mudah ditemukan.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">
                        ⚡
                    </div>

                    <h3>Cepat & Efisien</h3>

                    <p>
                        Mempermudah pekerjaan administrasi
                        sehari-hari.
                    </p>
                </div>
            </section>

            <footer className="brandforge-footer">
                <strong>BrandForge</strong>

                <span>
                    © {new Date().getFullYear()} BrandForge.
                    Semua hak dilindungi.
                </span>
            </footer>
        </div>
    );
}

export default Index;