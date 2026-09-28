import api from "./axios";

export const getWarna = async () => {
    const response = await api.get("/warna");

    return response.data;
};

export const getWarnaById = async (id) => {
    const response = await api.get(`/warna/${id}`);

    return response.data;
};

export const createWarna = async (data) => {
    const response = await api.post("/warna", data);

    return response.data;
};

export const updateWarna = async (id, data) => {
    const response = await api.put(`/warna/${id}`, data);

    return response.data;
};

export const deleteWarna = async (id) => {
    const response = await api.delete(`/warna/${id}`);

    return response.data;
};