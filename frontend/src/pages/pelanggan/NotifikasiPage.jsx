import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getPelangganNotifikasi } from "../../api/pelanggan";
import Loading from "../../components/common/Loading";
import "./NotifikasiPage.css";

function NotifikasiPage() {
    const [notifikasi, setNotifikasi] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifikasi = async () => {
        try {
            setLoading(true);

            const response =
                await getPelangganNotifikasi();

            const result =
                response?.data || response;

            const items = Array.isArray(result)
                ? result
                : result?.notifikasi ||
                  result?.notifications ||
                  result?.data ||
                  [];

            setNotifikasi(items);
        } catch (error) {
            console.error(
                "Gagal memuat notifikasi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Notifikasi tidak dapat dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifikasi();
    }, []);

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

    const formatWaktu = (value) => {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const getNotificationTitle = (item) => {
        return (
            item?.judul ||
            item?.title ||
            item?.subject ||
            "Notifikasi Pesanan"
        );
    };

    const getNotificationMessage = (item) => {
        return (
            item?.pesan ||
            item?.message ||
            item?.body ||
            item?.keterangan ||
            "Ada informasi terbaru untuk pesanan kamu."
        );
    };

    const getNotificationDate = (item) => {
        return (
            item?.created_at ||
            item?.tanggal ||
            item?.tanggal_notifikasi ||
            item?.updated_at
        );
    };

    const getNotificationType = (item) => {
        const value = String(
            item?.type ||
                item?.tipe ||
                item?.jenis ||
                ""
        ).toLowerCase();

        if (
            value.includes("success") ||
            value.includes("selesai") ||
            value.includes("diterima")
        ) {
            return "success";
        }

        if (
            value.includes("warning") ||
            value.includes("pending") ||
            value.includes("menunggu")
        ) {
            return "warning";
        }

        if (
            value.includes("danger") ||
            value.includes("error") ||
            value.includes("gagal")
        ) {
            return "danger";
        }

        if (
            value.includes("shipping") ||
            value.includes("kirim") ||
            value.includes("pengiriman")
        ) {
            return "shipping";
        }

        return "info";
    };

    const getNotificationIcon = (item) => {
        const type = getNotificationType(
            item
        );

        if (type === "success") {
            return "bi-check-circle";
        }

        if (type === "warning") {
            return "bi-clock";
        }

        if (type === "danger") {
            return "bi-exclamation-circle";
        }

        if (type === "shipping") {
            return "bi-truck";
        }

        return "bi-bell";
    };

    const getNotificationLink = (item) => {
        const transaksiId =
            item?.transaksi_id ||
            item?.id_transaksi ||
            item?.transaksi?.id ||
            item?.transaksi?.id_transaksi;

        if (transaksiId) {
            return `/pelanggan/pesanan/${transaksiId}/tracking`;
        }

        return null;
    };

    const isUnread = (item) => {
        if (
            item?.dibaca === false ||
            item?.read === false ||
            item?.is_read === false
        ) {
            return true;
        }

        if (
            item?.dibaca === true ||
            item?.read === true ||
            item?.is_read === true
        ) {
            return false;
        }

        return false;
    };

    if (loading) {
        return (
            <div className="notifikasi-page">
                <Loading />
            </div>
        );
    }

    return (
        <div className="notifikasi-page">
            <div className="notifikasi-container">
                <div className="notifikasi-header">
                    <div>
                        <span className="notifikasi-label">
                            Informasi Akun
                        </span>

                        <h1>
                            Notifikasi
                        </h1>

                        <p>
                            Informasi terbaru mengenai
                            pesanan dan aktivitas akun kamu.
                        </p>
                    </div>

                    <Link
                        to="/pelanggan"
                        className="notifikasi-back-button"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Dashboard
                    </Link>
                </div>

                {notifikasi.length === 0 ? (
                    <div className="notifikasi-empty">
                        <div className="notifikasi-empty-icon">
                            <i className="bi bi-bell-slash"></i>
                        </div>

                        <h2>
                            Belum Ada Notifikasi
                        </h2>

                        <p>
                            Saat ada informasi terbaru,
                            notifikasi akan muncul di sini.
                        </p>

                        <Link
                            to="/pelanggan"
                            className="notifikasi-empty-button"
                        >
                            Kembali ke Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="notifikasi-list">
                        {notifikasi.map(
                            (item, index) => {
                                const type =
                                    getNotificationType(
                                        item
                                    );

                                const icon =
                                    getNotificationIcon(
                                        item
                                    );

                                const link =
                                    getNotificationLink(
                                        item
                                    );

                                const unread =
                                    isUnread(item);

                                const date =
                                    getNotificationDate(
                                        item
                                    );

                                const content = (
                                    <>
                                        <div
                                            className={`notifikasi-icon notifikasi-icon-${type}`}
                                        >
                                            <i
                                                className={`bi ${icon}`}
                                            ></i>
                                        </div>

                                        <div className="notifikasi-content">
                                            <div className="notifikasi-content-top">
                                                <h2>
                                                    {getNotificationTitle(
                                                        item
                                                    )}
                                                </h2>

                                                {unread && (
                                                    <span className="notifikasi-new">
                                                        Baru
                                                    </span>
                                                )}
                                            </div>

                                            <p>
                                                {getNotificationMessage(
                                                    item
                                                )}
                                            </p>

                                            <div className="notifikasi-date">
                                                <i className="bi bi-clock"></i>

                                                <span>
                                                    {formatTanggal(
                                                        date
                                                    )}

                                                    {formatWaktu(
                                                        date
                                                    ) &&
                                                        ` • ${formatWaktu(
                                                            date
                                                        )}`}
                                                </span>
                                            </div>
                                        </div>

                                        {link && (
                                            <div className="notifikasi-arrow">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                        )}
                                    </>
                                );

                                if (link) {
                                    return (
                                        <Link
                                            key={
                                                item?.id ||
                                                item?.id_notifikasi ||
                                                index
                                            }
                                            to={link}
                                            className={`notifikasi-card ${
                                                unread
                                                    ? "notifikasi-card-unread"
                                                    : ""
                                            }`}
                                        >
                                            {content}
                                        </Link>
                                    );
                                }

                                return (
                                    <div
                                        key={
                                            item?.id ||
                                            item?.id_notifikasi ||
                                            index
                                        }
                                        className={`notifikasi-card ${
                                            unread
                                                ? "notifikasi-card-unread"
                                                : ""
                                        }`}
                                    >
                                        {content}
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotifikasiPage;
