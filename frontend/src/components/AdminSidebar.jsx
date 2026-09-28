import { NavLink } from "react-router-dom";

import { ROLES } from "../config/roles";

import "./AdminSidebar.css";

function AdminSidebar() {
    let user = {};

    try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error(
            "Data user di localStorage tidak valid:",
            error
        );

        localStorage.removeItem("user");
    }

    const role = String(user?.role || "")
        .trim()
        .toLowerCase();

    const menuGroups = [
        {
            title: "MENU UTAMA",
            items: [
                {
                    path: "/dashboard",
                    icon: "bi-speedometer2",
                    label: "Dashboard",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                        ROLES.KASIR,
                        ROLES.PELANGGAN,
                    ],
                },
            ],
        },
        {
            title: "MANAJEMEN",
            items: [
                {
                    path: "/kategori",
                    icon: "bi-tags",
                    label: "Kategori",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/koleksi",
                    icon: "bi-collection",
                    label: "Koleksi",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/produk",
                    icon: "bi-box-seam",
                    label: "Produk",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/ukuran",
                    icon: "bi-rulers",
                    label: "Ukuran",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/warna",
                    icon: "bi-palette",
                    label: "Warna",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/stok",
                    icon: "bi-boxes",
                    label: "Stok",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/supplier",
                    icon: "bi-truck",
                    label: "Supplier",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/pembelian",
                    icon: "bi-cart-plus",
                    label: "Pembelian",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/retur",
                    icon: "bi-arrow-return-left",
                    label: "Retur",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/pengiriman",
                    icon: "bi-box-seam",
                    label: "Pengiriman",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/biaya-operasional",
                    icon: "bi-cash-stack",
                    label: "Biaya Operasional",
                    roles: [
                        ROLES.OWNER,
                        ROLES.ADMIN,
                    ],
                },
                {
                    path: "/kasir/transaksi",
                    icon: "bi-receipt",
                    label: "Transaksi",
                    roles: [
                        ROLES.OWNER,
                        ROLES.KASIR,
                    ],
                },
            ],
        },
    ];

    const filteredGroups = menuGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) =>
                item.roles.includes(role)
            ),
        }))
        .filter((group) => group.items.length > 0);

    const roleLabels = {
        [ROLES.OWNER]: "Owner",
        [ROLES.ADMIN]: "Admin",
        [ROLES.KASIR]: "Kasir",
        [ROLES.PELANGGAN]: "Pelanggan",
    };

    const getRoleLabel = () => {
        return roleLabels[role] || "User";
    };

    return (
        <aside className="brandforge-sidebar">
            <div className="brandforge-sidebar-header">
                <NavLink
                    to="/dashboard"
                    className="brandforge-brand"
                >
                    <div className="brandforge-logo">
                        <i className="bi bi-grid-1x2-fill"></i>
                    </div>

                    <div className="brandforge-brand-info">
                        <span className="brandforge-brand-name">
                            BrandForge
                        </span>

                        <span className="brandforge-brand-subtitle">
                            Management System
                        </span>
                    </div>
                </NavLink>
            </div>

            <div className="brandforge-sidebar-body">
                <div className="brandforge-user-role">
                    <div className="brandforge-user-role-icon">
                        <i className="bi bi-person-badge"></i>
                    </div>

                    <div className="brandforge-user-role-info">
                        <span className="brandforge-user-role-name">
                            {user?.name || "User"}
                        </span>

                        <span className="brandforge-user-role-label">
                            {getRoleLabel()}
                        </span>
                    </div>
                </div>

                {filteredGroups.map((group) => (
                    <div
                        className="brandforge-menu-group"
                        key={group.title}
                    >
                        <div className="brandforge-menu-title">
                            {group.title}
                        </div>

                        <nav className="brandforge-navigation">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `brandforge-menu-item ${
                                            isActive
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                >
                                    <span className="brandforge-menu-icon">
                                        <i
                                            className={`bi ${item.icon}`}
                                        ></i>
                                    </span>

                                    <span className="brandforge-menu-text">
                                        {item.label}
                                    </span>
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>

            <div className="brandforge-sidebar-footer">
                <div className="brandforge-system-status">
                    <span className="brandforge-status-dot"></span>

                    <div className="brandforge-status-info">
                        <span className="brandforge-status-title">
                            Sistem Online
                        </span>

                        <span className="brandforge-status-text">
                            Semua sistem berjalan normal
                        </span>
                    </div>
                </div>

                <div className="brandforge-footer-line">
                    <span>BrandForge</span>
                    <span>v1.0.0</span>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;