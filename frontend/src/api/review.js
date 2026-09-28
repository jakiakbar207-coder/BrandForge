import api from "./axios";

export const getReview = async () => {
    const response = await api.get("/review");

    return response.data;
};

export const getReviewById = async (id) => {
    const response = await api.get(`/review/${id}`);

    return response.data;
};

export const createReview = async (data) => {
    const response = await api.post("/review", data);

    return response.data;
};

export const updateReview = async (id, data) => {
    const response = await api.put(`/review/${id}`, data);

    return response.data;
};

export const deleteReview = async (id) => {
    const response = await api.delete(`/review/${id}`);

    return response.data;
};