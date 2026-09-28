import api from "./axios";

export const getKasirDashboard = async () => {
    const response = await api.get("/kasir");
    return response.data;
};

export const getTransaksiKasir = async () => {
    const response = await api.get("/kasir/riwayat");
    return response.data;
};

export const getTransaksiKasirCreate = async () => {
    const response = await api.get("/kasir/transaksi");
    return response.data;
};

export const createTransaksiKasir = async (data) => {
    const response = await api.post("/kasir/transaksi", data);
    return response.data;
};

export const getTransaksiKasirById = async (id) => {
    const response = await api.get(`/kasir/detail/${id}`);
    return response.data;
};

export const verifikasiTransaksiKasir = async (id) => {
    const response = await api.put(
        `/kasir/transaksi/${id}/verifikasi`
    );

    return response.data;
};

export const selesaikanTransaksiKasir = async (id) => {
    const response = await api.put(
        `/kasir/transaksi/${id}/selesai`
    );

    return response.data;
};

export const deleteTransaksiKasir = async (id) => {
    const response = await api.delete(
        `/kasir/transaksi/${id}`
    );

    return response.data;
};

export const updateResiKasir = async (id, data) => {
    const response = await api.put(
        `/kasir/pengiriman/${id}/resi`,
        data
    );

    return response.data;
};

export const updateStatusPengirimanKasir = async (id, data) => {
    const response = await api.put(
        `/kasir/pengiriman/${id}/status`,
        data
    );

    return response.data;
};

export const getLabelPengirimanKasir = async (id) => {
    const response = await api.get(
        `/kasir/pengiriman/${id}/label`
    );

    return response.data;
};

export const getBuktiPembayaranKasir = async (id) => {
    const response = await api.get(
        `/kasir/transaksi/${id}/bukti`
    );

    return response.data;
};

export const getBuktiProdukKasir = async (id) => {
    const response = await api.get(
        `/kasir/transaksi/${id}/produk`
    );

    return response.data;
};

export const getStrukKasir = async (id) => {
    const response = await api.get(
        `/kasir/struk/${id}`
    );

    return response.data;
};