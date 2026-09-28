import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import api from "../api/axios";
import { createRetur } from "../api/retur";
import { getProduk } from "../api/produk";
import { getUkuran } from "../api/ukuran";
import { getWarna } from "../api/warna";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Retur.css";

const normalizeResponse = (response) => {
    return response?.data?.data ?? response?.data ?? response ?? [];
};

function ReturCreatePage() {
    const navigate = useNavigate();

    const [produks, setProduks] = useState([]);
    const [ukurans, setUkurans] = useState([]);
    const [warnas, setWarnas] = useState([]);
    const [transaksis, setTransaksis] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [transaksiId, setTransaksiId] = useState("");
    const [produkId, setProdukId] = useState("");
    const [ukuranId, setUkuranId] = useState("");
    const [warnaId, setWarnaId] = useState("");
    const [jumlah, setJumlah] = useState(1);
    const [alasan, setAlasan] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [tanggalRetur, setTanggalRetur] = useState("");

    useEffect(() => {
        const today = new Date()
            .toISOString()
            .split("T")[0];

        setTanggalRetur(today);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [
                    produkResponse,
                    ukuranResponse,
                    warnaResponse,
                    transaksiResponse,
                ] = await Promise.all([
                    getProduk(),
                    getUkuran(),
                    getWarna(),
                    api.get("/transaksi"),
                ]);

                const produkData =
                    normalizeResponse(produkResponse);

                const ukuranData =
                    normalizeResponse(ukuranResponse);

                const warnaData =
                    normalizeResponse(warnaResponse);

                const transaksiData =
                    normalizeResponse(transaksiResponse);

                setProduks(
                    Array.isArray(produkData)
                        ? produkData
                        : []
                );

                setUkurans(
                    Array.isArray(ukuranData)
                        ? ukuranData
                        : []
                );

                setWarnas(
                    Array.isArray(warnaData)
                        ? warnaData
                        : []
                );

                setTransaksis(
                    Array.isArray(transaksiData)
                        ? transaksiData
                        : []
                );
            } catch (error) {
                console.error(
                    "Gagal mengambil data referensi retur:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text:
                        error?.response?.data?.message ||
                        "Data referensi retur gagal dimuat.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!transaksiId) {
            Swal.fire({
                icon: "warning",
                title: "Transaksi Belum Dipilih",
                text: "Silakan pilih transaksi terlebih dahulu.",
            });
            return;
        }

        if (!produkId) {
            Swal.fire({
                icon: "warning",
                title: "Produk Belum Dipilih",
                text: "Silakan pilih produk terlebih dahulu.",
            });
            return;
        }

        if (!jumlah || Number(jumlah) < 1) {
            Swal.fire({
                icon: "warning",
                title: "Jumlah Tidak Valid",
                text: "Jumlah retur minimal 1.",
            });
            return;
        }

        if (!alasan.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Alasan Belum Diisi",
                text: "Silakan masukkan alasan retur.",
            });
            return;
        }

        if (!tanggalRetur) {
            Swal.fire({
                icon: "warning",
                title: "Tanggal Belum Dipilih",
                text: "Silakan pilih tanggal retur.",
            });
            return;
        }

        const confirmResult = await Swal.fire({
            icon: "question",
            title: "Simpan Retur?",
            text: "Data retur akan disimpan dan stok akan ditambahkan.",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            setSubmitting(true);

            await createRetur({
                transaksi_id: transaksiId,
                produk_id: produkId,
                ukuran_id: ukuranId || null,
                warna_id: warnaId || null,
                jumlah: Number(jumlah),
                alasan: alasan.trim(),
                keterangan: keterangan.trim() || null,
                tanggal_retur: tanggalRetur,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data retur berhasil disimpan.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/retur");
        } catch (error) {
            console.error(
                "Gagal menyimpan retur:",
                error
            );

            const validationErrors =
                error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                "Data retur gagal disimpan.";

            if (validationErrors) {
                message = Object.values(validationErrors)
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
            <div className="retur-page">
                <Loading text="Memuat form retur..." />
            </div>
        );
    }

    return (
        <div className="retur-page">
            <FormModal
                show={true}
                title="Tambah Retur"
                onClose={() => navigate("/retur")}
                onSubmit={handleSubmit}
                submitText="Simpan Retur"
                cancelText="Batal"
                loading={submitting}
                size="large"
            >
                <div className="retur-form-grid">
                    <div className="retur-form-group">
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

                                return (
                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {item?.kode_transaksi
                                            ? item.kode_transaksi
                                            : `Transaksi #${id}`}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="retur-form-group">
                        <label htmlFor="produk_id">
                            Produk
                        </label>

                        <select
                            id="produk_id"
                            value={produkId}
                            onChange={(e) =>
                                setProdukId(
                                    e.target.value
                                )
                            }
                            required
                        >
                            <option value="">
                                -- Pilih Produk --
                            </option>

                            {produks.map((item) => {
                                const id =
                                    item?.id ??
                                    item?.id_produk;

                                return (
                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {item?.nama_produk ??
                                            "-"}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="retur-form-group">
                        <label htmlFor="ukuran_id">
                            Ukuran
                        </label>

                        <select
                            id="ukuran_id"
                            value={ukuranId}
                            onChange={(e) =>
                                setUkuranId(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                -- Tanpa Ukuran --
                            </option>

                            {ukurans.map((item) => {
                                const id =
                                    item?.id ??
                                    item?.id_ukuran;

                                return (
                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {item?.nama_ukuran ??
                                            "-"}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="retur-form-group">
                        <label htmlFor="warna_id">
                            Warna
                        </label>

                        <select
                            id="warna_id"
                            value={warnaId}
                            onChange={(e) =>
                                setWarnaId(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                -- Tanpa Warna --
                            </option>

                            {warnas.map((item) => {
                                const id =
                                    item?.id ??
                                    item?.id_warna;

                                return (
                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {item?.nama_warna ??
                                            "-"}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="retur-form-group">
                        <label htmlFor="jumlah">
                            Jumlah
                        </label>

                        <input
                            id="jumlah"
                            type="number"
                            min="1"
                            value={jumlah}
                            onChange={(e) =>
                                setJumlah(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="retur-form-group">
                        <label htmlFor="tanggal_retur">
                            Tanggal Retur
                        </label>

                        <input
                            id="tanggal_retur"
                            type="date"
                            value={tanggalRetur}
                            onChange={(e) =>
                                setTanggalRetur(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="retur-form-group retur-form-full">
                        <label htmlFor="alasan">
                            Alasan Retur
                        </label>

                        <input
                            id="alasan"
                            type="text"
                            value={alasan}
                            onChange={(e) =>
                                setAlasan(
                                    e.target.value
                                )
                            }
                            placeholder="Contoh: Produk rusak"
                            maxLength={255}
                            required
                        />
                    </div>

                    <div className="retur-form-group retur-form-full">
                        <label htmlFor="keterangan">
                            Keterangan
                        </label>

                        <textarea
                            id="keterangan"
                            value={keterangan}
                            onChange={(e) =>
                                setKeterangan(
                                    e.target.value
                                )
                            }
                            placeholder="Keterangan tambahan jika diperlukan..."
                            rows="4"
                        />
                    </div>
                </div>
            </FormModal>
        </div>
    );
}

export default ReturCreatePage;