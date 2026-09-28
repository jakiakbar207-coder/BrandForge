import api from "./axios";

export const getPelangganDashboard = async () => {
    const response = await api.get("/pelanggan");
    return response.data;
};

export const getPelangganStatus = async () => {
    const response = await api.get("/pelanggan/dashboard-status");
    return response.data;
};

export const getPelangganNotifikasi = async () => {
    const response = await api.get("/pelanggan/notifikasi");
    return response.data;
};  

export const getPelangganBelanja = async (params = {}) => {
    const response = await api.get("/pelanggan/belanja", {
        params,
    });
    return response.data;
};

export const getPelangganDetail = async (id) => {
    const response = await api.get(`/pelanggan/detail/${id}`);
    return response.data;
};

export const beliSekarang = async (produkId, data) => {
    const response = await api.post(
        `/pelanggan/beli-sekarang/${produkId}`,
        data
    );
    return response.data;
};

export const getKeranjang = async () => {
    const response = await api.get("/pelanggan/keranjang");
    return response.data;
};

export const tambahKeranjang = async (produkId, data) => {
    const response = await api.post(
        `/pelanggan/keranjang/tambah/${produkId}`,
        data
    );
    return response.data;
};

export const hapusKeranjang = async (id) => {
    const response = await api.delete(
        `/pelanggan/keranjang/${id}`
    );
    return response.data;
};

export const getCheckout = async () => {
    const response = await api.get("/pelanggan/checkout");
    return response.data;
};

export const prosesCheckout = async (data = {}) => {
    const response = await api.post(
        "/pelanggan/checkout",
        data
    );
    return response.data;
};

export const getAlamat = async (transaksiId) => {
    const response = await api.get(
        `/pelanggan/alamat/${transaksiId}`
    );
    return response.data;
};

export const simpanAlamat = async (transaksiId, data) => {
    const response = await api.post(
        `/pelanggan/alamat/${transaksiId}`,
        data
    );
    return response.data;
};

export const getPembayaran = async (transaksiId) => {
    const response = await api.get(
        `/pembayaran/${transaksiId}`
    );
    return response.data;
};

export const uploadBuktiPembayaran = async (
    transaksiId,
    data
) => {
    const response = await api.post(
        `/pembayaran/${transaksiId}/upload`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getRiwayatTransaksi = async () => {
    const response = await api.get(
        "/pelanggan/riwayat"
    );
    return response.data;
};

export const hapusTransaksi = async (id) => {
    const response = await api.delete(
        `/pelanggan/transaksi/${id}`
    );
    return response.data;
};

export const getTrackingPesanan = async (transaksiId) => {
    const response = await api.get(
        `/pelanggan/pesanan/${transaksiId}/tracking`
    );
    return response.data;
};

export const uploadFotoProduk = async (
    transaksiId,
    data
) => {
    const response = await api.post(
        `/pelanggan/upload-foto-produk/${transaksiId}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getWishlist = async () => {
    const response = await api.get("/wishlist");
    return response.data;
};

export const tambahWishlist = async (produkId) => {
    const response = await api.post(
        `/wishlist/${produkId}`
    );
    return response.data;
};

export const hapusWishlist = async (produkId) => {
    const response = await api.delete(
        `/wishlist/${produkId}`
    );
    return response.data;
};

export const getReview = async (detailTransaksiId) => {
    const response = await api.get(
        `/pelanggan/review/${detailTransaksiId}`
    );
    return response.data;
};

export const kirimReview = async (
    detailTransaksiId,
    data
) => {
    const response = await api.post(
        `/pelanggan/review/${detailTransaksiId}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const hapusReview = async (reviewId) => {
    const response = await api.delete(
        `/pelanggan/review/${reviewId}`
    );
    return response.data;
};