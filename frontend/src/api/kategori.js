import api from "./axios";

export const getKategori = async () => {
    const response = await api.get("/kategori");

    return response.data;
};

export const getKategoriById = async (id) => {
    const response = await api.get(`/kategori/${id}`);

    return response.data;
};

export const createKategori = async (data) => {
    const response = await api.post("/kategori", data);

    return response.data;
};

export const updateKategori = async (id, data) => {
    const response = await api.put(`/kategori/${id}`, data);

    return response.data;
};

export const deleteKategori = async (id) => {
    const response = await api.delete(`/kategori/${id}`);

    return response.data;
};