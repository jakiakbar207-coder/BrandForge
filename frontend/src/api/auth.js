import api from "./axios";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    return response.data;
};

export const register = async (data) => {
    const response = await api.post("/auth/register", data);

    return response.data;
};

export const logout = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};

export const getUser = async () => {
    const response = await api.get("/auth/user");

    return response.data;
};