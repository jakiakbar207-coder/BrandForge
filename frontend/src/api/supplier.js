import api from "./axios";

export const getSupplier = async () => {
    const response = await api.get("/supplier");

    return response.data;
};

export const getSupplierById = async (id) => {
    const response = await api.get(`/supplier/${id}`);

    return response.data;
};

export const createSupplier = async (data) => {
    const response = await api.post("/supplier", data);

    return response.data;
};  

export const updateSupplier = async (id, data) => {
    const response = await api.put(`/supplier/${id}`, data);

    return response.data;
};

export const deleteSupplier = async (id) => {
    const response = await api.delete(`/supplier/${id}`);

    return response.data;
};