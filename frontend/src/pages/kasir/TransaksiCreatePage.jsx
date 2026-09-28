import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getTransaksiKasirCreate,
    createTransaksiKasir,
} from "../../api/transaksi";

import Loading from "../../components/common/Loading";

import "./Transaksi.css";

function TransaksiCreatePage() {
    const navigate = useNavigate();

    const [stoks, setStoks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [selectedStok, setSelectedStok] = useState(null);
    const [jumlah, setJumlah] = useState(1);

    const [items, setItems] = useState([]);
    const [bayar, setBayar] = useState("");

    useEffect(() => {
        loadStok();
    }, []);

    const loadStok = async () => {
        setLoading(true);

        try {
            const response = await getTransaksiKasirCreate();

            const data = response?.stoks || [];

            setStoks(data);
        } catch (error) {
            console.error("Gagal mengambil stok:", error);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Data stok gagal dimuat.",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value) || 0);
    };

    const filteredStoks = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return stoks;
        }

        return stoks.filter((stok) => {
            const namaProduk = String(
                stok.produk?.nama_produk || ""
            ).toLowerCase();

            const namaUkuran = String(
                stok.ukuran?.nama_ukuran || ""
            ).toLowerCase();

            const namaWarna = String(
                stok.warna?.nama_warna || ""
            ).toLowerCase();

            return (
                namaProduk.includes(keyword) ||
                namaUkuran.includes(keyword) ||
                namaWarna.includes(keyword)
            );
        });
    }, [stoks, search]);

    const totalHarga = useMemo(() => {
        return items.reduce((total, item) => {
            return total + item.subtotal;
        }, 0);
    }, [items]);

    const jumlahBayar = Number(bayar) || 0;

    const kembalian = Math.max(
        jumlahBayar - totalHarga,
        0
    );

    const pembayaranKurang =
        bayar !== "" && jumlahBayar < totalHarga;

    const handleSelectStok = (stok) => {
        setSelectedStok(stok);
        setJumlah(1);
    };

    const handleTambahItem = () => {
        if (!selectedStok) {
            Swal.fire({
                icon: "warning",
                title: "Pilih Produk",
                text: "Silakan pilih produk terlebih dahulu.",
            });

            return;
        }

        const jumlahInput = Number(jumlah);

        if (
            !jumlahInput ||
            jumlahInput < 1
        ) {
            Swal.fire({
                icon: "warning",
                title: "Jumlah Tidak Valid",
                text: "Jumlah produk minimal 1.",
            });

            return;
        }

        if (jumlahInput > selectedStok.jumlah) {
            Swal.fire({
                icon: "warning",
                title: "Stok Tidak Cukup",
                text:
                    `Stok tersedia hanya ${selectedStok.jumlah} produk.`,
            });

            return;
        }

        const harga =
            Number(selectedStok.produk?.harga) || 0;

        setItems((previous) => {
            const existingIndex = previous.findIndex(
                (item) =>
                    item.stok_id === selectedStok.id
            );

            if (existingIndex !== -1) {
                const updated = [...previous];

                const existing =
                    updated[existingIndex];

                const jumlahBaru =
                    existing.jumlah +
                    jumlahInput;

                if (
                    jumlahBaru >
                    selectedStok.jumlah
                ) {
                    Swal.fire({
                        icon: "warning",
                        title: "Stok Tidak Cukup",
                        text:
                            `Stok tersedia hanya ${selectedStok.jumlah} produk.`,
                    });

                    return previous;
                }

                updated[existingIndex] = {
                    ...existing,
                    jumlah: jumlahBaru,
                    subtotal:
                        harga * jumlahBaru,
                };

                return updated;
            }

            return [
                ...previous,
                {
                    stok_id: selectedStok.id,
                    produk_id:
                        selectedStok.produk_id,
                    nama_produk:
                        selectedStok.produk
                            ?.nama_produk ||
                        "-",
                    ukuran:
                        selectedStok.ukuran
                            ?.nama_ukuran ||
                        "-",
                    warna:
                        selectedStok.warna
                            ?.nama_warna ||
                        "-",
                    harga,
                    jumlah: jumlahInput,
                    stokTersedia:
                        selectedStok.jumlah,
                    subtotal:
                        harga * jumlahInput,
                },
            ];
        });

        setSelectedStok(null);
        setJumlah(1);
    };

    const handleUbahJumlah = (
        index,
        value
    ) => {
        const jumlahBaru = Number(value);

        if (
            !jumlahBaru ||
            jumlahBaru < 1
        ) {
            return;
        }

        setItems((previous) => {
            const updated = [...previous];

            const item = updated[index];

            if (
                jumlahBaru >
                item.stokTersedia
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "Stok Tidak Cukup",
                    text:
                        `Stok tersedia hanya ${item.stokTersedia} produk.`,
                });

                return previous;
            }

            updated[index] = {
                ...item,
                jumlah: jumlahBaru,
                subtotal:
                    item.harga *
                    jumlahBaru,
            };

            return updated;
        });
    };

    const handleHapusItem = (index) => {
        setItems((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (items.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Transaksi Kosong",
                text: "Tambahkan minimal satu produk.",
            });

            return;
        }

        if (
            !bayar ||
            jumlahBayar <= 0
        ) {
            Swal.fire({
                icon: "warning",
                title: "Pembayaran Belum Diisi",
                text: "Masukkan jumlah uang pembayaran.",
            });

            return;
        }

        if (jumlahBayar < totalHarga) {
            Swal.fire({
                icon: "warning",
                title: "Pembayaran Kurang",
                text:
                    `Uang pembayaran kurang ${formatRupiah(
                        totalHarga - jumlahBayar
                    )}.`,
            });

            return;
        }

        setSaving(true);

        try {
            const payload = {
                items: items.map((item) => ({
                    stok_id: item.stok_id,
                    jumlah: item.jumlah,
                })),
                bayar: jumlahBayar,
            };

            const response =
                await createTransaksiKasir(
                    payload
                );

            const transaksi =
                response?.data;

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    response?.message ||
                    "Transaksi berhasil disimpan.",
                timer: 1500,
                showConfirmButton: false,
            });

            if (transaksi?.id) {
                navigate(
                    `/kasir/transaksi/detail/${transaksi.id}`
                );
            } else {
                navigate("/kasir/transaksi");
            }
        } catch (error) {
            console.error(
                "Gagal menyimpan transaksi:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    error.response?.data?.message ||
                    "Transaksi gagal disimpan.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="transaksi-page">
                <Loading />
            </div>
        );
    }

    return (
        <div className="transaksi-page">
            <div className="transaksi-page-header">
                <div>
                    <h1>Transaksi Baru</h1>

                    <p>
                        Input transaksi penjualan Kasir
                    </p>
                </div>

                <button
                    type="button"
                    className="transaksi-secondary-button"
                    onClick={() =>
                        navigate(
                            "/kasir/transaksi"
                        )
                    }
                >
                    <i className="bi bi-arrow-left"></i>
                    Kembali
                </button>
            </div>

            <form
                className="transaksi-create-layout"
                onSubmit={handleSubmit}
            >
                <div className="transaksi-card">
                    <div className="transaksi-card-header">
                        <h2>Pilih Produk</h2>
                    </div>

                    <div className="transaksi-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Cari produk, ukuran, atau warna..."
                        />
                    </div>

                    <div className="transaksi-product-list">
                        {filteredStoks.length === 0 ? (
                            <div className="transaksi-empty-products">
                                <i className="bi bi-box-seam"></i>

                                <span>
                                    Produk dengan stok tersedia tidak ditemukan.
                                </span>
                            </div>
                        ) : (
                            filteredStoks.map(
                                (stok) => (
                                    <button
                                        type="button"
                                        key={stok.id}
                                        className={
                                            selectedStok?.id ===
                                            stok.id
                                                ? "transaksi-product-item selected"
                                                : "transaksi-product-item"
                                        }
                                        onClick={() =>
                                            handleSelectStok(
                                                stok
                                            )
                                        }
                                    >
                                        <div className="transaksi-product-info">
                                            <strong>
                                                {
                                                    stok.produk
                                                        ?.nama_produk
                                                }
                                            </strong>

                                            <span>
                                                Ukuran:{" "}
                                                {stok.ukuran
                                                    ?.nama_ukuran ||
                                                    "-"}
                                            </span>

                                            <span>
                                                Warna:{" "}
                                                {stok.warna
                                                    ?.nama_warna ||
                                                    "-"}
                                            </span>
                                        </div>

                                        <div className="transaksi-product-price">
                                            <strong>
                                                {formatRupiah(
                                                    stok
                                                        .produk
                                                        ?.harga
                                                )}
                                            </strong>

                                            <span>
                                                Stok:{" "}
                                                {
                                                    stok.jumlah
                                                }
                                            </span>
                                        </div>
                                    </button>
                                )
                            )
                        )}
                    </div>

                    {selectedStok && (
                        <div className="transaksi-selected-product">
                            <div>
                                <strong>
                                    {
                                        selectedStok
                                            .produk
                                            ?.nama_produk
                                    }
                                </strong>

                                <span>
                                    Ukuran:{" "}
                                    {selectedStok
                                        .ukuran
                                        ?.nama_ukuran ||
                                        "-"}
                                    {" • "}
                                    Warna:{" "}
                                    {selectedStok
                                        .warna
                                        ?.nama_warna ||
                                        "-"}
                                </span>
                            </div>

                            <div className="transaksi-quantity-control">
                                <label>
                                    Jumlah
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max={
                                        selectedStok.jumlah
                                    }
                                    value={jumlah}
                                    onChange={(
                                        event
                                    ) =>
                                        setJumlah(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="transaksi-primary-button"
                                    onClick={
                                        handleTambahItem
                                    }
                                >
                                    <i className="bi bi-cart-plus"></i>
                                    Tambahkan
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="transaksi-card">
                    <div className="transaksi-card-header">
                        <h2>Keranjang Transaksi</h2>

                        <span>
                            {items.length} item
                        </span>
                    </div>

                    {items.length === 0 ? (
                        <div className="transaksi-empty-cart">
                            <i className="bi bi-cart3"></i>

                            <strong>
                                Belum Ada Produk
                            </strong>

                            <span>
                                Pilih produk untuk membuat transaksi.
                            </span>
                        </div>
                    ) : (
                        <div className="transaksi-cart-list">
                            {items.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        className="transaksi-cart-item"
                                        key={
                                            item.stok_id
                                        }
                                    >
                                        <div className="transaksi-cart-item-info">
                                            <strong>
                                                {
                                                    item.nama_produk
                                                }
                                            </strong>

                                            <span>
                                                {item.ukuran}{" "}
                                                •{" "}
                                                {item.warna}
                                            </span>

                                            <span>
                                                {formatRupiah(
                                                    item.harga
                                                )}{" "}
                                                / item
                                            </span>
                                        </div>

                                        <div className="transaksi-cart-item-actions">
                                            <input
                                                type="number"
                                                min="1"
                                                max={
                                                    item.stokTersedia
                                                }
                                                value={
                                                    item.jumlah
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleUbahJumlah(
                                                        index,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                            <strong>
                                                {formatRupiah(
                                                    item.subtotal
                                                )}
                                            </strong>

                                            <button
                                                type="button"
                                                className="transaksi-icon-danger"
                                                onClick={() =>
                                                    handleHapusItem(
                                                        index
                                                    )
                                                }
                                                title="Hapus"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    <div className="transaksi-summary">
                        <div>
                            <span>
                                Total
                            </span>

                            <strong>
                                {formatRupiah(
                                    totalHarga
                                )}
                            </strong>
                        </div>

                        <div className="transaksi-payment-input">
                            <label>
                                Uang Bayar
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={bayar}
                                onChange={(
                                    event
                                ) =>
                                    setBayar(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Masukkan uang bayar"
                            />
                        </div>

                        <div>
                            <span>
                                Kembalian
                            </span>

                            <strong>
                                {formatRupiah(
                                    kembalian
                                )}
                            </strong>
                        </div>

                        {pembayaranKurang && (
                            <div className="transaksi-payment-warning">
                                <i className="bi bi-exclamation-circle"></i>

                                Pembayaran masih kurang{" "}
                                {formatRupiah(
                                    totalHarga -
                                        jumlahBayar
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="transaksi-submit-button"
                        disabled={
                            saving ||
                            items.length === 0 ||
                            pembayaranKurang
                        }
                    >
                        <i className="bi bi-check-circle"></i>

                        {saving
                            ? "Menyimpan..."
                            : "Simpan Transaksi"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TransaksiCreatePage;