import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getBiayaOperasionalById,
    updateBiayaOperasional,
} from "../api/biayaOperasional";

import Loading from "../components/common/Loading";
import FormModal from "../components/common/FormModal";

import "./BiayaOperasional.css";

const normalizeResponse = (response) => {
    return response?.data?.data ?? response?.data ?? response ?? {};
};

function BiayaOperasionalEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [namaBiaya, setNamaBiaya] = useState("");
    const [nominal, setNominal] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [keterangan, setKeterangan] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadBiaya = async () => {
            try {
                setLoading(true);

                const response =
                    await getBiayaOperasionalById(id);

                const data =
                    normalizeResponse(response);

                setNamaBiaya(
                    data?.nama_biaya ?? ""
                );

                setNominal(
                    data?.nominal ?? ""
                );

                setTanggal(
                    data?.tanggal
                        ? String(
                              data.tanggal
                          ).substring(0, 10)
                        : ""
                );

                setKeterangan(
                    data?.keterangan ?? ""
                );
            } catch (error) {
                console.error(
                    "Gagal mengambil data biaya operasional:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text:
                        error?.response?.data?.message ||
                        "Data biaya operasional gagal dimuat.",
                }).then(() => {
                    navigate("/biaya-operasional");
                });
            } finally {
                setLoading(false);
            }
        };

        loadBiaya();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!namaBiaya.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Nama Biaya Belum Diisi",
                text: "Silakan masukkan nama biaya operasional.",
            });

            return;
        }

        if (
            nominal === "" ||
            Number(nominal) < 0
        ) {
            Swal.fire({
                icon: "warning",
                title: "Nominal Tidak Valid",
                text: "Nominal harus berupa angka minimal 0.",
            });

            return;
        }

        if (!tanggal) {
            Swal.fire({
                icon: "warning",
                title: "Tanggal Belum Dipilih",
                text: "Silakan pilih tanggal biaya operasional.",
            });

            return;
        }

        const confirmResult = await Swal.fire({
            icon: "question",
            title: "Simpan Perubahan?",
            text: "Data biaya operasional akan diperbarui.",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            setSubmitting(true);

            await updateBiayaOperasional(id, {
                nama_biaya: namaBiaya.trim(),
                nominal: Number(nominal),
                tanggal,
                keterangan:
                    keterangan.trim() || null,
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Biaya operasional berhasil diperbarui.",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/biaya-operasional");
        } catch (error) {
            console.error(
                "Gagal memperbarui biaya operasional:",
                error
            );

            const errors =
                error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                "Biaya operasional gagal diperbarui.";

            if (errors) {
                message = Object.values(errors)
                    .flat()
                    .join("\n");
            }

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="biaya-operasional-page">
                <Loading text="Memuat data biaya operasional..." />
            </div>
        );
    }

    return (
        <div className="biaya-operasional-page">
            <FormModal
                show={true}
                title="Edit Biaya Operasional"
                onClose={() =>
                    navigate("/biaya-operasional")
                }
                onSubmit={handleSubmit}
                submitText="Simpan Perubahan"
                cancelText="Batal"
                loading={submitting}
                size="large"
            >
                <div className="biaya-operasional-form-grid">
                    <div className="biaya-operasional-form-group">
                        <label htmlFor="nama_biaya">
                            Nama Biaya
                        </label>

                        <input
                            id="nama_biaya"
                            type="text"
                            value={namaBiaya}
                            onChange={(e) =>
                                setNamaBiaya(
                                    e.target.value
                                )
                            }
                            maxLength={255}
                            required
                        />
                    </div>

                    <div className="biaya-operasional-form-group">
                        <label htmlFor="nominal">
                            Nominal
                        </label>

                        <input
                            id="nominal"
                            type="number"
                            min="0"
                            value={nominal}
                            onChange={(e) =>
                                setNominal(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="biaya-operasional-form-group">
                        <label htmlFor="tanggal">
                            Tanggal
                        </label>

                        <input
                            id="tanggal"
                            type="date"
                            value={tanggal}
                            onChange={(e) =>
                                setTanggal(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="biaya-operasional-form-group biaya-operasional-form-full">
                        <label htmlFor="keterangan">
                            Keterangan
                        </label>

                        <textarea
                            id="keterangan"
                            value={keterangan}
                            onChange={(e) =>
                                setKeterangan(
                                    e.target.value
                                )
                            }
                            rows="4"
                        />
                    </div>
                </div>
            </FormModal>
        </div>
    );
}

export default BiayaOperasionalEditPage;