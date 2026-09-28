import api from "./axios";

export const getNotifikasi = async () => {
    const response = await api.get("/notifikasi");

    return response.data;
};

export const getNotifikasiById = async (id) => {
    const response = await api.get(`/notifikasi/${id}`);

    return response.data;
};

export const createNotifikasi = async (data) => {
    const response = await api.post("/notifikasi", data);

    return response.data;
};

export const updateNotifikasi = async (id, data) => {
    const response = await api.put(`/notifikasi/${id}`, data);

    return response.data;
};

export const deleteNotifikasi = async (id) => {
    const response = await api.delete(`/notifikasi/${id}`);

    return response.data;
};