
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getPelangganDashboard,
    getPelangganStatus,
    getWishlist,
} from "../../api/pelanggan";

export default function PelangganDashboard() {
    const [dashboard, setDashboard] = useState({});
    const [statusPesanan, setStatusPesanan] = useState({});
    const [jumlahWishlist, setJumlahWishlist] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    dashboardData,
                    statusData,
                    wishlistData,
                ] = await Promise.all([
                    getPelangganDashboard(),
                    getPelangganStatus(),
                    getWishlist(),
                ]);

                console.log("Dashboard:", dashboardData);
                console.log("Status Pesanan:", statusData);
                console.log("Wishlist:", wishlistData);

                setDashboard(
                    dashboardData?.data ?? dashboardData ?? {}
                );

                setStatusPesanan(
                    statusData?.data ?? statusData ?? {}
                );

                const wishlist =
                    wishlistData?.data ?? wishlistData;

                setJumlahWishlist(
                    Array.isArray(wishlist)
                        ? wishlist.length
                        : 0
                );
            } catch (err) {
                console.error(
                    "Gagal mengambil dashboard:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Gagal memuat dashboard pelanggan."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const cards = [
        {
            title: "Total Produk",
            value:
                dashboard.total_produk ??
                dashboard.jumlah_produk ??
                0,
            icon: "bi-box-seam",
            color: "#2563eb",
            bg: "#dbeafe",
            link: "/pelanggan/belanja",
        },
        {
            title: "Total Pesanan",
            value: statusPesanan.total ?? 0,
            icon: "bi-bag-check",
            color: "#16a34a",
            bg: "#dcfce7",
            link: "/pelanggan/pesanan",
        },
        {
            title: "Pesanan Selesai",
            value: statusPesanan.selesai ?? 0,
            icon: "bi-check-circle",
            color: "#0891b2",
            bg: "#cffafe",
            link: "/pelanggan/riwayat",
        },
        {
            title: "Wishlist",
            value: jumlahWishlist,
            icon: "bi-heart",
            color: "#e11d48",
            bg: "#ffe4e6",
            link: "/pelanggan/wishlist",
        },
        {
            title: "Keranjang",
            value:
                dashboard.total_keranjang ??
                dashboard.jumlah_keranjang ??
                0,
            icon: "bi-cart3",
            color: "#9333ea",
            bg: "#f3e8ff",
            link: "/pelanggan/keranjang",
        },
    ];

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-3 text-muted">
                        Memuat dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-1">
                    Dashboard Pelanggan
                </h2>

                <p className="text-muted mb-0">
                    Selamat datang kembali! Berikut ringkasan
                    aktivitas akun kamu.
                </p>
            </div>

            <div className="row g-4">
                {cards.map((card, index) => (
                    <div
                        className="col-12 col-sm-6 col-xl-4"
                        key={index}
                    >
                        <Link
                            to={card.link}
                            className="text-decoration-none"
                            style={{ color: "inherit" }}
                        >
                            <div
                                className="card border-0 shadow-sm h-100"
                                style={{
                                    borderRadius: "16px",
                                    transition:
                                        "transform 0.2s ease, box-shadow 0.2s ease",
                                }}
                            >
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-muted mb-2">
                                                {card.title}
                                            </p>

                                            <h3 className="fw-bold mb-0">
                                                {card.value}
                                            </h3>
                                        </div>

                                        <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "58px",
                                                height: "58px",
                                                borderRadius: "14px",
                                                backgroundColor:
                                                    card.bg,
                                                color: card.color,
                                                fontSize: "26px",
                                            }}
                                        >
                                            <i
                                                className={`bi ${card.icon}`}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div
                className="card border-0 shadow-sm mt-4"
                style={{ borderRadius: "16px" }}
            >
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-2">
                        Mulai Belanja
                    </h5>

                    <p className="text-muted mb-3">
                        Temukan produk yang kamu butuhkan dan
                        tambahkan ke keranjang.
                    </p>

                    <Link
                        to="/pelanggan/belanja"
                        className="btn btn-primary"
                    >
                        Lihat Produk
                        <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}   