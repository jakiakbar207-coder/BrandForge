import api from "./axios";

export const getProduk = async () => {
    const response = await api.get("/produk");

    return response.data;
};

export const getProdukById = async (id) => {
    const response = await api.get(`/produk/${id}`);

    return response.data;
};

export const createProduk = async (data) => {
    const response = await api.post("/produk", data);

    return response.data;
};

export const updateProduk = async (id, data) => {
    if (data instanceof FormData) {
        if (!data.has("_method")) {
            data.append("_method", "PUT");
        }

        const response = await api.post(`/produk/${id}`, data);

        return response.data;
    }

    const response = await api.put(`/produk/${id}`, data);

    return response.data;
};

export const deleteProduk = async (id) => {
    const response = await api.delete(`/produk/${id}`);

    return response.data;
};