import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    createPengiriman,
    getPengirimanFormData,
} from "../api/pengiriman";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Pengiriman.css";

const normalizeResponse = (response) => {
    return response?.data?.data ?? response?.data ?? response ?? {};
};

function PengirimanCreatePage() {
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

    useEffect(() => {
        const loadFormData = async () => {
            try {
                setLoading(true);

                const response =
                    await getPengirimanFormData();

                const data =
                    normalizeResponse(response);

                setTransaksis(
                    Array.isArray(data?.transaksis)
                        ? data.transaksis
                        : []
                );
            } catch (error) {
                console.error(
                    "Gagal mengambil data form pengiriman:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text:
                        error?.response?.data?.message ||
                        "Data transaksi gagal dimuat.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadFormData();
    }, []);

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
            title: "Simpan Pengiriman?",
            text: "Data pengiriman akan disimpan.",
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
            }

            formData.append("status", status);

            if (catatan.trim()) {
                formData.append(
                    "catatan",
                    catatan.trim()
                );
            }

            if (fotoProduk) {
                formData.append(
                    "foto_produk",
                    fotoProduk
                );
            }

            await createPengiriman(formData);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data pengiriman berhasil disimpan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/pengiriman");
        } catch (error) {
            console.error(
                "Gagal menyimpan pengiriman:",
                error
            );

            const errors =
                error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                "Data pengiriman gagal disimpan.";

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

    if (loading) {
        return (
            <div className="pengiriman-page">
                <Loading text="Memuat form pengiriman..." />
            </div>
        );
    }

    return (
        <div className="pengiriman-page">
            <FormModal
                show={true}
                title="Tambah Pengiriman"
                onClose={() =>
                    navigate("/pengiriman")
                }
                onSubmit={handleSubmit}
                submitText="Simpan Pengiriman"
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
                                const id =
                                    item?.id ??
                                    item?.id_transaksi;

                                const kode =
                                    item?.kode_transaksi;

                                return (
                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {kode
                                            ? `${kode} (#${id})`
                                            : `Transaksi #${id}`}
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
                            placeholder="Contoh: JNE"
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
                            placeholder="Contoh: REG"
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
                            placeholder="0"
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
                            placeholder="Opsional"
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
                            Format JPG, JPEG, PNG, atau
                            WEBP. Maksimal 2 MB.
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
                            placeholder="Catatan tambahan..."
                        />
                    </div>
                </div>
            </FormModal>
        </div>
    );
}

export default PengirimanCreatePage;