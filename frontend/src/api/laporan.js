import api from "./axios";

export const getLaporan = async () => {
    const response = await api.get("/laporan");

    return response.data;
};

export const downloadLaporanPdf = async () => {
    const response = await api.get("/laporan/pdf", {
        responseType: "blob",
    });

    return response.data;
};

export const downloadLaporanExcel = async () => {
    const response = await api.get("/laporan/excel", {
        responseType: "blob",
    });

    return response.data;
};