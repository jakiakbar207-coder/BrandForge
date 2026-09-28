import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getPembelianById } from "../api/pembelian";

import Loading from "../components/common/Loading";

import "./Pembelian.css";

function PembelianDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [pembelian, setPembelian] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetail = async () => {
            try {
                setLoading(true);

                const response =
                    await getPembelianById(id);

                const data =
                    response?.data?.data ??
                    response?.data ??
                    response;

                setPembelian(data);
            } catch (error) {
                console.error(
                    "Gagal mengambil detail pembelian:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text:
                        error.response?.data?.message ??
                        "Detail pembelian gagal dimuat.",
                }).then(() => {
                    navigate("/pembelian");
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadDetail();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="pembelian-loading">
                <Loading />
            </div>
        );
    }

    if (!pembelian) {
        return null;
    }

    const details = Array.isArray(
        pembelian.details
    )
        ? pembelian.details
        : [];

    return (
        <div className="pembelian-page">
            <div className="pembelian-header">
                <div>
                    <div className="pembelian-breadcrumb">
                        Admin / Pembelian / Detail
                    </div>

                    <h1>Detail Pembelian</h1>

                    <p>
                        Informasi lengkap transaksi
                        pembelian.
                    </p>
                </div>

                <button
                    type="button"
                    className="pembelian-back-button"
                    onClick={() =>
                        navigate("/pembelian")
                    }
                >
                    <i className="bi bi-arrow-left"></i>
                    Kembali
                </button>
            </div>

            <div className="pembelian-info-grid">
                <div className="pembelian-info-item">
                    <span>ID Pembelian</span>
                    <strong>
                        #{pembelian.id}
                    </strong>
                </div>

                <div className="pembelian-info-item">
                    <span>Supplier</span>
                    <strong>
                        {pembelian.supplier
                            ?.nama_supplier ?? "-"}
                    </strong>
                </div>

                <div className="pembelian-info-item">
                    <span>Tanggal</span>
                    <strong>
                        {pembelian.tanggal_pembelian
                            ? new Date(
                                  pembelian.tanggal_pembelian
                              ).toLocaleDateString(
                                  "id-ID"
                              )
                            : "-"}
                    </strong>
                </div>

                <div className="pembelian-info-item">
                    <span>Total Pembelian</span>
                    <strong>
                        Rp{" "}
                        {Number(
                            pembelian.total_harga ?? 0
                        ).toLocaleString(
                            "id-ID"
                        )}
                    </strong>
                </div>
            </div>

            {pembelian.keterangan && (
                <div className="pembelian-note">
                    <span>Catatan</span>
                    <p>
                        {pembelian.keterangan}
                    </p>
                </div>
            )}

            <div className="pembelian-detail-card">
                <div className="pembelian-detail-card-header">
                    <div>
                        <h2>Detail Produk</h2>
                        <p>
                            Daftar produk pada pembelian
                            ini.
                        </p>
                    </div>
                </div>

                <div className="pembelian-detail-table-wrapper">
                    <table className="pembelian-detail-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Produk</th>
                                <th>Ukuran</th>
                                <th>Warna</th>
                                <th>Jumlah</th>
                                <th>Harga Modal</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {details.length > 0 ? (
                                details.map(
                                    (
                                        detail,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                detail.id ??
                                                index
                                            }
                                        >
                                            <td>
                                                {index +
                                                    1}
                                            </td>

                                            <td>
                                                {detail
                                                    .produk
                                                    ?.nama_produk ??
                                                    "-"}
                                            </td>

                                            <td>
                                                {detail
                                                    .ukuran
                                                    ?.nama_ukuran ??
                                                    "-"}
                                            </td>

                                            <td>
                                                {detail
                                                    .warna
                                                    ?.nama_warna ??
                                                    "-"}
                                            </td>

                                            <td>
                                                {detail.jumlah ??
                                                    0}
                                            </td>

                                            <td>
                                                Rp{" "}
                                                {Number(
                                                    detail.harga_modal ??
                                                        0
                                                ).toLocaleString(
                                                    "id-ID"
                                                )}
                                            </td>

                                            <td>
                                                Rp{" "}
                                                {Number(
                                                    detail.subtotal ??
                                                        0
                                                ).toLocaleString(
                                                    "id-ID"
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="pembelian-detail-empty"
                                    >
                                        Tidak ada detail
                                        produk.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PembelianDetailPage;