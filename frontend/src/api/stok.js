import api from "./axios";

export const getStok = async () => {
    const response = await api.get("/stok");

    return response.data;
};

export const getStokById = async (id) => {
    const response = await api.get(`/stok/${id}`);

    return response.data;
};

export const createStok = async (data) => {
    const response = await api.post("/stok", data);

    return response.data;
};

export const updateStok = async (id, data) => {
    const response = await api.put(`/stok/${id}`, data);

    return response.data;
};

export const deleteStok = async (id) => {
    const response = await api.delete(`/stok/${id}`);

    return response.data;
};