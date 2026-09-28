import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        Accept: "application/json",
    },
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.error(
                    "Unauthorized:",
                    error.config?.url,
                    error.response?.data
                );
            }

            if (status === 422) {
                console.error(
                    "Validasi Laravel gagal:",
                    error.response.data?.errors
                );
            }

            if (status === 404) {
                console.error(
                    "Endpoint API tidak ditemukan:",
                    error.config?.url
                );
            }

            if (status >= 500) {
                console.error(
                    "Laravel mengalami Internal Server Error."
                );
            }
        } else if (error.request) {
            console.error(
                "Tidak dapat terhubung ke Laravel. Pastikan server berjalan di http://127.0.0.1:8000"
            );
        } else {
            console.error(
                "Axios Error:",
                error.message
            );
        }

        return Promise.reject(error);
    }
);

export default api;