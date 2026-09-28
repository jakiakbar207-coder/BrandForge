import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getReturById } from "../api/retur";

import Loading from "../components/common/Loading";

import "./Retur.css";

const normalizeResponse = (response) => {
    return response?.data?.data ?? response?.data ?? response ?? {};
};

function ReturDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [retur, setRetur] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadRetur = async () => {
        try {
            setLoading(true);

            const response = await getReturById(id);
            const data = normalizeResponse(response);

            setRetur(data);
        } catch (error) {
            console.error(
                "Gagal mengambil detail retur:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error?.response?.data?.message ||
                    "Detail retur gagal dimuat.",
            }).then(() => {
                navigate("/retur");
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRetur();
    }, [id]);

    if (loading) {
        return (
            <div className="retur-page">
                <Loading text="Memuat detail retur..." />
            </div>
        );
    }

    if (!retur) {
        return (
            <div className="retur-page">
                <div className="retur-card">
                    <div className="retur-empty">
                        <h3>Data retur tidak ditemukan</h3>

                        <button
                            type="button"
                            className="retur-btn retur-btn-primary"
                            onClick={() => navigate("/retur")}
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const returId =
        retur?.id ??
        retur?.id_retur ??
        id;

    const transaksiId =
        retur?.transaksi_id ??
        retur?.transaksi?.id ??
        "-";

    const namaProduk =
        retur?.produk?.nama_produk ??
        "-";

    const namaUkuran =
        retur?.ukuran?.nama_ukuran ??
        "-";

    const namaWarna =
        retur?.warna?.nama_warna ??
        "-";

    const tanggalRetur = retur?.tanggal_retur
        ? new Date(
              retur.tanggal_retur
          ).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : "-";

    return (
        <div className="retur-page">
            <div className="retur-card">
                <div className="retur-header">
                    <div>
                        <h2>Detail Retur</h2>
                        <p>
                            Informasi lengkap data retur
                            produk.
                        </p>
                    </div>

                    <div className="retur-header-actions">
                        <button
                            type="button"
                            className="retur-btn retur-btn-secondary"
                            onClick={() =>
                                navigate("/retur")
                            }
                        >
                            Kembali
                        </button>

                        <button
                            type="button"
                            className="retur-btn retur-btn-edit"
                            onClick={() =>
                                navigate(
                                    `/retur/edit/${returId}`
                                )
                            }
                        >
                            Edit
                        </button>
                    </div>
                </div>

                <div className="retur-detail-card">
                    <div className="retur-detail-info">
                        <div className="retur-detail-item">
                            <span>ID Retur</span>
                            <strong>
                                {returId}
                            </strong>
                        </div>

                        <div className="retur-detail-item">
                            <span>Tanggal Retur</span>
                            <strong>
                                {tanggalRetur}
                            </strong>
                        </div>

                        <div className="retur-detail-item">
                            <span>Transaksi</span>
                            <strong>
                                #{transaksiId}
                            </strong>
                        </div>

                        <div className="retur-detail-item">
                            <span>Produk</span>
                            <strong>
                                {namaProduk}
                            </strong>
                        </div>

                        <div className="retur-detail-item">
                            <span>Ukuran</span>
                            <strong>
                                {namaUkuran}
                            </strong>
                        </div>

                        <div className="retur-detail-item">
                            <span>Warna</span>
                            <strong>
                                {namaWarna}
                            </strong>
                        </div>

                        <div className="retur-detail-item">
                            <span>Jumlah</span>
                            <strong>
                                {retur?.jumlah ?? 0}
                            </strong>
                        </div>

                        <div className="retur-detail-item">
                            <span>Alasan</span>
                            <strong>
                                {retur?.alasan ?? "-"}
                            </strong>
                        </div>
                    </div>

                    <div className="retur-detail-description">
                        <span>Keterangan</span>

                        <p>
                            {retur?.keterangan ||
                                "Tidak ada keterangan tambahan."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReturDetailPage;