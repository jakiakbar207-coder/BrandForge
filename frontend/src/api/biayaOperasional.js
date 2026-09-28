import api from "./axios";

export const getBiayaOperasional = async () => {
    const response = await api.get("/biaya-operasional");

    return response.data;
};

export const getBiayaOperasionalById = async (id) => {
    const response = await api.get(`/biaya-operasional/${id}`);

    return response.data;
};

export const createBiayaOperasional = async (data) => {
    const response = await api.post("/biaya-operasional", data);

    return response.data;
};

export const updateBiayaOperasional = async (id, data) => {
    const response = await api.put(
        `/biaya-operasional/${id}`,
        data
    );

    return response.data;
};

export const deleteBiayaOperasional = async (id) => {
    const response = await api.delete(
        `/biaya-operasional/${id}`
    );

    return response.data;
};