import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getPembelianById,
    updatePembelian,
} from "../api/pembelian";

import { getSupplier } from "../api/supplier";
import { getProduk } from "../api/produk";
import { getUkuran } from "../api/ukuran";
import { getWarna } from "../api/warna";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./Pembelian.css";

function PembelianEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [suppliers, setSuppliers] = useState([]);
    const [produks, setProduks] = useState([]);
    const [ukurans, setUkurans] = useState([]);
    const [warnas, setWarnas] = useState([]);

    const [supplierId, setSupplierId] = useState("");
    const [tanggalPembelian, setTanggalPembelian] = useState("");
    const [catatan, setCatatan] = useState("");

    const [details, setDetails] = useState([]);

    const [loadingData, setLoadingData] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const normalizeData = (response) => {
        const data =
            response?.data?.data ??
            response?.data ??
            response ??
            [];

        return Array.isArray(data) ? data : [];
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);

                const [
                    pembelianResponse,
                    supplierResponse,
                    produkResponse,
                    ukuranResponse,
                    warnaResponse,
                ] = await Promise.all([
                    getPembelianById(id),
                    getSupplier(),
                    getProduk(),
                    getUkuran(),
                    getWarna(),
                ]);

                const pembelian =
                    pembelianResponse?.data?.data ??
                    pembelianResponse?.data ??
                    pembelianResponse;

                setSuppliers(normalizeData(supplierResponse));
                setProduks(normalizeData(produkResponse));
                setUkurans(normalizeData(ukuranResponse));
                setWarnas(normalizeData(warnaResponse));

                if (!pembelian) {
                    throw new Error(
                        "Data pembelian tidak ditemukan."
                    );
                }

                setSupplierId(
                    pembelian.supplier_id
                        ? String(pembelian.supplier_id)
                        : pembelian.supplier?.id
                        ? String(pembelian.supplier.id)
                        : ""
                );

                setTanggalPembelian(
                    pembelian.tanggal_pembelian
                        ? String(
                              pembelian.tanggal_pembelian
                          ).substring(0, 10)
                        : ""
                );

                setCatatan(
                    pembelian.keterangan ??
                        pembelian.catatan ??
                        ""
                );

                const detailPembelian = Array.isArray(
                    pembelian.details
                )
                    ? pembelian.details
                    : [];

                setDetails(
                    detailPembelian.length > 0
                        ? detailPembelian.map((item) => ({
                              id: item.id,
                              produk_id: item.produk_id
                                  ? String(
                                        item.produk_id
                                    )
                                  : item.produk?.id
                                  ? String(
                                        item.produk.id
                                    )
                                  : "",
                              ukuran_id: item.ukuran_id
                                  ? String(
                                        item.ukuran_id
                                    )
                                  : item.ukuran?.id
                                  ? String(
                                        item.ukuran.id
                                    )
                                  : "",
                              warna_id: item.warna_id
                                  ? String(
                                        item.warna_id
                                    )
                                  : item.warna?.id
                                  ? String(
                                        item.warna.id
                                    )
                                  : "",
                              jumlah: item.jumlah ?? 1,
                              harga_modal:
                                  item.harga_modal ?? 0,
                          }))
                        : [
                              {
                                  produk_id: "",
                                  ukuran_id: "",
                                  warna_id: "",
                                  jumlah: 1,
                                  harga_modal: 0,
                              },
                          ]
                );
            } catch (error) {
                console.error(
                    "Gagal mengambil data pembelian:",
                    error
                );

                let message =
                    "Data pembelian gagal dimuat.";

                if (error.response?.status === 404) {
                    message =
                        "Data pembelian tidak ditemukan.";
                } else if (
                    error.response?.status === 401
                ) {
                    message =
                        "Sesi login telah berakhir. Silakan login kembali.";
                } else if (
                    error.response?.data?.message
                ) {
                    message =
                        error.response.data.message;
                } else if (error.message) {
                    message = error.message;
                }

                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: message,
                });

                navigate("/pembelian");
            } finally {
                setLoadingData(false);
            }
        };

        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "ID pembelian tidak ditemukan.",
            }).then(() => {
                navigate("/pembelian");
            });

            return;
        }

        loadData();
    }, [id, navigate]);

    const updateDetail = (index, field, value) => {
        setDetails((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };

    const addDetail = () => {
        setDetails((current) => [
            ...current,
            {
                produk_id: "",
                ukuran_id: "",
                warna_id: "",
                jumlah: 1,
                harga_modal: 0,
            },
        ]);
    };

    const removeDetail = (index) => {
        if (details.length === 1) {
            return;
        }

        setDetails((current) =>
            current.filter(
                (_, itemIndex) => itemIndex !== index
            )
        );
    };

    const totalHarga = useMemo(() => {
        return details.reduce((total, item) => {
            const jumlah = Number(item.jumlah) || 0;
            const harga = Number(item.harga_modal) || 0;

            return total + jumlah * harga;
        }, 0);
    }, [details]);

    const handleSubmit = async () => {
        if (!supplierId) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Supplier wajib dipilih.",
            });

            return;
        }

        if (!tanggalPembelian) {
            Swal.fire({
                icon: "warning",
                title: "Data Belum Lengkap",
                text: "Tanggal pembelian wajib diisi.",
            });

            return;
        }

        if (details.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Detail Pembelian Kosong",
                text: "Minimal harus ada satu produk.",
            });

            return;
        }

        const invalidDetail = details.some(
            (item) =>
                !item.produk_id ||
                Number(item.jumlah) < 1 ||
                Number(item.harga_modal) < 0
        );

        if (invalidDetail) {
            Swal.fire({
                icon: "warning",
                title: "Data Detail Belum Lengkap",
                text:
                    "Produk, jumlah, dan harga modal harus diisi dengan benar.",
            });

            return;
        }

        const confirmation = await Swal.fire({
            icon: "question",
            title: "Simpan Perubahan?",
            text:
                "Stok akan disesuaikan berdasarkan data pembelian yang baru.",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        try {
            setLoadingSubmit(true);

            const payload = {
                supplier_id: supplierId,
                tanggal_pembelian: tanggalPembelian,
                catatan: catatan.trim() || null,

                produk_id: details.map(
                    (item) => item.produk_id
                ),

                ukuran_id: details.map(
                    (item) =>
                        item.ukuran_id || null
                ),

                warna_id: details.map(
                    (item) =>
                        item.warna_id || null
                ),

                jumlah: details.map((item) =>
                    Number(item.jumlah)
                ),

                harga_modal: details.map((item) =>
                    Number(item.harga_modal)
                ),
            };

            await updatePembelian(id, payload);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    "Pembelian berhasil diperbarui dan stok berhasil disesuaikan.",
                timer: 1800,
                showConfirmButton: false,
            });

            navigate("/pembelian");
        } catch (error) {
            console.error(
                "Gagal memperbarui pembelian:",
                error
            );

            const validationErrors =
                error.response?.data?.errors;

            const firstError = validationErrors
                ? Object.values(validationErrors)
                      .flat()[0]
                : null;

            let message =
                firstError ??
                error.response?.data?.message ??
                "Pembelian gagal diperbarui.";

            if (error.response?.status === 404) {
                message =
                    "Data pembelian tidak ditemukan.";
            }

            if (error.response?.status === 401) {
                message =
                    "Sesi login telah berakhir. Silakan login kembali.";
            }

            if (error.response?.status === 403) {
                message =
                    "Anda tidak memiliki izin untuk mengubah pembelian.";
            }

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loadingData) {
        return (
            <div className="pembelian-loading">
                <Loading />
            </div>
        );
    }

    return (
        <FormModal
            show={true}
            title={`Edit Pembelian #${id}`}
            onClose={() => navigate("/pembelian")}
            onSubmit={handleSubmit}
            submitText="Simpan Perubahan"
            cancelText="Batal"
            loading={loadingSubmit}
            size="large"
        >
            <div className="pembelian-form-grid">
                <div className="pembelian-form-group">
                    <label htmlFor="supplier_id">
                        Supplier<span>*</span>
                    </label>

                    <select
                        id="supplier_id"
                        value={supplierId}
                        onChange={(event) =>
                            setSupplierId(
                                event.target.value
                            )
                        }
                        disabled={loadingSubmit}
                    >
                        <option value="">
                            Pilih Supplier
                        </option>

                        {suppliers.map((supplier) => (
                            <option
                                key={supplier.id}
                                value={supplier.id}
                            >
                                {supplier.nama_supplier}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="pembelian-form-group">
                    <label htmlFor="tanggal_pembelian">
                        Tanggal Pembelian<span>*</span>
                    </label>

                    <input
                        id="tanggal_pembelian"
                        type="date"
                        value={tanggalPembelian}
                        onChange={(event) =>
                            setTanggalPembelian(
                                event.target.value
                            )
                        }
                        disabled={loadingSubmit}
                    />
                </div>

                <div className="pembelian-form-group pembelian-form-full">
                    <label htmlFor="catatan">
                        Catatan
                    </label>

                    <textarea
                        id="catatan"
                        value={catatan}
                        onChange={(event) =>
                            setCatatan(
                                event.target.value
                            )
                        }
                        placeholder="Masukkan catatan pembelian jika diperlukan"
                        disabled={loadingSubmit}
                    />
                </div>
            </div>

            <div className="pembelian-detail-header">
                <div>
                    <h3>Detail Pembelian</h3>

                    <p>
                        Ubah produk, ukuran, warna,
                        jumlah, atau harga modal.
                    </p>
                </div>

                <button
                    type="button"
                    className="pembelian-add-detail-button"
                    onClick={addDetail}
                    disabled={loadingSubmit}
                >
                    <i className="bi bi-plus-lg"></i>
                    Tambah Produk
                </button>
            </div>

            <div className="pembelian-detail-list">
                {details.map((item, index) => (
                    <div
                        className="pembelian-detail-item"
                        key={item.id ?? index}
                    >
                        <div className="pembelian-detail-number">
                            {index + 1}
                        </div>

                        <div className="pembelian-detail-fields">
                            <div className="pembelian-form-group">
                                <label>
                                    Produk<span>*</span>
                                </label>

                                <select
                                    value={
                                        item.produk_id
                                    }
                                    onChange={(event) =>
                                        updateDetail(
                                            index,
                                            "produk_id",
                                            event.target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loadingSubmit
                                    }
                                >
                                    <option value="">
                                        Pilih Produk
                                    </option>

                                    {produks.map(
                                        (produk) => (
                                            <option
                                                key={
                                                    produk.id
                                                }
                                                value={
                                                    produk.id
                                                }
                                            >
                                                {
                                                    produk.nama_produk
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="pembelian-form-group">
                                <label>
                                    Ukuran
                                </label>

                                <select
                                    value={
                                        item.ukuran_id
                                    }
                                    onChange={(event) =>
                                        updateDetail(
                                            index,
                                            "ukuran_id",
                                            event.target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loadingSubmit
                                    }
                                >
                                    <option value="">
                                        Pilih Ukuran
                                    </option>

                                    {ukurans.map(
                                        (ukuran) => (
                                            <option
                                                key={
                                                    ukuran.id
                                                }
                                                value={
                                                    ukuran.id
                                                }
                                            >
                                                {
                                                    ukuran.nama_ukuran
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="pembelian-form-group">
                                <label>
                                    Warna
                                </label>

                                <select
                                    value={
                                        item.warna_id
                                    }
                                    onChange={(event) =>
                                        updateDetail(
                                            index,
                                            "warna_id",
                                            event.target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loadingSubmit
                                    }
                                >
                                    <option value="">
                                        Pilih Warna
                                    </option>

                                    {warnas.map(
                                        (warna) => (
                                            <option
                                                key={
                                                    warna.id
                                                }
                                                value={
                                                    warna.id
                                                }
                                            >
                                                {
                                                    warna.nama_warna
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="pembelian-form-group">
                                <label>
                                    Jumlah<span>*</span>
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={
                                        item.jumlah
                                    }
                                    onChange={(event) =>
                                        updateDetail(
                                            index,
                                            "jumlah",
                                            event.target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loadingSubmit
                                    }
                                />
                            </div>

                            <div className="pembelian-form-group">
                                <label>
                                    Harga Modal<span>*</span>
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        item.harga_modal
                                    }
                                    onChange={(event) =>
                                        updateDetail(
                                            index,
                                            "harga_modal",
                                            event.target
                                                .value
                                        )
                                    }
                                    disabled={
                                        loadingSubmit
                                    }
                                />
                            </div>

                            <div className="pembelian-form-group">
                                <label>
                                    Subtotal
                                </label>

                                <input
                                    type="text"
                                    value={`Rp ${(
                                        Number(
                                            item.jumlah ||
                                                0
                                        ) *
                                        Number(
                                            item.harga_modal ||
                                                0
                                        )
                                    ).toLocaleString(
                                        "id-ID"
                                    )}`}
                                    disabled
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="pembelian-remove-detail"
                            onClick={() =>
                                removeDetail(index)
                            }
                            disabled={
                                loadingSubmit ||
                                details.length === 1
                            }
                            title="Hapus produk"
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                ))}
            </div>

            <div className="pembelian-total-box">
                <span>Total Pembelian</span>

                <strong>
                    Rp{" "}
                    {totalHarga.toLocaleString(
                        "id-ID"
                    )}
                </strong>
            </div>
        </FormModal>
    );
}

export default PembelianEditPage;