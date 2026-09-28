import api from "./axios";

export const getPembelian = async () => {
    const response = await api.get("/pembelian");

    return response.data;
};

export const getPembelianById = async (id) => {
    const response = await api.get(`/pembelian/${id}`);

    return response.data;
};

export const createPembelian = async (data) => {
    const response = await api.post("/pembelian", data);

    return response.data;
};

export const updatePembelian = async (id, data) => {
    const response = await api.put(`/pembelian/${id}`, data);

    return response.data;
};

export const deletePembelian = async (id) => {
    const response = await api.delete(`/pembelian/${id}`);

    return response.data;
};