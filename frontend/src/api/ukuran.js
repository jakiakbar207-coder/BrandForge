import api from "./axios";

export const getUkuran = async () => {
    const response = await api.get("/ukuran");

    return response.data;
};

export const getUkuranById = async (id) => {
    const response = await api.get(`/ukuran/${id}`);

    return response.data;
};

export const createUkuran = async (data) => {
    const response = await api.post("/ukuran", data);

    return response.data;
};

export const updateUkuran = async (id, data) => {
    const response = await api.put(`/ukuran/${id}`, data);

    return response.data;
};

export const deleteUkuran = async (id) => {
    const response = await api.delete(`/ukuran/${id}`);

    return response.data;
};