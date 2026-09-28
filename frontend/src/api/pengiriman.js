import api from "./axios";

export const getPengiriman = async () => {
    const response = await api.get("/pengiriman");
    return response.data;
};

export const getPengirimanById = async (id) => {
    const response = await api.get(`/pengiriman/${id}`);
    return response.data;
};

export const createPengiriman = async (data) => {
    const response = await api.post("/pengiriman", data);
    return response.data;
};

export const updatePengiriman = async (id, data) => {
    const response = await api.post(
        `/pengiriman/${id}?_method=PUT`,
        data
    );

    return response.data;
};

export const updateStatusPengiriman = async (id, status) => {
    const response = await api.put(
        `/pengiriman/${id}/status`,
        {
            status,
        }
    );

    return response.data;
};

export const updateResiPengiriman = async (id, nomor_resi) => {
    const response = await api.put(
        `/pengiriman/${id}/resi`,
        {
            nomor_resi,
        }
    );

    return response.data;
};

export const getTrackingPengiriman = async (transaksiId) => {
    const response = await api.get(
        `/pengiriman/transaksi/${transaksiId}/tracking`
    );

    return response.data;
};

export const deletePengiriman = async (id) => {
    const response = await api.delete(`/pengiriman/${id}`);
    return response.data;
};

export const getPengirimanFormData = async () => {
    const response = await api.get("/pengiriman/create");
    return response.data;
};