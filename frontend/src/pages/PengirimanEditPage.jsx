import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getPengirimanById,
    updatePengiriman,
} from "../api/pengiriman";

import { getPengirimanFormData } from "../api/pengiriman";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Pengiriman.css";

const normalizeResponse = (response) => {
    return response?.data?.data ?? response?.data ?? response ?? {};
};

function PengirimanEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transaksis, setTransaksis] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [transaksiId, setTransaksiId] = useState("");
    const [kurir, setKurir] = useState("");
    const [layanan, setLayanan] = useState("");
    const [ongkir, setOngkir] = useState("");
    const [nomorResi, setNomorResi] = useState("");
    const [status, setStatus] = useState("menunggu");
    const [catatan, setCatatan] = useState("");
    const [fotoProduk, setFotoProduk] = useState(null);
    const [fotoLama, setFotoLama] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [
                    pengirimanResponse,
                    formResponse,
                ] = await Promise.all([
                    getPengirimanById(id),
                    getPengirimanFormData(),
                ]);

                const pengirimanData =
                    normalizeResponse(
                        pengirimanResponse
                    );

                const formData =
                    normalizeResponse(formResponse);

                setTransaksis(
                    Array.isArray(formData?.transaksis)
                        ? formData.transaksis
                        : []
                );

                setTransaksiId(
                    String(
                        pengirimanData?.transaksi_id ??
                            pengirimanData?.transaksi?.id ??
                            ""
                    )
                );

                setKurir(
                    pengirimanData?.kurir ?? ""
                );

                setLayanan(
                    pengirimanData?.layanan ?? ""
                );

                setOngkir(
                    pengirimanData?.ongkir ?? ""
                );

                setNomorResi(
                    pengirimanData?.nomor_resi ?? ""
                );

                setStatus(
                    pengirimanData?.status ??
                        "menunggu"
                );

                setCatatan(
                    pengirimanData?.catatan ?? ""
                );

                setFotoLama(
                    pengirimanData?.foto_produk ?? ""
                );
            } catch (error) {
                console.error(
                    "Gagal mengambil data pengiriman:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text:
                        error?.response?.data?.message ||
                        "Data pengiriman gagal dimuat.",
                }).then(() => {
                    navigate("/pengiriman");
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!transaksiId) {
            Swal.fire({
                icon: "warning",
                title: "Transaksi Belum Dipilih",
                text: "Silakan pilih transaksi.",
            });
            return;
        }

        if (!kurir.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Kurir Belum Diisi",
                text: "Silakan masukkan nama kurir.",
            });
            return;
        }

        if (!layanan.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Layanan Belum Diisi",
                text: "Silakan masukkan layanan pengiriman.",
            });
            return;
        }

        if (
            ongkir === "" ||
            Number(ongkir) < 0
        ) {
            Swal.fire({
                icon: "warning",
                title: "Ongkir Tidak Valid",
                text: "Ongkir harus berupa angka minimal 0.",
            });
            return;
        }

        const confirmResult = await Swal.fire({
            icon: "question",
            title: "Simpan Perubahan?",
            text: "Data pengiriman akan diperbarui.",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();

            formData.append(
                "transaksi_id",
                transaksiId
            );

            formData.append(
                "kurir",
                kurir.trim()
            );

            formData.append(
                "layanan",
                layanan.trim()
            );

            formData.append(
                "ongkir",
                Number(ongkir)
            );

            if (nomorResi.trim()) {
                formData.append(
                    "nomor_resi",
                    nomorResi.trim()
                );
            } else {
                formData.append(
                    "nomor_resi",
                    ""
                );
            }

            formData.append("status", status);

            if (catatan.trim()) {
                formData.append(
                    "catatan",
                    catatan.trim()
                );
            } else {
                formData.append(
                    "catatan",
                    ""
                );
            }

            if (fotoProduk) {
                formData.append(
                    "foto_produk",
                    fotoProduk
                );
            }

            await updatePengiriman(
                id,
                formData
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data pengiriman berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/pengiriman");
        } catch (error) {
            console.error(
                "Gagal memperbarui pengiriman:",
                error
            );

            const errors =
                error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                "Data pengiriman gagal diperbarui.";

            if (errors) {
                message = Object.values(errors)
                    .flat()
                    .join("\n");
            }

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const fotoUrl = fotoLama
        ? `http://127.0.0.1:8000/storage/${fotoLama}`
        : null;

    if (loading) {
        return (
            <div className="pengiriman-page">
                <Loading text="Memuat data pengiriman..." />
            </div>
        );
    }

    return (
        <div className="pengiriman-page">
            <FormModal
                show={true}
                title="Edit Pengiriman"
                onClose={() =>
                    navigate("/pengiriman")
                }
                onSubmit={handleSubmit}
                submitText="Simpan Perubahan"
                cancelText="Batal"
                loading={submitting}
                size="large"
            >
                <div className="pengiriman-form-grid">
                    <div className="pengiriman-form-group">
                        <label htmlFor="transaksi_id">
                            Transaksi
                        </label>

                        <select
                            id="transaksi_id"
                            value={transaksiId}
                            onChange={(e) =>
                                setTransaksiId(
                                    e.target.value
                                )
                            }
                            required
                        >
                            <option value="">
                                -- Pilih Transaksi --
                            </option>

                            {transaksis.map((item) => {
                                const itemId =
                                    item?.id ??
                                    item?.id_transaksi;

                                const kode =
                                    item?.kode_transaksi;

                                return (
                                    <option
                                        key={itemId}
                                        value={itemId}
                                    >
                                        {kode
                                            ? `${kode} (#${itemId})`
                                            : `Transaksi #${itemId}`}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="pengiriman-form-group">
                        <label htmlFor="kurir">
                            Kurir
                        </label>

                        <input
                            id="kurir"
                            type="text"
                            value={kurir}
                            onChange={(e) =>
                                setKurir(
                                    e.target.value
                                )
                            }
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="pengiriman-form-group">
                        <label htmlFor="layanan">
                            Layanan
                        </label>

                        <input
                            id="layanan"
                            type="text"
                            value={layanan}
                            onChange={(e) =>
                                setLayanan(
                                    e.target.value
                                )
                            }
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="pengiriman-form-group">
                        <label htmlFor="ongkir">
                            Ongkir
                        </label>

                        <input
                            id="ongkir"
                            type="number"
                            min="0"
                            value={ongkir}
                            onChange={(e) =>
                                setOngkir(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="pengiriman-form-group">
                        <label htmlFor="nomor_resi">
                            Nomor Resi
                        </label>

                        <input
                            id="nomor_resi"
                            type="text"
                            value={nomorResi}
                            onChange={(e) =>
                                setNomorResi(
                                    e.target.value
                                )
                            }
                            maxLength={255}
                        />
                    </div>

                    <div className="pengiriman-form-group">
                        <label htmlFor="status">
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                        >
                            <option value="menunggu">
                                Menunggu
                            </option>
                            <option value="diproses">
                                Diproses
                            </option>
                            <option value="dikemas">
                                Dikemas
                            </option>
                            <option value="dikirim">
                                Dikirim
                            </option>
                            <option value="selesai">
                                Selesai
                            </option>
                        </select>
                    </div>

                    <div className="pengiriman-form-group pengiriman-form-full">
                        <label htmlFor="foto_produk">
                            Foto Produk
                        </label>

                        {fotoUrl && (
                            <div className="pengiriman-foto-lama">
                                <img
                                    src={fotoUrl}
                                    alt="Foto produk"
                                />
                            </div>
                        )}

                        <input
                            id="foto_produk"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={(e) =>
                                setFotoProduk(
                                    e.target.files?.[0] ??
                                        null
                                )
                            }
                        />

                        <small>
                            Kosongkan jika tidak ingin
                            mengganti foto. Maksimal 2 MB.
                        </small>
                    </div>

                    <div className="pengiriman-form-group pengiriman-form-full">
                        <label htmlFor="catatan">
                            Catatan
                        </label>

                        <textarea
                            id="catatan"
                            value={catatan}
                            onChange={(e) =>
                                setCatatan(
                                    e.target.value
                                )
                            }
                            rows="4"
                        />
                    </div>
                </div>
            </FormModal>
        </div>
    );
}

export default PengirimanEditPage;