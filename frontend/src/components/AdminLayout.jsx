import { useMemo, useState } from "react";
import {
    Link,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const user = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem("user") || "{}"
            );
        } catch {
            return {};
        }
    }, []);

    const role = String(
        user?.role ||
            user?.data?.role ||
            localStorage.getItem("role") ||
            ""
    )
        .trim()
        .toLowerCase();

    const namaUser =
        user?.name ||
        user?.nama ||
        user?.nama_lengkap ||
        user?.username ||
        "User";

    const isPelanggan =
        role === "pelanggan" ||
        role === "customer";

    const isDashboardPelanggan =
        location.pathname === "/dashboard" &&
        new URLSearchParams(location.search).get("view") ===
            "pelanggan";

    const isPelangganPage =
        location.pathname.startsWith("/pelanggan");

    const dashboardPath =
        isPelanggan ||
        isDashboardPelanggan ||
        isPelangganPage
            ? "/pelanggan"
            : "/dashboard";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("dashboard_view");

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                display: "flex",
            }}
        >
            <aside
                style={{
                    width: sidebarOpen
                        ? "195px"
                        : "0px",
                    minWidth: sidebarOpen
                        ? "195px"
                        : "0px",
                    overflow: "hidden",
                    background:
                        "#111827",
                    color: "#fff",
                    transition:
                        "all 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    position: "sticky",
                    top: 0,
                }}
            >
                <div
                    style={{
                        padding: "14px 15px",
                        borderBottom:
                            "1px solid rgba(255,255,255,0.08)",
                        flexShrink: 0,
                    }}
                >
                    <Link
                        to={dashboardPath}
                        style={{
                            textDecoration:
                                "none",
                            color: "#fff",
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "9px",
                        }}
                    >
                        <div
                            style={{
                                width: "31px",
                                height: "31px",
                                borderRadius:
                                    "7px",
                                background:
                                    "#2563eb",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                fontWeight: "800",
                                fontSize: "16px",
                            }}
                        >
                            B
                        </div>

                        <div>
                            <div
                                style={{
                                    fontWeight:
                                        "700",
                                    fontSize:
                                        "14px",
                                    lineHeight:
                                        "1.1",
                                }}
                            >
                                BrandForge
                            </div>

                            <div
                                style={{
                                    fontSize:
                                        "8px",
                                    color:
                                        "#94a3b8",
                                    marginTop:
                                        "2px",
                                }}
                            >
                                Management System
                            </div>
                        </div>
                    </Link>
                </div>

                <div
                    style={{
                        padding: "14px 10px 10px",
                        flex: 1,
                        overflowY: "auto",
                    }}
                >
                    <div
                        style={{
                            background:
                                "#182338",
                            borderRadius:
                                "7px",
                            padding:
                                "10px 9px",
                            marginBottom:
                                "14px",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "8px",
                            }}
                        >
                            <div
                                style={{
                                    width:
                                        "28px",
                                    height:
                                        "28px",
                                    borderRadius:
                                        "6px",
                                    background:
                                        "#1f2937",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    color:
                                        "#60a5fa",
                                    fontSize:
                                        "13px",
                                }}
                            >
                                <i className="bi bi-person-fill"></i>
                            </div>

                            <div
                                style={{
                                    minWidth:
                                        0,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize:
                                            "10px",
                                        fontWeight:
                                            "600",
                                        whiteSpace:
                                            "nowrap",
                                        overflow:
                                            "hidden",
                                        textOverflow:
                                            "ellipsis",
                                    }}
                                >
                                    {namaUser}
                                </div>

                                <div
                                    style={{
                                        color:
                                            "#60a5fa",
                                        fontSize:
                                            "8px",
                                        marginTop:
                                            "2px",
                                        textTransform:
                                            "capitalize",
                                    }}
                                >
                                    {role || "user"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            fontSize:
                                "8px",
                            color:
                                "#64748b",
                            fontWeight:
                                "700",
                            padding:
                                "0 10px",
                            marginBottom:
                                "7px",
                            textTransform:
                                "uppercase",
                        }}
                    >
                        Menu Utama
                    </div>

                    <SidebarLink
                        to={dashboardPath}
                        icon="bi-speedometer2"
                        label="Dashboard"
                        active={
                            location.pathname ===
                                "/dashboard" ||
                            location.pathname ===
                                "/pelanggan"
                        }
                    />

                    {!isPelanggan && (
                        <>
                            <div
                                style={{
                                    fontSize:
                                        "8px",
                                    color:
                                        "#64748b",
                                    fontWeight:
                                        "700",
                                    padding:
                                        "11px 10px 7px",
                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                Manajemen
                            </div>

                            <SidebarLink
                                to="/kategori"
                                icon="bi-tags"
                                label="Kategori"
                                active={location.pathname.startsWith(
                                    "/kategori"
                                )}
                            />

                            <SidebarLink
                                to="/koleksi"
                                icon="bi-collection"
                                label="Koleksi"
                                active={location.pathname.startsWith(
                                    "/koleksi"
                                )}
                            />

                            <SidebarLink
                                to="/produk"
                                icon="bi-box"
                                label="Produk"
                                active={location.pathname.startsWith(
                                    "/produk"
                                )}
                            />

                            <SidebarLink
                                to="/ukuran"
                                icon="bi-rulers"
                                label="Ukuran"
                                active={location.pathname.startsWith(
                                    "/ukuran"
                                )}
                            />

                            <SidebarLink
                                to="/warna"
                                icon="bi-palette"
                                label="Warna"
                                active={location.pathname.startsWith(
                                    "/warna"
                                )}
                            />

                            <SidebarLink
                                to="/stok"
                                icon="bi-boxes"
                                label="Stok"
                                active={location.pathname.startsWith(
                                    "/stok"
                                )}
                            />

                            <SidebarLink
                                to="/supplier"
                                icon="bi-truck"
                                label="Supplier"
                                active={location.pathname.startsWith(
                                    "/supplier"
                                )}
                            />

                            <SidebarLink
                                to="/pembelian"
                                icon="bi-cart-plus"
                                label="Pembelian"
                                active={location.pathname.startsWith(
                                    "/pembelian"
                                )}
                            />

                            <SidebarLink
                                to="/retur"
                                icon="bi-arrow-return-left"
                                label="Retur"
                                active={location.pathname.startsWith(
                                    "/retur"
                                )}
                            />
                        </>
                    )}

                    {isPelanggan && (
                        <>
                            <div
                                style={{
                                    fontSize:
                                        "8px",
                                    color:
                                        "#64748b",
                                    fontWeight:
                                        "700",
                                    padding:
                                        "11px 10px 7px",
                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                Belanja
                            </div>

                            <SidebarLink
                                to="/pelanggan/belanja"
                                icon="bi-bag"
                                label="Belanja Produk"
                                active={location.pathname ===
                                    "/pelanggan/belanja"}
                            />

                            <SidebarLink
                                to="/pelanggan/keranjang"
                                icon="bi-cart3"
                                label="Keranjang"
                                active={location.pathname ===
                                    "/pelanggan/keranjang"}
                            />

                            <SidebarLink
                                to="/pelanggan/pesanan"
                                icon="bi-box-seam"
                                label="Pesanan"
                                active={location.pathname ===
                                    "/pelanggan/pesanan"}
                            />

                            <SidebarLink
                                to="/pelanggan/wishlist"
                                icon="bi-heart"
                                label="Wishlist"
                                active={location.pathname ===
                                    "/pelanggan/wishlist"}
                            />
                        </>
                    )}
                </div>

                <div
                    style={{
                        padding: "10px",
                        borderTop:
                            "1px solid rgba(255,255,255,0.08)",
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            background:
                                "#182338",
                            borderRadius:
                                "7px",
                            padding:
                                "9px 10px",
                            marginBottom:
                                "8px",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "7px",
                            }}
                        >
                            <span
                                style={{
                                    width:
                                        "7px",
                                    height:
                                        "7px",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "#22c55e",
                                    display:
                                        "inline-block",
                                }}
                            ></span>

                            <div>
                                <div
                                    style={{
                                        fontSize:
                                            "9px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    Sistem Online
                                </div>

                                <div
                                    style={{
                                        fontSize:
                                            "7px",
                                        color:
                                            "#64748b",
                                        marginTop:
                                            "2px",
                                    }}
                                >
                                    Semua sistem berjalan normal
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            border: "1px solid #ef4444",
                            background: "transparent",
                            color: "#f87171",
                            borderRadius: "6px",
                            padding: "7px 9px",
                            fontSize: "10px",
                            cursor: "pointer",
                        }}
                    >
                        <i className="bi bi-box-arrow-right me-1"></i>
                        Logout
                    </button>
                </div>
            </aside>

            <main
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <header
                    style={{
                        height: "56px",
                        background: "#fff",
                        borderBottom:
                            "1px solid #e5e7eb",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "space-between",
                        padding: "0 16px",
                        position: "sticky",
                        top: 0,
                        zIndex: 20,
                    }}
                >
                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "7px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(
                                    !sidebarOpen
                                )
                            }
                            style={{
                                width:
                                    "30px",
                                height:
                                    "30px",
                                border:
                                    "1px solid #dbe3ef",
                                background:
                                    "#fff",
                                borderRadius:
                                    "7px",
                                cursor:
                                    "pointer",
                                color:
                                    "#64748b",
                            }}
                        >
                            <i className="bi bi-list"></i>
                        </button>

                        <Link
                            to={dashboardPath}
                            style={{
                                textDecoration:
                                    "none",
                                background:
                                    "#eff6ff",
                                color:
                                    "#2563eb",
                                fontSize:
                                    "10px",
                                padding:
                                    "7px 10px",
                                borderRadius:
                                    "6px",
                            }}
                        >
                            Dashboard
                        </Link>

                        {!isPelanggan && (
                            <>
                                <TopLink
                                    to="/kategori"
                                    label="Kategori"
                                />

                                <TopLink
                                    to="/koleksi"
                                    label="Koleksi"
                                />

                                <TopLink
                                    to="/produk"
                                    label="Produk"
                                />

                                <TopLink
                                    to="/kasir/transaksi"
                                    label="Transaksi"
                                />
                            </>
                        )}

                        {isPelanggan && (
                            <>
                                <TopLink
                                    to="/pelanggan/belanja"
                                    label="Belanja"
                                />

                                <TopLink
                                    to="/pelanggan/pesanan"
                                    label="Pesanan"
                                />

                                <TopLink
                                    to="/pelanggan/keranjang"
                                    label="Keranjang"
                                />

                                <TopLink
                                    to="/pelanggan/wishlist"
                                    label="Wishlist"
                                />
                            </>
                        )}
                    </div>

                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "8px",
                        }}
                    >
                        <button
                            type="button"
                            style={{
                                width:
                                    "30px",
                                height:
                                    "30px",
                                border:
                                    "1px solid #dbe3ef",
                                background:
                                    "#fff",
                                borderRadius:
                                    "7px",
                                color:
                                    "#64748b",
                            }}
                        >
                            <i className="bi bi-bell"></i>
                        </button>

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "7px",
                                border:
                                    "1px solid #dbe3ef",
                                borderRadius:
                                    "7px",
                                padding:
                                    "5px 9px",
                                minWidth:
                                    "125px",
                            }}
                        >
                            <div
                                style={{
                                    width:
                                        "27px",
                                    height:
                                        "27px",
                                    borderRadius:
                                        "6px",
                                    background:
                                        "#2563eb",
                                    color:
                                        "#fff",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    fontSize:
                                        "12px",
                                }}
                            >
                                <i className="bi bi-person"></i>
                            </div>

                            <div
                                style={{
                                    flex: 1,
                                    minWidth:
                                        0,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize:
                                            "9px",
                                        fontWeight:
                                            "600",
                                        color:
                                            "#172033",
                                        whiteSpace:
                                            "nowrap",
                                        overflow:
                                            "hidden",
                                        textOverflow:
                                            "ellipsis",
                                    }}
                                >
                                    {namaUser}
                                </div>

                                <div
                                    style={{
                                        fontSize:
                                            "7px",
                                        color:
                                            "#64748b",
                                        textTransform:
                                            "capitalize",
                                    }}
                                >
                                    {role || "user"}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            style={{
                                height:
                                    "30px",
                                padding:
                                    "0 11px",
                                border:
                                    "1px solid #fca5a5",
                                color:
                                    "#ef4444",
                                background:
                                    "#fff",
                                borderRadius:
                                    "7px",
                                fontSize:
                                    "9px",
                                cursor:
                                    "pointer",
                            }}
                        >
                            <i className="bi bi-box-arrow-right me-1"></i>
                            Logout
                        </button>
                    </div>
                </header>

                <section
                    style={{
                        flex: 1,
                        minWidth: 0,
                        overflow:
                            "auto",
                    }}
                >
                    <Outlet />
                </section>

                <footer
                    style={{
                        height:
                            "32px",
                        background:
                            "#fff",
                        borderTop:
                            "1px solid #e5e7eb",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "space-between",
                        padding:
                            "0 14px",
                        fontSize:
                            "8px",
                        color:
                            "#64748b",
                    }}
                >
                    <span>
                        Copyright ©{" "}
                        {new Date().getFullYear()}{" "}
                        BrandForge.
                    </span>

                    <span>
                        BrandForge
                    </span>
                </footer>
            </main>
        </div>
    );
}

function SidebarLink({
    to,
    icon,
    label,
    active,
}) {
    return (
        <Link
            to={to}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                textDecoration: "none",
                color: active
                    ? "#fff"
                    : "#cbd5e1",
                background: active
                    ? "#2563eb"
                    : "transparent",
                padding: "9px 10px",
                borderRadius: "6px",
                marginBottom: "3px",
                fontSize: "10px",
                fontWeight: active
                    ? "600"
                    : "500",
                transition:
                    "all 0.2s ease",
            }}
        >
            <i
                className={`bi ${icon}`}
                style={{
                    width: "15px",
                    textAlign: "center",
                    fontSize: "11px",
                }}
            ></i>

            <span>{label}</span>
        </Link>
    );
}

function TopLink({
    to,
    label,
}) {
    return (
        <Link
            to={to}
            style={{
                textDecoration:
                    "none",
                color:
                    "#334155",
                fontSize:
                    "9px",
                padding:
                    "6px 7px",
                borderRadius:
                    "5px",
            }}
        >
            {label}
        </Link>
    );
}

export default AdminLayout;