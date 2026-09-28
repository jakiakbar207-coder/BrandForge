import React, { useEffect, useState } from "react";
import {
    Link,
    useSearchParams,
} from "react-router-dom";

import api from "../api/axios";

function Dashboard() {
    const [searchParams] =
        useSearchParams();

    const view =
        String(
            searchParams.get(
                "view"
            ) || ""
        )
            .trim()
            .toLowerCase();

    const [loading, setLoading] =
        useState(true);

    const [stats, setStats] =
        useState({
            total: 0,
            diproses: 0,
            selesai: 0,
            wishlist: 0,
            keranjang: 0,
        });

    useEffect(() => {
        loadDashboard();
    }, [view]);

    const loadDashboard =
        async () => {
            try {
                setLoading(true);

                if (
                    view ===
                    "pelanggan"
                ) {
                    const [
                        statusResponse,
                        wishlistResponse,
                        dashboardResponse,
                    ] =
                        await Promise.all([
                            api.get(
                                "/pelanggan/dashboard-status"
                            ),
                            api.get(
                                "/wishlist"
                            ),
                            api.get(
                                "/pelanggan"
                            ),
                        ]);

                    const statusData =
                        statusResponse
                            ?.data
                            ?.data ??
                        statusResponse?.data ??
                        {};

                    const wishlistRaw =
                        wishlistResponse
                            ?.data
                            ?.data ??
                        wishlistResponse?.data ??
                        [];

                    const customerData =
                        dashboardResponse
                            ?.data
                            ?.data ??
                        dashboardResponse?.data ??
                        {};

                    let jumlahWishlist =
                        0;

                    if (
                        Array.isArray(
                            wishlistRaw
                        )
                    ) {
                        jumlahWishlist =
                            wishlistRaw.length;
                    } else if (
                        wishlistRaw &&
                        typeof wishlistRaw ===
                            "object"
                    ) {
                        if (
                            Array.isArray(
                                wishlistRaw.data
                            )
                        ) {
                            jumlahWishlist =
                                wishlistRaw.data.length;
                        } else if (
                            Array.isArray(
                                wishlistRaw.items
                            )
                        ) {
                            jumlahWishlist =
                                wishlistRaw.items.length;
                        } else if (
                            wishlistRaw.total !==
                            undefined
                        ) {
                            jumlahWishlist =
                                Number(
                                    wishlistRaw.total
                                ) || 0;
                        }
                    }

                    setStats({
                        total:
                            statusData.total ??
                            statusData.total_transaksi ??
                            statusData.total_pesanan ??
                            customerData.total_pesanan ??
                            0,

                        diproses:
                            statusData.diproses ??
                            statusData.transaksi_diproses ??
                            statusData.pesanan_diproses ??
                            0,

                        selesai:
                            statusData.selesai ??
                            statusData.transaksi_selesai ??
                            statusData.pesanan_selesai ??
                            0,

                        wishlist:
                            jumlahWishlist,

                        keranjang:
                            customerData.jumlah_keranjang ??
                            0,
                    });

                    return;
                }

                const response =
                    await api.get(
                        "/dashboard"
                    );

                const data =
                    response?.data
                        ?.data ??
                    response?.data ??
                    {};

                setStats({
                    total:
                        data.total_transaksi ??
                        data.total ??
                        0,

                    diproses:
                        data.transaksi_diproses ??
                        data.diproses ??
                        0,

                    selesai:
                        data.transaksi_selesai ??
                        data.selesai ??
                        0,

                    wishlist:
                        data.total_wishlist ??
                        0,

                    keranjang:
                        0,
                });
            } catch (error) {
                console.error(
                    "Gagal memuat dashboard:",
                    error
                );

                setStats({
                    total: 0,
                    diproses: 0,
                    selesai: 0,
                    wishlist: 0,
                    keranjang: 0,
                });
            } finally {
                setLoading(false);
            }
        };

    if (loading) {
        return (
            <div
                style={{
                    minHeight:
                        "calc(100vh - 88px)",
                    background:
                        "#f5f7fb",
                    display:
                        "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                }}
            >
                <div
                    style={{
                        textAlign:
                            "center",
                    }}
                >
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    ></div>

                    <div
                        style={{
                            marginTop:
                                "10px",
                            color:
                                "#64748b",
                            fontSize:
                                "13px",
                        }}
                    >
                        Memuat dashboard...
                    </div>
                </div>
            </div>
        );
    }

    if (
        view ===
        "pelanggan"
    ) {
        return (
            <div
                style={{
                    minHeight:
                        "calc(100vh - 88px)",
                    background:
                        "#f5f7fb",
                    padding:
                        "34px",
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "24px",
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize:
                                "28px",
                            fontWeight:
                                "700",
                            color:
                                "#172033",
                        }}
                    >
                        Dashboard Pelanggan
                    </h1>

                    <p
                        style={{
                            margin:
                                "7px 0 0",
                            color:
                                "#64748b",
                            fontSize:
                                "13px",
                        }}
                    >
                        Selamat datang di
                        BrandForge.
                    </p>
                </div>

                <div
                    style={{
                        display:
                            "grid",
                        gridTemplateColumns:
                            "repeat(4, minmax(0, 1fr))",
                        gap: "18px",
                    }}
                >
                    <DashboardCard
                        to="/pelanggan/belanja"
                        icon="bi-bag"
                        title="Belanja Produk"
                        value="Lihat Produk"
                        description="Cari dan beli produk"
                        iconBg="#e8f0ff"
                        iconColor="#2563eb"
                    />

                    <DashboardCard
                        to="/pelanggan/keranjang"
                        icon="bi-cart3"
                        title="Keranjang"
                        value={stats.keranjang}
                        description="Produk dalam keranjang"
                        iconBg="#fff4df"
                        iconColor="#f59e0b"
                    />

                    <DashboardCard
                        to="/pelanggan/pesanan"
                        icon="bi-box-seam"
                        title="Pesanan"
                        value={stats.total}
                        description="Total pesanan saya"
                        iconBg="#e9f8ef"
                        iconColor="#16a34a"
                    />

                    <DashboardCard
                        to="/pelanggan/wishlist"
                        icon="bi-heart-fill"
                        title="Wishlist"
                        value={stats.wishlist}
                        description="Produk tersimpan"
                        iconBg="#ffeaf1"
                        iconColor="#e11d48"
                    />
                </div>

                <div
                    style={{
                        background:
                            "#fff",
                        border:
                            "1px solid #e5eaf2",
                        borderRadius:
                            "10px",
                        marginTop:
                            "20px",
                        padding:
                            "22px",
                        boxShadow:
                            "0 4px 14px rgba(15,23,42,0.04)",
                    }}
                >
                    <h3
                        style={{
                            margin:
                                "0 0 18px",
                            fontSize:
                                "17px",
                            fontWeight:
                                "700",
                            color:
                                "#172033",
                        }}
                    >
                        Ringkasan Pesanan
                    </h3>

                    <div
                        style={{
                            display:
                                "grid",
                            gridTemplateColumns:
                                "repeat(3, 1fr)",
                            gap: "14px",
                        }}
                    >
                        <MiniStat
                            label="Total Pesanan"
                            value={
                                stats.total
                            }
                            icon="bi-receipt"
                        />

                        <MiniStat
                            label="Diproses"
                            value={
                                stats.diproses
                            }
                            icon="bi-clock-history"
                        />

                        <MiniStat
                            label="Selesai"
                            value={
                                stats.selesai
                            }
                            icon="bi-check-circle"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight:
                    "calc(100vh - 88px)",
                background:
                    "#f5f7fb",
                padding:
                    "34px",
            }}
        >
            <div
                style={{
                    marginBottom:
                        "24px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize:
                            "28px",
                        fontWeight:
                            "700",
                        color:
                            "#172033",
                    }}
                >
                    Dashboard
                </h1>

                <p
                    style={{
                        margin:
                            "7px 0 0",
                        color:
                            "#64748b",
                        fontSize:
                            "13px",
                    }}
                >
                    Selamat datang kembali
                    di BrandForge.
                </p>
            </div>

            <div
                style={{
                    display:
                        "grid",
                    gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",
                    gap: "18px",
                }}
            >
                <DashboardCard
                    to="/dashboard"
                    icon="bi-receipt"
                    title="Total Transaksi"
                    value={stats.total}
                    description="Semua transaksi"
                    iconBg="#e8f0ff"
                    iconColor="#2563eb"
                />

                <DashboardCard
                    to="/dashboard"
                    icon="bi-clock-history"
                    title="Diproses"
                    value={stats.diproses}
                    description="Transaksi diproses"
                    iconBg="#fff4df"
                    iconColor="#f59e0b"
                />

                <DashboardCard
                    to="/dashboard"
                    icon="bi-check-circle"
                    title="Selesai"
                    value={stats.selesai}
                    description="Transaksi selesai"
                    iconBg="#e9f8ef"
                    iconColor="#16a34a"
                />

                <DashboardCard
                    to="/dashboard"
                    icon="bi-heart-fill"
                    title="Wishlist"
                    value={stats.wishlist}
                    description="Total wishlist"
                    iconBg="#ffeaf1"
                    iconColor="#e11d48"
                />
            </div>
        </div>
    );
}

function DashboardCard({
    to,
    icon,
    title,
    value,
    description,
    iconBg,
    iconColor,
}) {
    return (
        <Link
            to={to}
            style={{
                textDecoration:
                    "none",
                color:
                    "inherit",
            }}
        >
            <div
                style={{
                    background:
                        "#fff",
                    border:
                        "1px solid #e5eaf2",
                    borderRadius:
                        "10px",
                    padding:
                        "18px",
                    minHeight:
                        "142px",
                    boxShadow:
                        "0 4px 14px rgba(15,23,42,0.04)",
                    transition:
                        "all 0.2s ease",
                }}
            >
                <div
                    style={{
                        width:
                            "44px",
                        height:
                            "44px",
                        borderRadius:
                            "9px",
                        background:
                            iconBg,
                        color:
                            iconColor,
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        marginBottom:
                            "13px",
                    }}
                >
                    <i
                        className={`bi ${icon}`}
                        style={{
                            fontSize:
                                "18px",
                        }}
                    ></i>
                </div>

                <div
                    style={{
                        color:
                            "#64748b",
                        fontSize:
                            "12px",
                        marginBottom:
                            "4px",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        color:
                            "#172033",
                        fontSize:
                            "21px",
                        fontWeight:
                            "700",
                    }}
                >
                    {value}
                </div>

                <div
                    style={{
                        color:
                            "#94a3b8",
                        fontSize:
                            "10px",
                        marginTop:
                            "3px",
                    }}
                >
                    {description}
                </div>
            </div>
        </Link>
    );
}

function MiniStat({
    label,
    value,
    icon,
}) {
    return (
        <div
            style={{
                background:
                    "#f8fafc",
                borderRadius:
                    "8px",
                padding:
                    "15px",
            }}
        >
            <div
                style={{
                    display:
                        "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "space-between",
                    color:
                        "#64748b",
                    fontSize:
                        "12px",
                }}
            >
                <span>
                    {label}
                </span>

                <i
                    className={`bi ${icon}`}
                    style={{
                        color:
                            "#2563eb",
                    }}
                ></i>
            </div>

            <div
                style={{
                    marginTop:
                        "7px",
                    color:
                        "#172033",
                    fontSize:
                        "22px",
                    fontWeight:
                        "700",
                }}
            >
                {value}
            </div>
        </div>
    );
}

export default Dashboard;