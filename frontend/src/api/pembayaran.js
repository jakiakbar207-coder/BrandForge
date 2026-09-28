import api from "./axios";

export const getPembayaranById = async (id) => {
    const response = await api.get(`/pembayaran/${id}`);

    return response.data;
};

export const uploadBuktiPembayaran = async (id, data) => {
    const response = await api.post(
        `/pembayaran/${id}/upload`,
        data
    );

    return response.data;
};