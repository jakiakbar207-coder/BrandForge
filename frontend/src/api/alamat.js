import api from "./axios";

export const getAlamat = async () => {
    const response = await api.get("/alamat");

    return response.data;
};

export const getAlamatById = async (id) => {
    const response = await api.get(`/alamat/${id}`);

    return response.data;
};

export const createAlamat = async (data) => {
    const response = await api.post("/alamat", data);

    return response.data;
};

export const updateAlamat = async (id, data) => {
    const response = await api.put(`/alamat/${id}`, data);

    return response.data;
};

export const deleteAlamat = async (id) => {
    const response = await api.delete(`/alamat/${id}`);

    return response.data;
};