import api from "./axios";

export const getKoleksi = async () => {
    const response = await api.get("/koleksi");

    return response.data;
};

export const getKoleksiById = async (id) => {
    const response = await api.get(`/koleksi/${id}`);

    return response.data;
};

export const createKoleksi = async (data) => {
    const response = await api.post("/koleksi", data);

    return response.data;
};

export const updateKoleksi = async (id, data) => {
    const response = await api.put(`/koleksi/${id}`, data);

    return response.data;
};

export const deleteKoleksi = async (id) => {
    const response = await api.delete(`/koleksi/${id}`);

    return response.data;
};