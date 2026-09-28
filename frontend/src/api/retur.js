import api from "./axios";

export const getRetur = async () => {
    const response = await api.get("/retur");

    return response.data;
};

export const getReturById = async (id) => {
    const response = await api.get(`/retur/${id}`);

    return response.data;
};

export const createRetur = async (data) => {
    const response = await api.post("/retur", data);

    return response.data;
};

export const updateRetur = async (id, data) => {
    const response = await api.put(`/retur/${id}`, data);

    return response.data;
};

export const deleteRetur = async (id) => {
    const response = await api.delete(`/retur/${id}`);

    return response.data;
};